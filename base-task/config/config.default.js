'use strict';

const path = require('path');

const { middleware, middlewareMatch } = require('@jianghujs/jianghu/config/middlewareConfig');

const eggJianghuDirResolve = require.resolve('@jianghujs/jianghu');
const eggJianghuDir = path.join(eggJianghuDirResolve, '../');

module.exports = appInfo => {

  const projectId = 'jianghujs_enterprise';
  const appId = 'task';

  return {
    appId,
    projectId,
    appTitle: '办公应用',
    appLogo: `${appId}/public/img/logo.png`,
    appType: 'multiApp',
    appDirectoryLink: 'http://127.0.0.1:7273/directory',
    indexPage: `/${appId}/page/workbench`,
    loginPage: `/${appId}/page/login`,
    helpPage: `/${appId}/page/help`,

    uploadDir: path.join(appInfo.baseDir, 'upload'),
    downloadBasePath: `/${appId}/upload`,

    primaryColor: "#4caf50",
    primaryColorA80: "#EEF7EE",
    
    static: {
      dynamic: true,
      preload: false,
      maxAge: 31536000,
      buffer: true,
      dir: [
        { prefix: `/${appId}/public/`, dir: path.join(appInfo.baseDir, 'app/public') },
        { prefix: `/${appId}/public/`, dir: path.join(eggJianghuDir, 'app/public') },
      ],
    },

    view: {
      defaultViewEngine: 'nunjucks',
      mapping: { '.html': 'nunjucks' },
      root: [
        path.join(appInfo.baseDir, 'app/view'),
        path.join(eggJianghuDir, 'app/view'),
      ].join(','),
    },

    middleware,
    ...middlewareMatch,
  };

};
