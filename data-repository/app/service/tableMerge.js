'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');
const hyperDiffMerge = require('../common/hyperDiffMerge');

const appDataSchema = Object.freeze({
  mergeTable: {
    type: 'object',
    additionalProperties: true,
    required: [],
    properties: {
      targetDatabase: {type: 'string'},
      targetTable: {type: 'string'},
    },
  },
  deleteTableMergeConfig: {
    type: 'object',
    additionalProperties: true,
    required: ['id'],
    properties: {
      id: {type: 'number'},
    },
  },
});

function compareTableForMerge(sql1, sql2) {
  // 使用正则表达式提取列定义
  const columnDefRegex = /\((.*)\)/s;

  // 将列定义分割为单独的列
  let table1Columns = [];
  let table2Columns = [];
  const match1 = columnDefRegex.exec(sql1);
  const match2 = columnDefRegex.exec(sql2);
  if (match1) {
    table1Columns = match1[1]
      .split(',')
      .map(s => s.trim())
      .filter(s => !s.startsWith('PRIMARY KEY')) // 排除主键定义
      .filter(s => !s.startsWith('`id`'))        // 排除指定的列
      .filter(s => !s.startsWith('`incrementId`'))
      .filter(s => !s.startsWith('`appId`'));
  };
  if (match2) {
    table2Columns = match2[1]
      .split(',')
      .map(s => s.trim())
      .filter(s => !s.startsWith('PRIMARY KEY')) // 排除主键定义
      .filter(s => !s.startsWith('`id`'))        // 排除指定的列
      .filter(s => !s.startsWith('`incrementId`'))
      .filter(s => !s.startsWith('`appId`'));
  };
  // 比较差异
  const uniqueToTable1 = table1Columns.filter(col => !table2Columns.includes(col));
  const uniqueToTable2 = table2Columns.filter(col => !table1Columns.includes(col));
  const isDiff = uniqueToTable1.length > 0 || uniqueToTable2.length > 0;
  return isDiff;
}

async function createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction}) {
  const syncTime = dayjs().format();
  await jianghuKnex('_table_sync_log')
    .insert({
      sourceDatabase: tableSyncConfig.sourceDatabase, sourceTable: tableSyncConfig.sourceTable,
      syncAction, syncDesc,
      syncTime,
    });
}

class UtilService extends Service {

  getConfig() {
    const config = this.app.config;
    const defaultTargetDatabase = config.knex.client.connection.database;
    const { triggerPrefix } = config;
    const syncTriggerPrefix = `${triggerPrefix}_merge`;
    return { defaultTargetDatabase, syncTriggerPrefix };
  }

  async deleteTableMergeConfig() {
  }


  async doTableMerge(actionData) {
    // Tip: 适配schedule调用, actionData从入参取
    validateUtil.validate(appDataSchema.mergeTable, actionData);
    const {useSyncTimeSlotFilter} = actionData;
    const tableSyncConfigSelectParams = _.pick(actionData, ['targetDatabase', 'targetTable']);
    
    const {jianghuKnex, logger} = this.app;
    const lastSyncTime = dayjs().format();
    const currentMinute = dayjs().diff(dayjs().format('YYYY-MM-DD'), 'minute');
    const outsideKnexMap = {};

    let tableMergeConfigList = await jianghuKnex('_table_merge_config')
      .where(tableSyncConfigSelectParams)
      .select();
    tableMergeConfigList.forEach(item => { item.sourceList = JSON.parse(item.sourceList || '[]');})
    tableMergeConfigList = tableMergeConfigList.filter(item => item.sourceList.length > 0);
    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
    const allTableMap = Object.fromEntries(allTable.map(obj => [`${obj.database}.${obj.tableName}`, obj]));
    await this.tableConsistentCheckAndSync({tableMergeConfigList, allTableMap, outsideKnexMap});

  }


