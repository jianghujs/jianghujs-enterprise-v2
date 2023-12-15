'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');

const appDataSchema = Object.freeze({
  mergeAllTable: {
    type: 'object',
    additionalProperties: true,
    required: [],
    properties: {
      sourceDatabase: {type: 'string'},
      sourceTable: {type: 'string'},
    },
  },
  deleteTableSyncConfig: {
    type: 'object',
    additionalProperties: true,
    required: ['id'],
    properties: {
      id: {type: 'number'},
    },
  },
});

async function createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction}) {
  const syncTime = dayjs().format();
  await jianghuKnex('_table_sync_log')
    .insert({
      sourceDatabase: tableSyncConfig.sourceDatabase, sourceTable: tableSyncConfig.sourceTable,
      syncAction, syncDesc,
      syncTime,
    });
}

class UtilService extends Service {

  /**
   * 返回当前应用所在库
   * @return {Promise<*>}
   */
  getTargetDatabase() {
    const {database} = this.app.config.knex.client.connection;
    return database;
  }

  async deleteTableMergeAllConfig() {
  }


  async mergeAllTable(actionData) {
    // Tip: 适配schedule调用, actionData从入参取
    validateUtil.validate(appDataSchema.mergeAllTable, actionData);
    const {useSyncTimeSlotFilter} = actionData;
    const tableSyncConfigSelectParams = _.pick(actionData, ['sourceDatabase', 'sourceTable']);
    
  }


}

module.exports = UtilService;
