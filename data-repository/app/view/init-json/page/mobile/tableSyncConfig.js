const content = {
  pageType: "jh-mobile-page", pageId: "mobile/tableSyncConfig", pageName: "同步表管理",
  version: 'v3', template: 'jhMobileTemplateV4',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅获取同步日志",
      resourceData: {
        table: "_table_sync_config",
        operation: "select"
      }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<$ ctx.packagePage.pageName $>", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'jh-order' },
    /*html*/
    `<v-btn color="success" class="mr-2" @click="doUiAction('doSyncTableByIdList', { idList: tableData.map(item => item.id) })" small>
      同步全部
    </v-btn>`,
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
        { text: "同步组", value: "syncGroup",  width: 120, sortable: true, class: "", cellClass: "truncate max-w-[300px]"  },
        { text: "ID", value: "id", width: 50, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "源表", value: "sourceTableText", width: 80, sortable: true, class: "fixed", cellClass: "fixed truncate max-w-[300px]" },
        { text: "目标表", value: "targetTableText", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "定时检查", value: "syncTimeSlot", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "实时同步/触发器", value: "enableMysqlTrigger", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "数据同步次数", value: "syncTimesCount", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "数据同步时间(最后一次)", value: "lastSyncTime", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "数据同步详情(最后一次)", value: "lastSyncInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
        { text: "定时执行时间", value: "scheduleAt", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
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
      startDetailItem: [],
      doSyncTableByIdList: ['doSyncTableByIdList', 'doUiAction.getTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      formatTableData() {
        let tableData = this.tableDataFromBackend.map(row => {
          row.sourceTableText = `${row.sourceDatabase}.${row.sourceTable}`;
          row.targetTableText = `${row.targetDatabase}.${row.targetTable}`;
          row.lastSyncTime = row.lastSyncTime ? dayjs(row.lastSyncTime).format('YYYY-MM-DD HH:mm:ss') : '';
          row.scheduleAt = row.scheduleAt ? dayjs(row.scheduleAt).format('YYYY-MM-DD HH:mm:ss') : '';
          return row;
        });
        this.tableData = _.orderBy(tableData, ['syncGroup', 'sourceTableText'], ['asc', 'asc']);
      },

      // ---------- 同步相关 uiAction >>>>>>>>>>>> --------
      async doSyncTableByIdList({ idList }) {
        window.vtoast.loading({ message: `${idList.length}个表同步`, time: -1 });
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'doSyncTableByIdList',
              actionData: {
                idList,
              }
            }
          },
          timeout: 360 * 1000,
        });
        window.vtoast.success("同步完成");
      },
      // ---------- <<<<<<<<<<< 同步相关 uiAction ---------
    }
  },
  
};

module.exports = content;
