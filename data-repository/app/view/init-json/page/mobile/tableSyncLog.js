const content = {
  pageType: "jh-mobile-page", pageId: "mobile/tableSyncLog", pageName: "同步日志", 
  version: 'v3', template: 'jhMobileTemplateV4',
  resourceList: [
    /**
     * 	tableSyncLog	selectItemList	✅获取同步日志	sql		{"table": "_table_sync_log", "operation": "select"}
     */
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅获取同步日志",
      resourceData: {
        table: "_table_log",
        operation: "select"
      }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<$ ctx.packagePage.pageName $>", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'jh-order' },
    { tag: 'v-spacer' },
    { tag: 'jh-mode' }
  ],
  pageContent: [
    {
      tag: 'jh-list',
      props: {
        limit: 50,
      },
      attrs: { cols: 12, class: 'p-0 pb-7', ':style': '`height: calc(100vh - 140px); overflow-y: auto;overscroll-behavior: contain`' },
      headers: [
        { text: "同步类型", value: "logType", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "源表", value: "sourceTableInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "目标表", value: "targetTableInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步时间", value: "syncTime", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步详情", value: "syncInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        // width 表达式需要使用字符串包裹
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
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件
      tableDataOrder: [
        {
          column: "operationAt",
          order: "desc"
        }
      ],
      tableDataOrderList: [
        { text: "更新时间↓", value: [
          {
            column: "operationAt",
            order: "desc"
          },
        ] },
      ],
      viewMode: 'detail'
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
    created() {
      this.doUiAction('getTableData');
    },
    doUiAction: {
      startDetailItem: []
    }, // 额外uiAction { [key]: [action1, action2]}
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
