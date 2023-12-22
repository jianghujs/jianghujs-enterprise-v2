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

    // 判断taskType类型
    // Tips: 传href就是跳转其他业务页面，不传就是在当前页看

    if (!taskDesc) {
      switch (taskType) {
        case '任务':
          taskDesc = `${username} 邀请您参与<a>《${taskTitle}》</a>任务，请及时查看`;
          taskTitle = '任务邀请提醒';
          break;
        case '审批':
          taskDesc = `${username} 提交了<a>《${taskTitle}》</a>，请及时处理`;
          taskTitle = '待审批提醒';
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
    }

    const insertData = taskMemberIdList.map(item => {

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
  // 替换task a标签链接
  async replaceNoticeUrlAfterHook() {
    // 请求enterprise_app表
    const { jianghuKnex, knex } = this.app;
    const { userId } = this.ctx.userInfo;
    const enterpriseAppList = await jianghuKnex(tableEnum.enterprise_app).select()
    const appUrlMap = Object.fromEntries(enterpriseAppList.map(obj => [`__appUrl-${obj.appId}__`, obj.appUrl]));

    const rows = this.ctx.response.body.appData.resultData.rows

    // rows.forEach(row=> {
    //   if (!row.taskDesc) {return;}
    //   const matcheStrList = row.taskDesc.match(/__appUrl-([^_]+)__/g);
    //   const appItem = enterpriseAppList.find(item=> item.appId==row.appId) || {};
    //   if (matcheStrList) {
    //     matcheStrList.forEach(matcheStr => {
    //       row.taskDesc = row.taskDesc.replace(new RegExp(`${matcheStr}`, 'g'), appUrlMap[matcheStr]);
    //     });
    //     row.taskDesc = row.taskDesc.replace(new RegExp(`__appUrl__`, 'g'), appItem.appUrl);
    //   }
    // })

    rows.forEach(row=> {
      const appItem = enterpriseAppList.find(app=> app.appId == row.appId) || {}
      // 如果a标签href包含全路径，http或者https，则不替换
      if (row.taskDesc.includes('http') || row.taskDesc.includes('https')) return;
      
      if (!row.taskDesc.includes('href')) {
        // 没有路径的话，就加上
        row.taskDesc = row.taskDesc.replace(/<a>/g, `<a href="${appItem.appUrl}/page/noticeManagement?taskId=${row.taskBizId}" target="_blank">`)
      } else {
        // 有路径的话，加上全路径
        row.taskDesc = row.taskDesc.replace(/<a href="/g, `<a href="${appItem.appUrl}`)
      }
    })
    this.ctx.response.body.appData.resultData.rows = rows;
  }
}

module.exports = NoticeService;