'use strict';

const path = require('path');

const { middleware, middlewareMatch } = require('@jianghujs/jianghu/config/middlewareConfig');

const eggJianghuDirResolve = require.resolve('@jianghujs/jianghu');
const eggJianghuDir = path.join(eggJianghuDirResolve, '../');

module.exports = appInfo => {

  const projectId = 'jianghujs_enterprise';
  const appId = 'directory';

  return {
    appId,
    projectId,
    appTitle: '应用目录',
    appLogo: `${appId}/public/img/logo.png`,
    appType: 'multiApp',
    appDirectoryLink: 'http://127.0.0.1:7273/directory',
    indexPage: `/${appId}/page/directory`,
    loginPage: `/${appId}/page/login`,
    helpPage: `/${appId}/page/help`,

    uploadDir: path.join(appInfo.baseDir, 'upload'),
    downloadBasePath: `/${appId}/upload`,

    primaryColor: "#4caf50",
    primaryColorA80: "#EEF7EE",

    jianghuConfig: {
      jhIdConfig: {
        // 是否开启
        enable: true,
        // 当前应用使用的 jhId，在使用配置表时，自动用该 jhId 做过滤
        jhId: 'directory',
        // 使用到 jhId 的配置表，一般保持默认即可
        careTableViewList: [
          '_cache',
          '_constant',
          '_constant_ui',
          '_file',
          '_group',
          '_page',
          '_record_history',
          '_resource',
          '_resource_request_log',
          '_role',
          '_test_case',
          '_user',
          '_user_group_role',
          '_user_group_role_page',
          '_user_group_role_resource',
          '_user_session',
          '_view01_user',
        ],
      },
    },
    
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
