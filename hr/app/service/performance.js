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


class PerformanceService extends Service {

  


  async addPerformanceInsertBeforeHook() {
    const { ctx, app } = this;
    const { userId } = this.ctx.userInfo;

    Object.assign(this.ctx.request.body.appData.actionData, {
      performanceId: idGenerateUtil.uuid()
    })
  }

  /**
   * 考核结束、写入考核结果
   */
  async insertPerformanceResult() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    const { performanceId } = this.ctx.request.body.appData.actionData;
    // 查出所有进行考个人员考核数据
    const performance = await jianghuKnex(tableEnum.performance).where({ performanceId }).first();
    const performanceData = await jianghuKnex(tableEnum.performance_employee_rate).where({ performanceId, status: '已提交' }).select();
    if (!performanceData.length) {
      // 没有数据，不写入考核结果表
      throw new BizError(errorInfoEnum.no_data);
    }
    // 删除之前的考核结果
    await jianghuKnex(tableEnum.performance_result).where({ performanceId }).delete();
    if (performance.templateType === 'staff') {
      // 计算出每个人 employeeId 的 gradePerformance 平均分
      const employeeIdArr = _.uniq(_.map(performanceData, 'employeeId'));
      const employeeIdGradePerformanceMap = {};
      _.forEach(employeeIdArr, employeeId => {
        const employeeIdData = _.filter(performanceData, { employeeId });
        const gradePerformanceArr = _.map(employeeIdData, 'gradePerformance');
        const gradePerformanceAvg = _.mean(gradePerformanceArr);
        employeeIdGradePerformanceMap[employeeId] = gradePerformanceAvg;
      })
      // 写入考核结果表
      const performanceResultData = _.map(employeeIdGradePerformanceMap, (gradePerformance, employeeId) => {
        return {
          performanceId,
          performanceName: performance.performanceName,
          employeeId,
          gradePerformance,
          startTime: performance.startTime,
          endTime: performance.endTime,
          status: '已完成',
          raterId: performance.raterId,
        }
      })
      await jianghuKnex(tableEnum.performance_result).insert(performanceResultData);
    } else {
      // 固定 target 对应多 raterId
      const insert = []
      performanceData.forEach(performanceItem => {
        const { target, raterId, gradePerformance } = performanceItem;
        const performanceResultData = {
          performanceId,
          performanceName: performance.performanceName,
          target,
          gradePerformance,
          templateType: performance.templateType,
          status: '已完成',
          raterId,
        }
        insert.push(performanceResultData);
      })
      await jianghuKnex(tableEnum.performance_result).insert(insert);
    }
    
  }

  async insertPerformanceRateItem() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    const actionData = this.ctx.request.body.appData.actionData;
    const { id, performanceId, templateType, employeeId, target, raterId, ...data } = actionData;
    const insertData = {
      performanceId,
      performanceName: actionData.performanceName,
      performanceContent: JSON.stringify(actionData.performanceContent),
      performanceCycle: actionData.performanceCycle,
      startTime: actionData.startTime,
      endTime: actionData.endTime,
      templateType,
      status: '已开启',
    }
    const raterIdList = raterId.split(',');
    // 多对多维度
    const performanceInsertItemList = [];
    raterIdList.forEach(raterId => {
      if (templateType == 'staff') {
        const employeeIdList = employeeId.split(',');
        employeeIdList.forEach(employeeId => {
          performanceInsertItemList.push({...insertData, employeeId, raterId})
        })
      } else {
        performanceInsertItemList.push({...insertData, target, raterId})
      }
    })
    await jianghuKnex(tableEnum.performance_employee_rate).where({performanceId}).delete();
    await jianghuKnex(tableEnum.performance_employee_rate).jhInsert(performanceInsertItemList);

  }
  async deleteResultBeforeDeleteItem() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    const { performanceId } = this.ctx.request.body.appData.actionData;
    await jianghuKnex(tableEnum.performance_result).where({performanceId}).delete();
  }
 
}

module.exports = PerformanceService;
