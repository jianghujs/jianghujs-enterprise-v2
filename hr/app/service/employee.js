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
  fillInsertFileParamsBeforeHook: {
    type: 'object',
    additionalProperties: true,
    required: [ 'employeeId' ],
    properties: {
      employeeId: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  },
});
function generateCheckSum(sId) {
  var sIdCube = Math.pow(sId, 3);
  var sIdCubeRt = Math.sqrt(sIdCube);
  var roundSId = Math.round(sIdCubeRt);
  var remainder = roundSId % 22;

  var charList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y'];
  var checkSum = charList[remainder];

  return checkSum;
}

class EmployeeService extends Service {
  // 状态统计
  async getStatusCount() {
    const { jianghuKnex, knex } = this.app;
    const { actionData } = this.ctx.request.body.appData;

    const table = `${tableEnum.view01_employee} as employee`
    const status = await jianghuKnex(table).groupBy('status').select(`employee.status`, knex.raw('COUNT(*) AS count'));
    const employmentForms = await jianghuKnex(table).groupBy('employmentForms').select(`employee.employmentForms`, knex.raw('COUNT(*) AS count'));
    const entryStatus = await jianghuKnex(table).groupBy('entryStatus').select(`employee.entryStatus`, knex.raw('COUNT(*) AS count'));

    return { rows: { status, employmentForms, entryStatus } }
  }
  // ================ 离职相关 =====================
  // 离职BeforeHook
  async quitInsertBeforeHook() {
    Object.assign(this.ctx.request.body.appData.actionData, {
      quitInfoId: idGenerateUtil.uuid(),
      createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
    })
  }
  // 离职AfterHook
  async quitAfterHook() {
    const { employeeId } = this.ctx.request.body.appData.actionData;
    if (employeeId) {
      // 更新员工在职状态
      await this.app.jianghuKnex(tableEnum.employee).where({ employeeId }).jhUpdate({ entryStatus: 3 });
    }
  }
  // ================ 调整岗位/部门、晋升/降级 相关 =====================
  // BeforeHook
  async changeInsertBeforeHook() {
    const { userId } = this.ctx.userInfo;
    Object.assign(this.ctx.request.body.appData.actionData, {
      recordId: idGenerateUtil.uuid(),
      createUserId: userId,
      createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
    })
  }
  // AfterHook
  async changeAfterHook() {
    const { employeeId, newDept, newPost, newPostLevel, newWorkAddress } = this.ctx.request.body.appData.actionData;
    const params = { deptId: newDept, post: newPost, postLevel: newPostLevel, workAddress: newWorkAddress }
    if (employeeId) {
      // 更新员工相关
      await this.app.jianghuKnex(tableEnum.employee).where({ employeeId }).jhUpdate(params);
    }
  }
  // ================ 新建员工相关 =====================
  // BeforeHook

  async addEmployeeInsertBeforeHook() {

    const { employeeId, idSequence } = await this.getEmployeeInsertId();

    Object.assign(this.ctx.request.body.appData.actionData, {
      employeeId,
      idSequence,
    })
  }

  async getEmployeeInsertId() {
    const { jianghuKnex } = this.app;
    // 查询 view01_employee 最大的 idSequence
    const maxSidInfo = await jianghuKnex(tableEnum.view01_employee).max('idSequence as maxId').first();
    //console.log('maxSidInfo: ', maxSidInfo);
    var idSequence = maxSidInfo.maxId + 1;
    //console.log('memberIdNumber: ', idSequence);
    var employeeIdCheckSum = generateCheckSum(idSequence);
    return {employeeId: `E${idSequence}${employeeIdCheckSum}`, idSequence};
  }

  // ================ 导入相关 =====================
  async uploadItem() {
    const { userId } = this.ctx.userInfo;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.uploadItem, actionData);
    const { data } = actionData;
    const { jianghuKnex } = this.app;

    const params = _.map(data, (user, key) => {
      return {
        ...user,
        employeeId: idGenerateUtil.uuid(),
        createUserId: userId,
        createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
      }
    })

