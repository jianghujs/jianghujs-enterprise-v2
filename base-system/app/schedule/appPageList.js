'use strict';

module.exports = app => {
  return {
    schedule: {
      immediate: true,
      cron: "0 1 * * *", // 每天 1 点执行
      type: 'worker', // 只有一个worker执行
      disable: false,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { logger } = app;
      await ctx.service.app.updatePageList();
      const endTime = new Date().getTime();
      // TODO: 更新个数打印 & 如果是一样的不用update
      logger.info('[schedule/appPageList.js]', { useTime: `${endTime - startTime}/ms` });
    },
  };
};
