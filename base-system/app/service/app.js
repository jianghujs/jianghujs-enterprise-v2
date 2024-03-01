'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');
const dayjs = require('dayjs');

const getJhIdViewSql = (appList, tableName) => {

  // 检查 appList 中是否存在非空的 jhId
  if (!appList.some(({ appJhId }) => !!appJhId)) {

    let whereClause = ''; // 初始化 WHERE 子句
    if (['enterprise_user_group_role_page', 'enterprise_user_group_role_resource'].includes(tableName)) {
      whereClause = ` WHERE appId = '{APPID}' OR appId = '*'`;
    } else if (tableName === 'enterprise_user_app') {
      whereClause = ` WHERE appId = '{APPID}'`;
    }
    // 如果所有的 jhId 都是空，生成一个简单的 SELECT 查询
    return `SELECT * FROM jh_enterprise_v2_data_repository.${tableName}${whereClause.replace('{APPID}', appList[0].appId)}`;
  }

  // 否则，生成一个 CROSS JOIN 查询
  const jhIdValuesSql = appList.map(({ appJhId }) => {
    return `SELECT '${appJhId}' as jhId`;
  }).join(' UNION ALL ');

  if (['enterprise_user_group_role_page', 'enterprise_user_group_role_resource', 'enterprise_user_app'].includes(tableName)) {
    const appIdJhidMap = _.fromPairs(appList.map(({ appId, appJhId }) => [appId, appJhId]));
    const appIdList = _.uniq(appList.map(({ appId }) => appId));
    /**
     * CASE my_field
          WHEN 'haha' THEN 'Result for haha'
          WHEN 'hehe' THEN 'Result for hehe'
          ELSE 'Result for heihei'
      END 
    */
    let ifClasus = 'CASE appId';
    _.forEach(appIdJhidMap, (jhId, appId) => {
      ifClasus += ` WHEN '${appId}' THEN '${jhId}'`;
    });
    let userAppWhereClause = appIdList.length > 1 ? ` WHERE appId IN ('${appIdList.join("','")}')` : ` WHERE appId = '${appIdList[0]}'`;
    if (tableName != 'enterprise_user_app') {
      userAppWhereClause += ` union all 
      SELECT jhId_values.jhId, jh_enterprise_v2_data_repository.${tableName}.* 
          FROM (${jhIdValuesSql}) AS jhId_values 
          CROSS JOIN jh_enterprise_v2_data_repository.${tableName} where appId = '*'
      `;
    }
    ifClasus += ' ELSE NULL END AS jhId';
    return `SELECT ${ifClasus}, jh_enterprise_v2_data_repository.${tableName}.* 
            FROM jh_enterprise_v2_data_repository.${tableName}${userAppWhereClause}`;
  }

  return `SELECT jhId_values.jhId, jh_enterprise_v2_data_repository.${tableName}.* 
          FROM (${jhIdValuesSql}) AS jhId_values 
          CROSS JOIN jh_enterprise_v2_data_repository.${tableName}`;
}


class AppService extends Service {

