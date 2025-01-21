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
    const mergeTriggerPrefix = `${triggerPrefix}_merge`;
    return { defaultTargetDatabase, mergeTriggerPrefix };
  }

// {"service": "tableSync", "serviceFunction": "selectSourceDatabase"}
// {"service": "tableSync", "serviceFunction": "selectSourceTable"}

  async getDatabaseInfo() {
    const { jianghuKnex, config } = this.app;
    const { defaultTargetDatabase, syncTriggerPrefix } = this.getConfig();

    const tableList = await jianghuKnex('information_schema.TABLES')
      .whereNotIn('table_schema', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .orderBy('table_name', 'desc')
      .select('table_schema as databaseName', 'table_name as tableName', 'table_type as tableType');
    
    const triggerListAll = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('TRIGGER_NAME', 'like', `${syncTriggerPrefix}_%`)
      .select('TRIGGER_SCHEMA as databaseName', 'EVENT_OBJECT_TABLE as tableName', 'TRIGGER_NAME as triggerName', 'EVENT_MANIPULATION as triggerEvent');
    const tableTriggerGroupMap = _.groupBy(triggerListAll, (item) => `${item.database}.${item.tableName}`);
    const tableTriggerCountMap = Object.fromEntries(Object.entries(tableTriggerGroupMap).map(([key, value]) => [key, value.length]));
      
    const tableTypeMap = Object.fromEntries(tableList.map(item => [`${item.databaseName}.${item.tableName}`, item.tableType]));
    const tableListMap = _.groupBy(tableList, 'databaseName');
    const databaseList = Object.keys(tableListMap);
    return { defaultTargetDatabase, databaseList, tableListMap, tableTriggerCountMap, tableTypeMap};
  }


  async recycleTableMergeConfig({ id }) {
    const { jianghuKnex, knex } = this.app;
    const syncObj = await jianghuKnex('_table_merge_config').where({ id }).first();
    if (!syncObj) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    await jianghuKnex('_table_merge_config')
      .where({id})
      .update({rowStatus: '回收站'});
    return;
  }


  async doTableMerge({ idList }) {
    const {jianghuKnex, knex, logger} = this.app;
    const startTime = new Date().getTime();
    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
    const allTableMap = Object.fromEntries(allTable.map(obj => [`${obj.database}.${obj.tableName}`, obj]));

    let tableMergeConfigList = await jianghuKnex('_table_merge_config')
      .whereIn('id', idList)
      .select();
    tableMergeConfigList.forEach(item => { item.sourceList = JSON.parse(item.sourceList || '[]');})
    tableMergeConfigList = tableMergeConfigList.filter(item => item.sourceList.length > 0);

    const { mergeTriggerPrefix } = this.getConfig();
    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .where('TRIGGER_NAME', 'like', `${mergeTriggerPrefix}_%`)
      .select('TRIGGER_NAME as triggerName', 'ACTION_STATEMENT as triggerContent');
    const allTriggerContentMap = Object.fromEntries(triggerList.map(obj => [obj.triggerName, obj.triggerContent]));

    const tableCount = tableMergeConfigList.length;
    for (const [index, tableConfig] of tableMergeConfigList.entries()) {
      try { 
        await this.tableMergeCheck({tableConfig, allTableMap});
        await this.tableConsistentCheckAndSync({tableConfig, allTableMap});
        await this.createMysqlTriggerForSourceTable({tableConfig, allTriggerContentMap, mergeTriggerPrefix});
        logger.info(`[tableMerge.doTableMerge] ${index + 1}/${tableCount} ID:${tableConfig.id} 成功`);
      } catch (error) {
        await jianghuKnex('_table_merge_config').where({ id: tableConfig.id })
          .update({ 
            syncStatus: '失败', 
            syncTimesCount: knex.raw('syncTimesCount + 1'),
            lastSyncTime: dayjs().format(), 
            lastSyncInfo: `ERROR: ${error.message}`,
          });
        logger.error('[tableMerge] ERROR', `${tableConfig.targetDatabase}.${tableConfig.targetTable}`, { error: error.message });
      }
    }
    await this.clearUselessMysqlTrigger({allTableMap});
    logger.warn('[tableMerge.doTableMerge] end', { tableCount: idList.length, useTime: `${new Date().getTime() - startTime}/ms` });
  }

  async tableMergeCheck({tableConfig, allTableMap}) {
    const {jianghuKnex, logger} = this.app;

    tableConfig.sourceList = tableConfig.sourceList.filter(source => allTableMap[`${source.database}.${source.tableName}`]);
    if (tableConfig.sourceList.length === 0) { 
      throw new Error('源数据为空');
    }

    const masterSource = tableConfig.sourceList[0];
    const masterSourceDDLResult = await jianghuKnex.raw(`SHOW CREATE TABLE ${masterSource.database}.${masterSource.tableName};`);
    let masterSourceDDL = masterSourceDDLResult[0][0]['Create Table'];
    masterSourceDDL = masterSourceDDL.replace(/AUTO_INCREMENT=\d+ ?/, '');

    let errorMessage = '';
    for (let i = 1; i < tableConfig.sourceList.length; i++) {
      const currentSource = tableConfig.sourceList[i];
      const currentSourceDDLResult = await jianghuKnex.raw(`SHOW CREATE TABLE ${currentSource.database}.${currentSource.tableName};`);
      let currentSourceDDL = currentSourceDDLResult[0][0]['Create Table'];
      currentSourceDDL = currentSourceDDL
        .replace(`CREATE TABLE \`${currentSource.tableName}\``, `CREATE TABLE \`${masterSource.tableName}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '');
      if (masterSourceDDL != currentSourceDDL) {
        errorMessage += `${currentSource.database}.${currentSource.tableName}和主表结构不一致; `;
      }
    }
    if (errorMessage) {
      logger.warn(`[tableMerge.tableMergeCheck] ${tableConfig.id}`, errorMessage);
      throw new Error(errorMessage);
    }
  }

  async tableConsistentCheckAndSync({tableConfig, allTableMap}) {
    const { jianghuKnex, knex, logger } = this.app;
    if (tableConfig.sourceList.length === 0) { return; }
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
      logger.info(`[merge][${targetTable}]`, '结构不一致; 创建成功;');
    }

    const targetConnection = {...this.app.config.knex.client.connection, database: targetDatabase};
    const appIdList = tableConfig.sourceList.map(source => source.appId);
    let diffCountTotal = 0, addedTotal = 0, removedTotal = 0, changedTotal = 0;
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
      const { added, removed, changed } = hyperDiffResult;
      const diffCount = added.length + removed.length + changed.length;
      diffCountTotal += diffCount;
      addedTotal += added.length;
      removedTotal += removed.length;
      changedTotal += changed.length;
      if (diffCount > 0) {
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
    
    if (diffCountTotal > 0) {
      logger.warn('[mergeTable.doTableMerge]', `${targetDatabase}.${targetTable}`, { addedTotal, removedTotal, changedTotal });
    } 
    await knex(`${targetDatabase}.${targetTable}`).whereNotIn('appId', appIdList).delete();
    await knex('_table_merge_config').where({ id: tableConfig.id }).update({ syncStatus: '成功' });
    await jianghuKnex('_table_merge_config').where({ id: tableConfig.id }).where('lastSyncInfo', 'like', 'ERROR%').update({lastSyncInfo: ''});
    if(diffCountTotal > 0){
      await jianghuKnex('_table_merge_config').where({ id: tableConfig.id })
        .update({ 
          lastSyncTime: dayjs().format(),
          lastSyncInfo: `${addedTotal}条新增, ${changedTotal}条修改, ${removedTotal}条删除`,
          syncTimesCount: knex.raw('syncTimesCount + 1'),
        });
    }
  }

  async createMysqlTriggerForSourceTable({tableConfig, allTriggerContentMap, mergeTriggerPrefix}) {
    const {jianghuKnex, logger} = this.app;
    const { targetDatabase, targetTable, sourceList } = tableConfig;
    for (const source of sourceList) {
      const sourceDatabase = source.database;
      const sourceTable = source.tableName;
      const appId = source.appId;

      const columnListSelect = await jianghuKnex('information_schema.COLUMNS')
        .where({TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable})
        .select();
      const columnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\``);
      const NEWColumnList = columnListSelect.map(item => `NEW.\`${item.COLUMN_NAME}\``);
      const updateColumnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\`=NEW.\`${item.COLUMN_NAME}\``);
      const INSERTTriggerName = `${mergeTriggerPrefix}_${appId}_${targetTable}_INSERT`;
      const INSERTTriggerContentSql = `BEGIN
              INSERT INTO \`${targetDatabase}\`.\`${targetTable}\`
              (\`appId\`,${columnList.join(',')})
              VALUES
              ("${appId}",${NEWColumnList.join(',')});
          END`;
      const INSERTTriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${INSERTTriggerName}\` AFTER INSERT
          ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
          ${INSERTTriggerContentSql}`;
      if (!allTriggerContentMap[INSERTTriggerName] || allTriggerContentMap[INSERTTriggerName] !== INSERTTriggerContentSql) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
        await jianghuKnex.raw(INSERTTriggerCreateSql);
        const syncDesc = 'insert 触发器覆盖';
        logger.warn(`[merge][${targetTable}]`, syncDesc);
      } 
      

      const UPDATETriggerName = `${mergeTriggerPrefix}_${appId}_${targetTable}_UPDATE`;
      const UPDATETriggerContentSql = `BEGIN
              UPDATE \`${targetDatabase}\`.\`${targetTable}\`
              SET ${updateColumnList.join(',')}
              where id=OLD.id and appId="${appId}";
          END`;
      const UPDATETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${UPDATETriggerName}\` AFTER UPDATE
          ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
          ${UPDATETriggerContentSql}`;
      if (!allTriggerContentMap[UPDATETriggerName] || allTriggerContentMap[UPDATETriggerName] !== UPDATETriggerContentSql) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
        await jianghuKnex.raw(UPDATETriggerCreateSql);
        const syncDesc = 'update 触发器覆盖';
        logger.warn(`[merge][${targetTable}]`, syncDesc);
      } 


      const DELETETriggerName = `${mergeTriggerPrefix}_${appId}_${targetTable}_DELETE`;
      const DELETETriggerContentSql = `BEGIN
              DELETE FROM \`${targetDatabase}\`.\`${targetTable}\` WHERE id = OLD.id and appId="${appId}";
          END`;
      const DELETETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${DELETETriggerName}\` AFTER DELETE
          ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
          ${DELETETriggerContentSql}`;
      if (!allTriggerContentMap[DELETETriggerName] || allTriggerContentMap[DELETETriggerName] !== DELETETriggerContentSql) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
        await jianghuKnex.raw(DELETETriggerCreateSql);
        const syncDesc = 'delete 触发器覆盖';
        logger.warn(`[merge][${targetTable}]`, syncDesc);
      } 
    }
    
  }

  async clearUselessMysqlTrigger({allTableMap}) {
    const {jianghuKnex, logger} = this.app;
    const { mergeTriggerPrefix } = this.getConfig();

    const tableConfigList = await jianghuKnex('_table_merge_config').select();
    tableConfigList.forEach(item => { item.sourceList = JSON.parse(item.sourceList || '[]');})
    const triggerCheckMap = {};
    tableConfigList.forEach(tableConfig => {
      const { sourceList, targetDatabase, targetTable } = tableConfig;
      for (const source of sourceList) {
        const appId = source.appId;
        triggerCheckMap[`${mergeTriggerPrefix}_${appId}_${targetTable}_INSERT`] = true;
        triggerCheckMap[`${mergeTriggerPrefix}_${appId}_${targetTable}_UPDATE`] = true;
        triggerCheckMap[`${mergeTriggerPrefix}_${appId}_${targetTable}_DELETE`] = true;
      }
    })

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .where('TRIGGER_NAME', 'like', `${mergeTriggerPrefix}_%`)
      .select();

    for (const trigger of triggerList) {
      const {
        TRIGGER_SCHEMA: sourceDatabase,
        TRIGGER_NAME: triggerName, EVENT_MANIPULATION: triggerEvent,
      } = trigger;
      if (!triggerCheckMap[triggerName]) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${triggerName};`);
        logger.warn(`[merge][${triggerName}]`, '无用的mysql trigger, 执行删除逻辑;');
      }
    }
  }

}

module.exports = UtilService;
