'use strict';
const Service = require('egg').Service;
const { tableEnum } = require("../constant/constant");
const _ = require("lodash");
const path = require("path");
const fileUtil = require('@jianghujs/jianghu/app/common/fileUtil');
const xlsx = require('node-xlsx');

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");
const fs = require("fs"),
  fsPromises = require("fs").promises,
  rename = fsPromises.rename,
  util = require("util"),
  rimraf = util.promisify(require("rimraf")),
  exists = util.promisify(fs.exists);
const actionDataScheme = Object.freeze({
  uploadItem: {
    type: 'object',
    additionalProperties: true,
    required: ['data'],
    properties: {
      data: { type: 'array' },
    },
  },
});


class PerformanceTemplateService extends Service {

  async addTemplateIdBeforeHook() {

    Object.assign(this.ctx.request.body.appData.actionData, {
      templateId: idGenerateUtil.uuid()
    })
  }
 
}

module.exports = PerformanceTemplateService;
