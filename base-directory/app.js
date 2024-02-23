'use strict';

const { ApiConfig, QyApiConfigKit } = require('tnwx');

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didReady() {
    let config = this.app.config

    // 初始化微信配置
    if (config.wechat) {
      let wechat = config.wechat;
      let qyApiConfig = new ApiConfig(
        wechat.qyApiConfig.appId,
        wechat.qyApiConfig.appScrect,
        wechat.qyApiConfig.token,
        wechat.qyApiConfig.encryptMessage,
        wechat.qyApiConfig.encodingAesKey,
        wechat.qyApiConfig.corpId
      )
      QyApiConfigKit.putApiConfig(qyApiConfig);
      QyApiConfigKit.setCurrentAppId(qyApiConfig.getAppId, qyApiConfig.getCorpId);
      if (wechat.devMode) {
        QyApiConfigKit.devMode = true
      }
    }
  }

  async serverDidReady() {
  }

}

module.exports = AppBootHook;

