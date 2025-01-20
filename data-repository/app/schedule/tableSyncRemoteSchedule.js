'use strict';

module.exports = app => {
  return {
    schedule: {
      immediate: true, // 应用启动后触发
      interval: '2m', // 每2min执行一次
      type: 'worker', // worker: 只有一个worker执行
      disable: !app.config.schedule.tableSyncRemoteSchedule,
    },
    async task(ctx) {
      const { jianghuKnex, logger } = ctx.app;
      const syncList = await jianghuKnex('_table_sync_config_remote')
        .where({ rowStatus: '正常' })
        .select('id');
      const tableCount = syncList.length ;
      logger.warn('[tableSyncRemoteSchedule] start', { tableCount });
      await ctx.service.tableSyncRemote.doSyncTableRemoteByIdList({ idList: syncList.map(obj => obj.id) });
    },
    
  }
};



