const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const dayjs = require('dayjs')
const actionDataScheme = Object.freeze({
  addNotice: {
    type: 'object',
    additionalProperties: true,
    required: [ 'taskMemberIdList', 'taskTitle', 'taskContent' ],
    properties: {
      taskMemberIdList: { type: 'string', },
      taskTitle: { type: 'string', },
      taskContent: { type: 'string', },
    }
  },
});
class NoticeService extends Service {

  // 添加消息通知
  async addNotice(actionData) {
    validateUtil.validate(actionDataScheme.addNotice, actionData);

    const { jianghuKnex, knex } = this.app;
    const { username } = this.ctx.userInfo;
    let { taskMemberIdList, taskTitle, taskContent, taskType } = actionData;

    taskMemberIdList = taskMemberIdList.split(',')
    let idSequence = await idGenerateUtil.idPlus({
      knex,
      tableName: 'task',
      columnName: 'idSequence',
    })
    idSequence--;

    // 判断taskType类型
    switch(taskType) {
      case '任务':
        taskContent = `${username}邀请您参与<a href="">《${taskTitle}》</a>任务，请及时查看`;
        taskTitle = '任务邀请提醒';
        break;
      case '审批':
        taskContent = `${username}邀请您参与<a href="">《${taskTitle}》</a>审批，请及时查看`;
        taskTitle = '审批邀请提醒';
        break;
      case '日志':
        taskContent = `${username}邀请您参与<a href="">《${taskTitle}》</a>日志，请及时查看`;
        taskTitle = '日志邀请提醒';
        break;
      default:
        taskContent = `有一个新公告 《${taskTitle}》 ，请及时查看，请及时查看`;
        taskTitle = '公告提醒';
        break;
    }

    const insertData = taskMemberIdList.map(item=> {

      idSequence++
      return {
        taskTitle,
        taskContent,
        taskManagerId: item,
        idSequence,
        taskType: '通知',
        taskCreateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        taskId: `TZ${idSequence}`,
      }
    })
   
    await jianghuKnex(tableEnum.task).jhInsert(insertData)
  }

  // 更新所有未读消息为【已读】
  async updateAllNotReadNotice() {
    const { jianghuKnex, knex } = this.app;
    const { userId } = this.ctx.userInfo;

    await jianghuKnex(tableEnum.task)
    .where({
      taskReadStatus: '否',
      taskManagerId: userId
    })
    .update({
      taskReadStatus: '是',
    })
  }

  // 删除所有已读消息
  async deleteAllReadNotice() {
    const { jianghuKnex, knex } = this.app;
    const { userId } = this.ctx.userInfo;

    await jianghuKnex(tableEnum.task)
    .where({
      taskReadStatus: '是',
      taskManagerId: userId
    })
    .delete()
  }
}

module.exports = NoticeService;