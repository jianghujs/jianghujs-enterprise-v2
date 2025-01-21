'use strict';

module.exports = app => {
  return {
    schedule: {
      immediate: true, // 应用启动后触发
      cron: '0 */1 * * * *', // 每分钟0秒执行
      type: 'worker', // worker: 只有一个worker执行
      disable: !app.config.schedule.tableSyncRemoteSchedule,
    },
    async task(ctx) {
      const { jianghuKnex, logger } = ctx.app;
      const syncList = await jianghuKnex('_table_sync_config_remote')
        .where({ rowStatus: '正常' })
        .select('id', 'syncTimeSlot');
      
      const currentMinute = Math.floor(new Date().getTime()/60000);
      if (!ctx.app.appStartMinute) { ctx.app.appStartMinute = currentMinute; }
      const syncTimeMinute = currentMinute - ctx.app.appStartMinute;

      const idList = syncList
        .filter(obj => syncTimeMinute%obj.syncTimeSlot === 0)
        .map(obj => obj.id);
      const tableCount = idList.length ;
      logger.warn('[tableSyncRemoteSchedule] start', { tableCount, syncTimeMinute });
      await ctx.service.tableSyncRemote.doSyncTableRemoteByIdList({ idList });
    },
    
  }
};



