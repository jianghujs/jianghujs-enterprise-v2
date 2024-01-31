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

  async insertUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { userId, roleId: roleIdList, groupId } = this.ctx.request.body.appData.actionData;
    const appList = await jianghuKnex('enterprise_user_group_role_page').where('group', groupId).whereIn('role',roleIdList).select();

    const roleInsertList = [];
    const appInsertList = [];
    roleIdList.forEach(roleId => {
      roleInsertList.push({
        userId,
        roleId,
        groupId,
      })
    })
    appList.forEach( appItem => {
      appInsertList.push({
        userId,
        'appId':appItem.appId,
        'groupId': appItem.group,
        'roleId': appItem.role
      })
    })
    await jianghuKnex.transaction(async trx => { 
      await trx('enterprise_user_group_role',this.ctx).insert(roleInsertList);
      await trx('enterprise_user_app',this.ctx).insert(appInsertList);
     })
  }

  async updateUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { userId, roleId: roleIdList, groupId } = this.ctx.request.body.appData.actionData;
    const appList = await jianghuKnex('enterprise_user_group_role_page').where('group', groupId).whereIn('role',roleIdList).select();

    const roleInsertList = [];
    const appInsertList = [];
    roleIdList.forEach(roleId => {
      roleInsertList.push({
        userId,
        roleId,
        groupId,
      })
    })
    appList.forEach( appItem => {
      appInsertList.push({
        userId,
        'appId':appItem.appId,
        'groupId': appItem.group,
        'roleId': appItem.role
      })
    })

    await jianghuKnex.transaction(async trx => { 

      // 删除旧的
      await trx('enterprise_user_group_role').where({userId, groupId}).delete();
      // 插入新的
      await trx('enterprise_user_group_role', this.ctx).insert(roleInsertList);

      // 删除旧的
      await trx('enterprise_user_app').where({userId, groupId}).delete();
      // 插入新的
      await trx('enterprise_user_app', this.ctx).insert(appInsertList);

    })
  }
  async deleteUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { userId, groupId } = this.ctx.request.body.appData.actionData;

    await jianghuKnex.transaction(async trx => { 
      await trx('enterprise_user_group_role').where({ userId, groupId }).delete();
      await trx('enterprise_user_app').where({userId, groupId}).delete();
    })
  }


  async updateUserGroupRolePage() {
    const { jianghuKnex } = this.app;
    const {dataList, role, group} = this.ctx.request.body.appData.actionData;
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
    const roleUserList = await jianghuKnex('enterprise_user_group_role').select('userId').where({ groupId: group, roleId: role });
    const userIdList = roleUserList.map(e => e.userId);
    const insertUserApp = [];
    _.forEach(userIdList, (userId, index) => {
      const userAppList =appIdList.map(appId => { return { groupId: group, roleId: role, userId, appId} });
      insertUserApp.push(...userAppList);
    });

    await jianghuKnex.transaction(async trx => {
      // 删除原有的 enterprise_user_group_role_page
      await trx('enterprise_user_group_role_page').where({ group, role }).jhDelete();
      // 新增 enterprise_user_group_role_page
      insertUserGroupRolePageList.length && await trx('enterprise_user_group_role_page').jhInsert(insertUserGroupRolePageList);
      await trx('enterprise_user_group_role_resource').where({ group, role }).jhDelete();
      // 新增 enterprise_user_group_role_resource
      insertUserGroupRoleResourceList.length && await trx('enterprise_user_group_role_resource').jhInsert(insertUserGroupRoleResourceList);

      // 删除原有的 _user_app
      await trx('enterprise_user_app').where({ groupId: group, roleId: role }).jhDelete();
      insertUserApp.length && await trx('enterprise_user_app').jhInsert(insertUserApp);
    })
  }

  /**
   * 删除角色，删除角色关系与权限
   */
  async deleteGroupRole() {
    const { jianghuKnex } = this.app;
    const { roleId, groupId } = this.ctx.request.body.appData.actionData;
    
    await jianghuKnex.transaction(async trx => { 
      await trx('enterprise_role').where({ roleId  }).jhDelete();
      await trx('enterprise_user_app').where({ roleId, groupId  }).jhDelete();
      await trx('enterprise_user_group_role').where({ roleId, groupId }).jhDelete();
      await trx('enterprise_user_group_role_page').where({ group: groupId, role: roleId }).jhDelete();
      await trx('enterprise_user_group_role_resource').where({ group: groupId, role: roleId }).jhDelete();
    })

  }

}

module.exports = UserGroupRoleService;
