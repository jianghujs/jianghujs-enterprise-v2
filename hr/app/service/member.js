'use strict';

const Service = require('egg').Service;
const _ = require("lodash");

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { tableEnum } = require('../constant/constant');
const actionDataScheme = Object.freeze({
});

class MemberService extends Service {

  async fillInsertItemParamsBeforeHook() {
    const tableName = tableEnum.employee;
    const columnName = "idSequence";
    const startValue = 1000;
    const idSequence = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
      startValue,
    });
    const staffId = `E${idSequence}`
    Object.assign(this.ctx.request.body.appData.actionData, { idSequence, staffId })
  }

  async selectMemberFromOgrId() {
    const {knex} = this.app;
    const { where: {orgPrentId} } = this.ctx.request.body.appData;
    let result;
    if(!orgPrentId) {
      result = await knex(tableEnum.view01_member_org_role).select();
    } else {

      result = await knex(tableEnum.view01_member_org_role).where('orgId', 'like', '%' + orgPrentId + '%').select();
    }
    return {
      rows: result
    }
  }

  async updateRoleItem() {
    const {jianghuKnex} = this.app;
    // roleId 数组
    const { memberId, roleId } = this.ctx.request.body.appData.actionData;
    // 事务处理 删除 、 新增
    await jianghuKnex.transaction(async trx => {
      await trx(tableEnum.member_role).where('memberId', memberId).delete();
      await trx(tableEnum.member_role).insert(roleId.map(item => ({memberId, roleId: item})));
    });
  }
}

module.exports = MemberService;
