const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");

const actionDataScheme = Object.freeze({
  addNotice: {
    type: 'object',
    additionalProperties: true,
    required: [ 'taskMemberIdList', 'taskTitle', 'taskContent' ],
    properties: {
      taskMemberIdList: { type: 'array', },
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
    const { taskMemberIdList, taskTitle, taskContent } = actionData;

    let idSequence = await idGenerateUtil.idPlus({
      knex,
      tableName: 'task',
      columnName: 'idSequence',
    })
    idSequence--;

    const insertData = taskMemberIdList.map(item=> {

      idSequence++
      return {
        taskTitle,
        taskContent,
        taskManagerId: item,
        idSequence,
        taskType: '通知',
        taskId: `TZ${idSequence}`,
      }
    })
   
    await jianghuKnex(tableEnum.task).insert(insertData)
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