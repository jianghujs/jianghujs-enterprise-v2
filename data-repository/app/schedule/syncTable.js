'use strict';
const _ = require('lodash');
const dayjs = require('dayjs');
const diff = require('@jianghujs/jianghu/app/common/diffUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');

module.exports = app => {
  return {
    schedule: {
      immediate: true, // 应用启动后触发
      interval: '3min', // 每3min执行一次
      type: 'worker', // worker: 只有一个worker执行
      disable: !app.config.schedule.syncTable,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { knex, logger } = ctx.app;
      const databaseName =  ctx.app.config.knex.client.connection.database;
      const connection = ctx.app.config.knex.client.connection;
      const syncList = [
        { sourceTable: "_resource", targetTable: "_resource_01", sourceDatabase: databaseName, targetDatabase: databaseName, },
      ];
      logger.warn('[targetTable] start');
      for (const syncObj of syncList) {
        await doTargetTableDDL({ knex, logger, syncObj });
      }
      for (const syncObj of syncList) {
        await doTargetTableSync({ knex, logger, connection, syncObj });
      }
      logger.warn('[targetTable] end', { useTime: `${new Date().getTime() - startTime}/ms` });
    },
    
  }
};

async function doTargetTableDDL({ 
    knex, logger,
    syncObj: { sourceDatabase, sourceTable, targetDatabase, targetTable }
  }) {
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
  } 

  if(tableType === "BASE TABLE"){
    const sourceTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${sourceTable};`);
    const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
    targetTableDDLExcept = sourceTableDDL && sourceTableDDL
      .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``)
      .replace(/AUTO_INCREMENT=\d+ ?/, '').replace(/\n\s*/g, '');
  }

  const tableExists = await knex.schema.hasTable(targetTable);
  if (tableExists) {
    const targetTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${targetTable};`);
    targetTableDDL = targetTableDDLResult[0][0]['Create Table']
      .replace(/AUTO_INCREMENT=\d+ ?/, '').replace(/\n\s*/g, '');
  }

  if(!targetTableDDLExcept){
    logger.error(`[targetTableDDL] ${sourceTable} 不存在`);
    return;
  }


  if (targetTableDDL !== targetTableDDLExcept) {
    logger.warn('[targetTable]', targetTable, 'DDL有改动, 重新生成同步表');
    await knex.raw(`DROP TABLE IF EXISTS ${targetTable};`);
    await knex.raw(targetTableDDLExcept);
  }
}

async function doTargetTableSync({ 
  knex, connection, logger,
  syncObj: { sourceDatabase, sourceTable, targetDatabase, targetTable }
}) {
  // logger.warn(`[targetTable] ${targetTable} start`);
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
  logger.warn('[targetTable]', targetTable, { added: added.length, removed: removed.length, changed: changed.length });
}

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

