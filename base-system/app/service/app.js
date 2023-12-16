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

  async updateToDirectoryApp() {
    const appTypeList =  [
      { value:'系统应用' },
      { value:'办公应用' }, 
      { value:'简单应用' }, 
      { value:'其他应用' }, 
    ];
    const { jianghuKnex } = this.app;
    const appList = await jianghuKnex('enterprise_app').select();
    appList.forEach((row)=>{
      row.appPageList = JSON.parse(row.appPageList || '[]');
      row.appPageDirectoryList = JSON.parse(row.appPageDirectoryList || '[]');
      row.appPageDirectoryList = row.appPageDirectoryList
        .filter((pageId)=>row.appPageList.findIndex((page)=>page.pageId == pageId) > -1)
        .map((pageId)=>row.appPageList.find((page)=>page.pageId == pageId));
    });
    await jianghuKnex('jh_enterprise_v2_directory.directory').where({description: '生成'}).delete();
    const directoryList = await jianghuKnex('jh_enterprise_v2_directory.directory').select();
    for (const app of appList) {
      const { appPageDirectoryList, appType } = app;
      const directoryList = appPageDirectoryList.map((page)=>{
        const appTypeIndex = appTypeList.findIndex((at)=>at.value == appType)
        return {
          // `appGroupNumber` varchar(255) DEFAULT NULL COMMENT '应用组排序',
          // `appGroupName` varchar(255) DEFAULT NULL COMMENT '应用组名',
          // `appGroupItemSort` varchar(255) DEFAULT NULL COMMENT '应用组下url的排序',
          appGroupNumber: appTypeIndex > -1 ? `${appTypeIndex + 1}0`: null,
          appGroupName: app.appType,
          appId: app.appId,
          appName: app.appName,
          url: `/page/${page.pageId}`,
          displayName: page.pageName,
          description: '生成',
          accessType: 'login',
        }
      });
      if (directoryList.length > 0) {
        await jianghuKnex('jh_enterprise_v2_directory.directory').insert(directoryList);
      }
    }
    console.log('updateToDirectoryApp');
  }

}

module.exports = AppService;
