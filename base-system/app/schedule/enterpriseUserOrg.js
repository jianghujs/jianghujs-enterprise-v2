'use strict';
const _ = require('lodash');
const dayjs = require('dayjs');
const Knex = require('knex');

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
        await ctx.service.userGroupRole.updateUserOrg();
        const endTime = new Date().getTime();
        logger.info('[schedule/enterpriseUserOrg.js]', { useTime: `${endTime - startTime}/ms` });
    }
  };
};
