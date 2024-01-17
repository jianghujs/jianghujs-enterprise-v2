'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
  }

  async serverDidReady() {
    // 应用已经启动完毕
    const ctx = await this.app.createAnonymousContext();
    await ctx.service.app.buildSupperAdminUserApp();
  }

}

module.exports = AppBootHook;

