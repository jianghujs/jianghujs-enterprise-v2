'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');
const dayjs = require('dayjs');

class UserService extends Service {
    async updateUserOrg() {
        const { jianghuKnex } = this.app;
        const userList = await jianghuKnex('_user')
            .where('userStatus', '=', "active")
            .select();
        const userGroupRoleList = await jianghuKnex('enterprise_user_group_role')
            .where('groupId', '<>', 'login')
            .where('groupId', '<>', '超级管理员')
            .where('deadline', '=', '-1')
            .select()
            .orderBy("id", "asc")
        const groupList = await jianghuKnex('enterprise_group')
            .select();
        const useUpdateList = []

        // 循环user表
        userList.forEach(element => {
            const userGroupRole = userGroupRoleList.find(item => item.userId == element.userId)
            // 判断User的组织信息是否跟enterprise_user_group_role的第一条信息相同
            if (userGroupRole && userGroupRole.groupId != element.orgId) {
                const group = groupList.find(item => userGroupRole.groupId == item.groupPath + '-' + item.groupId)
                if (group) {
                    useUpdateList.push({
                        userId: element.userId,
                        orgId: group.groupPath + '-' + group.groupId,
                        orgName: group.groupName,
                        orgFullName: group.groupAllName,
                        orgPath: group.groupPath + '-' + group.groupId,
                    })
                }
            }
        });
        if (useUpdateList.length > 0) {
            for (const i of useUpdateList) {
              await jianghuKnex('_user').where({userId: i.userId}).jhUpdate(i);
            }
        }
    }
}

module.exports = UserService;
