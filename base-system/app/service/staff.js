'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
const { tableEnum } = require('../constant/constant');
// ========================================常用 require end=============================================
const _ = require('lodash');
const md5 = require('md5-node');
const actionDataScheme = Object.freeze({
  batchStaffUserAddApp: {
    type: 'object',
    additionalProperties: true,
    required: [ 'userIdList', 'appList' ],
    properties: {
      userIdList: { type: 'array' },
      appList: { type: 'array' },
    },
  },
});
class StaffService extends Service {

  async batchStaffUserAddApp() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.batchStaffUserAddApp, actionData);
    const { userIdList, appList } = actionData;
    const readyList = await jianghuKnex(tableEnum._user_app).select().whereIn('userId', userIdList).whereIn('appId', appList);
    const readyMap = _.keyBy(readyList, 'userId');
    const insertList = [];
    userIdList.forEach(userId => {
      appList.forEach(appId => {
        if (readyList.some(item => item.userId === userId && item.appId === appId)) {
          return;
        }
        insertList.push({
          userId,
          appId,
        });
      });
    });
    if (insertList.length) {
      await jianghuKnex(tableEnum._user_app).jhInsert(insertList);
    } 
  }

}
module.exports = StaffService;
