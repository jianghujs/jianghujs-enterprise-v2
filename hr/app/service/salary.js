'use strict';
const Service = require('egg').Service;
const { tableEnum, articlePublishStatusEnum } = require("../constant/constant");
const _ = require("lodash");

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");
const actionDataScheme = Object.freeze({
  afterDelEmpRecord: {
    type: "object",
    additionalProperties: true,
    required: ["iRecordId"],
    properties: {
      iRecordId: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  },
  importSalaryData: {
    type: 'object',
    additionalProperties: true,
    required: [ 'importData' ],
    properties: {
      importData: { type: 'array' }
    },
  },
  checkSalaryData: {
    type: 'object',
    additionalProperties: true,
    required: [ 'importData' ],
    properties: {
      importData: { type: 'array' }
    },
  }
});

class InsuranceService extends Service {

  async beforeInsertSalaryGroupHook() {
    const { userId } = this.ctx.userInfo;
    this.ctx.request.body.appData.actionData.groupId = idGenerateUtil.uuid();
    this.ctx.request.body.appData.actionData.createTime = new Date();
    this.ctx.request.body.appData.actionData.createUserId = userId;
  }

  async afterSchemeAppendProjectHook() {
    const { jianghuKnex } = this.app;
    const projectList = await jianghuKnex(tableEnum.insurance_project).select();
    this.ctx.body.appData.resultData.rows.forEach((row) => {
      row.projectList = projectList.filter((project) => project.schemeId === row.schemeId);
    });
  }

  async updateScheme() {
    const { jianghuKnex } = this.app;
    let { id, schemeName, city, schemeType, projectList, isDel, schemeId } = this.ctx.request.body.appData.actionData;
    if (id) {
      await jianghuKnex(tableEnum.insurance_scheme).where({ id }).update({city, schemeType, schemeName, isDel});
    } else {
      schemeId = idGenerateUtil.uuid();
      await jianghuKnex(tableEnum.insurance_scheme).insert({city, schemeType, schemeName, isDel, schemeId, createTime: dayjs().format("YYYY-MM-DD HH:mm:ss")});
    }
    const existProjectList = await jianghuKnex(tableEnum.insurance_project).where({ schemeId }).select();
    // 判断被删除的project
    const delProjectIdList = existProjectList.filter((existProject) => !projectList.some((project) => project.id == existProject.id)).map((project) => project.id);
    // 删除被删除的project
    if (delProjectIdList.length > 0) {
      await jianghuKnex(tableEnum.insurance_project).whereIn("id", delProjectIdList).delete();
    }

    for (const project of projectList) {
      const { 
        id, 
        type,
        schemeId: projectSchemeId,
        projectName,
        defaultAmount,
        corporateProportion,
        personalProportion,
        corporateAmount,
        personalAmount,
        isDel 
      } = project;
      if (id) {
        await jianghuKnex(tableEnum.insurance_project).where({ id }).update({
          type,
          defaultAmount,
          corporateProportion,
          personalProportion,
          corporateAmount,
          personalAmount,
          isDel
        });
      } else {
        const projectId = idGenerateUtil.uuid();
        await jianghuKnex(tableEnum.insurance_project).insert({
          type,
          schemeId: projectSchemeId || schemeId,
          projectId, 
          projectName, 
          defaultAmount,
          corporateProportion,
          personalProportion,
          corporateAmount,
          personalAmount,
          isDel 
        });
      }
    }
  }

  async updateSlipOption() {
    const { jianghuKnex } = this.app;
    let { codeList, templateName, id } = this.ctx.request.body.appData.actionData;
    const templateOptionInsert = [];

    if (id) {
      await jianghuKnex(tableEnum.salary_slip_template).where({ id }).update({ templateName });
      // 删除原有的模板
      await jianghuKnex(tableEnum.salary_slip_template_option).where({ templateId: id }).delete();
      
    } else {
      // 新增 返回id
      const res = await jianghuKnex(tableEnum.salary_slip_template).insert({ templateName });
      if (res) {
        id = res[0]
      }
    }
    codeList.forEach((item) => {
      templateOptionInsert.push({ templateId: id, code: item.code, parentCode: item.parentCode, name: item.name, type: 2 });
    });
    await jianghuKnex(tableEnum.salary_slip_template_option).insert(templateOptionInsert);
  }
  async deleteSlipOption() {
    const { jianghuKnex } = this.app;
    let { id } = this.ctx.request.body.appData.actionData;
    
    await jianghuKnex(tableEnum.salary_slip_template).where({ id }).delete();
    await jianghuKnex(tableEnum.salary_slip_template_option).where({ templateId: id }).delete();
  }
  // 定薪api
  async makeEmployeeArchives() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    // changType 0 未定薪 1 已定薪 2 已调薪
    // 调薪原因:changeReason (default 0) 1 入职核定 2 转正 3 晋升 4 调动 5 年中调薪 6 年度调薪 7 特别调薪 8 其他
    let {recordType, proSalary: {newSalary: proSalary}, salary: {newSalary: salary}, templateId, remarks, changeReason, enableTime, employeeId, id, employeeStatus} = this.ctx.request.body.appData.actionData;

    const employeeInfo = await jianghuKnex(tableEnum.employee).where({ employeeId }).first();
    // 写入初次调薪变动记录
    const salaryArchivesInsert = {
      employeeId,
      changeType: '已定薪',
      changeDate: dayjs().format("YYYY-MM-DD"),
      changeReason: 0,
      remarks,
    }
    await jianghuKnex(tableEnum.salary_archives).insert(salaryArchivesInsert);
    // 写入 salary_archives_option 调薪金额详情
    const salaryArchivesOptionInsert = [];
    proSalary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 1,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    salary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 0,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    await jianghuKnex(tableEnum.salary_archives_option).delete({employeeId: employeeId});
    await jianghuKnex(tableEnum.salary_archives_option).insert(salaryArchivesOptionInsert);
    const afterSum = _.sumBy(salary, "value");
    // 写入 salary_change_record 调薪记录
    const salaryChangeRecordInsert = {
      employeeId,
      recordType,
      changeReason,
      enableDate: dayjs().format("YYYY-MM-DD"),
      proBeforeSum: 0,
      proAfterSum: _.sumBy(proSalary, "value"), // 试用状态下可设定
      proSalary: JSON.stringify(proSalary),
      salary: JSON.stringify(salary),
      beforeSum: 0,
      afterSum,
      status: 1,
      employeeStatus: employeeStatus || employeeInfo.status,
      beforeTotal: 0,
      afterTotal: this.checkUserBecomeTime(employeeInfo, afterSum),
      remarks
    }
    // 判断是否从详情记录修改
    if (id) {
      await jianghuKnex(tableEnum.salary_change_record).where({id}).update(salaryChangeRecordInsert);
    } else {
      salaryChangeRecordInsert.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      salaryChangeRecordInsert.createUserId = userId;
      await jianghuKnex(tableEnum.salary_change_record).insert(salaryChangeRecordInsert);
    }
  }
  // 暂时计入工资合计、0的情况待定
  checkUserBecomeTime({employmentForms}, afterSum) {
    return afterSum;
    // 非正式员工写入合计
    if (employmentForms == 2) {
      return afterSum;
    } else {
      return 0;
    }
  }
  
  // 调薪api
  async updateEmployeeArchives() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    // changType 0 未定薪 1 已定薪 2 已调薪
    // 调薪原因: 1 入职核定 2 转正 3 晋升 4 调动 5 年中调薪 6 年度调薪 7 特别调薪 8 其他
    // salary {newSalary, oldSalary}
    // let { employeeId, remarks, changeReason, enableDate, proSalary, salary } = this.ctx.request.body.appData.actionData;
    
    let {proSalary, salary, remarks, changeReason, enableDate, employeeId, id, employeeStatus} = this.ctx.request.body.appData.actionData;
    const employeeInfo = await jianghuKnex(tableEnum.employee).where({ employeeId }).first();
    // 查询用户是否存在调薪任务、存在则抛出 bizError
    const salaryChangeRecord = await jianghuKnex(tableEnum.salary_change_record).where({ employeeId, status: 0 }).first();
    
    if (salaryChangeRecord && !id) {
      throw new BizError(errorInfoEnum.salary_change_record_exist);
    }

    // 修改初次调薪变动记录
    await jianghuKnex(tableEnum.salary_archives).where({employeeId}).update({changeDate: dayjs().format("YYYY-MM-DD")});
    
    // 写入 salary_archives_option 调薪金额详情
    const salaryArchivesOptionInsert = [];
    proSalary.newSalary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 1,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    salary.newSalary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 0,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    await jianghuKnex(tableEnum.salary_archives_option).where({employeeId: employeeId}).delete();
    await jianghuKnex(tableEnum.salary_archives_option).insert(salaryArchivesOptionInsert);
    salary.newSalary.forEach((item) => {
      item.value = +item.value;
    });
    proSalary.newSalary.forEach((item) => {
      item.value = +item.value;
    });
    salary.oldSalary.forEach((item) => {
      item.value = +item.value;
    });

    // 调薪还未生效、暂不更改工资明细
    const afterSum = _.sumBy(salary.newSalary, "value");
    // 写入 salary_change_record 调薪记录
    const salaryChangeRecordInsert = {
      employeeId,
      recordType: 2,
      changeReason,
      enableDate: enableDate || dayjs().format("YYYY-MM-DD"),
      proBeforeSum: 0,
      proAfterSum: _.sumBy(proSalary.newSalary, "value"), // 试用状态下可设定
      proSalary: JSON.stringify(proSalary),
      salary: JSON.stringify(salary),
      beforeSum: _.sumBy(salary.oldSalary, "value"),
      afterSum,
      status: 1, // 生效
      employeeStatus: employeeStatus || employeeInfo.status,
      beforeTotal: _.sumBy(salary.oldSalary, "value"),
      afterTotal: this.checkUserBecomeTime(employeeInfo, afterSum),
      remarks
    }
    if (id) {
      await jianghuKnex(tableEnum.salary_change_record).where({id}).update(salaryChangeRecordInsert);
    } else {
      salaryChangeRecordInsert.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      salaryChangeRecordInsert.createUserId = userId;
      await jianghuKnex(tableEnum.salary_change_record).insert(salaryChangeRecordInsert);
    }
  }

  async beforeCreateChangeTmpHook() {
    const { userId } = this.ctx.userInfo;
    this.ctx.request.body.appData.actionData.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    this.ctx.request.body.appData.actionData.createUserId = userId;
  }

  async afterAppendNewChangeRecordHook() {
    const { jianghuKnex } = this.app;
    const { rows } = this.ctx.body.appData.resultData;
    const employeeList = rows.map((item) => item.employeeId);
    // 查询每个员工最新的记录id
    const salaryChangeRecordList = await jianghuKnex(tableEnum.salary_change_record).whereIn("employeeId", employeeList).orderBy("id", "desc").select();
    salaryChangeRecordList.forEach((item) => {
      item.proSalary = JSON.parse(item.proSalary);
      item.salary = JSON.parse(item.salary);
    });
    rows.forEach((item) => {  
      item.changeRecordList = salaryChangeRecordList.filter((record) => record.employeeId == item.employeeId);
    });
  }
  // 薪资管理
  async monthEmpRecord() {
    // 自动查询最新月份的 salary_month_record 的记录
    const { jianghuKnex } = this.app;
    const salaryMonthRecord = await jianghuKnex(tableEnum.salary_month_record).orderBy("year", "desc").orderBy("month", "desc").first();
    const salaryConfig = await this.getSalaryConfig();
    // 如果没有最新记录、查询 salary_config 配置的最初开始日期
    if (!salaryMonthRecord) {
      if (!salaryConfig) {
        throw new BizError(errorInfoEnum.salary_config_not_exist);
      }
      return { rows: [] };
    }
    
    const {year, month} = salaryMonthRecord;
    const rows = await this.monthEmpRecordDetail(year, month);
    
    return { rows: await this.buildMonthEmpGuide(rows) };
  }
  // 增加明细核算参考值
  async buildMonthEmpGuide(rows) {
    const { jianghuKnex } = this.app;
    const employeeList = await jianghuKnex(tableEnum.employee).where('employeeId', 'in', rows.map(e => e.employeeId)).select();
    const salaryComputation = await jianghuKnex(tableEnum._constant).where({constantKey: 'salaryComputation'}).first();
    const salaryComputationValue = JSON.parse(salaryComputation.constantValue);
    rows.forEach((row) => {
      const employee = employeeList.find((e) => e.employeeId == row.employeeId);
      if (!employee) {
        return;
      }
      // 根据 dateOfEntry 距今 计算入职的年数（去1取整）
      const dateOfEntry = employee.dateOfEntry ? dayjs(employee.dateOfEntry) : dayjs();
      const now = dayjs();
      const yearOfEntry = now.diff(dateOfEntry, 'year');
      // 参考双休日补贴
      row.weekendSubsidyGuide = salaryComputationValue['weekendSubsidy'] || 0;
      // 参考教龄补贴 高中部计算-其他为0
      row.senioritySubsidyGuide = employee.teachingLevel == '高中' ? 100 : 0;
      // 参考校龄补贴
      row.schoolAgeAllowanceGuide = (yearOfEntry > 10 ? 10 : +yearOfEntry) * salaryComputationValue['schoolAgeSubsidy'];
      // 参考节日福利：教师节600元/人、春节600元/人，端午节200元/人、中秋节200元/人。（当月包含则算入）
      row.festivalWelfareGuide = 0;
      // 参考寒暑假工资：教师3000元/月，班主任3300元/月，教育干事3300元/月，副主级3400元/月，主任级3500元/月。
      row.holidaySalaryGuide = 0;
      // 参考学历津贴：本科（中级）300元，硕士（高级）600元，博士1000元。
      row.professionalTitleAllowanceGuide =  salaryComputationValue['professionalTitleAllowanceGuide'][employee.highestEducation] || 0;

      // todo特殊人才津贴
    });
    return rows;
  }
  async monthEmpRecordByYearMonth() {
    const { jianghuKnex } = this.app;
    const { year, month } = this.ctx.request.body.appData.actionData;
    const salaryConfig = await this.getSalayOptionConfig();
    return { rows: await this.monthEmpRecordDetail(year, month), salaryConfig};
  }
  async monthEmpRecordDetail(year, month) {
    const { jianghuKnex } = this.app;
    const salaryMonthEmpRecord = await jianghuKnex(tableEnum.salary_month_emp_record)
      .leftJoin(tableEnum.employee, `${tableEnum.salary_month_emp_record}.employeeId`, `${tableEnum.employee}.employeeId`)
      .where({year, month})
      .select(tableEnum.salary_month_emp_record + '.*', tableEnum.employee + '.employeeName');
    salaryMonthEmpRecord.forEach((item) => {
      const optionList = JSON.parse(item.optionList || '[]');
      optionList.forEach((option) => {
        item[option.code] = option.value;
      });
    });
    return salaryMonthEmpRecord;
  }
  async getLastConfig() {
    const { jianghuKnex } = this.app;
    const lastMonth = await jianghuKnex(tableEnum.salary_month_record).orderBy('year', 'desc').orderBy('month', 'desc').first();
    let month,year;
    if (!lastMonth) {
      const {salaryStartMonth} = await this.getSalaryConfig();
      [year, month] = salaryStartMonth.split('-');
    } else {
      month = lastMonth.month;
      year = lastMonth.year;
    }
    // salary_option parentCode > 0
    const salaryOption = (await this.getSalayOptionConfig()).filter(e => e.parentCode > 0);
    return {month, year, salaryOption};
  }
  // 核算薪资：生成月薪资记录
  async createMonthRecord() {
    const { jianghuKnex } = this.app;
    let { year, month } = this.ctx.request.body.appData.actionData;
    // 获取可生成的最新月份
    if (!year || !month) {
      const {salaryStartMonth} = await this.getSalaryConfig();
      [year, month] = salaryStartMonth.split("-").map((item) => parseInt(item));
    }
    if (month > 12) {
      year++;
      month = month - 12;
    }
    await this.makeMonthRecord(year, month);
  }
  async makeMonthRecord(year, month) {
    const { jianghuKnex } = this.app;
    // 预防重复生成
    await jianghuKnex(tableEnum.salary_month_emp_record).where({year, month}).delete();
    await jianghuKnex(tableEnum.salary_month_record).where({year, month}).delete();

    // 事务处理
    await jianghuKnex.transaction(async (trx) => {

      // 写入薪资月份记录
      const {insertMonthRecord, insuranceMonthEmpRecordList} = await this.buildInsertMonthRecordList(jianghuKnex, year, month);
      await trx(tableEnum.salary_month_record).insert(insertMonthRecord);

      // 写入月份内人员信息
      const insertMonthEmpRecord = await this.buildInsertMonthEmpRecordList(jianghuKnex, insuranceMonthEmpRecordList, year, month, insertMonthRecord.sRecordId);

      // 写入人员的薪资项明细
      if (insertMonthEmpRecord.length) {
        const insertMonthOptionValue = await this.buildInsertMonthOptionValue(insertMonthEmpRecord, insuranceMonthEmpRecordList);
        insertMonthEmpRecord.forEach((item) => {
          item.optionList = JSON.stringify(insertMonthOptionValue[item.sEmpRecordId]);
          item.realSalary = insertMonthOptionValue[item.sEmpRecordId].find((option) => option.code == '              ')?.value || 0;
        });
        // 写入月份人员记录
        await trx(tableEnum.salary_month_emp_record).insert(insertMonthEmpRecord);
      }

    });
  }
  async delMonthRecord() {
    const { jianghuKnex } = this.app;
    const { id, year, month } = this.ctx.request.body.appData.actionData;
    // 事务处理
    await jianghuKnex.transaction(async (trx) => {
      await trx(tableEnum.salary_month_emp_record).where({id}).delete();
      const salaryMonthEmpRecordList = await trx(tableEnum.salary_month_emp_record).where({year, month}).select();
      if (salaryMonthEmpRecordList.length) {
        await this.updateSalaryMonth(salaryMonthEmpRecordList, trx);
      }
    })
  }
  async buildInsertMonthRecordList(jianghuKnex, year, month) {
    const { userId } = this.ctx.userInfo;
    // 对应社保自然月 0-上月 1-当月 2-次月
    const { socialSecurityMonthType } = await this.getSalaryConfig();
    // 计算对应社保月份、兼容年底跨年
    const cacheMonth = +month + (socialSecurityMonthType - 1);
    const insuranceYear = cacheMonth > 12 ? year + 1 : year;
    const insuranceMonth = cacheMonth > 12 ? cacheMonth - 12 : cacheMonth;

    // 查询 view01_employee_archives 符合条件的员工 entryStatus '在职' 并且 changeType != '未定薪' 的员工
    const salaryEmployeeList = await this.getSalaryEmployeeList(year, month);


    
    let insuranceMonthEmpRecordList = await jianghuKnex(tableEnum.insurance_month_emp_record).where({year: insuranceYear, month: insuranceMonth}).select();
    insuranceMonthEmpRecordList = insuranceMonthEmpRecordList.filter((item) => {
      return salaryEmployeeList.some((emp) => emp.employeeId === item.employeeId);
    });
    // 校验社保月份是否已生成
    if (!insuranceMonthEmpRecordList.length) {
      throw new BizError(errorInfoEnum.insurance_month_record_not_exist);
    }
    // personalInsuranceAmount | personalProvidentFundAmount | corporateInsuranceAmount | corporateProvidentFundAmount
    const personalInsuranceAmount = _.sumBy(insuranceMonthEmpRecordList, "personalInsuranceAmount");
    const personalProvidentFundAmount = _.sumBy(insuranceMonthEmpRecordList, "personalProvidentFundAmount");
    const corporateInsuranceAmount = _.sumBy(insuranceMonthEmpRecordList, "corporateInsuranceAmount");
    const corporateProvidentFundAmount = _.sumBy(insuranceMonthEmpRecordList, "corporateProvidentFundAmount");
    return {insertMonthRecord: {
      personalInsuranceAmount,
      personalProvidentFundAmount,
      corporateInsuranceAmount,
      corporateProvidentFundAmount,
      title: month + '月薪资报表',
      year,
      month,
      startTime: `${year}-${month}-01`,
      endTime: `${year}-${month}-${dayjs(`${year}-${month}-01`).daysInMonth()}`,
      checkStatus: 0,
      createUserId: userId,
      createTime: new Date(),
      sRecordId: idGenerateUtil.uuid(),
    }, insuranceMonthEmpRecordList};
  }
  async getSalaryEmployeeList(year, month) {
    const { jianghuKnex } = this.app;
    const employeeList = await jianghuKnex(tableEnum.view01_employee_archives).where({entryStatus: '在职'}).whereNot({changeType: '未定薪'}).select();
    let salaryEmployeeList = employeeList.filter((item) => {
      const entryTime = dayjs(item.dateOfEntry);
      const leaveTime = item.dateOfContractExpiration ? dayjs(item.dateOfContractExpiration) : dayjs('9999-12-31');
      const entryStatus = item.dateOfEntry <= `${year}-${month < 10 ? '0' + +month : month}-01`;
      return entryStatus && leaveTime.isAfter(`${year}-${month < 10 ? '0' + month : month}-01`);
    });

    // 校验员工是否在薪资组内
    const salaryGroupList = await jianghuKnex(tableEnum.view01_salary_group_rule).select();
    salaryEmployeeList = salaryEmployeeList.filter((item) => salaryGroupList.some((group) => group.employeeIds.includes(item.employeeId)));
    return salaryEmployeeList;
  }
  // 核算薪资：生成月薪资记录
  async buildInsertMonthEmpRecordList(jianghuKnex, insuranceMonthEmpRecordList, year, month, sRecordId) {
    // 查询用户所在薪资组 salary_group
    const salaryGroupList = await jianghuKnex(tableEnum.salary_group).select();
    const insertMonthEmpRecord = insuranceMonthEmpRecordList.map((item) => {
      const salaryGroup = salaryGroupList.find((group) => group.employeeIds.includes(item.employeeId));
      return {
        sEmpRecordId: idGenerateUtil.uuid(),
        sRecordId: sRecordId,
        employeeId: item.employeeId,
        actualWorkDay: salaryGroup.salaryStandard,
        needWorkDay: 0,
        year,
        month,
        createTime: new Date(),
      }
    });
    return insertMonthEmpRecord;
  }
  // 根据人员列表写入具体明细信息
  async buildInsertMonthOptionValue(insertMonthEmpRecord, insuranceMonthEmpRecordList) {
    const { jianghuKnex } = this.app;
    const employeeIdList = insertMonthEmpRecord.map((item) => item.employeeId);
    const archivesOptionListByEmployeeId = await jianghuKnex(tableEnum.salary_archives_option).whereIn("employeeId", employeeIdList).select();
    const employeeList = await jianghuKnex(tableEnum.employee).whereIn("employeeId", employeeIdList).select();
    const insertMonthOptionValue = {};
    // 查询 计税规则
    const salaryGroupList = await jianghuKnex(tableEnum.view01_salary_group_rule).select();
    // 查询 parentCode > 0 的 salary_option
    const salaryOptionList = (await this.getSalayOptionConfig()).filter(e => e.parentCode > 0);
    insertMonthEmpRecord.forEach((item) => {
      const employee = employeeList.find((employee) => employee.employeeId === item.employeeId);
      const insurance = insuranceMonthEmpRecordList.find((insurance) => insurance.employeeId === item.employeeId);
      let archivesOptionList = [];
      // 根据员工状态获取对应的薪资档案
      if (employee.employmentForms == '正式') {
        archivesOptionList = archivesOptionListByEmployeeId.filter((option) => option.employeeId == item.employeeId && option.isPro == 0);
      } else {
        archivesOptionList = archivesOptionListByEmployeeId.filter((option) => option.employeeId == item.employeeId && option.isPro == 1);
      }
      insertMonthOptionValue[item.sEmpRecordId] = [];
      // 循环遍历添加薪资项明细
      salaryOptionList.forEach((option) => {
        // [10]基本工资：员工签订合同时确定的工资，通常是固定的月薪或年薪。
        // [20]津补贴：一些公司为了激励员工或补偿员工的特殊工作环境或工作性质而发放的补贴，例如住房补贴、餐补等。津补贴通常不计入税前应税工资和税后实发工资。
        // [30]浮动工资：根据公司业绩或员工绩效表现而调整的工资，通常是月度或季度调整。
        // [40]奖金：根据公司或部门的业绩表现或个人的表现而发放的额外奖励，通常不计入税前应税工资和税后实发工资。
        // [50]提成工资：员工根据销售业绩或完成项目而获得的工资，通常是一定比例的销售额或项目利润。
        // [60]计件工资：员工根据完成的产品数量或完成的工作任务数而获得的工资，通常是按每个产品或任务的固定价格计算。
        // [70]计时工资：员工根据工作时间计算的工资，通常是按小时或日计算。
        // [80]工龄/司龄工资：员工在公司工作的年限或职位级别升级而获得的工资调整。
        // [90]职称工资：员工根据职称等级而获得的工资调整。
        // [100]代扣代缴：公司代替个人缴纳的费用，如个人社保、个人公积金。该类别下的薪酬项，将从应纳税所得额中扣除，影响个税计算。
        // [130]税前补发：税前补发，与该月的工资一起发放，需参与计税。
        // [140]税前补扣：税前从该月的工资中补扣的金额，会影响本月的应税工资总额。
        // [150]税后补发：税后补发，不参与该月工资计算，会影响当月的实际所得。
        // [160]税后补扣：从税后的工资中补扣的款项，不参与该月的工资计税。
        // [170]特殊计税项：特定的收入项目根据税法规定需要特殊计税。
        // [180]加班工资：员工在规定工作时间外工作的加班费。
        // [200]考勤扣款合计：员工因迟到、早退、旷工等原因而被扣除的工资。
        // [210]应发工资：员工应该获得的全部工资总额，包括基本工资
        let value = 0;
        if (option.code == 200101) {
          // 考勤扣款合计 : 迟到、早退、旷工、缺卡、请假等6中异常考勤的扣款合计
          value = _.sumBy(archivesOptionList.filter((e) => e.parentCode == 190), "value");
        } else if (option.code == 210101) {
          // 应发工资 = 基本工资 + 津补贴 + 浮动工资 + 奖金 + 提成工资 + 计件工资 + 计时工资 + 工龄/司龄工资 + 职称工资 - 代扣代缴 + 税前补发 - 税前补扣  + 加班工资 - 考勤扣款合计
          value = _.sumBy(insertMonthOptionValue[item.sEmpRecordId].filter((e) => [10, 20, 30, 40, 50, 60, 70, 80, 90, 130, 180].includes(e.parentCode)), "value") - _.sumBy(insertMonthOptionValue[item.sEmpRecordId].filter((e) => [140, 200].includes(e.parentCode)), "value")
        } else  if (option.code == 240101) {
          // 实发工资 = 应发工资 - 个人所得税 + 税后补发 - 税后补扣 - 代扣代缴
          // 应发工资
          const salaryValue = insertMonthOptionValue[item.sEmpRecordId].find((e) => e.code == 210101).value;
          // 社保公积金代扣代缴
          const insuranceValue = _.sumBy(insertMonthOptionValue[item.sEmpRecordId].filter((e) => [100].includes(e.parentCode)), "value");
          // 个税缴纳
          const taxValue = insertMonthOptionValue[item.sEmpRecordId].find((e) => e.code == 230101).value;
          // 税后补发
          const afterTaxValue = _.sumBy(insertMonthOptionValue[item.sEmpRecordId].filter((e) => [150].includes(e.parentCode)), "value");
          // 税后补扣
          const afterTaxDeductValue = _.sumBy(insertMonthOptionValue[item.sEmpRecordId].filter((e) => [160].includes(e.parentCode)), "value");

          value = salaryValue - taxValue + afterTaxValue - afterTaxDeductValue - insuranceValue;
        } else if ([100101, 100102, 110101, 120101].includes(option.code)) {
          // 个人社保、个人公积金、企业社保、企业公积金
          const codeKey = {
            100101: "personalInsuranceAmount",
            100102: "personalProvidentFundAmount",
            110101: "corporateInsuranceAmount",
            120101: "corporateProvidentFundAmount",
          }
          value = insurance ? +insurance[codeKey[option.code]] : 0;
        } else if ( option.code == 220101) {
          // 应税工资 = 应发工资 - 个税起征点 + 特殊计税项
          const taxGroup = salaryGroupList.find((group) => group.employeeIds.includes(item.employeeId));
          if (taxGroup.isTax > 0) {
            const salaryValue = insertMonthOptionValue[item.sEmpRecordId].find((e) => e.code == 210101).value;
            // 特殊计税项
            const otherValue = _.sumBy(archivesOptionList.filter((e) => e.parentCode == 170), "value");

            const insuranceValue = _.sumBy(insertMonthOptionValue[item.sEmpRecordId].filter((e) => [100].includes(e.parentCode)), "value");
            // taxType 1 - 工资个税 2 - 劳务个税 3 - 不记税
            if (taxGroup.taxType == 1) { 
              value = salaryValue > taxGroup.markingPoint ? salaryValue - taxGroup.markingPoint + otherValue - insuranceValue : 0;
            } else if (taxGroup.taxType == 2) {
              value = (salaryValue * 0.7 + otherValue - insuranceValue).toFixed(taxGroup.decimalPoint);
            }
          }
        } else if (option.code == 230101) {
          // 个税金额 = 应税工资 * 个税税率 - 速算扣除数
          const taxGroup = salaryGroupList.find((group) => group.employeeIds.includes(item.employeeId));
          if (taxGroup.isTax > 0) {
            const salaryValue = insertMonthOptionValue[item.sEmpRecordId].find((e) => e.code == 220101).value;
            // taxType 1 - 工资个税 2 - 劳务个税 3 - 不记税
            if (taxGroup.taxType == 1) { 
              // salaryValue - taxGroup.markingPoint 保留 taxGroup.decimalPoint 为小数点
              value = this.calculatePersonalIncomeTax(salaryValue, taxGroup.decimalPoint);
            } else if (taxGroup.taxType == 2) {
              // 劳务个税计算
              value = this.calculateLaborIncomeTax(salaryValue, taxGroup.decimalPoint);
            }
          }
          console.log(value)
        } else {
          const archivesOption = archivesOptionList.find((optionItem) => optionItem.code == option.code);
          if (archivesOption && archivesOption.value) {
            value = +archivesOption.value;
          }
        }

        insertMonthOptionValue[item.sEmpRecordId].push({
          code: option.code,
          parentCode: option.parentCode,
          value,
        });
      });
    });
    return insertMonthOptionValue;
  }
  // 发放工资条
  async createSlipRecord() {
    const { jianghuKnex } = this.app;
    const { year, month } = this.ctx.request.body.appData.actionData;
    const {userId} = this.ctx.userInfo;
    // 修改 salary_month_emp_record 表 readStatus 为未读
    return await jianghuKnex(tableEnum.salary_month_emp_record).where({year, month}).update({readStatus: '未读'});
  }
  // 获取薪资项配置
  async getSalayOptionConfig() {
    const { jianghuKnex } = this.app;
    const optionConstant = await jianghuKnex(tableEnum._constant).where({constantKey: 'salaryOption'}).first();
    if (!optionConstant) {
      return [];
    }
    return JSON.parse(optionConstant.constantValue || '[]');
  }

  async getSalaryConfig() {
    const { jianghuKnex } = this.app;
    const optionConstant = await jianghuKnex(tableEnum._constant).where({constantKey: 'salaryConfig'}).first();
    if (!optionConstant) {
      return {};
    }
    return JSON.parse(optionConstant.constantValue || '{}');
  }
  calculatePersonalIncomeTax(salary, decimal) {
    if (salary <= 0) {
      return 0;
    }
    const thresholds = [0, 36000, 144000, 300000, 420000, 660000, 960000];
    const rates = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
    let tax = 0;
    
    // 判断应纳税所得额在哪个阶梯范围内
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (salary > thresholds[i]) {
        // 计算当前阶梯下应纳税额
        tax = (salary - thresholds[i]) * rates[i];
        break;
      }
    }
    
    return tax.toFixed(decimal);
  }
  calculateLaborIncomeTax(salary, decimal) {
//     预扣预缴应纳税所得额 = 劳务报酬（少于4000元） - 800元

// 预扣预缴应纳税所得额 = 劳务报酬（超过4000元） × （1 - 20%）

// 应纳税额 = 应纳税收入额 × 适用税率 - 速算扣除数

// 2022年最新个人所得税税率表：劳务报酬收入所得税
// 级数应纳税收入额(含税)税率(%)速算扣除数
// 1不超过20000元的20% 速算扣除数：0
// 2超过20000元至50,000元的部分30% 速算扣除数：2000
// 3超过50,000元的部分40% 速算扣除数：7000
// 提示：
// 1、劳务报酬收入在800元以下的，不用缴纳个人所得税；

// 2、劳务报酬收入大于800元且没有超过4000元，可减除800元的扣除费用；

// 3、劳务报酬收入超过4000元的，可减除劳务报酬收入20%的扣除费用；

// 4、本表中的含税级距、不含税级距，均为按照税法规定减除有关费用后的收入额；

// 5、含税级距适用于由纳税人负担税款的劳务报酬收入；不含税级距适用于由他人（单位）代付税款的劳务报酬收入。

    let tax = 0;
    if (salary < 4000) {
      tax = salary - 800;
    }
    if (salary >= 4000) {
      tax = salary * (1 - 0.2);
    }
    if (tax <= 20000) {
      tax = tax * 0.2;
    }
    if (tax > 20000 && tax <= 50000) {
      tax = (tax - 20000) * 0.3 + 2000;
    }
    if (tax > 50000) {
      tax = (tax - 50000) * 0.4 + 7000;
    }
    return tax.toFixed(decimal);
  }
  calculateTaxableIncome(salary, decimal) {
    const threshold = 5000;  // 个税起征点
    const taxLevels = [
      { threshold: 36000, rate: 0.03, deduction: 0 },
      { threshold: 144000, rate: 0.1, deduction: 2520 },
      { threshold: 300000, rate: 0.2, deduction: 16920 },
      { threshold: 420000, rate: 0.25, deduction: 31920 },
      { threshold: 660000, rate: 0.3, deduction: 52920 },
      { threshold: 960000, rate: 0.35, deduction: 85920 },
      { threshold: Infinity, rate: 0.45, deduction: 181920 },
    ];  // 个税税率表
  
    let taxableIncome = salary - threshold;  // 应税工资
  
    if (taxableIncome <= 0) {
      return 0;  // 不需要缴纳个税
    }
  
    let totalTax = 0;  // 总个税
  
    for (let i = 0; i < taxLevels.length; i++) {
      const level = taxLevels[i];
      if (taxableIncome <= level.threshold) {
        totalTax += taxableIncome * level.rate - level.deduction;
        break;
      } else {
        totalTax += (level.threshold - (i === 0 ? threshold : taxLevels[i - 1].threshold)) * level.rate - level.deduction;
      }
    }
  
    return Math.max(totalTax, 0).toFixed(decimal);  // 返回应纳个税金额，最小为0
  }
  
  async getIdSequence(table) {
    const tableName = tableEnum[table];
    const columnName = "idSequence";
    const startValue = 10000;
    const idSequence = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
      startValue,
    });
    return idSequence;
  }

  //检查待导入的薪资数据
  async checkSalaryData() {
    const {jianghuKnex} = this.app;
    const {ctx} = this;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.checkSalaryData, actionData);
    const { importData } = actionData;

    if(importData.length === 0){
      throw new BizError(errorInfoEnum.import_data_not_exist);
    }

    // 员工数据
    const employeeNames = _.map(importData, 'employeeName');
    const employeeData = await jianghuKnex(tableEnum.employee, this.ctx).whereIn('employeeName', employeeNames).select();

    // 员工的薪资数据
    const { year, month }  = importData[0];
    const employeeIds = _.map(employeeData, 'employeeId');
    const salaryData = year && month ? await jianghuKnex(tableEnum.salary_month_emp_record, this.ctx).whereIn('employeeId', employeeIds).where({ year, month }).select() : [];

    const rows = _.map(importData, item => {
      const { employeeName } = item;
      const employee = _.find(employeeData, ['employeeName', employeeName]);

      let employeeSalaryData = null;
      if(employee && employee.employeeId){
        employeeSalaryData = _.find(salaryData, ['employeeId', employee.employeeId]);
      }

      let errorDesc = '';
      if(!employee || !employee.employeeId){
        errorDesc = '【未匹配到员工】'
      }else if(employeeSalaryData){
        errorDesc = '【已存在薪资数据】'
      }else{
        errorDesc = '正常'
      }

      return {
        employeeId: employee?.employeeId || '',
        errorDesc,
        ...item
      }
    });

    return { rows };
  }

  //导入薪资数据
  async importSalaryData() {
    const {jianghuKnex} = this.app;
    const {ctx} = this;
    const { userInfo = {} } = ctx;
    const { userId: operationByUserId } = userInfo;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.importSalaryData, actionData);
    const { importData } = actionData;

    //检查数据
    const checkData = await this.checkSalaryData();
    const abnormalData = _.filter(checkData.rows || [], item => item.errorDesc !== '正常');
    if (abnormalData.length > 0) {
      throw new BizError(errorInfoEnum.import_data_exception);
    }

    //写入数据
    const insertData = _.map(importData, item => {
      return {
        ..._.omit(item, ['number', 'employeeName', 'errorDesc']),
        createUserId: operationByUserId,
        createTime: dayjs().format(),
        checkStatus: '待审核'
      }
    });
    // 事务处理
    await jianghuKnex.transaction(async (trx) => {
      if (insertData.length) {
        await trx(tableEnum.salary_month_emp_record, ctx).jhInsert(insertData);
        // 更新薪资月份
        await this.updateSalaryMonth(insertData, trx);
      }
    });
    
  }

  //更新薪资月份
  async updateSalaryMonth(insertData, trx) {
    // 更新月汇总表
    // const expectedPaySalary = _.sumBy(insertData, 'expectedPaySalary');
    const personalTax = _.sumBy(insertData, 'personalTax');
    const realPaySalary = _.sumBy(insertData, 'realPaySalary');
    const {year, month, startTime, endTime} = insertData[0];
    const { userId } = this.ctx.userInfo;
    const salaryMonthRecord = await trx(tableEnum.salary_month_record, this.ctx).where({year, month}).first();
    if(salaryMonthRecord){
      await trx(tableEnum.salary_month_record, this.ctx).where({year, month}).update({
        // expectedPaySalary: salaryMonthRecord.expectedPaySalary + expectedPaySalary,
        personalTax,
        realPaySalary
      });
    }else{
      await trx(tableEnum.salary_month_record, this.ctx).jhInsert({
        sRecordId: idGenerateUtil.uuid(),
        year,
        month,
        startTime,
        endTime,
        // expectedPaySalary,
        personalTax,
        realPaySalary,
        createUserId: userId,
        createTime: dayjs().format(),
        checkStatus: '待审核'
      });
    }
  }

  // 在线编辑-批量修改
  async batchUpdate() {
    const { jianghuKnex } = this.app;
    const { ctx } = this;
    const actionData = this.ctx.request.body.appData.actionData;
    // validateUtil.validate(actionDataScheme.batchUpdate, actionData);  
    const updateKey = ['holidaySalary', 'sessionHourSalary', 'workloadAllowance', 'overtimeAllowance', 
    'nightAllowance', 'dutyAllowance', 'specialClassSubstitutionAllowance',
    'weekendSubsidy', 'examinationTeachingPerformance', 'regularTeachingPerformance',
    'communityTeachingPerformance', 'professionalTitleAllowance', 'gradeTeamLeaderAllowance',
    'researchLeaderAllowance', 'classTeacherAllowance', 'monthPropositionalSubsidy',
    'teachingAgeAllowance', 'preparationTeamLeaderAllowance', 'managementPositionSalary',
    'teachingAssistantsSalary', 'enrollmentSubsidy', 'supplementarySocialBenefit',
    'specialTalentAllowance', 'retainWage', 'partyBranchActivitySubsidy', 'carSubsidy',
    'substitutSalary', 'schoolAgeAllowanceAndOther', 'schoolAgeAllowance', 'otherAllowances',
    'expectedPaySalary', 'deductionForLeave', 'penaltyForViolation', 'utilityCost',
    'personalTax', 'socialSecurityPaymentAgency', 'singleRoomFee', 'mealExpenses',
    'workUniformExpenses', 'deductionAmount', 'realPaySalary']
    const { data } = actionData;
    for (const item of data) {
      const { id, ...update } = item;
      const updateData = _.pick(update, updateKey);
      await jianghuKnex(tableEnum.salary_month_emp_record, ctx).where({ id }).update(updateData);
    }
    await this.updateSalaryMonth(data, jianghuKnex);
  }
}

module.exports = InsuranceService;
