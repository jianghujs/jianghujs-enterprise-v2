const content = {
  pageType: "jh-page", pageId: "tableSyncLog", pageName: "同步日志", 
  template: "jhTemplateV4", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅获取日志",
      resourceData: {
        table: "_table_log",
        operation: "select"
      }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "同步日志", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: false, slot: [] },
    { tag: 'v-spacer'},
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      searchBtn: true,
      value: [
        { tag: "v-text-field", model: "keyword", colAttrs: { cols: 12, md: 5 }, 
          attrs: { prefix: '赛选', ':disabled': 'keywordFieldList.length == 0', ':placeholder': "!keywordFieldList.length ? '未设置搜索字段' : ''"} },
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
      data: {
        keyword: '', // 特殊搜索变量，支持多字段模糊搜索
        keywordFieldList: ['logType', 'sourceTableInfo', 'targetTableInfo', 'syncStatus', 'syncTime', 'syncInfo'], // 模糊字段列表
        serverSearchWhereLike: { },
      }
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: { 
        ":footer-props": "{ itemsPerPageOptions: [20, 50, 200, 500, -1], itemsPerPageText: '每页', itemsPerPageAllText: '所有'}",
        "items-per-page": 200,
      },
      props: {
        serverPagination: true  // 开启服务端分页、服务端分页默v-badge认 limit 50
      },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headers: [
        { text: "同步类型", value: "logType", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "源表", value: "sourceTableInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "目标表", value: "targetTableInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步时间", value: "syncTime", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步详情", value: "syncInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
      ],
      value: [
        /*html*/`
        <template v-slot:item.sourceTableInfo="{ item }">
          <span :title="item.sourceTableInfo">{{ item.sourceTableInfo }}</span>
        </template>
        <template v-slot:item.targetTableInfo="{ item }">
          <span :title="item.targetTableInfo">{{ item.targetTableInfo }}</span>
        </template>
        <template v-slot:item.syncInfo="{ item }">
          <span :title="item.syncInfo">{{ item.syncInfo }}</span>
        </template>
        <template v-slot:item.syncStatus="{ item }">
          <span :class="item.syncStatus == '成功' ? 'success--text' : 'error--text'">{{ item.syncStatus }}</span>
        </template>
        `
      ],
    }
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {},
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      filterMap: {}, // 结果筛选条件

      tableOptions: {
        page: 1,
        limit: 200,
        totalCount: 0,
      },
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
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
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      formatTableData() {
        let tableData = this.tableDataFromBackend.map(row => {
          row.syncTime = row.syncTime ? dayjs(row.syncTime).format('YYYY-MM-DD HH:mm:ss') : '';
          return row;
        });
        this.tableData = tableData;
      },
    }
  },
  
};

module.exports = content;
