'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');

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

  /**
   * 返回当前应用所在库
   * @return {Promise<*>}
   */
  getTargetDatabase() {
    const {database} = this.app.config.knex.client.connection;
    return database;
  }

  async deleteTableMergeConfig() {
  }


  async doMergeTable(actionData) {
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


  async tableConsistentCheckAndSync({tableMergeConfigList, allTableMap, outsideKnexMap}) {
    const {knex, jianghuKnex, logger} = this.app;
    for (const tableConfig of tableMergeConfigList) {

      const { targetDatabase, targetTable } = tableConfig;
      const sourceDatabase = tableConfig.sourceList[0].database;
      const sourceTable = tableConfig.sourceList[0].tableName;
      const sourceKnex = outsideKnexMap[sourceDatabase] || knex;
      const targetKnex = outsideKnexMap[targetDatabase] || knex;
      const targetConnection = {...this.app.config.knex.client.connection, database: targetDatabase};
      let sourceConnection = {...this.app.config.knex.client.connection, database: sourceDatabase};
      let outsideMode = false
      let sourceDatabaseInDb = sourceDatabase;
      if (sourceDatabase.startsWith('{')) {
        outsideMode = true
        const {name, ...knexConfig} = JSON.parse(sourceDatabase);
        sourceConnection = knexConfig;
        sourceDatabaseInDb = knexConfig.database;
        targetTable = `${name.toLowerCase()}__${sourceTable}`;
      }

      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];
      const sourceTableDDLResult = await sourceKnex.raw(`SHOW CREATE TABLE ${sourceDatabaseInDb}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      const exceptTargetTableDDL = sourceTableDDL
        .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '');
      let targetTableDDL = null;
      if (targetTableExist) {
        const targetTableDDLResult = await targetKnex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
        targetTableDDL = targetTableDDLResult[0][0]['Create Table'].replace(/AUTO_INCREMENT=\d+ ?/, '');
      }
      // TODO: 判断DDL不一致时才执行
      // TODO: 表结构要加上appId，以便区分数据来源
      // if (targetTableDDL !== exceptTargetTableDDL) {
      // }
      await targetKnex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
      await targetKnex.raw(exceptTargetTableDDL);
      await targetKnex.raw(`ALTER TABLE \`${targetDatabase}\`.\`${targetTable}\`
        ADD COLUMN \`incrementId\` int(11) NOT NULL AUTO_INCREMENT FIRST,
        MODIFY COLUMN \`id\` int(11) NULL DEFAULT NULL FIRST,
        DROP PRIMARY KEY,
        ADD PRIMARY KEY (\`incrementId\`) USING BTREE;`);
      const selectDataSql = tableConfig.sourceList
        .map(source => `select null as incrementId, a.* from \`${source.database}\`.\`${source.tableName}\` as a`)
        .join(' UNION ');
      await targetKnex.raw(`REPLACE INTO all_task ${selectDataSql};`);
    }
  }

}

module.exports = UtilService;
