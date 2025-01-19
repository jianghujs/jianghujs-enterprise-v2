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

class TableSyncService extends Service {

  getConfig() {
    const config = this.app.config;
    const defaultTargetDatabase = config.knex.client.connection.database;
    const { triggerPrefix } = config;
    const syncTriggerPrefix = `${triggerPrefix}_sync`;
    return { defaultTargetDatabase, syncTriggerPrefix };
  }

  async selectSourceDatabase() {
    const {jianghuKnex, config} = this.app;
    const { defaultTargetDatabase } = this.getConfig();  

    const tableList = await jianghuKnex('information_schema.TABLES')
      .whereNotIn('table_schema', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('table_type', 'BASE TABLE')
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase');

    const databaseMap = _.groupBy(tableList, 'sourceDatabase');
    const databaseList = Object.keys(databaseMap).map(key => ({ sourceDatabase: key, tableList: databaseMap[key] }));
    return { defaultTargetDatabase, databaseMap, databaseList};
  }

  async recycleTableSyncConfig({ id }) {
    const { jianghuKnex } = this.app;
    const { syncTriggerPrefix } = this.getConfig();
    const tableSyncConfig = await jianghuKnex('_table_sync_config').where({ id }).first();
    if (!tableSyncConfig) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase } = tableSyncConfig;
    await jianghuKnex('_table_sync_config')
      .where({id})
      .update({rowStatus: '回收站'});

    const targetTable = tableSyncConfig.targetTable;
    const DELETETriggerName = `${syncTriggerPrefix}_${targetTable}_DELETE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
    const INSERTTriggerName = `${syncTriggerPrefix}_${targetTable}_INSERT`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
    const UPDATETriggerName = `${syncTriggerPrefix}_${targetTable}_UPDATE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
    return;
  }


  async doSyncTableByIdList({ idList }) {
    const { jianghuKnex, logger } = this.app;
    const syncList = await jianghuKnex('_table_sync_config')
      .whereIn("id", idList)
      .select('id', 'sourceDatabase', 'sourceTable', 'targetDatabase', 'targetTable');
    const tableCount = syncList.length;
    logger.warn('[doSyncTableByIdList] start', { tableCount });
    const startTime = new Date().getTime();
    for (const [index, syncObj] of syncList.entries()) { 
      try {
        await this.doTargetTableDDL(syncObj);
        await this.doSyncTable(syncObj);
        logger.info(`[doSyncTableByIdList] ${index + 1}/${tableCount} ID:${syncObj.id} 成功`);
      } catch (error) {
        logger.error(`[doSyncTableByIdList] ID:${syncObj.id} 失败`, error);
      }
    }
    logger.warn('[doSyncTableByIdList] end', { tableCount: idList.length, useTime: `${new Date().getTime() - startTime}/ms` });

  }

  async doTargetTableDDL({ sourceDatabase, sourceTable, targetDatabase, targetTable }) {
    const {knex, logger} = this.app;
    const columnsDefinition = (await knex.raw(`SELECT COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`))[0];
    const viewDefinition = (await knex.raw(`SELECT CHARACTER_SET_CLIENT,COLLATION_CONNECTION FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`))[0][0];

    let targetTableDDL = null;
    let targetTableDDLExcept = null;
    const tableTypeResult = await knex.raw(`SELECT TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${sourceDatabase}' AND TABLE_NAME = '${sourceTable}';`);
    const tableType = tableTypeResult[0][0].TABLE_TYPE;
    if (tableType === 'VIEW') {
      targetTableDDLExcept = getCreateTableSqlFromView({ targetTable, columnsDefinition, viewDefinition });
      targetTableDDLExcept = targetTableDDLExcept
        .replace(/AUTO_INCREMENT=\d+ ?/, '')
        .replace(/\n\s*/g, '')
        .replace(/[\r\n]+/g, '');
    } 

    if(tableType === "BASE TABLE"){
      const sourceTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${sourceDatabase}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      targetTableDDLExcept = sourceTableDDL
        .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '')
        .replace(/\n\s*/g, '')
        .replace(/[\r\n]+/g, '');
    }

    if(!targetTableDDLExcept){
      logger.error(`[syncTable.targetTableDDL] ${sourceDatabase}.${sourceTable} 不存在`);
      return;
    }

    const tableExists = await knex.schema.hasTable(targetTable);
    if (tableExists) {
      const targetTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
      targetTableDDL = targetTableDDLResult[0][0]['Create Table']
        .replace(/AUTO_INCREMENT=\d+ ?/, '')
        .replace(/\n\s*/g, '')
        .replace(/[\r\n]+/g, '');
    }

    if (targetTableDDL !== targetTableDDLExcept) {
      logger.warn('[doTargetTableDDL]', `${targetDatabase}.${targetTable}`, 'DDL有改动, 重新生成同步表');
      await knex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
      targetTableDDLExcept = targetTableDDLExcept
        .replace(`CREATE TABLE \`${targetTable}\``, `CREATE TABLE \`${targetDatabase}\`.\`${targetTable}\``);
      await knex.raw(targetTableDDLExcept);
    }
  }

  async doSyncTable({ id, sourceDatabase, sourceTable, targetDatabase, targetTable }) {
    const { jianghuKnex, knex, logger, config} = this.app;
    const connection = config.knex.client.connection;

    const hyperDiffResult = await hyperDiff({
      oldDatabaseConnectionConfig: {...connection, database: targetDatabase},
      oldTable: targetTable,
      newDatabaseConnectionConfig: {...connection, database: sourceDatabase},
      newTable: sourceTable,
      splitCount: 2,
      stopThreshold: 100,
      ignoreColumns: [],
    });
    const { added, removed, changed } = hyperDiffResult;
    if (added.length > 0) {
      await knex(`${targetTable}`).insert(added);
    }
    if (removed.length > 0) {
      const idList = removed.map(item => item.id);
      await knex(`${targetTable}`).whereIn('id', idList).delete();
    }
    if (changed.length > 0) {
      for (const item of changed) {
        const { id, ...updateParam } = item.new;
        await knex(`${targetTable}`).where({ id }).update(updateParam);
      }
    }

    if (id) {
      await jianghuKnex('_table_sync_config').where({ id }).update({ syncStatus: '正常' });
    }


    if (added.length > 0 || removed.length > 0 || changed.length > 0) {
      if (id) {
        await jianghuKnex('_table_sync_config').where({ id })
          .update({ 
            lastSyncTime: dayjs().format(),
            lastSyncInfo: `${added.length}条新增, ${changed.length}条修改, ${removed.length}条删除`,
          });
      } 

      logger.warn('[syncTable.doSyncTable]', `${targetDatabase}.${targetTable}`, { added: added.length, removed: removed.length, changed: changed.length });

    }
  }

}

module.exports = TableSyncService;
