const content = {
  pageType: "jh-page", pageId: "tableSyncConfigRemote", table: "_table_sync_config_remote", 
  pageName: "远程同步管理", template: "jhTemplateV4", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅数据库管理页-查询同步表",
      resourceData: { table: "_table_sync_config_remote", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅数据库管理页-创建同步表",
      resourceData: { table: "_table_sync_config_remote", operation: "insert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅数据库管理页-更新同步表",
      resourceData: { table: "_table_sync_config_remote", operation: "update" }
    },
    {
      actionId: "getDatabaseInfo",
      resourceType: "service",
      desc: "✅数据库管理页-查询当前数据库信息",
      resourceData: {
        service: "tableSyncRemote",
        serviceFunction: "getDatabaseInfo"
      }
    },
    {
      actionId: "doSyncTableRemoteByIdList",
      resourceType: "service",
      desc: "✅数据库管理页-触发同步",
      resourceData: {
        service: "tableSyncRemote",
        serviceFunction: "doSyncTableRemoteByIdList"
      }
    },
    {
      actionId: "recycleTableSyncConfig",
      resourceType: "service",
      desc: "✅数据库管理页-同步表回收站",
      resourceData: {
        service: "tableSyncRemote",
        serviceFunction: "recycleTableSyncConfig"
      }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<$ ctx.packagePage.pageName $>", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: false, slot: [] },
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
        { tag: 'v-btn', value: '同步全部', attrs: { color: 'success', class: 'mr-2', '@click': "doUiAction('doSyncTableRemoteByIdList', { idList: tableData.map(item => item.id) })" }, quickAttrs: ['small'] },
        { tag: 'v-btn', value: '清除同步次数', attrs: { color: 'success', class: 'mr-2', '@click': "doUiAction('clearSyncTimesCount', {})" }, quickAttrs: ['small'] },
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
        <template v-slot:item.syncTimeSlot="{ item }">
          <span>{{ constantObj.syncTimeSlotMap[item.syncTimeSlot] || item.syncTimeSlot + '分钟' }}</span>
        </template>
        <template v-slot:item.syncStatus="{ item }">
          <div class="d-flex justify-space-between ">
            <v-chip small :class="item.syncStatus == '正常' ? 'jh-status-tag-success' : 'jh-status-tag-error'"> 
              {{ item.syncStatus }} 
            </v-chip>
            <span role="button" @click="doUiAction('doSyncTableRemoteByIdList', { idList: [item.id] })" title="同步" class="translate-y-[2px]">
              <v-icon size="18" color="success">mdi-sync</v-icon>
            </span>
          </div>
        </template>
        <template v-slot:item.lastSyncInfo="{ item }">
          <span :title="item.lastSyncInfo">{{ item.lastSyncInfo }}</span>
        </template>
        <template v-slot:item.sourceTableText="{ item }">
          <span :title="item.sourceTableText">{{ item.sourceTableText }}</span>
        </template>
        <template v-slot:item.targetTableText="{ item }">
          <span :title="item.targetTableText">{{ item.targetTableText }}</span>
        </template>

        <template v-slot:item.tableType="{ item }">
          <span :title="item.tableType">{{ constantObj.tableTypeMap[item.sourceDatabase + '.' + item.sourceTable] || '' }}</span>
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
            { label: "同步组", model: "syncGroup", tag: "v-combobox", 
              attrs: { ':items': 'constantObj.syncGroup', 'item-text': 'syncGroup', 'item-value': 'syncGroup', "return-object": false},
              colAttrs: { md: 4 },
            },
            { label: "定时检查", model: "syncTimeSlot", tag: "v-select", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.syncTimeSlot', 'item-text': 'text', 'item-value': 'value' },
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-源库", model: "sourceDatabase", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'return-object': false },
              colAttrs: { md: 4 },
            },
            { label: /*html*/`
                同步-源表 
                <span v-if="createItem.sourceTable">
                  (源表类型: {{ constantObj.tableTypeMap[createItem.sourceDatabase + '.' + createItem.sourceTable] || '' }})
                </span>
                <span role="button" @click="initConstantObjData({ showTip: true })" class="success--text ml-1">
                  查询<v-icon size="18" color="success">mdi-sync</v-icon>
                </span>
                `, 
              model: "sourceTable", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.tableListMap[createItem.sourceDatabase]||[]', 
                  'item-text': 'sourceTable', 'item-value': 'sourceTable', 'return-object': false},
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-目标库", model: "targetDatabase", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'return-object': false },
              colAttrs: { md: 4 },
            },
            { label: "同步-目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.targetTableRules", 
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
            { label: "同步组", model: "syncGroup", tag: "v-combobox",
              attrs: { ':items': 'constantObj.syncGroup', 'item-text': 'syncGroup', 'item-value': 'syncGroup', "return-object": false},
              colAttrs: { md: 4 },
            },
            { label: "定时检查", model: "syncTimeSlot", tag: "v-select", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.syncTimeSlot', 'item-text': 'text', 'item-value': 'value' },
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-源库", model: "sourceDatabase", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'return-object': false },
              colAttrs: { md: 4 },
            },
            { label: /*html*/`
              同步-源表 
              <span v-if="updateItem.sourceTable">
                (源表类型: {{ constantObj.tableTypeMap[updateItem.sourceDatabase + '.' + updateItem.sourceTable] || '' }})
              </span>
              <span role="button" @click="initConstantObjData({ showTip: true })" class="success--text ml-1">
                查询<v-icon size="18" color="success">mdi-sync</v-icon>
              </span>
              `, 
              model: "sourceTable", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.tableListMap[updateItem.sourceDatabase]||[]', 
                'item-text': 'sourceTable', 'item-value': 'sourceTable', 'return-object': false },
              colAttrs: { md: 4 },
            },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-目标库", model: "targetDatabase", tag: "v-combobox", rules: "validationRules.requireRules", 
              attrs: { ':items': 'constantObj.databaseList', 'return-object': false },
              colAttrs: { md: 4 },
            },
            { label: "同步-目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.targetTableRules", 
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
        viewMode: ["同步组模式", "源表模式"],
        syncGroup: ['账号', '业务01数据', '业务02数据', '临时测试'],
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
        databaseList: [],
        tableListMap: {},
        tableTypeMap: {},
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
        // Tip：在源头限制 targetTable, 不能让 triggerName 超过64
        //  - `${syncTriggerPrefix}_${targetTable}_UPDATE`.slice(-64);
        targetTableRules: [
          v => !!v || '必填',
          v => (v && v.length <= 36) || '不能超过36位',
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
        if (this.viewMode == '源表模式') {
          return [
            { text: "源表", value: "sourceTable", width: 80, sortable: true, class: "fixed", cellClass: "fixed truncate max-w-[300px]" },
            { text: "源表类型", value: "tableType", width: 80, sortable: true, cellClass: "truncate max-w-[300px]"  },
            { text: "ID", value: "id", width: 50, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "源库(别名)", value: "sourceDatabase", width: 80, sortable: true, cellClass: "truncate max-w-[300px]"  },
            { text: "目标表", value: "targetTableText", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "同步组", value: "syncGroup",  width: 120, sortable: true, class: "", cellClass: "truncate max-w-[300px]"  },
            { text: "定时检查", value: "syncTimeSlot", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "数据同步次数", value: "syncTimesCount", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "数据同步时间(最后一次)", value: "lastSyncTime", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "数据同步详情(最后一次)", value: "lastSyncInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
            { text: "操作", value: "action", type: "action", width: 80, align: "center", class: "fixed", cellClass: "fixed truncate max-w-[300px]" },
          ]
        }

        return [
          { text: "同步组", value: "syncGroup",  width: 120, sortable: true, class: "fixed", cellClass: "fixed truncate max-w-[300px]"  },
          { text: "ID", value: "id", width: 50, sortable: true, cellClass: "truncate max-w-[300px]" },
          { text: "源表", value: "sourceTableText", width: 80, sortable: true, cellClass: "truncate max-w-[400px]" },
          { text: "源表类型", value: "tableType", width: 80, sortable: true, cellClass: "truncate max-w-[300px]"  },
          { text: "目标表", value: "targetTableText", width: 80, sortable: true, cellClass: "truncate max-w-[400px]" },
          { text: "定时检查", value: "syncTimeSlot", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
          { text: "同步状态", value: "syncStatus", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
          { text: "数据同步次数", value: "syncTimesCount", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
          { text: "数据同步时间(最后一次)", value: "lastSyncTime", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
          { text: "数据同步详情(最后一次)", value: "lastSyncInfo", width: 80, sortable: true, cellClass: "truncate max-w-[300px]" },
          { text: "操作", value: "action", type: "action", width: 80, align: "center", class: "fixed", cellClass: "fixed truncate max-w-[300px]" },
        ];
      }
    },
    async created() {
      this.viewMode = window.localStorage.getItem(`${window.appInfo.appId}_${this.pageId}_viewMode`) || '同步组模式';
      await this.doUiAction('getTableData');
    },
    doUiAction: {
      getTableData: ['prepareTableParamsDefault', 'prepareTableParams', 'getTableData', 'formatTableData', 'initConstantObjData'],
 
      doSyncTableRemoteByIdList: ['doSyncTableRemoteByIdList', 'doUiAction.getTableData'],
      syncGroupSelectDailog: ['syncGroupSelectDailog'],
      initConstantObjData: ['initConstantObjData'],
      recycleItem: ['recycleItem', 'doUiAction.getTableData'],
      clearSyncTimesCount: ['clearSyncTimesCount', 'doUiAction.getTableData'],
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
        if (this.viewMode == '源表模式') {
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
              pageId: 'tableSyncConfigRemote',
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
          syncTimeSlot: 10,
        };
        this.createItemOrigin = _.cloneDeep(this.createItem);
      },
      async recycleItem({ item }) {
        window.vtoast.loading(`${item.id} 移入回收站`);
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfigRemote',
              actionId: 'recycleTableSyncConfig',
              actionData: { id: item.id }
            }
          }
        });
        window.vtoast.success(`${item.id} 移入回收站`);
      },
      // ---------- <<<<<<<<<<< CRUD覆盖 uiAction ---------


      // ---------- 同步相关 uiAction >>>>>>>>>>>> --------
      async doSyncTableRemoteByIdList({ idList }) {
        window.vtoast.loading({ message: `${idList.length}个表同步`, time: -1 });
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfigRemote',
              actionId: 'doSyncTableRemoteByIdList',
              actionData: {
                idList,
              }
            }
          },
          timeout: 360 * 1000,
        });
        window.vtoast.success("同步完成");
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
                  pageId: 'tableSyncConfigRemote',
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
      async initConstantObjData(funObj) {
        const { showTip= false } = funObj||{};
        if (showTip) { window.vtoast.loading("查询表"); }
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfigRemote',
              actionId: 'getDatabaseInfo',
            }
          }
        });
        const { databaseList, tableListMap, tableTypeMap } = result.data.appData.resultData;
        this.constantObj.databaseList = databaseList;
        this.constantObj.tableListMap = tableListMap;
        this.constantObj.tableTypeMap = tableTypeMap;
        if (showTip) { window.vtoast.success("查询表"); }
      },
      async clearSyncTimesCount({ item }) {
        window.vtoast.loading("清除同步次数");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfigRemote',
              actionId: 'updateItem',
              actionData: { syncTimesCount: 0 },
              whereIn: { id: this.tableData.map(item => item.id) }
            }
          }
        });
        window.vtoast.success("清除同步次数");
      },
      // ---------- <<<<<<<<<<< 同步相关 uiAction ---------

    }
  },
   
};

module.exports = content;