    await jianghuKnex(tableEnum.employee).insert(params);
    return { rows: {} };
  }
  // ================ 导出相关 =====================
  async getExcelData() {
    const app = this.app;
    const { config, jianghuKnex } = app;
    const { uploadDir, downloadBasePath } = config;
    const { where, whereLike, limit, orderBy } = this.ctx.request.body.appData;

    const employeeData = await jianghuKnex(tableEnum.employee)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .select();

    // 设定excel 列名
    const fieldList = ['employeeName', 'jobNumber', 'mobile', 'post', 'employmentForms', 'status', 'entryTime', 'idType', 'idNumber'];
    const nameList = ['姓名', '工号', '手机号', '岗位', '聘用形式', '员工状态', '入职日期', '证件类型', '证件号码'];
    // 组装excel data数据
    const dataList = [];
    employeeData.forEach(e => {
      dataList.push(fieldList.map(field => {
        return field === 'entryTime' ? dayjs(e[field]).format('YYYY-MM-DD') : e[field] || '';
      }));
    })
    const data = [
      nameList,
      ...dataList
    ];

    const buffer = xlsx.build([{ name: 'mySheetName', data: data }]); // Returns a buffer
    const excelDirectory = 'excelTemp';
    const excelName = 'tempExcel.xlsx';
    const fileUploadPath = path.join(uploadDir, excelDirectory);
    const filePath = path.join(fileUploadPath, excelName);
    const isFileExists = await fileUtil.exists(fileUploadPath);
    if (!isFileExists) {
      await fileUtil.checkAndPrepareFilePath(fileUploadPath);
    }
    await fileUtil.writeFile(filePath, buffer);
    return {
      filePath: '/excelTemp/' + excelName
    }
  }
  async getCountByEntryStatus() {
    const { jianghuKnex, knex } = this.app;
    return await knex.raw(`SELECT entryStatus,count(id) as count FROM employee GROUP BY entryStatus`);
  }
  async getContractWarnList() {
    const { jianghuKnex, knex } = this.app;
    // 查询 dateOfContractExpiration 是 null 或者 一个月内到期的员工
    const dateOfContractExpiration = dayjs().add(1, 'month').format('YYYY-MM-DD');
    const employeeList =   await jianghuKnex(tableEnum.employee)
      .where('dateOfContractExpiration', '<', dateOfContractExpiration)
      // entryStatus 不是 已离职 的
      .whereNot('entryStatus', '已离职')
      .select();
    return employeeList.map(e => {
      return {
        employeeId: e.employeeId,
        employeeName: e.employeeName,
        // 到期倒计时 天数
        days: dayjs(e.dateOfContractExpiration).diff(dayjs(), 'day')
      }
    });
  }
  async getProbationWarnList() {
    const { jianghuKnex, knex } = this.app;
    // 查询 employmentForms 是 试用 并且 减3个月入职的员工
    const entryTime = dayjs().subtract(3, 'month').format('YYYY-MM-DD');
    const employeeList =   await jianghuKnex(tableEnum.employee)
      .where('dateOfEntry', '>', entryTime)
      .where('employmentForms', '试用')
      // entryStatus 不是 已离职 的
      .whereNot('entryStatus', '已离职')
      .select();

    // 按照 probationPeriod 的试用期月份数量计算试用期到期时间，筛选出所有1个月内到期或已超期的员工
    return employeeList.map(e => {
      return {
        employeeId: e.employeeId,
        employeeName: e.employeeName,
        // 到期倒计时 天数 的绝对值
        days: dayjs(e.dateOfEntry).add(e.probationPeriod || 1, 'month').diff(dayjs(), 'day')
      }
    }).filter(e => e.days <= 30);
  }
  async getEmployeeWarnList() {
    return [
      {
        text: '合同到期提醒',
        list: await this.getContractWarnList()
      },
      {
        text: '试用到期提醒',
        list: await this.getProbationWarnList()
      }
    ]
  }
  async fillInsertFileParamsBeforeHook() {
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.fillInsertFileParamsBeforeHook, actionData);
    const jianghuKnex = this.app.jianghuKnex;
    const { employeeId } = actionData;
    const employeeList = await jianghuKnex(tableEnum.employee_file).where({ employeeId }).select();
    const idSubfix= _.padStart(`${employeeList.length}`, 3, '0');
    this.ctx.request.body.appData.actionData.employeeFileId = `${employeeId}-${idSubfix}`;
  }
}

module.exports = EmployeeService;
