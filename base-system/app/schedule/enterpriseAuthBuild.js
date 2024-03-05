'use strict';
const _ = require('lodash');


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
      const { jianghuKnex, logger } = app;

      // 删除临时角色权限信息
      await ctx.service.app.removeRelationByExpire();

      await ctx.service.app.buildRelationByCommonAuth();

      await ctx.service.app.buildUserApp();

      const endTime = new Date().getTime();
      logger.info('[schedule/enterpriseAuthBuild.js]', { useTime: `${endTime - startTime}/ms` });
    },
  };
};
