'use strict';
const path = require('path');
const fs = require('fs');
const Knex = require('knex');
const _ = require('lodash');
const list = require('../../../../.vscode/project-list');
let appList = [];
async function cloneOrUpdateProjects() {
  appList = [];
      // 导入 project-list.js 文件
      const projectList = list;

      // 遍历项目列表
      for (const project of projectList) {
        const { id, name, url, subProjectList } = project;
        if (subProjectList) {
            for (const subProject of subProjectList) {
                const { subdir } = subProject;
                const dir = path.join(__dirname, '/../../../../', id + '.' + name, subdir);
                const defaultConfigPath = path.join(dir, 'config/config.default.js');
                const configPath = path.join(dir, 'config/config.local.js');
                if (!fs.existsSync(defaultConfigPath)) {
                    console.error(`${id + '.' + name + '/' + subdir} 项目下不存在 config/config.default.js 文件，跳过`)
                    continue
                }
                // 读取 defaultConfigPath 文件内容
                const appId = fs.readFileSync(defaultConfigPath, 'utf8').match(/const appId = ["'](.*)["']/)[1];
                const database = fs.readFileSync(configPath, 'utf8').match(/database: ["'](.*)["']/)[1];
                appList.push({ appId, database });
            }
        } else {
            const dir = path.join(__dirname, '/../../../../', id + '.' + name);
            const defaultConfigPath = path.join(dir, 'config/config.default.js');
            const configPath = path.join(dir, 'config/config.local.js');
            if (!fs.existsSync(defaultConfigPath)) {
                console.error(`${id + '.' + name + '/' + subdir} 项目下不存在 config/config.default.js 文件，跳过`)
                continue
            }
            // 读取 defaultConfigPath 文件内容
            const appId = fs.readFileSync(defaultConfigPath, 'utf8').match(/const appId = ["'](.*)["']/)[1];
            const database = fs.readFileSync(configPath, 'utf8').match(/database: ["'](.*)["']/)[1];
            appList.push({ appId, database });
        }
      }
  return appList;
}
module.exports = app => {
  return {
    schedule: {
      immediate: true,
      interval: '1111m', // 1 分钟间隔; 2m 30s
      type: 'worker', // 只有一个worker执行
      disable: true,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { logger } = app;
      const { jianghuKnex, knex } = app;
      const apps = await jianghuKnex('enterprise_app').select('*');
      const appList = await cloneOrUpdateProjects();
      for(const {appId, database} of appList) {
        if (!apps.find(item => item.appId === appId)) {
          const pageList = await jianghuKnex(database +'._page').select('*');
          const pageListFilter = _.map(pageList.filter(e => !['help', 'login', 'manual'].includes(e.pageId)), item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']))
          const appPageList = JSON.stringify(pageListFilter);
          const appUrl = 'https://init.openjianghu.org/' + appId;
          const appPageDirectoryList = JSON.stringify(pageListFilter.map(e => e.pageId));
          await jianghuKnex('enterprise_app').insert({appId, appName: appId, appDatabase: database, appPageList, appUrl, appType: '办公应用', appPageDirectoryList});
        }
      }
      const endTime = new Date().getTime();
      logger.info('[schedule/appPageList.js]', { useTime: `${endTime - startTime}/ms` });
    },
  };
};
