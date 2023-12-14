'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');


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
    const pageList = await knex('_page').select('*');
    console.log(_.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']));
    // const pageListFilter = _.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']);
    const pageListFilter = _.map(pageList, item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']))
    this.ctx.request.body.appData.actionData.appPageList = JSON.stringify(pageListFilter);
  }

  async updateUserGroupRolePage() {
    const { jianghuKnex } = this.app;
    const {dataList, role} = this.ctx.request.body.appData.actionData;

    const dataListByAppId = _.groupBy(dataList, 'appId');
    const insert = [];
    _.forEach(dataListByAppId, (value, key) => {
      insert.push({
        appId: key,
        role,
        page: value.map(e => e.pageId).join(','),
        group: '*',
        user: '*',
        allowOrDeny: 'allow',
      })
    });
    
    await jianghuKnex.transaction(async trx => {
      // 删除原有的 enterprise_user_group_role_page
      await trx('enterprise_user_group_role_page').where({ role }).delete();
      // 新增 enterprise_user_group_role_page
      await trx('enterprise_user_group_role_page').insert(insert);
    })
  }

}

module.exports = AppService;
