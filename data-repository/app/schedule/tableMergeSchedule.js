'use strict';
const dayjs = require('dayjs');

module.exports = app => {
  return {
    schedule: {
      immediate: true, // 应用启动后触发
      cron: '0 */1 * * * *', // 每分钟0秒执行
      type: 'worker', // 只有一个worker执行
      disable: !app.config.schedule.tableMergeSchedule,
    },
    async task(ctx) {
      const { jianghuKnex, logger } = ctx.app;
      const syncList = await jianghuKnex('_table_merge_config')
        .where({ rowStatus: '正常' })
        .select('id', 'syncTimeSlot');
      
      const currentMinute = Math.floor(new Date().getTime()/60000);
      if (!ctx.app.appStartMinute) { ctx.app.appStartMinute = currentMinute; }
      const syncTimeMinute = currentMinute - ctx.app.appStartMinute;

      const idList = syncList
        .filter(obj => syncTimeMinute%obj.syncTimeSlot === 0)
        .map(obj => obj.id);
      const tableCount = idList.length ;
      await jianghuKnex('_table_merge_config').whereIn('id', idList).update({ scheduleAt: dayjs().format() });
      logger.warn('[tableMergeSchedule] start', { tableCount, syncTimeMinute });
      await ctx.service.tableMerge.doTableMerge({ idList });
    },
  };
};
