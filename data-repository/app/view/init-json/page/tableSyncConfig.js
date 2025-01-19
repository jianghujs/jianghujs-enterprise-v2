const content = {
  pageType: "jh-page", pageId: "tableSyncConfig", table: "a_table_sync_config", 
  pageName: "同步表管理", template: "jhTemplateV4", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "a_table_sync_config", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "a_table_sync_config", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "a_table_sync_config", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "a_table_sync_config", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<$ ctx.packagePage.pageName $>", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer'},
    /*html*/`
    <span class="w-[220px] inline-block mr-2">
      <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
    </span>
    <v-btn class="elevation-0 float-right mt-2 mt-sm-0" color="success" small @click="doUiAction('getTableData')">
      查询
    </v-btn>
    `,
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增同步表', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-btn', value: '批量同步', attrs: { color: 'grey', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-spacer' },
        /*html*/`
        <div class="v-btn-toggle">
          <v-btn small v-for="viewModeVal, index in constantObj.viewMode" 
            :key="index" 
            :class="viewMode == viewModeVal? 'success v-btn--active white--text' : ''"
            @click="() => {
              viewMode = viewModeVal; 
              window.localStorage.setItem(window.appInfo.appId + '_' + pageId + '_' + 'viewMode', viewModeVal);  
            }" >
            {{viewModeVal}}
          </v-btn>
        </div>
        `
      ],
      headers: [
        { text: "同步组", value: "syncGroup", width: 80, sortable: true },
        { text: "源库", value: "sourceDatabase", width: 80, sortable: true },
        { text: "源表", value: "sourceTable", width: 80, sortable: true },
        { text: "目标库", value: "targetDatabase", width: 80, sortable: true },
        { text: "目标表", value: "targetTable", width: 80, sortable: true },
        { text: "定时检查", value: "syncTimeSlot", width: 80, sortable: true },
        { text: "Trigger实时同步", value: "enableMysqlTrigger", width: 80, sortable: true },
        { text: "同步状态", value: "syncDesc", width: 80, sortable: true },
        { text: "同步触发时间", value: "lastSyncTime", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: [],
      rowActionList: [
        { text: '同步', icon: 'mdi-sync', color: 'success', click: 'doUiAction("manualSyncOneTable", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
         
        // { text: '详情', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        // { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
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
            { label: "同步组", model: "syncGroup", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "源库", model: "sourceDatabase", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "源表", model: "sourceTable", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "目标库", model: "targetDatabase", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "定时检查", model: "syncTimeSlot", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "Trigger实时同步", model: "enableMysqlTrigger", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "同步状态", model: "syncDesc", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "同步触发时间", model: "lastSyncTime", tag: "v-text-field", rules: "validationRules.requireRules" },
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
            { label: "同步组", model: "syncGroup", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "源库", model: "sourceDatabase", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "源表", model: "sourceTable", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "目标库", model: "targetDatabase", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "定时检查", model: "syncTimeSlot", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "Trigger实时同步", model: "enableMysqlTrigger", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "同步状态", model: "syncDesc", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "同步触发时间", model: "lastSyncTime", tag: "v-text-field", rules: "validationRules.requireRules" },
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
      pageId: '<$ ctx.packagePage.pageId $>',
      viewMode: null,
      constantObj: {
        viewMode: ["列表模式", "分组模式"],
        categoryList: [],
        categoryMap: {},
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
      this.viewMode = window.localStorage.getItem(`${window.appInfo.appId}_${this.pageId}_viewMode`) || '列表模式';
      await this.doUiAction('getTableData');
    },
    doUiAction: {
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
       
    }
  },
   
};

module.exports = content;