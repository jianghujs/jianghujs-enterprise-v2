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

  getConfig() {
    const config = this.app.config;
    const defaultTargetDatabase = config.knex.client.connection.database;
    const { triggerPrefix } = config;
    const syncTriggerPrefix = `${triggerPrefix}_sync`;
    return { defaultTargetDatabase, syncTriggerPrefix };
  }

  async getDatabaseInfo() {
    const { jianghuKnex, config } = this.app;
    const { defaultTargetDatabase, syncTriggerPrefix } = this.getConfig();

    const tableList = await jianghuKnex('information_schema.TABLES')
      .whereNotIn('table_schema', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase', 'table_type as tableType');
    
    const triggerListAll = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('TRIGGER_NAME', 'like', `${syncTriggerPrefix}_%`)
      .select('TRIGGER_SCHEMA as sourceDatabase', 'EVENT_OBJECT_TABLE as sourceTable', 'TRIGGER_NAME as triggerName', 'EVENT_MANIPULATION as triggerEvent');
    const tableTriggerGroupMap = _.groupBy(triggerListAll, (item) => `${item.sourceDatabase}.${item.sourceTable}`);
    const tableTriggerCountMap = Object.fromEntries(Object.entries(tableTriggerGroupMap).map(([key, value]) => [key, value.length]));
      
    const tableTypeMap = Object.fromEntries(tableList.map(item => [`${item.sourceDatabase}.${item.sourceTable}`, item.tableType]));
    const databaseMap = _.groupBy(tableList, 'sourceDatabase');
    const databaseList = Object.keys(databaseMap).map(key => ({ sourceDatabase: key, tableList: databaseMap[key] }));
    return { defaultTargetDatabase, databaseMap, databaseList, tableTriggerCountMap, tableTypeMap};
  }

  async recycleTableSyncConfig({ id }) {
    const { jianghuKnex, knex } = this.app;
    const { syncTriggerPrefix } = this.getConfig();
    const syncObj = await jianghuKnex('_table_sync_config').where({ id }).first();
    if (!syncObj) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase, sourceTable, targetDatabase, targetTable } = syncObj;
    await jianghuKnex('_table_sync_config')
      .where({id})
      .update({rowStatus: '回收站'});

    const DELETETriggerName = `${syncTriggerPrefix}_${targetTable}_DELETE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
    const INSERTTriggerName = `${syncTriggerPrefix}_${targetTable}_INSERT`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
    const UPDATETriggerName = `${syncTriggerPrefix}_${targetTable}_UPDATE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);

    // 删除 targetDatabase.targetTable
    if (targetDatabase === this.app.config.knex.client.connection.database) {
      await knex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
    }
    return;
  }

  async doSyncTableByIdList({ idList }) {
    const { knex,jianghuKnex, logger } = this.app;
    const syncList = await jianghuKnex('_table_sync_config')
      .where({ rowStatus: '正常' })
      .whereIn("id", idList)
      .select('id', 'sourceDatabase', 'sourceTable', 'targetDatabase', 'targetTable', 'enableMysqlTrigger');
    const tableCount = syncList.length;
    const startTime = new Date().getTime();
    for (const [index, syncObj] of syncList.entries()) { 
      try {
        await this.doTargetTableDDL(syncObj);
        await this.doSyncTable(syncObj);
        if(syncObj.enableMysqlTrigger === '开启'){
          await this.createMysqlTrigger(syncObj);
        }
        logger.info(`[doSyncTableByIdList] ${index + 1}/${tableCount} ID:${syncObj.id} 成功`);
      } catch (error) {
        await jianghuKnex('_table_sync_config').where({ id: syncObj.id })
          .update({ 
            syncStatus: '失败', 
            lastSyncTime: dayjs().format(), 
            lastSyncInfo: error.message,
            syncTimesCount: knex.raw('syncTimesCount + 1'),
          });
        logger.error(`[doSyncTableByIdList] ID:${syncObj.id} 失败`, error);
      }
    }
    await this.clearMysqlTrigger({});
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
    const tableType = tableTypeResult[0]?.[0]?.TABLE_TYPE;
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
      throw new Error(`${sourceDatabase}.${sourceTable} 源表不存在` );
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
    const diffCount = added.length + removed.length + changed.length;
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
      if(diffCount > 0){
        await jianghuKnex('_table_sync_config').where({ id })
          .update({ 
            lastSyncTime: dayjs().format(),
            lastSyncInfo: `${added.length}条新增, ${changed.length}条修改, ${removed.length}条删除`,
            syncTimesCount: knex.raw('syncTimesCount + 1'),
          });
      }
    }

    if (diffCount > 0) {
      logger.warn('[syncTable.doSyncTable]', `${targetDatabase}.${targetTable}`, { added: added.length, removed: removed.length, changed: changed.length });
    }
  }

  async createMysqlTrigger({ sourceDatabase, sourceTable, targetDatabase, targetTable } ) {
    const {jianghuKnex, logger} = this.app;
    const { syncTriggerPrefix } = this.getConfig();

    const triggerListAll = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('TRIGGER_NAME', 'like', `${syncTriggerPrefix}_%`)
      .select('TRIGGER_SCHEMA as sourceDatabase', 'TRIGGER_NAME as triggerName', 'EVENT_MANIPULATION as triggerEvent', 'ACTION_STATEMENT as triggerContent');
    const allTriggerContentMap = Object.fromEntries(triggerListAll.map(tri => [`${tri.sourceDatabase}.${tri.triggerName}`, tri.triggerContent]));

    const columnListSelect = await jianghuKnex('information_schema.COLUMNS')
      .where({TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable})
      .select();
    const columnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\``);
    const NEWColumnList = columnListSelect.map(item => `NEW.\`${item.COLUMN_NAME}\``);
    const updateColumnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\`=NEW.\`${item.COLUMN_NAME}\``);

    const INSERTTriggerName = `${syncTriggerPrefix}_${targetTable}_INSERT`;
    const INSERTTriggerContentSql = `BEGIN
            INSERT INTO \`${targetDatabase}\`.\`${targetTable}\`
            (${columnList.join(',')})
            VALUES
            (${NEWColumnList.join(',')});
        END`;
    const INSERTTriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${INSERTTriggerName}\` AFTER INSERT
        ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
        ${INSERTTriggerContentSql}`;
    if (!allTriggerContentMap[`${sourceDatabase}.${INSERTTriggerName}`] || allTriggerContentMap[`${sourceDatabase}.${INSERTTriggerName}`] !== INSERTTriggerContentSql) {
      await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
      await jianghuKnex.raw(INSERTTriggerCreateSql);
      logger.warn('[createMysqlTrigger]', `创建触发器 ${sourceDatabase}.${INSERTTriggerName}`);
    }

    const UPDATETriggerName = `${syncTriggerPrefix}_${targetTable}_UPDATE`;
    const UPDATETriggerContentSql = `BEGIN
            UPDATE \`${targetDatabase}\`.\`${targetTable}\`
            SET ${updateColumnList.join(',')}
            where id=OLD.id;
        END`;
    const UPDATETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${UPDATETriggerName}\` AFTER UPDATE
        ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
        ${UPDATETriggerContentSql}`;
    if (!allTriggerContentMap[`${sourceDatabase}.${UPDATETriggerName}`] || allTriggerContentMap[`${sourceDatabase}.${UPDATETriggerName}`] !== UPDATETriggerContentSql) {
      await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
      await jianghuKnex.raw(UPDATETriggerCreateSql);
      logger.warn('[createMysqlTrigger]', `创建触发器 ${sourceDatabase}.${UPDATETriggerName}`);
    }

    const DELETETriggerName = `${syncTriggerPrefix}_${targetTable}_DELETE`;
    const DELETETriggerContentSql = `BEGIN
            DELETE FROM \`${targetDatabase}\`.\`${targetTable}\` WHERE id = OLD.id;
        END`;
    const DELETETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${DELETETriggerName}\` AFTER DELETE
        ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
        ${DELETETriggerContentSql}`;
    if (!allTriggerContentMap[`${sourceDatabase}.${DELETETriggerName}`] || allTriggerContentMap[`${sourceDatabase}.${DELETETriggerName}`] !== DELETETriggerContentSql) {
      await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
      await jianghuKnex.raw(DELETETriggerCreateSql);
      logger.warn('[createMysqlTrigger]', `创建触发器 ${sourceDatabase}.${DELETETriggerName}`);
    }

  }

  async clearMysqlTrigger({ }) {
    const { jianghuKnex, logger } = this.app;
    const { syncTriggerPrefix } = this.getConfig();

    const tableListAll = await jianghuKnex('information_schema.TABLES')
      .whereNotIn('table_schema', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('table_type', 'BASE TABLE')
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase', 'table_type as tableType');
    const tableTypeMap = Object.fromEntries(tableListAll.map(item => [`${item.sourceDatabase}.${item.sourceTable}`, item.tableType]));

    let syncList = await jianghuKnex('_table_sync_config').where({rowStatus: '正常', enableMysqlTrigger: '开启'}).select();
    syncList = syncList.filter(x => tableTypeMap[`${x.sourceDatabase}.${x.sourceTable}`] === 'BASE TABLE');

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('TRIGGER_NAME', 'like', `${syncTriggerPrefix}_%`)
      .select('TRIGGER_SCHEMA as sourceDatabase', 'TRIGGER_NAME as triggerName', 'EVENT_MANIPULATION as triggerEvent', 'ACTION_STATEMENT as triggerContent');

    for (const trigger of triggerList) {
      const { sourceDatabase, triggerName, triggerEvent } = trigger;
      const triggerSourceExist = syncList.find(item => sourceDatabase === item.sourceDatabase && triggerName === `${syncTriggerPrefix}_${item.targetTable}_${triggerEvent}`);
      if (!triggerSourceExist) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${triggerName};`);
        logger.warn(`[clearMysqlTrigger]`, `删除触发器 ${sourceDatabase}.${triggerName}`);
      }
    }
  }

}

module.exports = TableSyncRemoteService;
