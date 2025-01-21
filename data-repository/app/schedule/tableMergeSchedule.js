'use strict';

module.exports = app => {
  return {
    schedule: {
      immediate: true, // 应用启动后触发
      cron: '0 */1 * * * *', // 每分钟0秒执行
      type: 'worker', // 只有一个worker执行
      disable: !app.config.schedule.tableMergeSchedule,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { logger } = app;
      await ctx.service.tableMerge.doTableMerge({ useSyncTimeSlotFilter: true });
      const endTime = new Date().getTime();
      logger.info('[tableMergeSchedule]', { useTime: `${endTime - startTime}/ms` });
    },
  };
};
