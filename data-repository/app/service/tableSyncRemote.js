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

  async getDatabaseInfo() {
    const { jianghuKnex, config } = this.app;

    // Tip: 为了数据安全，这里只返回 sourceDatabase
    const databaseList = config.remoteDatabaseList.map(obj => obj.sourceDatabase);
   
    // TODO: databaseList中填充 tableList
    return { databaseList,
      defaultTargetDatabase: null,
      databaseMap: {},
      tableTriggerCountMap: {},
      tableTypeMap: {},
    };
    // return { defaultTargetDatabase, databaseMap, databaseList, tableTriggerCountMap, tableTypeMap};
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
    const { knex,jianghuKnex, logger } = this.app;
    const syncList = await jianghuKnex('_table_sync_config_remote')
      .where({ rowStatus: '正常' })
      .whereIn("id", idList)
      .select('id', 'sourceDatabase', 'sourceTable', 'targetDatabase', 'targetTable');
    const tableCount = syncList.length;
    const startTime = new Date().getTime();
    for (const [index, syncObj] of syncList.entries()) { 
      try {
        await this.doTargetTableDDL(syncObj);
        await this.doSyncTable(syncObj);
        logger.info(`[doSyncTableRemoteByIdList] ${index + 1}/${tableCount} ID:${syncObj.id} 成功`);
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
    await this.clearMysqlTrigger({});
    logger.warn('[doSyncTableRemoteByIdList] end', { tableCount: idList.length, useTime: `${new Date().getTime() - startTime}/ms` });

  }


}

module.exports = TableSyncRemoteService;
