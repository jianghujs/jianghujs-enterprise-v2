'use strict';
const _ = require('lodash');
const dayjs = require('dayjs');
const diff = require('@jianghujs/jianghu/app/common/diffUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const jianghu = require('@jianghujs/jianghu');

module.exports = app => {
  return {
    schedule: {
      immediate: true, // 应用启动后触发
      interval: '3min', // 每3min执行一次
      type: 'worker', // worker: 只有一个worker执行
      disable: !app.config.schedule.tableSyncSchedule,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { jianghuKnex, logger } = ctx.app;
      // const databaseName =  ctx.app.config.knex.client.connection.database;
      // const syncList = [
      //   { sourceTable: "_resource", targetTable: "_resource_01", sourceDatabase: databaseName, targetDatabase: databaseName, },
      // ];

      const syncList = await jianghuKnex('_table_sync_config')
        .where({ rowStatus: '正常' })
        // .where({ id: 291 })
        .select('id', 'sourceDatabase', 'sourceTable', 'targetDatabase', 'targetTable');
      const tableCount = syncList.length ;


      logger.warn('[syncTable] start', { tableCount });
      for (const [index, syncObj] of syncList.entries()) {
        try {
          await ctx.service.tableSync.doTargetTableDDL(syncObj);
          await ctx.service.tableSync.doSyncTable(syncObj);
          logger.info(`[doSyncTable] ${index + 1}/${tableCount} ID:${syncObj.id} 成功`);
        } catch (error) {
          errorIdMap[syncObj.id] = error;
          logger.error(`[doSyncTable] ID:${syncObj.id} 失败`, error);
        }
      }

      logger.warn('[syncTable] end', { tableCount, useTime: `${new Date().getTime() - startTime}/ms` });
    },
    
  }
};



