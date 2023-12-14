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
    required: [ 'taskMemberIdList', 'taskTitle' ],
    properties: {
      taskMemberIdList: { type: [ 'string', 'array' ], },
      taskTitle: { type: 'string', },
    }
  },
});
class NoticeService extends Service {

  // 添加消息通知
  async addNotice(actionData) {
    validateUtil.validate(actionDataScheme.addNotice, actionData);

    const { jianghuKnex, knex } = this.app;
    const { username } = this.ctx.userInfo;
    let { rowId, taskMemberIdList, taskTitle, taskContent, taskType, taskDesc } = actionData;

    let taskBizId = null
    // 根据rowId查task的taskId
    if (rowId) {
      const task = await jianghuKnex(tableEnum.task).where({ id: rowId }).first();
      taskBizId = task.taskId
    }
    
    // 判断taskMemberIdList是否为数组
    if(!_.isArray(taskMemberIdList)) {
      taskMemberIdList = taskMemberIdList.split(',')
    }

    let idSequence = await idGenerateUtil.idPlus({
      knex,
      tableName: 'task',
      columnName: 'idSequence',
    })
    idSequence--;

    // 判断taskType类型
    // Tips: 传href就是跳转其他业务页面，不传就是在当前页看
    switch(taskType) {
      case '任务':
        taskDesc = `${username} 邀请您参与<a>《${taskTitle}》</a>任务，请及时查看`;
        taskTitle = '任务邀请提醒';
        break;
      case '审批':
        taskDesc = `${username} 邀请您参与<a>《${taskTitle}》</a>审批，请及时查看`;
        taskTitle = '审批邀请提醒';
        break;
      case '日志':
        taskDesc = `${username} 将<a>《${taskTitle}》</a>日志发送给您，请及时查看`;
        taskTitle = '日志邀请提醒';
        break;
      default:
        taskDesc = `有一个新公告 <a>《${taskTitle}》</a> ，请及时查看`;
        taskTitle = '公告提醒';
        break;
    }

    const insertData = taskMemberIdList.map(item=> {

      idSequence++
      return {
        taskBizId: taskBizId || `TZ${idSequence}`,
        taskTitle,
        taskContent,
        taskDesc,
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