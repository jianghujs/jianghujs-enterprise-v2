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
    required: ['taskMemberIdList', 'taskTitle'],
    properties: {
      taskMemberIdList: { type: ['string', 'array'], },
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
    const { appId } = this.config
    let { rowId, taskMemberIdList, taskManagerId, taskTitle, taskContent, taskType, taskDesc } = actionData;

    let taskBizId = null
    // 根据rowId查task的taskId
    if (rowId) {
      const task = await jianghuKnex(tableEnum.task).where({ id: rowId }).first();
      taskBizId = task.taskId
    }

    // 判断taskMemberIdList是否为数组
    if (!_.isArray(taskMemberIdList)) {
      taskMemberIdList = taskMemberIdList.split(',')
    }

    // 如果taskMemberIdList为空，则不执行
    if (!taskMemberIdList.length) {
      return
    }

    // 合并taskMemberIdList和taskManagerId，要去重
    if (taskManagerId) {
      taskMemberIdList = _.union(taskMemberIdList, [taskManagerId])
    }

    let idSequence = await idGenerateUtil.idPlus({
      knex,
      tableName: 'task',
      columnName: 'idSequence',
    })
    idSequence--;

    // Tips: 传href就是跳转其他业务页面，不传就是在当前页看
    if (!taskDesc) {
      switch (taskType) {
        case '审批':
          taskDesc = `${username} 提交了<a>《${taskTitle}》</a>，请及时处理`;
          taskTitle = '待审批提醒';
          break;
        default:
          taskDesc = `有一个新通知 <a>《${taskTitle}》</a> ，请及时查看`;
          taskTitle = `${taskTitle}提醒`;
          break;
      }
    }


    const insertData = taskMemberIdList.map(item => {

      idSequence++

      const insertItem = {
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

      return insertItem
    })

    // 判断taskType类型


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

  // 添加消息通知AfterHook
  async addNoticeAfterHook(actionData) {
    const { userId } = actionData
    const { actionId } = this.ctx.request.body.appData

    let taskTitle = null, taskContent = null
    switch (actionId) {
      case 'resetUserPassword':
        taskTitle = '修改密码'
        taskContent = `您的密码已被修改为[${actionData.clearTextPassword}]，请重新登录`
        break;
      case 'insertUserGroupRole':
        taskTitle = '角色变更'
        taskContent = `您的角色已被修改为[${actionData.groupId}]，请重新登录`
      default:
        break;
    }

    await this.addNotice({
      taskMemberIdList: [userId],
      taskTitle,
      taskContent,
    })
  }

  async replaceNoticeUrlAfterHook() {

  }
}

module.exports = NoticeService;