'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');


class AppService extends Service {

  async checkDatabaseExist() {
    const { jianghuKnex, knex } = this.app;
    const { appDatabase: database } = this.ctx.request.body.appData.actionData;
    // 检查数据库是否存在
    const [databaseExist] = await knex.raw('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',[database])
    if (!databaseExist.length) {
      throw new Error(`【 ${database} 】- 数据库不存在`);
    }
    // 修改 knex 的 database
    knex.client.config.connection.database = database;
    const currentKnex = Knex(knex.client.config);
    const pageList = await currentKnex('_page').select('*');
    console.log(_.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']));
    // const pageListFilter = _.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']);
    const pageListFilter = _.map(pageList.filter(e => !['help', 'login', 'manual'].includes(e.pageId)), item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']))
    this.ctx.request.body.appData.actionData.appPageList = JSON.stringify(pageListFilter);
  }

  async updateUserGroupRolePage() {
    const { jianghuKnex } = this.app;
    const {dataList, role} = this.ctx.request.body.appData.actionData;

    const dataListByAppId = _.groupBy(dataList, 'appId');
    const appIdList = Object.keys(dataListByAppId);
    const insertUserGroupRolePageList = [];
    const insertUserGroupRoleResourceList = [];
    _.forEach(dataListByAppId, (value, key) => {
      const item = {
        appId: key,
        role,
        group: '*',
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
      await trx('enterprise_user_group_role_page').where({ role }).jhDelete();
      // 新增 enterprise_user_group_role_page
      insertUserGroupRolePageList.length && await trx('enterprise_user_group_role_page').jhInsert(insertUserGroupRolePageList);
      await trx('enterprise_user_group_role_resource').where({ role }).jhDelete();
      // 新增 enterprise_user_group_role_resource
      insertUserGroupRoleResourceList.length && await trx('enterprise_user_group_role_resource').jhInsert(insertUserGroupRoleResourceList);

      // 删除原有的 _user_app
      await trx('enterprise_user_app').whereIn('userId', userIdList).whereIn('appId', appIdList).jhDelete();
      // 新增 _user_app
      insertUserApp.length && await trx('enterprise_user_app').jhInsert(insertUserApp);
    })
  }

}

module.exports = AppService;
