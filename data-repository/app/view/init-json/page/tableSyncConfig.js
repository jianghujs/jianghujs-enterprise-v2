const content = {
  pageType: "jh-page", pageId: "tableSyncConfig", table: "_table_sync_config", 
  pageName: "同步表管理", template: "jhTemplateV4", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "_table_sync_config", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "_table_sync_config", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "_table_sync_config", operation: "jhUpdate" }
    },
    // {
    //   actionId: "deleteItem",
    //   resourceType: "sql",
    //   desc: "✅删除",
    //   resourceData: { table: "_table_sync_config", operation: "jhDelete" }
    // }
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
      attrs: { 
      },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增同步表', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-btn', value: '全部同步', attrs: { color: 'success', class: 'mr-2', '@click': "doUiAction('manualSyncTable', { idList: tableData.map(item => item.id) })" }, quickAttrs: ['small'] },
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
      value: [
        /*html*/`
        <template v-slot:item.syncGroup="{ item }">
          <div class="d-flex justify-space-between">
            <span>{{ item.syncGroup }}</span>
            <span role="button" class="translate-y-[0px]" @click="doUiAction('syncGroupSelectDailog', { item })">
              <v-icon size="18" color="success">mdi-note-edit-outline</v-icon>
            </span>
          </div>
        </template>
        <template v-slot:item.enableMysqlTrigger="{ item }">
          <span :class="item.enableMysqlTrigger == '开启' ? 'success--text' : 'grey--text'">{{ item.enableMysqlTrigger }}</span>
        </template>
        <template v-slot:item.syncTimeSlot="{ item }">
          <span>{{ constantObj.syncTimeSlotMap[item.syncTimeSlot] || item.syncTimeSlot + '分钟' }}</span>
        </template>
        <template v-slot:item.syncStatus="{ item }">
          <div class="d-flex justify-space-between ">
            <v-chip small :class="item.syncStatus == '正常' ? 'jh-status-tag-success' : 'jh-status-tag-error'"> 
              {{ item.syncStatus }} 
            </v-chip>
            <span role="button" @click="doUiAction('manualSyncTable', { idList: [item.id] })" title="同步" class="translate-y-[2px]">
              <v-icon size="18" color="success">mdi-sync</v-icon>
            </span>
          </div>
        </template>
        `
      ],
      rowActionList: [
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '回收站', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("recycleItem", { item })' } // 简写支持 pc 和 移动端折叠
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
      title: '新增同步表',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "新增同步表", 
          type: "form", 
          formItemList: [
            { label: "同步-源库", model: "sourceDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'item-text': 'sourceDatabase', 'item-value': 'sourceDatabase'},
              colAttrs: { md: 4 },
            },
            { label: '同步-源表 <span role="button" @click="initConstantObjData({ showTip: true })" class="success--text ml-1">查询<v-icon size="18" color="success">mdi-sync</v-icon></span>', 
              model: "sourceTable", tag: "v-autocomplete", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseMap[createItem.sourceDatabase]||[]', 'item-text': 'sourceTable', 'item-value': 'sourceTable'},
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-目标库", model: "targetDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'item-text': 'sourceDatabase', 'item-value': 'sourceDatabase'},
              colAttrs: { md: 4 },
            },
            { label: "同步-目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.requireRules", 
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "定时检查", model: "syncTimeSlot", tag: "v-select", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.syncTimeSlot', 'item-text': 'text', 'item-value': 'value' },
              colAttrs: { md: 4 },
            },
            { label: "实时同步", model: "enableMysqlTrigger", default: "开启", tag: "v-checkbox", 
              attrs: { trueValue: "开启", falseValue: "关闭" }, quickAttrs: ['dense'],
              colAttrs: { md: 4 },
            },
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
      title: '{{updateItem.id}} | 编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            { label: "同步组", model: "syncGroup", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.syncGroup', 'item-text': 'syncGroup', 'item-value': 'syncGroup', "return-object": false},
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-源库", model: "sourceDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'item-text': 'sourceDatabase', 'item-value': 'sourceDatabase'},
              colAttrs: { md: 4 },
            },
            { label: '同步-源表 <span role="button" @click="initConstantObjData({ showTip: true })" class="success--text ml-1">查询<v-icon size="18" color="success">mdi-sync</v-icon></span>', 
              model: "sourceTable", tag: "v-autocomplete", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseMap[updateItem.sourceDatabase]||[]', 'item-text': 'sourceTable', 'item-value': 'sourceTable'},
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-目标库", model: "targetDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'item-text': 'sourceDatabase', 'item-value': 'sourceDatabase'},
              colAttrs: { md: 4 },
            },
            { label: "同步-目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.requireRules", 
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "定时检查", model: "syncTimeSlot", tag: "v-select", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.syncTimeSlot', 'item-text': 'text', 'item-value': 'value' },
              colAttrs: { md: 4 },
            },
            { label: "实时同步", model: "enableMysqlTrigger", default: "开启", tag: "v-checkbox", 
              attrs: { trueValue: "开启", falseValue: "关闭" }, quickAttrs: ['dense'],
              colAttrs: { md: 4 },
            },
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
        viewMode: ["同步组模式", "源库模式"],
        syncGroup: ['Enterprise', 'HR', 'USER', 'test'],
        syncTimeSlot: [
          { text: '2分钟', value: 2 }, 
          { text: '5分钟', value: 5 }, 
          { text: '10分钟', value: 10 }, 
          { text: '1小时', value: 60 }, 
          { text: '6小时', value: 360 }, 
          { text: '12小时', value: 720 }, 
          { text: '24小时', value: 1440 }
        ],
        syncTimeSlotMap: {
          2: '2分钟',
          5: '5分钟',
          10: '10分钟',
          60: '1小时',
          360: '6小时',
          720: '12小时',
          1440: '24小时',
        },
        databaseMap: {},
        databaseList: [],
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
      headers() {
        if (this.viewMode == '源库模式') {
          return [
            { text: "ID", value: "id", width: 50, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "源库", value: "sourceDatabase", width: 80, sortable: true, class: "fixed", cellClass: "fixed text-truncate max-width-300"  },
            { text: "源表", value: "sourceTable", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "目标表", value: "targetTableText", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "同步组", value: "syncGroup",  width: 120, sortable: true, class: "", cellClass: "text-truncate max-width-300"  },
            { text: "定时检查", value: "syncTimeSlot", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "实时同步", value: "enableMysqlTrigger", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "最后一次同步检查", value: "lastSyncTime", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "最后一次同步详情", value: "lastSyncInfo", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
            { text: "操作", value: "action", type: "action", width: 80, align: "center", class: "fixed", cellClass: "fixed text-truncate max-width-300" },
          ]
        }

        return [
          { text: "ID", value: "id", width: 50, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "同步组", value: "syncGroup",  width: 120, sortable: true, class: "fixed", cellClass: "fixed text-truncate max-width-300"  },
          { text: "源表", value: "sourceTableText", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "目标表", value: "targetTableText", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "定时检查", value: "syncTimeSlot", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "实时同步", value: "enableMysqlTrigger", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "最后一次同步检查", value: "lastSyncTime", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "最后一次同步详情", value: "lastSyncInfo", width: 80, sortable: true, cellClass: "text-truncate max-width-300" },
          { text: "操作", value: "action", type: "action", width: 80, align: "center", class: "fixed", cellClass: "fixed text-truncate max-width-300" },
        ];
      }
    },
    async created() {
      this.viewMode = window.localStorage.getItem(`${window.appInfo.appId}_${this.pageId}_viewMode`) || '同步组模式';
      this.doUiAction('initConstantObjData', {});
      await this.doUiAction('getTableData');
    },
    doUiAction: {
      manualSyncTable: ['manualSyncTable', 'doUiAction.getTableData'],
      syncGroupSelectDailog: ['syncGroupSelectDailog'],

      initConstantObjData: ['initConstantObjData'],
      recycleItem: ['recycleItem', 'doUiAction.getTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      // ---------- CRUD覆盖 uiAction >>>>>>>>>>>> --------
      async getTableData() {
        this.isTableLoading = true;

        let orderBy =[
          { column: 'syncGroup', order: 'asc' },
          { column: 'sourceDatabase', order: 'asc' },
          { column: 'sourceTable', order: 'asc' },
        ];
        if (this.viewMode == '源库模式') {
          orderBy = [
            { column: 'sourceDatabase', order: 'asc' },
            { column: 'syncGroup', order: 'asc' },
            { column: 'sourceTable', order: 'asc' },
          ];
        }
        this.tableParams.where.rowStatus = '正常';
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: "selectItemList",
              actionData: {},
              ...this.tableParams,
              orderBy,
            }
          }
        });
        const { rows, count } = result.data.appData.resultData;
        
        this.tableDataFromBackend = rows;
        this.isTableLoading = false;
      },
      formatTableData() {
        let tableData = this.tableDataFromBackend.map(row => {
          row.sourceTableText = `${row.sourceDatabase}.${row.sourceTable}`;
          row.targetTableText = `${row.targetDatabase}.${row.targetTable}`;
          row.lastSyncTime = row.lastSyncTime ? dayjs(row.lastSyncTime).format('YYYY-MM-DD HH:mm:ss') : '';
          return row;
        });
        this.tableData = tableData;
      },
      async prepareCreateFormData() {
        this.createItem = {
          targetDatabase: this.defaultTargetDatabase,
          enableMysqlTrigger: "开启",
        };
        this.createItemOrigin = _.cloneDeep(this.createItem);
      },
      async recycleItem({ item }) {
        window.vtoast.loading(`${item.id} 移入回收站`);
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'updateItem',
              where: { id: item.id },
              actionData: { rowStatus: '回收站' }
            }
          }
        });
        window.vtoast.success(`${item.id} 移入回收站`);
      },
      // ---------- <<<<<<<<<<< CRUD覆盖 uiAction ---------


      // ---------- 同步相关 uiAction >>>>>>>>>>>> --------
      async manualSyncTable({ idList }) {
        window.vtoast.loading({ message: `${idList.length}个表同步`, time: -1 });
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'syncTable',
              actionData: {
                idList,
              }
            }
          },
          timeout: 360 * 1000,
        });
        window.vtoast.success("同步成功");
      },
      async syncGroupSelectDailog({ item }){
        const dailogTitle = "同步组设置"
        await window.jhConfirmDailog({ 
          title: dailogTitle,
          data: { 
            syncGroupList: this.constantObj.syncGroup,
            syncGroupSelect: item.syncGroup,
          },
          htmlTemplate: /*html*/`
            <v-combobox class="jh-v-input mb-2"
              :items="syncGroupList" single-line dense filled :multiple="false" :return-object="false" 
              v-model="syncGroupSelect"></v-combobox>
          `,
          onConfirm: async ($instance) => {
            // Tip: 等10ms让 vueData更新完
            await new Promise(resolve => setTimeout(resolve, 10));
            window.vtoast.loading(dailogTitle);
            await window.jianghuAxios({
              data: {
                appData: {
                  pageId: 'tableSyncConfig',
                  actionId: 'updateItem',
                  actionData: {
                    syncGroup: $instance.syncGroupSelect,
                  },
                  where: { id: item.id }
                }
              }
            });
            window.vtoast.success(dailogTitle);
            await this.doUiAction('getTableData');
          },
        });
      },
      async initConstantObjData({ showTip = false }) {
        if (showTip) { window.vtoast.loading("查询表"); }
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'selectSourceDatabase',
            }
          }
        });
        const { defaultTargetDatabase, databaseMap, databaseList } = result.data.appData.resultData;
        this.constantObj.databaseMap = databaseMap;
        this.constantObj.databaseList = databaseList;
        this.defaultTargetDatabase = defaultTargetDatabase;
        if (showTip) { window.vtoast.success("查询表"); }
      },
      // ---------- <<<<<<<<<<< 同步相关 uiAction ---------

    }
  },
   
};

module.exports = content;