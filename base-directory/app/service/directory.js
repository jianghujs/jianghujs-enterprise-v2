'use strict';

const _ = require('lodash');

const Service = require('egg').Service;

class DirectoryService extends Service {

  async getDirectoryList() {
    const { jianghuKnex } = this.app;
    const { userInfo } = this.ctx;
    const { userAppList } = userInfo;
    const appIdList = userAppList.map(userApp => userApp.appId);
    
    // 旧版
    // const rows = await jianghuKnex('directory')
    //   .orWhere(function() {
    //     this.whereIn('appId', appIdList);
    //   })
    //   .orWhere('accessType', 'public')
    //   .select();

    const directoryConfigConstant = await jianghuKnex('_constant').where('constantKey', 'directoryConfig').first();
    const appList = await jianghuKnex('enterprise_app').select();
    const directoryConfig = JSON.parse(directoryConfigConstant.constantValue);
    directoryConfig.forEach(catalog => {
      catalog.children.forEach(app => {
        app.children.forEach(page => {
          const appItem = appList.find(app => app.appId === page.appId);
          let url = appItem.appUrl;
          if (page.pageId) {
            url += `/page/${page.pageId}`;
          }
          page.link = page.link || url;
        });
      });
    })
    return { rows: directoryConfig };
  }

  async saveDirectoryConfig() {
    const { jianghuKnex } = this.app;
    const { userInfo } = this.ctx;
    const {appConfigList} = this.ctx.request.body.appData.actionData;
    const appList = await jianghuKnex('enterprise_app').select();

    const confitStr = JSON.stringify(appConfigList);
    for (const catalog of appConfigList) {
      for (const appTmp of catalog.children) {
        for (const pageTmp of appTmp.children) {
          const { appId, pageId, link } = pageTmp;
          const app = appList.find(app => app.appId === appId);
          if (!link) {
            pageTmp.link = app.appUrl;
            if (pageId) {
              pageTmp.link += `/${pageId}`;
            }
          }
        }
      }
    }
    if (!await jianghuKnex('_constant').where('constantKey', 'directoryConfig').first()) {
      await jianghuKnex('_constant').insert({ constantKey: 'directoryConfig', constantValue: confitStr });
      await jianghuKnex('_constant').insert({ constantKey: 'directoryList', constantValue: JSON.stringify(appConfigList) });
      return;
    }
    await jianghuKnex('_constant').where('constantKey', 'directoryConfig').update({ constantValue: confitStr });
    await jianghuKnex('_constant').where('constantKey', 'directoryList').update({ constantValue: JSON.stringify(appConfigList) });

  }

}

module.exports = DirectoryService;
