'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const md5 = require('md5-node');
const appDataSchema = Object.freeze({
  addUser: {
    type: 'object',
    additionalProperties: true,
    required: [ 'username', 'clearTextPassword' ],
    properties: {
      clearTextPassword: { type: 'string' },
      username: { type: 'string' },
      userAvatar: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      contactNumber: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      gender: { anyOf: [{ type: 'string', enum: [ 'male', 'female' ] }, { type: 'null' }] },
      birthday: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
      signature: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      email: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    },
  },
  initUserPassword: {
    type: 'object',
    additionalProperties: true,
    required: [ 'userId', 'clearTextPassword' ],
    properties: {
      userId: { type: 'string' },
      clearTextPassword: { type: 'string' },
    },
  },
});

class UserManagementService extends Service {

  async addUser() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(appDataSchema.addUser, actionData);
    const { clearTextPassword } = actionData;
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);
    const maxUserId = await jianghuKnex('_user').where("userId", "<>", "F10001").max('userId as maxUserId').first()
    // 避开F10001
    const nextId = (parseInt(maxUserId.maxUserId.toString().substring(1)) + 1)
    const userId = "F" + (nextId == 10001 ? 10002 : nextId).toString().padStart(5,"0")
    const userExistCountResult = await jianghuKnex('_user', this.ctx).where({ userId }).count('*', {as: 'count'});
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount > 0) {
      throw new BizError(errorInfoEnum.user_id_exist);
    }
    const insertParams = _.pick(actionData, [ 'username', 'userStatus', 'qiweiId' ]);
    await jianghuKnex('_user', this.ctx).insert({ ...insertParams, userId, password, clearTextPassword, md5Salt });
    await this.service.app.buildUserApp(userId);
    return {};
  }

  async resetUserPassword() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(appDataSchema.initUserPassword, actionData);
    const { userId, clearTextPassword } = actionData;
    const userExistCountResult = await jianghuKnex('_user', this.ctx).where({ userId }).count('*', {as: 'count'});
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount === 0) {
      throw new BizError(errorInfoEnum.user_not_exist);
    }
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);
    await jianghuKnex('_user', this.ctx).where({userId}).update({ password, clearTextPassword, md5Salt });
    return {};
  }
}

module.exports = UserManagementService;
