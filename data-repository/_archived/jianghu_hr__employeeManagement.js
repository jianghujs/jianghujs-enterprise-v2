const content = {
  pageType: "jh-page", pageId: "jianghu_hr__employeeManagement", table: "jianghu_hr__employee", pageName: "jianghu_hr__employeeManagement", template: "jhTemplateV4", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "jianghu_hr__employee", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "jianghu_hr__employee", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "jianghu_hr__employee", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "jianghu_hr__employee", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<$ ctx.packagePage.pageName $>", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { tag: 'v-spacer'},
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      searchBtn: true,
      value: [
        { tag: "v-text-field", model: "keyword", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '标题', ':disabled': 'keywordFieldList.length == 0', ':placeholder': "!keywordFieldList.length ? '未设置搜索字段' : ''"} },
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
      data: {
        keyword: '', // 特殊搜索变量，支持多字段模糊搜索
        keywordFieldList: [], // 模糊字段列表
        serverSearchWhereLike: { },
      }
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-spacer' },
        /*html*/`
        <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
          <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
        </v-col>
        `
      ],
      headers: [
        { text: "员工id", value: "employeeId", width: 80, sortable: true },
        { text: "员工姓名", value: "employeeName", width: 80, sortable: true },
        { text: "员工序号", value: "idSequence", width: 80, sortable: true },
        { text: "员工性别", value: "sex", width: 80, sortable: true },
        { text: "员工年龄", value: "age", width: 80, sortable: true },
        { text: "联系电话", value: "contactNumber", width: 80, sortable: true },
        { text: "紧急联系电话", value: "emergencyContactNumber", width: 80, sortable: true },
        { text: "岗位1", value: "post", width: 80, sortable: true },
        { text: "岗位2", value: "post2", width: 80, sortable: true },
        { text: "岗位3", value: "post3", width: 80, sortable: true },
        { text: "政治面貌", value: "politicalBackground", width: 80, sortable: true },
        { text: "身份证号码", value: "icNumber", width: 80, sortable: true },
        { text: "出生日期", value: "dateOfBirth", width: 80, sortable: true },
        { text: "毕业学校", value: "institution", width: 80, sortable: true },
        { text: "专业", value: "major", width: 80, sortable: true },
        { text: "学历层次", value: "highestEducation", width: 80, sortable: true },
        { text: "教师资格证类别", value: "teacherQualification", width: 80, sortable: true },
        { text: "教师资格证学段", value: "teacherQualificationLeaver", width: 80, sortable: true },
        { text: "教师资格证学科", value: "teacherQualificationSubject", width: 80, sortable: true },
        { text: "教师资格证编号", value: "teacherCertificationNumber", width: 80, sortable: true },
        { text: "任教学段", value: "teachingLevel", width: 80, sortable: true },
        { text: "任教学科", value: "teachingSubject", width: 80, sortable: true },
        { text: "家庭地址", value: "residentialAddress", width: 80, sortable: true },
        { text: "省", value: "province", width: 80, sortable: true },
        { text: "市", value: "city", width: 80, sortable: true },
        { text: "县", value: "county", width: 80, sortable: true },
        { text: "入职", value: "dateOfEntry", width: 80, sortable: true },
        { text: "到期", value: "dateOfContractExpiration", width: 80, sortable: true },
        { text: "申请离职状态", value: "leaveRequestStatus", width: 80, sortable: true },
        { text: "建设银行卡卡号", value: "cardNumber", width: 80, sortable: true },
        { text: "车牌号", value: "licensePlateNumber", width: 80, sortable: true },
        { text: "聘用形式", value: "employmentForms", width: 80, sortable: true },
        { text: "试用期", value: "probationPeriod", width: 80, sortable: true },
        { text: "在职状态", value: "entryStatus", width: 80, sortable: true },
        { text: "员工状态", value: "status", width: 80, sortable: true },
        { text: "备注", value: "remarks", width: 80, sortable: true },
        { text: "联系人", value: "contactPerson", width: 80, sortable: true },
        { text: "教育经历", value: "educationExperience", width: 80, sortable: true },
        { text: "证书", value: "certificate", width: 80, sortable: true },
        { text: "薪资卡信息", value: "salaryCard", width: 80, sortable: true },
        { text: "社保卡信息", value: "socialSecurity", width: 80, sortable: true },
        { text: "培训经历", value: "trainingExperience", width: 80, sortable: true },
        { text: "工作经历", value: "workExperience", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: [],
      rowActionList: [
        // 简写支持 pc 和 移动端折叠
         
        { text: '详情', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "新增", 
          type: "form", 
          formItemList: [
            /**
            * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
            * attrs: {} // 表单项属性
            */
            { label: "员工id", model: "employeeId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工姓名", model: "employeeName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工序号", model: "idSequence", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工性别", model: "sex", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工年龄", model: "age", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "联系电话", model: "contactNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "紧急联系电话", model: "emergencyContactNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "岗位1", model: "post", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "岗位2", model: "post2", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "岗位3", model: "post3", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "政治面貌", model: "politicalBackground", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "身份证号码", model: "icNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "毕业学校", model: "institution", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "专业", model: "major", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学历层次", model: "highestEducation", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证类别", model: "teacherQualification", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证学段", model: "teacherQualificationLeaver", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证学科", model: "teacherQualificationSubject", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证编号", model: "teacherCertificationNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "任教学段", model: "teachingLevel", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "任教学科", model: "teachingSubject", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "家庭地址", model: "residentialAddress", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "省", model: "province", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "市", model: "city", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "县", model: "county", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "入职", model: "dateOfEntry", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "到期", model: "dateOfContractExpiration", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "申请离职状态", model: "leaveRequestStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "建设银行卡卡号", model: "cardNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "车牌号", model: "licensePlateNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "聘用形式", model: "employmentForms", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "试用期", model: "probationPeriod", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "在职状态", model: "entryStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工状态", model: "status", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "备注", model: "remarks", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "联系人", model: "contactPerson", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教育经历", model: "educationExperience", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "证书", model: "certificate", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "薪资卡信息", model: "salaryCard", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "社保卡信息", model: "socialSecurity", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "培训经历", model: "trainingExperience", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "工作经历", model: "workExperience", tag: "v-text-field", rules: "validationRules.requireRules" },
          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              class: 'ml-2',
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }],
        },

      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '详情',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "详情", 
          type: "form", 
          formItemList: [
            /**
            * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
            * attrs: {} // 表单项属性
            */
            { label: "员工id", model: "employeeId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工姓名", model: "employeeName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工序号", model: "idSequence", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工性别", model: "sex", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工年龄", model: "age", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "联系电话", model: "contactNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "紧急联系电话", model: "emergencyContactNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "岗位1", model: "post", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "岗位2", model: "post2", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "岗位3", model: "post3", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "政治面貌", model: "politicalBackground", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "身份证号码", model: "icNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "毕业学校", model: "institution", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "专业", model: "major", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学历层次", model: "highestEducation", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证类别", model: "teacherQualification", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证学段", model: "teacherQualificationLeaver", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证学科", model: "teacherQualificationSubject", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教师资格证编号", model: "teacherCertificationNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "任教学段", model: "teachingLevel", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "任教学科", model: "teachingSubject", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "家庭地址", model: "residentialAddress", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "省", model: "province", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "市", model: "city", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "县", model: "county", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "入职", model: "dateOfEntry", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "到期", model: "dateOfContractExpiration", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "申请离职状态", model: "leaveRequestStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "建设银行卡卡号", model: "cardNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "车牌号", model: "licensePlateNumber", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "聘用形式", model: "employmentForms", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "试用期", model: "probationPeriod", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "在职状态", model: "entryStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "员工状态", model: "status", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "备注", model: "remarks", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "联系人", model: "contactPerson", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "教育经历", model: "educationExperience", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "证书", model: "certificate", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "薪资卡信息", model: "salaryCard", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "社保卡信息", model: "socialSecurity", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "培训经历", model: "trainingExperience", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "工作经历", model: "workExperience", tag: "v-text-field", rules: "validationRules.requireRules" },
          ], 
          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              class: 'ml-2',
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
         
      ]
    }
  ],
  includeList: [
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
     
    data: {
      constantObj: {
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      filterMap: {}, // 结果筛选条件

       
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    computed: {
      tableDataComputed() {
        if(this.filterMap) {
          return this.tableData.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return this.tableData;
        }
      },
    },
    async created() {
      await this.doUiAction('getTableData');
    },
    doUiAction: {
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
       
    }
  },
   
};

module.exports = content;