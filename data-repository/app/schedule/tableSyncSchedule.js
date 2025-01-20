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
      const { jianghuKnex, logger } = ctx.app;
      const syncList = await jianghuKnex('_table_sync_config')
        .where({ rowStatus: '正常' })
        .where('id', 302)
        .select('id');
      const tableCount = syncList.length ;
      logger.warn('[tableSyncSchedule] start', { tableCount });
      await ctx.service.tableSync.doSyncTableByIdList({ idList: syncList.map(obj => obj.id) });
    },
    
  }
};



