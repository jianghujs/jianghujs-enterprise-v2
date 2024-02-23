'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    appDirectoryLink: 'http://127.0.0.1:7273/directory',
    debug: true,
    jiangHuConfig: {
      packageIdCheck: false,
      updateRequestDemoAndResponseDemo: true,
    },
    logger: {
      outputJSON: true,
      consoleLevel: 'DEBUG',
      level: 'DEBUG',
      dir: path.join(appInfo.baseDir, 'logs'),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      },
    },
    wechat: {
      devMode: true,
      // 微信配置（公众号、小程序、开放平台）
      apiConfig: {
        // appId: 'appId',
        // appScrect: 'appScrect',
        // token: 'token',
        // encryptMessage: true,
        // encodingAesKey: 'encodingAesKey'
      },
      // 企业微信配置（应用、小程序、第三方）
      qyApiConfig: {
        // appId: '123',
        // appScrect: '123',
        // token: 'token',
        // encryptMessage: true,
        // encodingAesKey: 'encodingAesKey',
        // corpId: '123'
      },
      // 微信支付配置
      wxPayApiConfig: {
        //     apiKey: 'apiKey',
        //     apiKey3: 'apiKey3',
        //     domain: 'domain',
        //     appId: '应用ID',
        //     mchId: '商户号',
        //     certP12Path: 'cert.p12',
        //     keyPath: 'key.pem',
        //     certPath: 'cert.pem',
        //     providerAppId: '服务商appId',
        //     provideMchId: '服务商商户号'
      },
    },
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'root',
          password: '123456',
          database: 'jh_enterprise_v2_directory',
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
