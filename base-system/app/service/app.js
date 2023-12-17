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
    // console.log(_.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']));
    // const pageListFilter = _.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']);
    const pageListFilter = _.map(pageList.filter(e => !['help', 'login', 'manual'].includes(e.pageId)), item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']))
    this.ctx.request.body.appData.actionData.appPageList = JSON.stringify(pageListFilter);
  }

  async updatePageList() {
    const { jianghuKnex } = this.app;
    const appList = await jianghuKnex('enterprise_app').select();
    for (const app of appList) {
      const pageList = await jianghuKnex(`${app.appDatabase}._page`).select();
      const pageListFilter = _.map(pageList.filter(e => !['help', 'login', 'manual'].includes(e.pageId)), item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']));
      // TODO: 有差异再更新
      await jianghuKnex('enterprise_app').where({ id: app.id })
        .update({ appPageList: JSON.stringify(pageListFilter)});
    }
  }

  async updateAppUserGroupRole() {
    const actionData = this.ctx.request.body.appData.actionData;
    const {knex, logger} = this.app;
    const appWhere = _.pick(actionData, ['id']);

    let appList = await knex('enterprise_app')
      .where(appWhere)
      .select();
    appList = appList.filter((app)=>app.appId != 'system');
    for (const app of appList) {
      const { appDatabase, appId} = app;
      knex.client.config.connection.database = appDatabase;
      const currentKnex = Knex(knex.client.config);
      logger.info(`updateAppUserGroupRole appId: ${appId}`);
      const deleteViewSql = [
        currentKnex.raw(`DROP TABLE IF EXISTS _group;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _role;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _user_group_role;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _user_group_role_page;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _user_group_role_resource;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _view01_user;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _view02_user_app;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _group;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _role;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _user_group_role;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _user_group_role_page;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _user_group_role_resource;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _view01_user;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _view02_user_app;`),
      ];
      const createViewSql = [
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _group AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_group;`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _role AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_role;`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_user_group_role;`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_page AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_user_group_role_page WHERE jh_enterprise_v2_data_repository.enterprise_user_group_role_page.appId = '${appId}' OR jh_enterprise_v2_data_repository.enterprise_user_group_role_page.appId = '*';`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_resource AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_user_group_role_resource WHERE jh_enterprise_v2_data_repository.enterprise_user_group_role_resource.appId = '${appId}' OR jh_enterprise_v2_data_repository.enterprise_user_group_role_resource.appId = '*';`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view01_user AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_user;`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view02_user_app AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_user_app;`),
      ];
      await Promise.all(deleteViewSql);
      await Promise.all(createViewSql);
    }
  }

  async updateToDirectoryApp() {
    const { jianghuKnex } = this.app;

    const appTypeListConstant = await jianghuKnex('_constant', this.ctx).where({ constantKey: 'appTypeList' }).select().first();
    const appTypeList = JSON.parse(appTypeListConstant?.constantValue || '[]');
    const appList = await jianghuKnex('enterprise_app').select();
    appList.forEach((row)=>{
      row.appPageList = JSON.parse(row.appPageList || '[]');
      row.appPageDirectoryList = JSON.parse(row.appPageDirectoryList || '[]');
      row.appPageDirectoryList = row.appPageDirectoryList
        .filter((pageId)=>row.appPageList.findIndex((page)=>page.pageId == pageId) > -1)
        .map((pageId)=>row.appPageList.find((page)=>page.pageId == pageId));
    });
    const directoryList = await jianghuKnex('jh_enterprise_v2_directory.directory').select();
    const directoryListFilter = directoryList.filter(d => d.appGroupItemSort && d.appGroupItemSort >= 0);
    const appGroupItemSortMap = Object.fromEntries(directoryListFilter.map(obj => [obj.appId, obj.appGroupItemSort]));
    await jianghuKnex('jh_enterprise_v2_directory.directory').where({description: '生成'}).delete();
    for (const app of appList) {
      const { appPageDirectoryList, appId, appType, appUrl } = app;
      const directoryList = appPageDirectoryList.map((page)=>{
        const appTypeObj = appTypeList.find((at)=>at.value == appType)
        return {
          appGroupNumber: appTypeObj?.appGroupNumber,
          appGroupName: app.appType,
          appGroupItemSort: appGroupItemSortMap[appId], // TODO: 从 old directoryList里取
          appId: app.appId,
          appName: app.appName,
          url: `${appUrl}/page/${page.pageId}`,
          displayName: page.pageName,
          description: '生成',
          accessType: 'login',
        }
      });
      if (directoryList.length > 0) {
        await jianghuKnex('jh_enterprise_v2_directory.directory').insert(directoryList);
      }
    }
  }

}

module.exports = AppService;
