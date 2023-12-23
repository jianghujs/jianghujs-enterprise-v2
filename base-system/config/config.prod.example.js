'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    authTokenKey: 'directory',
    loginPage: '/directory/page/login',
    appDirectoryLink: '/directory',
    jiangHuConfig: {
      packageIdCheck: false,
      updateRequestDemoAndResponseDemo: false,
      enableUserInfoCache: true,
      userInfoCacheRefreshInterval: '10s',
    },
    logger: {
      outputJSON: true,
      level: 'INFO',
      // level: 'DEBUG',
      // allowDebugAtProd: true,
      dir: path.join(appInfo.baseDir, 'logs'),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      },
    },
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: '3306',
          user: 'root',
          password: '123456',
          database: 'jh_enterprise_v2_system',
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };
};
