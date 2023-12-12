'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { tableEnum } = require('../constant/constant');
// ========================================常用 require end=============================================
const dayjs = require('dayjs');

class WorkbenchService extends Service {
  async getWorkbenchCount() {
    // 员工状态统计
    const [entryStatus] = await this.ctx.service.employee.getCountByEntryStatus();
    // 招聘状态统计
    const jobStatus = await this.ctx.service.job.getCountByJobStatus();
    // 合同到期提醒
    const contractWarnList = await this.ctx.service.employee.getContractWarnList();
    return {entryStatus, jobStatus, contractWarnList};
  }
}

module.exports = WorkbenchService;
