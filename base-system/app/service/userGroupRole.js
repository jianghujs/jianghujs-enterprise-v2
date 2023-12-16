'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');


class UserGroupRoleService extends Service {

  async updateUserGroupRole() {
    const { jianghuKnex } = this.app;
    const {userId, roleId: roleIdList, groupId} = this.ctx.request.body.appData.actionData;
    const insert = [];
    roleIdList.forEach(roleId => {
      insert.push({
        userId,
        roleId,
        groupId,
      })
    })

    // 删除旧的
    await jianghuKnex('enterprise_user_group_role').where({userId, groupId}).delete();
    // 插入新的
    await jianghuKnex('enterprise_user_group_role').insert(insert);

  } 

  async updateUserGroupRolePage() {
    const { jianghuKnex } = this.app;
    const {dataList, role = '*', group} = this.ctx.request.body.appData.actionData;
    const dataListByAppId = _.groupBy(dataList, 'appId');
    const appIdList = Object.keys(dataListByAppId);
    const insertUserGroupRolePageList = [];
    const insertUserGroupRoleResourceList = [];
    _.forEach(dataListByAppId, (value, key) => {
      const item = {
        appId: key,
        role,
        group,
        user: '*',
        allowOrDeny: 'allow',
      }
      insertUserGroupRolePageList.push({
        ...item,
        page: value.map(e => e.pageId).join(','),
      })
      insertUserGroupRoleResourceList.push({
        ...item,
        resource: value.map(e => e.pageId == '*' ? e.pageId : e.pageId + '.*').join(','),
      })
    });
    // 查询该角色的所有user
    const roleUserList = await jianghuKnex('enterprise_user_group_role').select('userId').where({ roleId: role });
    const userIdList = roleUserList.map(e => e.userId);
    const insertUserApp = [];
    _.forEach(userIdList, (userId, index) => {
      _.forEach(dataListByAppId, (item, key) => {
        insertUserApp.push({
          userId: userId,
          appId: key,
        })
      })
    });

    
    await jianghuKnex.transaction(async trx => {
      // 删除原有的 enterprise_user_group_role_page
      await trx('enterprise_user_group_role_page').where({ role, group }).jhDelete();
      // 新增 enterprise_user_group_role_page
      insertUserGroupRolePageList.length && await trx('enterprise_user_group_role_page').jhInsert(insertUserGroupRolePageList);
      await trx('enterprise_user_group_role_resource').where({ role, group }).jhDelete();
      // 新增 enterprise_user_group_role_resource
      insertUserGroupRoleResourceList.length && await trx('enterprise_user_group_role_resource').jhInsert(insertUserGroupRoleResourceList);

      // 删除原有的 _user_app
      await trx('enterprise_user_app').whereIn('userId', userIdList).whereIn('appId', appIdList).jhDelete();
      // 新增 _user_app
      insertUserApp.length && await trx('enterprise_user_app').jhInsert(insertUserApp);
    })
  }

  /**
   * 删除角色after hook，删除角色的同时，删除角色关系与权限
   */
  async afterDeleteGroupRole() {
    const { jianghuKnex } = this.app;
    const { roleId } = this.ctx.request.body.appData.actionData;
    // 删除原有的 enterprise_user_group_role_page
    await jianghuKnex('enterprise_user_group_role').where({ roleId }).jhDelete();
    await jianghuKnex('enterprise_user_group_role_page').where({ role: roleId }).jhDelete();
    await jianghuKnex('enterprise_user_group_role_resource').where({ role: roleId }).jhDelete();
  }

}

module.exports = UserGroupRoleService;
