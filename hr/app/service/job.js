'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { tableEnum } = require('../constant/constant');
// ========================================常用 require end=============================================
const dayjs = require('dayjs');

class JobService extends Service {

  async beforHookForGenerateJobResumeId() {
    const maxJobResumeResult = await this.app
      .jianghuKnex("job_resume")
      .max("jobResumeId", { as: "maxJobResumeId" })
      .first();

    let newJobResumeId;
    if (!maxJobResumeResult.maxJobResumeId) {
      newJobResumeId = "J10001";
    } else {
      const maxJobResumeId = parseInt(maxJobResumeResult.maxJobResumeId.replace("J", ""))
      newJobResumeId = `J${maxJobResumeId + 1}`;
    }
    this.ctx.request.body.appData.actionData.jobResumeId = newJobResumeId;
  }

  async beforHookForGenerateJobId(){
    const maxJobResult = await this.app
      .jianghuKnex("job_postings")
      .max("jobId", { as: "maxJobId" })
      .first();

    let newJobId;
    if (!maxJobResult.maxJobId) {
      newJobId = "Z10001";
    } else {
      const maxJobId = parseInt(maxJobResult.maxJobId.replace("Z", ""))
      newJobId = `Z${maxJobId + 1}`;
    }
    this.ctx.request.body.appData.actionData.jobId = newJobId;
  }

  async afterReturnJobResumeId() {
    const { jianghuKnex } = this.app;
    const { actionData } = this.ctx.request.body.appData;
    const { jobResumeId } = actionData;
    this.ctx.body.appData.resultData.jobResumeId = jobResumeId;
    return true
  }



   // 状态统计
   async getStatusCount() {
    const { jianghuKnex, knex } = this.app;
    const { actionData } = this.ctx.request.body.appData;
    const table = `${tableEnum.view01_job_resume} as jobResume`
    const resumeStatus = await jianghuKnex(table).groupBy('resumeStatus').select(`jobResume.resumeStatus`, knex.raw('COUNT(*) AS count'));
    return { rows: { resumeStatus } }
  }

  async list() {
    const { jianghuKnex } = this.app;
    const { pageId } = this.ctx.packagePage;
    const {keyword = ''} = this.ctx.query;
    // 模糊查询
    const jobList = await jianghuKnex(tableEnum.job_postings).where('jobTitle', 'like', `%${keyword}%`).andWhere('publishStatus','招聘中').select();
    return jobList;
  }
  async hotList() {
    const { jianghuKnex } = this.app;
    const { pageId } = this.ctx.packagePage;
    const {jobId} = this.ctx.query;
    const hotJobList = await jianghuKnex(tableEnum.job_postings).select();
    return hotJobList;
  }
  async detail() {
    const { jianghuKnex } = this.app;
    const { pageId } = this.ctx.packagePage;
    const {jobId} = this.ctx.query;
    const job = await jianghuKnex(tableEnum.job_postings).where({jobId}).first();
    return job;
  }
  async resumeDetail() {
    const { jianghuKnex } = this.app;
    const { pageId } = this.ctx.packagePage;
    const {resumeId} = this.ctx.query;
    const job = await jianghuKnex(tableEnum.job_resume).where({jobResumeId: resumeId}).first();
    return job;
  }
  async afterEmployItemHook() {
    const { jianghuKnex } = this.app;
    const {id} = this.ctx.request.body.appData.where;
    // 查询 简历
    const jobResume = await jianghuKnex(tableEnum.job_resume).where({id}).first();
    if (jobResume.employeeId) {
      throw new Error('该简历已经被录用')
    }

    const { employeeId, idSequence } = await this.ctx.service.employee.getEmployeeInsertId();

    // 录入员工信息
    const employee = {
      employeeId,
      employeeName: jobResume.user,
      idSequence,
      sex: jobResume.gender,
      age: jobResume.age,
      contactNumber: jobResume.phone,
      emergencyContactNumber: '',
      post: jobResume.jobTitle,
      politicalBackground: jobResume.politicalAffiliation,
      icNumber: jobResume.idCard,
      dateOfBirth: jobResume.birthday,
      institution: '',
      major: '',
      highestEducation: jobResume.highestEducation,
      teacherQualification: '',
      teacherQualificationLeaver: '',
      teacherQualificationSubject: '',
      teacherCertificationNumber: '',
      teachingLevel: '',
      teachingSubject: '',
      residentialAddress: jobResume.homeAddress,
      province: '',
      city: '',
      county: '',
      dateOfEntry: dayjs().format('YYYY-MM-DD'),
      dateOfContractExpiration: '',
      cardNumber: '',
      licensePlateNumber: '',
      employmentForms: '',
      entryStatus: '',
      status: '',
      remarks: '',
      contactPerson: '',
      educationExperience: jobResume.education,
      // certificate: jobResume.educationCertificate,
      salaryCard: '{}',
      socialSecurity: '{}',
      workExperience: jobResume.experience,
    }
    await jianghuKnex(tableEnum.employee).insert(employee);
    await jianghuKnex(tableEnum.job_resume).where({id}).update({employeeId});
  }
  async getCountByJobStatus() {
    const { jianghuKnex } = this.app;
    // 1. 正在招聘职位数量
    const jobCount = await jianghuKnex(tableEnum.job_postings).where({publishStatus: '招聘中'}).count('jobId', { as: 'jobCount' }).first();
    // 2. 评选中 job_resume - resumeStatus 初选通过、安排面试、面试通过、已发offer
    const selectionCount = await jianghuKnex(tableEnum.job_resume).whereIn('resumeStatus', ['初选通过', '安排面试', '面试通过', '已发offer']).count('jobResumeId', { as: 'resumeCount' }).first();

    // 3. 待入职 job_resume - resumeStatus 待入职
    const waitingEmploymentCount = await jianghuKnex(tableEnum.job_resume).where({resumeStatus: '待入职'}).count('jobResumeId', { as: 'jobResumeCount' }).first();

    // 4. 已入职 job_resume - resumeStatus 已录用
    const employmentCount = await jianghuKnex(tableEnum.job_resume).where({resumeStatus: '已录用'}).count('jobResumeId', { as: 'employeeCount' }).first();
    return [
      { text: '正在招聘职位数量', value: jobCount.jobCount },
      { text: '评选中', value: selectionCount.resumeCount },
      { text: '待入职', value: waitingEmploymentCount.jobResumeCount },
      { text: '已入职', value: employmentCount.employeeCount },
    ]
  }
}

module.exports = JobService;