  async checkDatabaseExist() {
    const { jianghuKnex, knex } = this.app;
    const { appDatabase: database, appJhId: jhId } = this.ctx.request.body.appData.actionData;
    // 检查数据库是否存在
    const [databaseExist] = await knex.raw('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?', [database])
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
        .update({ appPageList: JSON.stringify(pageListFilter) });
    }
  }

  async updateAppUserGroupRole() {
    const actionData = this.ctx.request.body.appData.actionData;
    const { knex, logger } = this.app;
    const appWhere = _.pick(actionData, ['id']);

    const appListAll = await knex('enterprise_app').where(appWhere).select();
    const appListForUserGroupRole = appListAll.filter((app) => app.appId != 'system');
    const databaseList = _.compact(_.uniqBy(appListForUserGroupRole.map((app) => app.appDatabase)));
    for (const database of databaseList) {
      const appListByDatabase = appListForUserGroupRole.filter((app) => app.appDatabase == database);
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
        currentKnex.raw(`DROP VIEW IF EXISTS _enterprise_user_session;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _directory_user_session;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _view01_user;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _dr__member;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _view02_user_app;`),
      ];
      const createViewSql = [
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _group AS ${getJhIdViewSql(appListByDatabase, 'enterprise_group')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _role AS ${getJhIdViewSql(appListByDatabase, 'enterprise_role')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_page AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role_page')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_resource AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role_resource')};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _directory_user_session AS ${getJhIdViewSql(appListByDatabase, 'directory_user_session')};`),
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
    // 补一个system的 _user_session
    const systemApp = appListAll.find((app) => app.appId == 'system');
    knex.client.config.connection.database = systemApp.appDatabase;
    const systemKnex = Knex(knex.client.config);
    await systemKnex.raw(`DROP VIEW IF EXISTS _enterprise_user_session;`);
    await systemKnex.raw(`DROP VIEW IF EXISTS _directory_user_session;`);
    await systemKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _directory_user_session AS ${getJhIdViewSql(['system'], 'directory_user_session')};`);
    await systemKnex.destroy();


    // knex 检查 _page表是否有 pageIcon 字段
    const appListForTask = appListAll;
    // const appListForTask = appListAll.filter((app) => app.appId != 'task');
    const taskApp = appListAll.find((app) => app.appId == 'task');
    for (const app of appListForTask) {
      const { appDatabase, appId } = app;
      if (!await knex.schema.hasColumn(`${appDatabase}._page`, 'pageIcon')) {
        await knex.schema.alterTable(`${appDatabase}._page`, function (table) {
          table.text('pageIcon').after('pageType');
        });
      }
      await knex(`${appDatabase}._page`).where({ pageName: '通知/待办', pageType: 'showInRightMenu' }).delete();
      await knex(`${appDatabase}._page`).insert({
        pageId: taskApp.appUrl + '/page/noticeManagement',
        pageName: '通知/待办', pageType: 'showInRightMenu',
        pageIcon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <g id="Frame 19"> <path id="Vector" d="M14 0C6.2695 0 0 6.2695 0 14C0 21.7305 6.2695 28 14 28C21.7305 28 28 21.7305 28 14C28 6.2695 21.7305 0 14 0Z" fill="#5DB55F"/> <g id="Frame"> <path id="Vector_2" d="M15.2698 19.44L15.307 19.4419C15.5022 19.4633 15.6398 19.6499 15.5895 19.8403L15.57 19.9088C15.3646 20.5638 14.7393 21.04 14.0001 21.04L13.9239 21.0384C13.193 21.0057 12.5866 20.5075 12.4103 19.8403L12.4033 19.8048C12.3758 19.6153 12.5284 19.44 12.7303 19.44H15.2698ZM14.0001 6.95996C14.1274 6.95996 14.2495 7.01053 14.3395 7.10055C14.4295 7.19057 14.4801 7.31266 14.4801 7.43996V7.94364C16.9402 8.191 18.8001 10.3545 18.8001 12.8556V16.24L18.802 16.288C18.8141 16.4489 18.8866 16.5994 19.0049 16.7091C19.1232 16.8189 19.2787 16.8799 19.4401 16.88H19.5543L19.6087 16.8816C20.0055 16.9065 20.3562 17.1993 20.3959 17.5974L20.3994 17.6486C20.4037 17.7562 20.3861 17.8635 20.3479 17.9642C20.3096 18.0648 20.2514 18.1567 20.1768 18.2343C20.1022 18.312 20.0127 18.3737 19.9137 18.4159C19.8146 18.4581 19.7081 18.4799 19.6004 18.48H8.44583L8.39143 18.4784C7.99463 18.4534 7.64391 18.1606 7.60423 17.7625L7.60071 17.7113C7.59649 17.6037 7.61404 17.4964 7.65231 17.3957C7.69058 17.295 7.74878 17.2031 7.82342 17.1255C7.89807 17.0479 7.98762 16.9861 8.0867 16.9439C8.18579 16.9017 8.29238 16.88 8.40007 16.88H8.56007L8.60807 16.8784C8.76908 16.8663 8.91956 16.7937 9.02935 16.6753C9.13914 16.5569 9.20012 16.4014 9.20007 16.24V12.72C9.20007 10.231 11.0945 8.1846 13.5201 7.94364V7.43996C13.5201 7.31266 13.5706 7.19057 13.6607 7.10055C13.7507 7.01053 13.8728 6.95996 14.0001 6.95996Z" fill="white"/> </g> </g> </svg>`,
      });
    }

  }

  async updateToDirectoryApp() {
    const { jianghuKnex } = this.app;

    const appTypeListConstant = await jianghuKnex('_constant', this.ctx).where({ constantKey: 'appTypeList' }).select().first();
    const appTypeList = JSON.parse(appTypeListConstant?.constantValue || '[]');
    const appList = await jianghuKnex('enterprise_app').select();
    appList.forEach((row) => {
      row.appPageList = JSON.parse(row.appPageList || '[]');
      row.appPageDirectoryList = JSON.parse(row.appPageDirectoryList || '[]');
      row.appPageDirectoryList = row.appPageDirectoryList
        .filter((pageId) => row.appPageList.findIndex((page) => page.pageId == pageId) > -1)
        .map((pageId) => row.appPageList.find((page) => page.pageId == pageId));
    });
    const directoryList = await jianghuKnex('jh_enterprise_v2_directory.directory').select();
    const directoryListFilter = directoryList.filter(d => d.appGroupItemSort && d.appGroupItemSort >= 0);
    const appGroupItemSortMap = Object.fromEntries(directoryListFilter.map(obj => [obj.appId, obj.appGroupItemSort]));
    await jianghuKnex('jh_enterprise_v2_directory.directory').where({ description: '生成' }).delete();
    for (const app of appList) {
      const { appPageDirectoryList, appId, appType, appUrl } = app;
      const directoryList = appPageDirectoryList.map((page) => {
        const appTypeObj = appTypeList.find((at) => at.value == appType)
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
    const supperAdminUserList = await jianghuKnex('enterprise_user_group_role').where({ groupId: '超级管理员', roleId: '*' }).select();
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
            groupId: '超级管理员', roleId: '*',
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


  // createUserId若存在，表示在创建新用户，否则为定时任务
  async buildRelationByCommonAuth(createUserId) {
    const { jianghuKnex } = this.app;

    const commonAuth = await jianghuKnex('_constant').where({ constantKey: 'commonAuth' }).select();

    const userApp = await jianghuKnex('enterprise_user_app').where({ groupId: 'login', roleId: 'commonAuth' }).select();
    const userGroupRole = await jianghuKnex('enterprise_user_group_role').where({ groupId: 'login', roleId: 'commonAuth' }).select();
    const userGroupRolePage = await jianghuKnex('enterprise_user_group_role_page').where({ group: 'login', role: 'commonAuth' }).select();
    const userGroupRoleResource = await jianghuKnex('enterprise_user_group_role_resource').where({ group: 'login', role: 'commonAuth' }).select();


    const userList = await jianghuKnex('_user').select();
    const appList = JSON.parse(commonAuth[0].constantValue)

    const insertUserAppList = []
    const insertUserGroupRoleList = []
    const insertUserGroupRolePageList = []
    const insertUserGroupRoleResourceList = []

    // 待删除的app列表
    const deleteAppList = []

    // 已存在的app列表
    const preAppList = []


    // 通过 _constant 取出新的app列表
    const nextAppList = appList.map(item => {
      return {
        appId: item.appId,
        pageIdList: item.pageIdList.join(',')
      }
    })

    // 通过 enterprise_user_group_role_page 筛选出旧的app列表
    _.forEach(userGroupRolePage, acc => {
      if (!preAppList.find(app => app.appId === acc.appId && app.pageIdList === acc.page)) {
        preAppList.push({
          appId: acc.appId,
          pageIdList: acc.page
        })
      }
    })


    //筛选出需要删除的app数据
    _.forEach(preAppList, item => {
      if (!nextAppList.find(app => app.appId === item.appId && app.pageIdList === item.pageIdList) && !deleteAppList.find(app => app.appId === item.appId && app.pageIdList === item.pageIdList)) {
        deleteAppList.push(item)
      }
    })


    //遍历所有app，检查是否需要插入新的 page 和 resource
    _.forEach(appList, app => {
      const item = {
        appId: app.appId,
        group: 'login',
        role: 'commonAuth',
        user: '*',
        allowOrDeny: 'allow',
      }

      //检查 enterprise_user_group_role_page 是否需要插入新的记录
      if (!userGroupRolePage.find(item => item.group === 'login' && item.role === 'commonAuth' && item.appId === app.appId)) {
        insertUserGroupRolePageList.push({
          ...item,
          page: app.pageIdList.join(','),
        })
      }

      //检查 enterprise_user_group_role_resource 是否需要插入新的记录
      if (!userGroupRoleResource.find(item => item.group === 'login' && item.role === 'commonAuth' && item.appId === app.appId)) {
        insertUserGroupRoleResourceList.push({
          ...item,
          resource: app.pageIdList.join(',') === '*' ? '*' : app.pageIdList.join('.*,') + '.*'
        })
      }
    })

    // createUserId若存在，表示在创建新用户，否则为定时任务
    if (createUserId) {
      //准备插入的 enterprise_user_group_role 数据
      insertUserGroupRoleList.push({
        groupId: 'login',
        roleId: 'commonAuth',
        userId: createUserId,
        deadline: -1,
      })


      // 遍历基础应用的app列表
      _.forEach(appList, app => {
        //根据app列表，准备插入的 enterprise_user_app 数据
        insertUserAppList.push({
          appId: app.appId,
          groupId: 'login',
          roleId: 'commonAuth',
          userId: createUserId,
        })

      })

      // console.log('======创建新用户========')

    } else {

      // 遍历所有用户，查看是否需要插入新的记录
      _.forEach(userList, user => {

        //检查 enterprise_user_group_role 是否需要插入新的记录
        if (!userGroupRole.find(item => item.groupId === 'login' && item.roleId === 'commonAuth' && item.userId === user.userId) && user.userId ) {
          insertUserGroupRoleList.push({
            groupId: 'login',
            roleId: 'commonAuth',
            userId: user.userId,
            deadline: -1,
          })
        }

        // 遍历基础应用的app列表
        _.forEach(appList, app => {
          //检查 enterprise_user_app 是否需要插入新的记录
          if (!userApp.find(item => item.groupId === 'login' && item.roleId === 'commonAuth' && item.appId === app.appId && item.userId === user.userId) && user.userId) {
            insertUserAppList.push({
              appId: app.appId,
              groupId: 'login',
              roleId: 'commonAuth',
              userId: user.userId,
            })
          }
        })

      })

      // console.log('======定时任务========')
      // console.log('旧的app列表', preAppList)
      // console.log('新的app列表', nextAppList)
      // console.log('待删除数据的app列表', deleteAppList)
      // console.log('插入UserApp的数据：insertUserAppList', insertUserAppList.length)
      // console.log('插入UserGroupRole的数据：insertUserGroupRoleList', insertUserGroupRoleList.length)
      // console.log('插入UserGroupRolePage的数据：insertUserGroupRolePageList', insertUserGroupRolePageList.length)
      // console.log('插入UserGroupRoleResource的数据：insertUserGroupRoleResourceList', insertUserGroupRoleResourceList.length)
      // console.log('======定时任务========')
    }

    await jianghuKnex.transaction(async trx => {

      if (deleteAppList.length > 0) {
        for (const deleteApp of deleteAppList) {
          // 删除原有的 enterprise_user_app
          await trx('enterprise_user_app').where({ groupId: 'login', roleId: 'commonAuth', appId: deleteApp.appId }).jhDelete();

          // 删除原有的 enterprise_user_group_role_page
          await trx('enterprise_user_group_role_page').where({ group: 'login', role: 'commonAuth', appId: deleteApp.appId, page: deleteApp.pageIdList }).jhDelete();

          //删除原有的 enterprise_user_group_role_resource
          await trx('enterprise_user_group_role_resource').where({ group: 'login', role: 'commonAuth', appId: deleteApp.appId }).jhDelete();
        }
      }
      // 新增 enterprise_user_app
      insertUserAppList.length && await trx('enterprise_user_app').jhInsert(insertUserAppList);

      // 新增 enterprise_user_group_role
      insertUserGroupRoleList.length && await trx('enterprise_user_group_role').jhInsert(insertUserGroupRoleList);

      // 新增 enterprise_user_group_role_page
      insertUserGroupRolePageList.length && await trx('enterprise_user_group_role_page').jhInsert(insertUserGroupRolePageList);

      // 新增 enterprise_user_group_role_resource
      insertUserGroupRoleResourceList.length && await trx('enterprise_user_group_role_resource').jhInsert(insertUserGroupRoleResourceList);
    })
  }

  async removeRelationByExpire() {
    const { jianghuKnex } = this.app;
    let today = dayjs().format('YYYY-MM-DD')
    const userRoleList = await jianghuKnex('enterprise_user_group_role')
      .where('deadline', '<', today)
      .where('deadline', '<>', '-1')
      .select();
    
    // enterprise_user_group_role
    await jianghuKnex('enterprise_user_group_role')
      .where('deadline', '<', today)
      .where('deadline', '<>', '-1')
      .jhDelete();
    
    // enterprise_user_app
    if (userRoleList.length > 0) {
      for (const i of userRoleList) {
        await jianghuKnex('enterprise_user_app')
          .where({userId: i.userId, roleId: i.roleId, groupId: i.groupId})
          .jhDelete();
      }
    }
  }
}

module.exports = AppService;