  async tableConsistentCheckAndSync({tableMergeConfigList, allTableMap}) {
    const {knex, logger} = this.app;
    for (const tableConfig of tableMergeConfigList) {
      const { targetDatabase, targetTable } = tableConfig;
      const sourceDatabase = tableConfig.sourceList[0].database;
      const sourceTable = tableConfig.sourceList[0].tableName;
      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];
      const sourceTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${sourceDatabase}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      const exceptTargetTableDDL = sourceTableDDL
        .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetDatabase}\`.\`${targetTable}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '');
      let targetTableDDL = null;
      if (targetTableExist) {
        const targetTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
        targetTableDDL = targetTableDDLResult[0][0]['Create Table'].replace(/AUTO_INCREMENT=\d+ ?/, '');
      }
      const isDiff = compareTableForMerge(targetTableDDL, exceptTargetTableDDL);
      if (isDiff) {
        await knex.raw(`DROP TABLE IF EXISTS \`${targetDatabase}\`.\`${targetTable}\`;`);
        await knex.raw(exceptTargetTableDDL);
        await knex.raw(`ALTER TABLE \`${targetDatabase}\`.\`${targetTable}\`
          ADD COLUMN \`incrementId\` int(11) NOT NULL AUTO_INCREMENT FIRST,
          ADD COLUMN \`appId\` varchar(255) DEFAULT NULL AFTER \`incrementId\`,
          MODIFY COLUMN \`id\` int(11) NULL DEFAULT NULL AFTER \`appId\`,
          DROP PRIMARY KEY,
          ADD PRIMARY KEY (\`incrementId\`) USING BTREE;`);
        const selectDataSql = tableConfig.sourceList
          .map(source => `select null as incrementId, '${source.appId}' as appId, a.* from \`${source.database}\`.\`${source.tableName}\` as a`)
          .join(' UNION ');
        await knex.raw(`REPLACE INTO \`${targetDatabase}\`.\`${targetTable}\` ${selectDataSql};`);
        logger.info(`[${targetTable}]`, '结构不一致; 创建成功;');
      }

      const targetConnection = {...this.app.config.knex.client.connection, database: targetDatabase};
      let hasHyperDiff = false;
      for (const source of tableConfig.sourceList) {
        const { appId } = source; 
        const sourceConnection = {...this.app.config.knex.client.connection, database: source.database};
        const hyperDiffResult = await hyperDiffMerge({
          oldDatabaseConnectionConfig: targetConnection,
          oldTable: targetTable, oldDataWhere: { appId },
          newDatabaseConnectionConfig: sourceConnection,
          newTable: source.tableName,
          splitCount: 2,
          stopThreshold: 10,
          ignoreColumns: ['incrementId', 'appId'],
        });
        let hyperDiffIsConsistent = hyperDiffResult.added.length === 0 && hyperDiffResult.removed.length === 0 && hyperDiffResult.changed.length === 0;
        if (!hyperDiffIsConsistent) {
          hasHyperDiff = true;
          const {added, removed, changed} = hyperDiffResult;
          added.forEach(item => { item.appId = appId; })
          changed.forEach(item => { item.appId = appId; })
          if (added.length > 0) {
            await knex(`${targetDatabase}.${targetTable}`).insert(added);
          }
          if (removed.length > 0) {
            const idList = removed.map(item => item.id);
            await knex(`${targetDatabase}.${targetTable}`).where({ appId }).whereIn('id', idList).delete();
          }
          if (changed.length > 0) {
            for (const item of changed) {
              const {id, ...updateParam} = item.new;
              await knex(`${targetDatabase}.${targetTable}`).where({ appId }).where({id}).update(updateParam);
            }
          }
        }  
      }    
      // TODO: 多余的appId数据删除
      if (hasHyperDiff) {
        logger.info(`[${targetTable}]`, '数据不一致; 同步成功;');
      } 
      if (!hasHyperDiff) {
        logger.info(`[${targetTable}]`, '数据一致; 无需同步;');
      } 
    }
  }

}

module.exports = UtilService;
