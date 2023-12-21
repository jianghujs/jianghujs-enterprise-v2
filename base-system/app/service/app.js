'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');

const getJhIdViewSql = (appList, tableName) => {
  let whereClause = ''; // 初始化 WHERE 子句

  if (['enterprise_user_group_role_page', 'enterprise_user_group_role_resource'].includes(tableName)) {
    whereClause = ` WHERE appId = '{APPID}' OR appId = '*'`;
  } else if (tableName === 'enterprise_user_app') {
    whereClause = ` WHERE appId = '{APPID}'`;
  }

  // 检查 appList 中是否存在非空的 jhId
  if (!appList.some(({appJhId}) => !!appJhId)) {
    // 如果所有的 jhId 都是空，生成一个简单的 SELECT 查询
    return `SELECT * FROM jh_enterprise_v2_data_repository.${tableName}${whereClause.replace('{APPID}', appList[0].appId)}`;
  }

  // 否则，生成一个 CROSS JOIN 查询
  const jhIdValuesSql = appList.map(({appJhId}) => {
    return `SELECT '${appJhId}' as jhId`;
  }).join(' UNION ALL ');

  const crossJoinSql = `SELECT jhId_values.jhId, jh_enterprise_v2_data_repository.${tableName}.* 
                        FROM (${jhIdValuesSql}) AS jhId_values 
                        CROSS JOIN jh_enterprise_v2_data_repository.${tableName}${whereClause.replace('{APPID}', appList[0].appId)}`;

  return crossJoinSql;
}


class AppService extends Service {

  async checkDatabaseExist() {
    const { jianghuKnex, knex } = this.app;
    const { appDatabase: database, appJhId: jhId } = this.ctx.request.body.appData.actionData;
    // 检查数据库是否存在
    const [databaseExist] = await knex.raw('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',[database])
    if (!databaseExist.length) {
      throw new Error(`数据库不存在`);
    }
    // 修改 knex 的 database
    if (jhId) {
      // knex 验证jhId 字段是否存在
      if (!await knex.schema.hasColumn(database + '._page', 'jhId')) {
        throw new Error(`数据库不存在 jhId 字段`);
      }
    }
    const pageList = await jianghuKnex(database + '._page').where(jhId ? { jhId } : {}).select();
    // console.log(_.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']));
    // const pageListFilter = _.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']);
    const pageListFilter = _.map(pageList.filter(e => !['help', 'login', 'manual'].includes(e.pageId)), item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']));

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
    const databaseList = _.compact(_.uniqBy(appList.map((app) => app.appDatabase)));
    for (const database of databaseList) {
      const appListByDatabase = appList.filter((app) => app.appDatabase == database);
      const appIdList = appListByDatabase.map((app) => app.appId);
      knex.client.config.connection.database = database;
      const currentKnex = Knex(knex.client.config);
      logger.info(`updateAppUserGroupRole appId: ${appIdList.join(',')}`);
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
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _group AS ${getJhIdViewSql(appListByDatabase, 'enterprise_group')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _role AS ${getJhIdViewSql(appListByDatabase, 'enterprise_role')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_page AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role_page')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_resource AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role_resource')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view01_user AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view02_user_app AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_app')};`),
      ];
      if (appIdList.includes('directory')) { 
        // 替换 createViewSql 的最后一个
        createViewSql.pop();
        createViewSql.push(currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view02_user_app AS SELECT * FROM jh_enterprise_v2_data_repository.enterprise_user_app`));
      }
      await Promise.all(deleteViewSql);
      await Promise.all(createViewSql);
      await currentKnex.destroy();
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

  async buildSupperAdminUserApp() {
    const { jianghuKnex } = this.app;
    const supperAdminUserList = await jianghuKnex('enterprise_user_group_role').where({groupId: '超级管理员', roleId: '*'}).select();
    const userList = supperAdminUserList.map(e => e.userId);
    // 检查 enterprise_user_app 内是否有对应的关系数据
    const userAppList = await jianghuKnex('enterprise_user_app').whereIn('userId', userList).select();
    const appList = await jianghuKnex('enterprise_app').select();
    const appIdList = appList.map(e => e.appId);

    for (const appId of appIdList) {
      for (const userId of userList) {
        if (!userAppList.some(e => e.appId == appId && e.userId == userId)) {
          await jianghuKnex('enterprise_user_app').insert({
            userId: userId,
            appId: appId,
          });
        }
      }
    }
    // 判断是否有非这些id的user关系数据
    const idList = userAppList.filter(e => !appIdList.includes(e.appId)).map(e => e.id);
    if (idList.length > 0) {
      await jianghuKnex('enterprise_user_app').whereIn('id', idList).delete();
    }
  }

}

module.exports = AppService;
