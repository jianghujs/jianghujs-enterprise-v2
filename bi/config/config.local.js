'use strict';

const path = require('path');
// require('dotenv').config({path: path.resolve(__dirname, '../.env')});

module.exports = appInfo => {

  return {
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
    },
    logger: {
      outputJSON: true,
      consoleLevel: 'DEBUG',
      level: 'DEBUG',
      dir: path.join(appInfo.baseDir, 'logs'),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      }
    },
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: '42122',
          user: 'root',
          password: 'msDCkSrtCdfWknnT',
          database: 'jianghu_bi'
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000
      },
      app: true
    }
  };

};
