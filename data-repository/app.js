'use strict';

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async configWillLoad() {
  }

  async serverDidReady() {
  }

}

module.exports = AppBootHook;

