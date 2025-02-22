'use strict';

const Service = require('egg').Service;
const { tableEnum } = require('../constant/constant');
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');

function getCreateTableSqlFromView({targetTable, targetTableIndexList=[], columnsDefinition,viewDefinition}){
  // 构建sql语句
  let sql = `CREATE TABLE \`${targetTable}\` (\n`
  for(const index in columnsDefinition){
    const {COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT} = columnsDefinition[index];
    // sql += `\`${COLUMN_NAME}\` ${COLUMN_TYPE}${CHARACTER_SET_NAME ? ` CHARACTER SET ${CHARACTER_SET_NAME}`:''}${COLLATION_NAME ? ` COLLATE ${COLLATION_NAME}`:''}${COLUMN_TYPE.includes("text") ? '' : (IS_NULLABLE==='YES'?' DEFAULT NULL':' NOT NULL')}${COLUMN_COMMENT?` COMMENT '${COLUMN_COMMENT}'`:''}`
    sql += `\`${COLUMN_NAME}\` ${COLUMN_TYPE}${COLUMN_TYPE.includes("text") ? '' : (IS_NULLABLE==='YES'?' DEFAULT NULL':' NOT NULL')}${COLUMN_COMMENT?` COMMENT '${COLUMN_COMMENT}'`:''}`
    sql += ",\n"
  }
  if(columnsDefinition.some(columnObj => columnObj.COLUMN_NAME == 'id')){
    sql += "PRIMARY KEY (`id`),\n"
  }
  targetTableIndexList = targetTableIndexList.filter(indexObj => {
    return indexObj.COLUMN_NAME_LIST && indexObj.COLUMN_NAME_LIST.every(columnName => {
      return columnsDefinition.some(columnObj => columnObj.COLUMN_NAME === columnName);
    });
  });
  for(const index in targetTableIndexList){
    const {COLUMN_NAME_LIST, INDEX_TYPE} = targetTableIndexList[index];
    if (!COLUMN_NAME_LIST || COLUMN_NAME_LIST.length === 0) { continue;}
    sql += `KEY \`${COLUMN_NAME_LIST.join('_')}_index\` (\`${COLUMN_NAME_LIST.join('`,`')}\`) USING BTREE`
    sql += ",\n"
  }
  sql = sql.slice(0, -2);
  sql += "\n"
  const {CHARACTER_SET_CLIENT} = viewDefinition;
  // 数据表排序规则、字符定义
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=${CHARACTER_SET_CLIENT}`
  return sql;
}

class TableSyncRemoteService extends Service {

  async getSourceTableColumnList({ sourceRemoteName, sourceDatabase, sourceTable }){
    const { config } = this.app;
    const connection = config.remoteDatabaseList.find(item => item.remoteName === sourceRemoteName); 
    if (!connection) { return { rows: [] }; }

    try {
      const knex = Knex({ client: 'mysql2', connection });
      const columnListResult = await knex('information_schema.COLUMNS')
        .where({TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable})
        .select('COLUMN_NAME');
      const columnList = columnListResult
        .map(item => item.COLUMN_NAME)
          .filter(column => !['id', 'operation', 'operationByUserId', 'operationByUser', 'operationAt'].includes(column));
      knex.destroy();
      return { rows: columnList };
    } catch (error) {
      logger.error('[getSourceTableColumnList]', error);
      return { rows: [] };
    }
  }

  async getDatabaseInfo() {
    const { jianghuKnex, config, logger } = this.app;
    const remoteDatabaseList = config.remoteDatabaseList;

    const remoteNameList = [];
    const databaseListMap = {};
    const tableListMap = {};
    const tableTypeMap = {};

    for(const remoteDatabase of remoteDatabaseList){
      const { remoteName, ...connection } = remoteDatabase;
      remoteNameList.push(remoteName);
      try {
        const knex = Knex({ client: 'mysql2', connection });
        const tableList = await knex.select('TABLE_NAME').from('information_schema.TABLES')
          .whereNotIn('table_schema', ['sys', 'information_schema', 'performance_schema', 'mysql'])
          .orderBy('table_name', 'desc')
          .select('table_schema as databaseName', 'table_name as tableName', 'table_type as tableType');
        knex.destroy();
        databaseListMap[remoteName] = [...new Set(tableList.map(item => item.databaseName))];
        
        const groupedTables = _.groupBy(tableList, 'databaseName');
        Object.keys(groupedTables).forEach(databaseName => {
          tableListMap[`${remoteName}.${databaseName}`] = groupedTables[databaseName];
        });

        tableList.forEach(item => {
          tableTypeMap[`${remoteName}.${item.databaseName}.${item.tableName}`] = item.tableType;
        });
      } catch (error) {
        databaseListMap[remoteName] = [];
        logger.error('[getDatabaseInfo]', `remoteName: ${remoteName}`, error);
        continue;
      }
    }
    return { remoteNameList, databaseListMap, tableListMap, tableTypeMap };
    // return { databaseList, tableListMap, tableTypeMap };
  }

  async recycleTableSyncConfig({ id }) {
    const { jianghuKnex, knex } = this.app;
    const syncObj = await jianghuKnex(tableEnum.view01_table_sync_config_remote).where({ id }).first();
    if (!syncObj) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase, sourceTable, targetDatabase, targetTable } = syncObj;
    await jianghuKnex(tableEnum._table_sync_config_remote)
      .where({id})
      .update({rowStatus: '回收站'});
    return;
  }

  async doSyncTableRemoteByIdList({ idList }) {
    const { knex, jianghuKnex, config, logger } = this.app;
    const syncList = await jianghuKnex(tableEnum.view01_table_sync_config_remote)
      .where({ rowStatus: '正常' })
      .whereIn("id", idList)
      .select();
    const tableCount = syncList.length;
    const startTime = new Date().getTime();

    const remoteConnectionMap = config.remoteDatabaseList.reduce((acc, { remoteName, ...connection }) => {
      acc[remoteName] = connection;
      return acc;
    }, {});

    for (const [index, syncObj] of syncList.entries()) { 
      const { id, sourceDatabase, sourceTable, targetDatabase, targetTable} = syncObj;
      try {
        const targetTableIndexList = JSON.parse(syncObj.targetTableIndexList||'[]');
        const sourceConnection = remoteConnectionMap[syncObj.sourceRemoteName] || {};
        const targetConnection = remoteConnectionMap[syncObj.targetRemoteName] || {};
        sourceConnection.database = sourceDatabase;
        targetConnection.database = targetDatabase;
        const sourceKnex = Knex({ client: 'mysql2', connection: sourceConnection });
        const targetKnex = Knex({ client: 'mysql2', connection: targetConnection });
        await this.doTargetTableDDL({ sourceDatabase, sourceTable, targetDatabase, targetTable, targetTableIndexList, sourceKnex, targetKnex });
        await this.doSyncTable({ 
          id, 
          sourceDatabase, sourceTable, targetDatabase, targetTable, 
          sourceConnection, targetConnection, sourceKnex, targetKnex 
        });
        logger.info(`[doSyncTableRemoteByIdList] ${index + 1}/${tableCount} ID:${syncObj.id} 成功`);
        sourceKnex.destroy();
        targetKnex.destroy();
      } catch (error) {
        await jianghuKnex(tableEnum._table_sync_config_remote).where({ id: syncObj.id })
          .update({ 
            syncStatus: '失败', 
            lastSyncTime: dayjs().format(), 
            lastSyncInfo: `ERROR: ${error.message}`,
            syncTimesCount: knex.raw('syncTimesCount + 1'),
          });
        await jianghuKnex('_table_log').insert({
          logType: '远程同步',
          sourceTableInfo: `${syncObj.sourceDatabase}.${syncObj.sourceTable}`,
          targetTableInfo: `${syncObj.targetDatabase}.${syncObj.targetTable}`,
          syncStatus: '失败',
          syncTime: dayjs().format(),
          syncInfo: `ERROR: ${error.message}`,
        });
        logger.error(`[doSyncTableRemoteByIdList] ID:${syncObj.id} 失败`, error);
      }
    }
    logger.warn('[doSyncTableRemoteByIdList] end', { tableCount: idList.length, useTime: `${new Date().getTime() - startTime}/ms` });
  }

  async doTargetTableDDL({ sourceDatabase, sourceTable, targetDatabase, targetTable, targetTableIndexList, sourceKnex, targetKnex }) {
    const { logger } = this.app;

    const columnsDefinition = (await sourceKnex.raw(`SELECT COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`))[0];
    const viewDefinition = (await sourceKnex.raw(`SELECT CHARACTER_SET_CLIENT,COLLATION_CONNECTION FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`))[0][0];

    let targetTableDDL = null;
    let targetTableDDLExcept = null;
    const tableTypeResult = await sourceKnex.raw(`SELECT TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`);
    const tableType = tableTypeResult[0]?.[0]?.TABLE_TYPE;
    if (tableType === 'VIEW') {
      targetTableDDLExcept = getCreateTableSqlFromView({ targetTable, targetTableIndexList, columnsDefinition, viewDefinition });
      targetTableDDLExcept = targetTableDDLExcept
        .replace(/AUTO_INCREMENT=\d+ ?/, '')
        .replace(/\n\s*/g, '')
        .replace(/[\r\n]+/g, '');
    } 

    if(tableType === "BASE TABLE"){
      const sourceTableDDLResult = await sourceKnex.raw(`SHOW CREATE TABLE ${sourceDatabase}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      targetTableDDLExcept = sourceTableDDL
        .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '')
        .replace(/\n\s*/g, '')
        .replace(/[\r\n]+/g, '');
    }

    if(!targetTableDDLExcept){
      logger.error(`[syncTable.targetTableDDL] ${sourceDatabase}.${sourceTable} 不存在`);
      throw new Error(`${sourceDatabase}.${sourceTable} 源表不存在` );
    }

    const tableExists = await targetKnex.schema.hasTable(targetTable);
    if (tableExists) {
      const targetTableDDLResult = await targetKnex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
      targetTableDDL = targetTableDDLResult[0][0]['Create Table']
        .replace(/AUTO_INCREMENT=\d+ ?/, '')
        .replace(/\n\s*/g, '')
        .replace(/[\r\n]+/g, '');
    }

    if (targetTableDDL !== targetTableDDLExcept) {
      logger.warn('[doTargetTableDDL]', `${targetDatabase}.${targetTable}`, 'DDL有改动, 重新生成同步表');
      await targetKnex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
      targetTableDDLExcept = targetTableDDLExcept
        .replace(`CREATE TABLE \`${targetTable}\``, `CREATE TABLE \`${targetDatabase}\`.\`${targetTable}\``);
      await targetKnex.raw(targetTableDDLExcept);
    }
  }

  async doSyncTable({ id, sourceDatabase, sourceTable, targetDatabase, targetTable, 
    sourceConnection, targetConnection,
    sourceKnex, targetKnex,
  }) {
    const { jianghuKnex, knex, logger } = this.app;

    const hyperDiffResult = await hyperDiff({
      oldDatabaseConnectionConfig: {...targetConnection, database: targetDatabase},
      oldTable: targetTable,
      newDatabaseConnectionConfig: {...sourceConnection, database: sourceDatabase},
      newTable: sourceTable,
      splitCount: 2,
      stopThreshold: 100,
      ignoreColumns: [],
    });
    const { added, removed, changed } = hyperDiffResult;
    const diffCount = added.length + removed.length + changed.length;
    if (added.length > 0) {
      await targetKnex(`${targetTable}`).insert(added);
    }
    if (removed.length > 0) {
      const idList = removed.map(item => item.id);
      await targetKnex(`${targetTable}`).whereIn('id', idList).delete();
    }
    if (changed.length > 0) {
      for (const item of changed) {
        const { id, ...updateParam } = item.new;
        await targetKnex(`${targetTable}`).where({ id }).update(updateParam);
      }
    }

    if (id) {
      await jianghuKnex(tableEnum._table_sync_config_remote).where({ id }).update({syncStatus: '成功'});
      await jianghuKnex(tableEnum._table_sync_config_remote).where({ id }).where('lastSyncInfo', 'like', 'ERROR%').update({lastSyncInfo: ''});
      if(diffCount > 0){
        await jianghuKnex(tableEnum._table_sync_config_remote).where({ id })
          .update({ 
            lastSyncTime: dayjs().format(),
            lastSyncInfo: `${added.length}条新增, ${changed.length}条修改, ${removed.length}条删除`,
            syncTimesCount: knex.raw('syncTimesCount + 1'),
          });
        await jianghuKnex('_table_log').insert({
          logType: '远程同步',
          sourceTableInfo: `${sourceDatabase}.${sourceTable}`,
          targetTableInfo: `${targetDatabase}.${targetTable}`,
          syncStatus: '成功',
          syncTime: dayjs().format(),
          syncInfo: `${added.length}条新增, ${changed.length}条修改, ${removed.length}条删除`,
          syncHyperDiffResult: JSON.stringify(hyperDiffResult),
        });
      }
    }

    if (diffCount > 0) {
      logger.warn('[syncTableRemote.doSyncTable]', `${targetDatabase}.${targetTable}`, { added: added.length, removed: removed.length, changed: changed.length });
    }
  }

}

module.exports = TableSyncRemoteService;
