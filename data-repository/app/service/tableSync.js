'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');

const appDataSchema = Object.freeze({
  syncTable: {
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

class TableSyncService extends Service {

  getConfig() {
    const config = this.app.config;
    const defaultTargetDatabase = config.knex.client.connection.database;
    const { triggerPrefix } = config;
    const syncTriggerPrefix = `${triggerPrefix}_sync`;
    return { defaultTargetDatabase, syncTriggerPrefix };
  }

  async selectSourceDatabase() {
    const {jianghuKnex, config} = this.app;
    const { defaultTargetDatabase } = this.getConfig();  

    const tableList = await jianghuKnex('information_schema.TABLES')
      .whereNotIn('table_schema', ['sys', 'information_schema', 'performance_schema', 'mysql'])
      .where('table_type', 'BASE TABLE')
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase');

    const databaseMap = _.groupBy(tableList, 'sourceDatabase');
    const databaseList = Object.keys(databaseMap).map(key => ({ sourceDatabase: key, tableList: databaseMap[key] }));
    return { defaultTargetDatabase, databaseMap, databaseList};
  }

  async recycleTableSyncConfig({ id }) {
    const { jianghuKnex } = this.app;
    const { syncTriggerPrefix } = this.getConfig();
    const tableSyncConfig = await jianghuKnex('_table_sync_config').where({ id }).first();
    if (!tableSyncConfig) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase } = tableSyncConfig;
    await jianghuKnex('_table_sync_config')
      .where({id})
      .update({rowStatus: '回收站'});

    const targetTable = tableSyncConfig.targetTable;
    const DELETETriggerName = `${syncTriggerPrefix}_${targetTable}_DELETE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
    const INSERTTriggerName = `${syncTriggerPrefix}_${targetTable}_INSERT`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
    const UPDATETriggerName = `${syncTriggerPrefix}_${targetTable}_UPDATE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
    return;
  }

}

module.exports = TableSyncService;
