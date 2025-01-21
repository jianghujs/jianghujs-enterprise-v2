'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    remoteDatabaseList: [
      { remoteName: 'demo',      host: '127.0.0.1',       port: 3306, user: 'root', password: '123456' },
      { remoteName: 'dev03',     host: '127.0.0.1',       port: 3307, user: 'root', password: '123456' },
      { remoteName: 'dev05',     host: '127.0.0.1',       port: 3308, user: 'root', password: '123456' },
    ],
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: '3306',
          user: 'root',
          password: '123456',
          database: 'jh_enterprise_v2_data_repository',
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
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
  };
};
