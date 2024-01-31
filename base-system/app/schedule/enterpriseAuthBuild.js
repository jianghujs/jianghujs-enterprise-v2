'use strict';
const _ = require('lodash');


module.exports = app => {
  return {
    schedule: {
      immediate: true,
      cron: "0 0 * * *", // 每天 0 点执行
      type: 'worker', // 只有一个worker执行
      disable: false,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { jianghuKnex, logger } = app;

      await ctx.service.app.buildRelationByCommonAuth();

      await ctx.service.app.buildSupperAdminUserApp();

      const endTime = new Date().getTime();
      logger.info('[schedule/enterpriseAuthBuild.js]', { useTime: `${endTime - startTime}/ms` });
    },
  };
};
