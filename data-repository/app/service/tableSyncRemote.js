'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');

function getCreateTableSqlFromView({targetTable,columnsDefinition,viewDefinition}){
  // 构建sql语句
  let sql = `CREATE TABLE \`${targetTable}\` (\n`
  for(const index in columnsDefinition){
    const {COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT} = columnsDefinition[index];
    // sql += `\`${COLUMN_NAME}\` ${COLUMN_TYPE}${CHARACTER_SET_NAME ? ` CHARACTER SET ${CHARACTER_SET_NAME}`:''}${COLLATION_NAME ? ` COLLATE ${COLLATION_NAME}`:''}${COLUMN_TYPE.includes("text") ? '' : (IS_NULLABLE==='YES'?' DEFAULT NULL':' NOT NULL')}${COLUMN_COMMENT?` COMMENT '${COLUMN_COMMENT}'`:''}`
    sql += `\`${COLUMN_NAME}\` ${COLUMN_TYPE}${COLUMN_TYPE.includes("text") ? '' : (IS_NULLABLE==='YES'?' DEFAULT NULL':' NOT NULL')}${COLUMN_COMMENT?` COMMENT '${COLUMN_COMMENT}'`:''}`
    if(index != columnsDefinition.length - 1){
      sql += ","
    } 
    sql += "\n"
  }
  const {CHARACTER_SET_CLIENT} = viewDefinition;
  // 数据表排序规则、字符定义
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=${CHARACTER_SET_CLIENT}`
  return sql;
}

class TableSyncRemoteService extends Service {

  // TODO: tableSyncConfig.js 也参考优化
  async getDatabaseInfo() {
    const { jianghuKnex, config, logger } = this.app;
    const remoteDatabaseList = config.remoteDatabaseList;

    const databaseList = [];
    const tableListMap = {};
    const tableTypeMap = {};

    for(const remoteDatabase of remoteDatabaseList){
      const { remoteName, ...connection } = remoteDatabase;
      const databaseName = remoteName;
      const databaseNameReal = connection.database;
      try {
        const knex = Knex({ client: 'mysql2', connection });
        const tableList = await knex.select('TABLE_NAME').from('information_schema.TABLES')
          .where('TABLE_SCHEMA', databaseNameReal)
        .orderBy('table_name', 'desc')
        .select('table_name as sourceTable', 'table_schema as sourceDatabase', 'table_type as tableType');
        knex.destroy();
        databaseList.push(databaseName);
        tableListMap[databaseName] = tableList;
        tableList.forEach(item => {
          tableTypeMap[`${databaseName}.${item.sourceTable}`] = item.tableType;
        });
      } catch (error) {
        databaseList.push(databaseName);
        tableListMap[databaseName] = [];
        logger.error('[getDatabaseInfo]', `remoteName: ${remoteName}`, error);
        continue;
      }
    }
   
    return { databaseList, tableListMap, tableTypeMap };
  }

  async recycleTableSyncConfig({ id }) {
    const { jianghuKnex, knex } = this.app;
    const syncObj = await jianghuKnex('_table_sync_config_remote').where({ id }).first();
    if (!syncObj) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase, sourceTable, targetDatabase, targetTable } = syncObj;
    await jianghuKnex('_table_sync_config_remote')
      .where({id})
      .update({rowStatus: '回收站'});
    return;
  }

  async doSyncTableRemoteByIdList({ idList }) {
    const { knex, jianghuKnex, config, logger } = this.app;
    const syncList = await jianghuKnex('_table_sync_config_remote')
      .where({ rowStatus: '正常' })
      .whereIn("id", idList)
      .select('id', 'sourceDatabase', 'sourceTable', 'targetDatabase', 'targetTable');
    const tableCount = syncList.length;
    const startTime = new Date().getTime();

    const remoteConnectionMap = config.remoteDatabaseList.reduce((acc, { remoteName, ...connection }) => {
      acc[remoteName] = connection;
      return acc;
    }, {});

    for (const [index, syncObj] of syncList.entries()) { 
      try {
        const sourceConnection = remoteConnectionMap[syncObj.sourceDatabase];
        const targetConnection = remoteConnectionMap[syncObj.targetDatabase];
        const sourceDatabase = sourceConnection?.database;
        const targetDatabase = targetConnection?.database;
        const sourceTable = syncObj.sourceTable;
        const targetTable = syncObj.targetTable;
        const sourceKnex = Knex({ client: 'mysql2', connection: sourceConnection });
        const targetKnex = Knex({ client: 'mysql2', connection: targetConnection });
        await this.doTargetTableDDL({ sourceDatabase, sourceTable, targetDatabase, targetTable, sourceKnex, targetKnex });
        // await this.doSyncTable(syncObj);
        logger.info(`[doSyncTableRemoteByIdList] ${index + 1}/${tableCount} ID:${syncObj.id} 成功`);
        sourceKnex.destroy();
        targetKnex.destroy();
      } catch (error) {
        await jianghuKnex('_table_sync_config_remote').where({ id: syncObj.id })
          .update({ 
            syncStatus: '失败', 
            lastSyncTime: dayjs().format(), 
            lastSyncInfo: error.message,
            syncTimesCount: knex.raw('syncTimesCount + 1'),
          });
        logger.error(`[doSyncTableRemoteByIdList] ID:${syncObj.id} 失败`, error);
      }
    }
    logger.warn('[doSyncTableRemoteByIdList] end', { tableCount: idList.length, useTime: `${new Date().getTime() - startTime}/ms` });
  }

  async doTargetTableDDL({ sourceDatabase, sourceTable, targetDatabase, targetTable, sourceKnex, targetKnex }) {
    const {knex, logger} = this.app;

    const columnsDefinition = (await sourceKnex.raw(`SELECT COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`))[0];
    const viewDefinition = (await targetKnex.raw(`SELECT CHARACTER_SET_CLIENT,COLLATION_CONNECTION FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`))[0][0];

    let targetTableDDL = null;
    let targetTableDDLExcept = null;
    const tableTypeResult = await sourceKnex.raw(`SELECT TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`);
    const tableType = tableTypeResult[0]?.[0]?.TABLE_TYPE;
    if (tableType === 'VIEW') {
      targetTableDDLExcept = getCreateTableSqlFromView({ targetTable, columnsDefinition, viewDefinition });
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

}

module.exports = TableSyncRemoteService;
