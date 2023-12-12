# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _cache
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_cache`;
CREATE TABLE `_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL COMMENT '用户Id',
  `content` longtext COMMENT '缓存数据',
  `recordStatus` varchar(255) DEFAULT 'active',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = '缓存表';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _constant
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_constant`;
CREATE TABLE `_constant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `constantKey` varchar(255) DEFAULT NULL,
  `constantType` varchar(255) DEFAULT NULL COMMENT '常量类型; object, array',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `constantValue` text COMMENT '常量内容; object, array',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 COMMENT = '常量表; 软删除未启用;';



INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'salaryOption','array','薪资项','[{\"optionId\":\"1161\",\"code\":10,\"parentCode\":0,\"name\":\"基本工资\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1165\",\"code\":20,\"parentCode\":0,\"name\":\"津补贴\",\"remarks\":\"企业给员工提供的福利\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1170\",\"code\":30,\"parentCode\":0,\"name\":\"浮动工资\",\"remarks\":\"浮动工资需要在每月算薪前手工录入\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1172\",\"code\":40,\"parentCode\":0,\"name\":\"奖金\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1176\",\"code\":50,\"parentCode\":0,\"name\":\"提成工资\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1178\",\"code\":60,\"parentCode\":0,\"name\":\"计件工资\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1180\",\"code\":70,\"parentCode\":0,\"name\":\"计时工资\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1182\",\"code\":80,\"parentCode\":0,\"name\":\"工龄/司龄工资\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1185\",\"code\":90,\"parentCode\":0,\"name\":\"职称工资\",\"remarks\":null,\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1189\",\"code\":100,\"parentCode\":0,\"name\":\"代扣代缴\",\"remarks\":\"公司代替个人缴纳的费用，如个人社保、个人公积金。该类别下的薪酬项，将从应纳税所得额中扣除，影响个税计算\",\"isFixed\":0,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1192\",\"code\":110,\"parentCode\":0,\"name\":\"企业社保\",\"remarks\":\"该类别下的薪酬项，不参与工资计算，只参与企业成本统计或社保成本分析\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1194\",\"code\":120,\"parentCode\":0,\"name\":\"企业公积金\",\"remarks\":\"该类别下的薪酬项，不参与工资计算，只参与企业成本统计或社保成本分析\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1196\",\"code\":130,\"parentCode\":0,\"name\":\"税前补发\",\"remarks\":\"税前补发，与该月的工资一起发放，需参与计税\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1198\",\"code\":140,\"parentCode\":0,\"name\":\"税前补扣\",\"remarks\":\"税前从该月的工资中补扣的金额，会影响本月的应税工资总额\",\"isFixed\":0,\"isPlus\":0,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1200\",\"code\":150,\"parentCode\":0,\"name\":\"税后补发\",\"remarks\":\"税后补发，不参与该月工资计算，会影响当月的实际所得\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1202\",\"code\":160,\"parentCode\":0,\"name\":\"税后补扣\",\"remarks\":\"从税后的工资中补扣的款项，不参与该月的工资计税\",\"isFixed\":0,\"isPlus\":0,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1206\",\"code\":170,\"parentCode\":0,\"name\":\"特殊计税项\",\"remarks\":\"其它里的科目不参与工资计算，但要计税\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1208\",\"code\":180,\"parentCode\":0,\"name\":\"加班工资\",\"remarks\":\"公司按员工加班时长计算的加班报酬\",\"isFixed\":1,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1210\",\"code\":190,\"parentCode\":0,\"name\":\"考勤扣款明细\",\"remarks\":null,\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1217\",\"code\":200,\"parentCode\":0,\"name\":\"考勤扣款合计\",\"remarks\":null,\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1219\",\"code\":210,\"parentCode\":0,\"name\":\"应发工资\",\"remarks\":null,\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1221\",\"code\":220,\"parentCode\":0,\"name\":\"应税工资\",\"remarks\":null,\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1223\",\"code\":230,\"parentCode\":0,\"name\":\"个人所得税\",\"remarks\":null,\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1225\",\"code\":240,\"parentCode\":0,\"name\":\"实发工资\",\"remarks\":null,\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1227\",\"code\":10101,\"parentCode\":10,\"name\":\"基本工资\",\"remarks\":\"劳动合同中约定的标准工资。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1228\",\"code\":10102,\"parentCode\":10,\"name\":\"岗位工资\",\"remarks\":\"根据岗位、责任、技能要求等，不同岗位，工资不同。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1229\",\"code\":10103,\"parentCode\":10,\"name\":\"职务工资\",\"remarks\":\"根据职务高低、业务技术水平等因素的不同，工资不同，随职务变动而变动。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1230\",\"code\":20101,\"parentCode\":20,\"name\":\"住房补贴\",\"remarks\":\"为职工解决住房问题而给予的补贴资助。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1231\",\"code\":20102,\"parentCode\":20,\"name\":\"高温津贴\",\"remarks\":\"用人单位安排劳动者在高温天气下工作，当温度高于33℃，应支付高温补贴。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1232\",\"code\":20103,\"parentCode\":20,\"name\":\"交通补贴\",\"remarks\":\"企业按月按标准支付的交通补贴\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1233\",\"code\":20104,\"parentCode\":20,\"name\":\"餐补\",\"remarks\":\"企业不统一供餐，而是按月按标准支付的午饭或晚餐补贴\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1234\",\"code\":30101,\"parentCode\":30,\"name\":\"绩效工资\",\"remarks\":\"以员工的实际劳动成果或表现为考核标准，支付一定的奖励工资。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1235\",\"code\":40101,\"parentCode\":40,\"name\":\"季度奖\",\"remarks\":\"对于表现优秀的员工，按季度给予一定的奖励工资。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1236\",\"code\":40102,\"parentCode\":40,\"name\":\"全勤奖\",\"remarks\":\"对于按公司规定到岗工作，未出现任何迟到、早退的员工给予的奖励，一般以月度为考核期限。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1237\",\"code\":40103,\"parentCode\":40,\"name\":\"推荐奖\",\"remarks\":\"企业在招揽人才的过程中，对推荐人才并顺利入职的内部员工，给予的奖励工资。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1238\",\"code\":50101,\"parentCode\":50,\"name\":\"销售提成\",\"remarks\":\"对于销售或业务人员，通常按照一定的比例，企业和员工之间对盈利进行分成。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1239\",\"code\":60101,\"parentCode\":60,\"name\":\"计件工资\",\"remarks\":\"根据职工完成的劳动数量和按事先规定的计件单价计算和支付的工资。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1240\",\"code\":70101,\"parentCode\":70,\"name\":\"计时工资\",\"remarks\":\"根据职工的工作时间,按照工资标准、等级计算和支付的工资\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1241\",\"code\":80101,\"parentCode\":80,\"name\":\"工龄工资\",\"remarks\":\"企业按照员工的工作年数，即员工的工作经验和劳动贡献的积累给予的经济补偿。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1242\",\"code\":80102,\"parentCode\":80,\"name\":\"司龄工资\",\"remarks\":\"司龄工资是按照劳动者在在公司做的时间的长短进行相应工资的计算。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1243\",\"code\":90101,\"parentCode\":90,\"name\":\"职称工资\",\"remarks\":\"工资高低与职称挂钩，职称越高，工资越高。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1244\",\"code\":90102,\"parentCode\":90,\"name\":\"技能工资\",\"remarks\":\"以员工个人所掌握的知识、技术和所具备的能力为基础来进行工资报酬的支付。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1245\",\"code\":90103,\"parentCode\":90,\"name\":\"学历工资\",\"remarks\":\"根据员工在教育机构取得的学历而给予适当的津贴。\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1246\",\"code\":100101,\"parentCode\":100,\"name\":\"个人社保\",\"remarks\":\"社保中个人缴纳的部分\",\"isFixed\":0,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1247\",\"code\":100102,\"parentCode\":100,\"name\":\"个人公积金\",\"remarks\":\"公积金中个人缴纳的部分\",\"isFixed\":0,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1248\",\"code\":110101,\"parentCode\":110,\"name\":\"企业社保\",\"remarks\":\"企业承担的社保费用\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1249\",\"code\":120101,\"parentCode\":120,\"name\":\"企业公积金\",\"remarks\":\"企业承担的公积金费用\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1250\",\"code\":130101,\"parentCode\":130,\"name\":\"税前补发\",\"remarks\":\"如上月漏发，这月补发的工资\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1251\",\"code\":140101,\"parentCode\":140,\"name\":\"税前补扣\",\"remarks\":\"如上月未扣，这月补扣的扣款；\",\"isFixed\":0,\"isPlus\":0,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1252\",\"code\":150101,\"parentCode\":150,\"name\":\"税后补发\",\"remarks\":\"其它税后补发\",\"isFixed\":0,\"isPlus\":1,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1253\",\"code\":160101,\"parentCode\":160,\"name\":\"党费\",\"remarks\":\"向党组织交纳的用于党的事业和党的活动的经费，由公司代收。\",\"isFixed\":0,\"isPlus\":0,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1254\",\"code\":160102,\"parentCode\":160,\"name\":\"工会费\",\"remarks\":\"员工缴纳的，工会组织开展各项活动所需要的费用\",\"isFixed\":0,\"isPlus\":0,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1255\",\"code\":160103,\"parentCode\":160,\"name\":\"补充医疗\",\"remarks\":\"企业在基本医疗保险的基础上，为员工缴纳的额外补充医疗保险。\",\"isFixed\":0,\"isPlus\":0,\"isTax\":0,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1256\",\"code\":170101,\"parentCode\":170,\"name\":\"商业保险金\",\"remarks\":\"商业保险金不参与计算，但要计税\",\"isFixed\":0,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1257\",\"code\":180101,\"parentCode\":180,\"name\":\"加班工资\",\"remarks\":\"按一定的比例，按加班时长计算加班工资\",\"isFixed\":1,\"isPlus\":1,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1258\",\"code\":190101,\"parentCode\":190,\"name\":\"迟到扣款\",\"remarks\":\"员工无故迟到，需扣除一定的工资作为惩戒\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1259\",\"code\":190102,\"parentCode\":190,\"name\":\"早退扣款\",\"remarks\":\"员工无故早退，需扣除一定的工资作为惩戒\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1260\",\"code\":190103,\"parentCode\":190,\"name\":\"旷工扣款\",\"remarks\":\"员工无故旷工，需扣除一定的工资作为惩戒\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1261\",\"code\":190104,\"parentCode\":190,\"name\":\"假期扣款\",\"remarks\":\"员工因请事假、病假等，工作日未能到岗，需扣除一定的工资\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1262\",\"code\":190105,\"parentCode\":190,\"name\":\"缺卡扣款\",\"remarks\":\"员工无故缺卡，需扣除一定的金额作为惩戒\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1263\",\"code\":190106,\"parentCode\":190,\"name\":\"综合扣款\",\"remarks\":\"按月累计迟到和早退时长或次数，计算的考勤扣款金额\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":1,\"isOpen\":1},{\"optionId\":\"1264\",\"code\":200101,\"parentCode\":200,\"name\":\"考勤扣款合计\",\"remarks\":\"迟到、早退、旷工、缺卡、请假等6中异常考勤的扣款合计\",\"isFixed\":1,\"isPlus\":0,\"isTax\":1,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1265\",\"code\":210101,\"parentCode\":210,\"name\":\"应发工资\",\"remarks\":\"应发工资=员工工资总额-请假扣款-考勤扣款等\",\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1266\",\"code\":220101,\"parentCode\":220,\"name\":\"应税工资\",\"remarks\":\"应税工资=应发工资-个人社保-个人公积金-每月减除费用\",\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1267\",\"code\":230101,\"parentCode\":230,\"name\":\"个人所得税\",\"remarks\":\"根据个税计算规则，计算的每月应缴纳个税\",\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1},{\"optionId\":\"1268\",\"code\":240101,\"parentCode\":240,\"name\":\"实发工资\",\"remarks\":\"员工每月获得的实际收入。\",\"isFixed\":1,\"isPlus\":2,\"isTax\":2,\"isShow\":1,\"isCompute\":0,\"isOpen\":1}]','update',NULL,NULL,'2023-03-07T15:17:37+08:00');
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'salaryConfig','object','薪资配置','{\n\t\"salaryCycleStartDay\": 1,\n\t\"salaryCycleEndDay\": 31,\n\t\"payType\": \"当月\",\n\t\"payDay\": \"发薪日期\",\n\t\"socialSecurityMonthType\": \"1\",\n\t\"salaryStartMonth\": \"2022-03\",\n\t\"socialSecurityStartMonth\": \"2022-01\"\n}','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _constant_ui
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_constant_ui`;
CREATE TABLE `_constant_ui` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `constantKey` varchar(255) DEFAULT NULL,
  `constantType` varchar(255) DEFAULT NULL COMMENT '常量类型; object, array',
  `pageId` varchar(255) DEFAULT 'all' COMMENT '页面id',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `en` text COMMENT '常量内容; object, array',
  `zh` text COMMENT '常量内容; object, array',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `pageId_constantKey_unique` (`constantKey`, `pageId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 COMMENT = '常量表;';



INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'header','object','all',NULL,'{\n    \"logo\": \"/logo.png\",\n    \"menuList\":\n    [\n        {\n            \"title\": \"首页\",\n            \"path\": \"/\",\n            \"dropdown\": false\n        },\n        {\n            \"title\": \"俱乐部介绍\",\n            \"path\": \"/foison/page/xfPage/5735\",\n            \"dropdown\": false\n        },\n        {\n            \"title\": \"风神资讯\",\n            \"path\": \"/foison/page/xfPage/5734\",\n            \"dropdown\": true,\n            \"children\":\n            [\n                {\n                    \"title\": \" 全部资讯\",\n                    \"path\": \"/foison/page/xfPage/5734\"\n                },\n                {\n                    \"title\": \"一季一会\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10000&categoryName=一季一会\"\n                },\n                {\n                    \"title\": \"会员臻享\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10001&categoryName=会员臻享\"\n                },\n                {\n                    \"title\": \"承办赛事\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10002&categoryName=承办赛事\"\n                },\n                {\n                    \"title\": \"主题活动\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10004&categoryName=主题活动\"\n                },\n                {\n                    \"title\": \"青少年球队捷报\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10005&categoryName=青少年球队捷报\"\n                }\n            ]\n        },\n        {\n            \"title\": \"乐享高尔夫\",\n            \"path\": \"/foison/page/xfPage/5733\",\n            \"dropdown\": true,\n            \"children\":\n            [\n                {\n                    \"title\": \"24小时约球\",\n                    \"path\": \"/foison/page/xfPage/5733\"\n                },\n                {\n                    \"title\": \"哈沃斯球场 \",\n                    \"path\": \"/foison/page/xfPage/5721\"\n                },\n                {\n                    \"title\": \"戴伊球场 \",\n                    \"path\": \"/foison/page/xfPage/5738\"\n                },\n                {\n                    \"title\": \"训练中心\",\n                    \"path\": \"/foison/page/xfPage/5722\"\n                }\n            ]\n        },\n        {\n            \"title\": \"会籍尊享\",\n            \"path\": \"/foison/page/xfPage/5729\"\n        },\n        {\n            \"title\": \"宴会&婚礼\",\n            \"path\": \"/foison/page/xfPage/5728\"\n        },\n        {\n            \"title\": \"人才招聘\",\n            \"path\": \"/foison/page/xfPage/5730\"\n        },\n        {\n            \"title\": \"联系我们\",\n            \"path\": \"/foison/page/xfPage/5731\",\n            \"dropdown\": false\n        }\n    ],\n    \"isMedia\": false,\n    \"isLanguage\": true\n}','{\n    \"logo\": \"/logo.png\",\n    \"menuList\":\n    [\n        {\n            \"title\": \"首页\",\n            \"path\": \"/\",\n            \"dropdown\": false\n        },\n        {\n            \"title\": \"俱乐部介绍\",\n            \"path\": \"/foison/page/xfPage/5735\",\n            \"dropdown\": false\n        },\n        {\n            \"title\": \"风神资讯\",\n            \"path\": \"/foison/page/xfPage/5734\",\n            \"dropdown\": true,\n            \"children\":\n            [\n                {\n                    \"title\": \" 全部资讯\",\n                    \"path\": \"/foison/page/xfPage/5734\"\n                },\n                {\n                    \"title\": \"一季一会\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10000&categoryName=一季一会\"\n                },\n                {\n                    \"title\": \"会员臻享\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10001&categoryName=会员臻享\"\n                },\n                {\n                    \"title\": \"承办赛事\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10002&categoryName=承办赛事\"\n                },\n                {\n                    \"title\": \"主题活动\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10004&categoryName=主题活动\"\n                },\n                {\n                    \"title\": \"青少年球队捷报\",\n                    \"path\": \"/foison/page/xfPage/5734?categoryId=10005&categoryName=青少年球队捷报\"\n                }\n            ]\n        },\n        {\n            \"title\": \"乐享高尔夫\",\n            \"path\": \"/foison/page/xfPage/5733\",\n            \"dropdown\": true,\n            \"children\":\n            [\n                {\n                    \"title\": \"24小时约球\",\n                    \"path\": \"/foison/page/xfPage/5733\"\n                },\n                {\n                    \"title\": \"哈沃斯球场 \",\n                    \"path\": \"/foison/page/xfPage/5721\"\n                },\n                {\n                    \"title\": \"戴伊球场 \",\n                    \"path\": \"/foison/page/xfPage/5738\"\n                },\n                {\n                    \"title\": \"训练中心\",\n                    \"path\": \"/foison/page/xfPage/5722\"\n                }\n            ]\n        },\n        {\n            \"title\": \"会籍尊享\",\n            \"path\": \"/foison/page/xfPage/5729\"\n        },\n        {\n            \"title\": \"宴会&婚礼\",\n            \"path\": \"/foison/page/xfPage/5728\"\n        },\n        {\n            \"title\": \"人才招聘\",\n            \"path\": \"/foison/page/xfPage/5730\"\n        },\n        {\n            \"title\": \"联系我们\",\n            \"path\": \"/foison/page/xfPage/5731\",\n            \"dropdown\": false\n        }\n    ],\n    \"isMedia\": false,\n    \"isLanguage\": true\n}','jhUpdate','admin','武林盟主','2022-11-15T13:56:14+08:00');
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'resource','object','all',NULL,'{\"version\": \"1.0.6\"}','{\"version\": \"1.0.6\"}','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,'body','object','home','首页说明文字','{ \n  \"title\": \"<span class=\'jianghu-home-hero-accent\'>Progressive</span></br>Enterprise Framework</p>\", \n  \"desc\": \"beginners will enjoy learning and using\",\n\t\"btnGettingStarted\": \"Getting Started\"\n}','{\"title\": \"<span class=\'jianghu-home-hero-accent\'>渐进式</span></br>企业级框架</p>\", \"desc\": \"构建短平快的新手学习路径，掌握企业级应用开发的整体知识体系\", \"btnGettingStarted\": \"开始使用\"}','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (11,'features','array','home',NULL,'[{\r\n\t\"title\": \"learn enterprise application development\\n the overall framework\",\r\n\t\"content\": \"start with the overall framework，easy for beginners to learn，grasp the core concepts，improve learning and development efficiency。\",\r\n\t\"img\": \"/images/home/icon-3.png\"\r\n}, {\r\n\t\"title\": \"build the shortest learning path\",\r\n\t\"content\": \"learn what you need，put aside what you dont，bulid the shortest lerning path for enterprise application development。\",\r\n\t\"img\": \"/images/home/icon-4.png\"\r\n}, {\r\n\t\"title\": \"jianghu scaffold \\n quick page generation\",\r\n\t\"content\": \"integrate scaffold jianghu-init，It can be used to quickly build frameworks, pages, management, and other business components。\",\r\n\t\"img\": \"/images/home/icon-2.png\"\r\n}, {\r\n\t\"title\": \"Based on lake JS ecology \\n Out of the box application\",\r\n\t\"content\": \"jianghuJS、duoxing-IM、xuanfeng-Content management、wulin live classroom、training、IT primary programming training。\",\r\n\t\"img\": \"/images/home/icon-1.png\"\r\n}]','[{\r\n\t\"title\": \"掌握企业级应用开发的整体知识体系\",\r\n\t\"content\": \"先从企业级应用开发的整体入手，提取核心概念与关联，便于新手学习，提升学习与开发效率。\",\r\n\t\"img\": \"/images/home/icon-3.png\"\r\n}, {\r\n\t\"title\": \"尽全力地构建短平快的新手学习路径\",\r\n\t\"content\": \"参考实际开发经验，用到的学，不用的先放一放，构建开发企业级应用的短平快的学习路径。\",\r\n\t\"img\": \"/images/home/icon-4.png\"\r\n}, {\r\n\t\"title\": \"江湖脚手架，快速生成组件，页面与项目\",\r\n\t\"content\": \"jianghu-init，可用于快速构建组件，页面与项目，并且能够方便地继续进行的调整与开发\",\r\n\t\"img\": \"/images/home/icon-2.png\"\r\n}, {\r\n\t\"title\": \"基于江湖JS生态，开箱即用的江湖应用\",\r\n\t\"content\": \"多星-即时通讯、旋风-内容管理、武林-直播课堂、飞鸽-客服系统等。\",\r\n\t\"img\": \"/images/home/icon-1.png\"\r\n}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (12,'links','array','all',NULL,'[{\r\n\t\"label\": \"Reference\",\r\n\t\"list\": [{\r\n\t\t\"title\": \"EggJS\",\r\n\t\t\"path\": \"https://www.eggjs.org/\"\r\n\t}, {\r\n\t\t\"title\": \"CNode\",\r\n\t\t\"path\": \"https://cnodejs.org/\"\r\n\t}]\r\n}, {\r\n\t\"label\": \"jianghu application\",\r\n\t\"list\": [{\r\n\t\t\"title\": \"jianghuJS\",\r\n\t\t\"path\": \"/page/article/10005\"\r\n\t}, {\r\n\t\t\"title\": \"duoxing-instant message\",\r\n\t\t\"path\": \"/page/article/10016\"\r\n\t}, {\r\n\t\t\"title\": \"xuanfeng content management\",\r\n\t\t\"path\": \"/page/article/10075\"\r\n\t}, {\r\n\t\t\"title\": \"wulin live classroom\",\r\n\t\t\"path\": \"/page/article/10076\"\r\n\t}]\r\n}, {\r\n\t\"label\": \"community\",\r\n\t\"list\": [{\r\n\t\t\"title\": \"CNode commuinty\",\r\n\t\t\"path\": \"https://cnodejs.org/\"\r\n\t}, {\r\n\t\t\"title\": \"BBS\",\r\n\t\t\"path\": \"\"\r\n\t}, {\r\n\t\t\"title\": \"submit feedback\",\r\n\t\t\"path\": \"\"\r\n\t}, {\r\n\t\t\"title\": \"release the log\",\r\n\t\t\"path\": \"\"\r\n\t}]\r\n}, {\r\n\t\"label\": \"take part in the discussion\",\r\n\t\"img\": \"OR code link\"\r\n}]','[{\r\n\t\"label\": \"参考\",\r\n\t\"list\": [{\r\n\t\t\"title\": \"EggJS\",\r\n\t\t\"path\": \"https://www.eggjs.org/\"\r\n\t}, {\r\n\t\t\"title\": \"Knex\",\r\n\t\t\"path\": \"http://knexjs.org/\"\r\n\t}, {\n\t\t\"title\": \"SocketIO\",\n\t\t\"path\": \"https://socket.io/\"\n\t}]\r\n}, {\r\n\t\"label\": \"江湖应用\",\r\n\t\"list\": [{\r\n\t\t\"title\": \"江湖JS\",\r\n\t\t\"path\": \"/page/article/10005\"\r\n\t}, {\r\n\t\t\"title\": \"多星-即时通讯\",\r\n\t\t\"path\": \"/page/article/10118\"\r\n\t}, {\r\n\t\t\"title\": \"旋风-内容管理\",\r\n\t\t\"path\": \"/page/article/10075\"\r\n\t}, {\r\n\t\t\"title\": \"武林-直播课堂\",\r\n\t\t\"path\": \"/page/article/10076\"\r\n\t}]\r\n}, {\r\n\t\"label\": \"社区\",\r\n\t\"list\": [{\r\n\t\t\"title\": \"论坛\",\r\n\t\t\"path\": \"\"\r\n\t}, {\r\n\t\t\"title\": \"提交反馈\",\r\n\t\t\"path\": \"\"\r\n\t}, {\r\n\t\t\"title\": \"发布日志\",\r\n\t\t\"path\": \"\"\r\n\t}]\r\n}, {\r\n\t\"label\": \"参与讨论\",\r\n\t\"img\": \"二维码链接\"\r\n}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (13,'footer','object','all','','{ \"copyright\": \"Copyright © 2022 openjianghu.org\" }','{\"footerTitle\":\"联系我们 \",\"tel1\":\"预订热线：020-8968 3888\",\"tel2\":\"会籍专线：020-8968 3899\",\"tel3\":\"招聘热线：189 2622 8831\",\"tel4\":\"商务合作：189 2622 8827\",\"tel5\":\"会籍专线：020-8968 3899\",\"add\":\"广州市花都区汽车城风神大道转岭东路39号\",\"wechat1\":\"风神高尔夫<br>俱乐部官方微信\",\"wechat2\":\"风神高尔夫<br>训练中心官方微信\",\"wechat3\":\"畅享<br>24小时快速约球\",\"img1\":\"/materialRepo/image/5733-modeList-1-ewm.png\",\"img2\":\"/materialRepo/image/5733-modeList-2-ewm.png\",\"img3\":\"/materialRepo/image/24h_appointment.png\",\"link\":\"相关链接\",\"url\":\"http://www.foisongroup.com/index.html\",\"name\":\"风神集团 \"}','jhUpdate','beibei','贝贝','2022-12-15T14:50:24+08:00');
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (20,'article','object','article',NULL,'{\"comment\": {\"isOpen\": false}}','{\"comment\": {\"isOpen\": true}}','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (21,'errorInfo','object','all','错误信息','{\"title\": \"Error\", \"contentEnum\": { \"article_not_found\": \"Article not found\" } }','{\"title\": \"错误\", \"contentEnum\": { \"article_not_found\": \"文章找不到\" } }','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (22,'button','object','all','按钮','{\"add\": \"Add\", \"edit\": \"Edit\",\"login\":\"Login\",\"changePassword\":\"Change Password\",\"logout\":\"Logout\",\"manage\":\"Manage\",\"visitor\":\"Visitor\",\"homeTitle\":\"Home\",\"oldPassword\":\"Old Password\",\"newPassword\":\"New Password\",\"newPasswordAgain\":\"New Password Again\",\"cancel\":\"Cancel\",\"modify\":\"Modify\",\"search\":\"Search\",\"rememberPassword\":\"Remember password\",\"password\":\"password\",\"account\":\"account\",\"loginSuc\":\"Login Success\"}','{\"add\": \"新增\", \"edit\": \"编辑\",\"login\":\"登录\",\"changePassword\":\"修改密码\",\"logout\":\"退出登录\",\"manage\":\"管理后台\",\"visitor\":\"游客\",\"homeTitle\":\"首页\",\"oldPassword\":\"原密码\",\"newPassword\":\"新密码\",\"newPasswordAgain\":\"再次确认新密码\",\"cancel\":\"取消\",\"modify\":\"修改\",\"search\":\"搜索\",\"rememberPassword\":\"记住密码\",\"password\":\"密码\",\"account\":\"账号\",\"loginSuc\":\"登录成功\"}','insert',NULL,NULL,NULL);
INSERT INTO `_constant_ui` (`id`,`constantKey`,`constantType`,`pageId`,`desc`,`en`,`zh`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (24,'template','object','home',NULL,NULL,NULL,'insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_group`;
CREATE TABLE `_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` varchar(255) NOT NULL COMMENT 'groupId',
  `groupName` varchar(255) DEFAULT NULL COMMENT '群组名',
  `groupDesc` varchar(255) DEFAULT NULL COMMENT '群组描述',
  `groupAvatar` varchar(255) DEFAULT NULL COMMENT '群logo',
  `groupExtend` varchar(1024) DEFAULT '{}' COMMENT '拓展字段; { groupNotice: ''xx'' }',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `groupId_index` (`groupId`) USING BTREE
) ENGINE = InnoDB COMMENT = '群组表; 软删除未启用;';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_page`;
CREATE TABLE `_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT 'pageId',
  `pageName` varchar(255) DEFAULT NULL COMMENT 'page name',
  `pageHook` varchar(1000) DEFAULT NULL,
  `pageFile` varchar(255) DEFAULT NULL COMMENT 'page文件指定; 默认使用pageId.html',
  `pageType` varchar(255) DEFAULT NULL COMMENT '页面类型; showInMenu, dynamicInMenu',
  `sort` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 COMMENT = '页面表; 软删除未启用;';



INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助',NULL,'helpV4','dynamicInMenu','11','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆',NULL,'loginV4','','','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (29,'employeeManagement','[员工组织]员工管理',NULL,NULL,'showInMenu','2','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (30,'memberOrgRoleManagement','[员工组织]员工组织管理',NULL,NULL,'showInMenu','4','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'performanceManagement','[绩效]考核管理(开发中)',NULL,NULL,'showInMenu','15','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (32,'appraisalPlanManagement','[绩效]考核计划 (开发中)',NULL,NULL,'showInMenu','16','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (33,'archivesSetup','[绩效]绩效档案(开发中)',NULL,NULL,'showInMenu','17','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (35,'clockManagement','[绩效]考勤管理(开发中)',NULL,NULL,'showInMenu','18','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (37,'insuranceSchemeSetup','[社保]社保方案',NULL,NULL,'showInMenu','8','update','vscode','vscode','2022-11-14T21:19:59+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (38,'salaryGroupManagement','[薪资]薪资组',NULL,'salary/salaryGroupManagement','showInMenu','9','update','vscode','vscode','2022-11-15T10:29:48+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (39,'salaryTaxRuleManagement','[薪资]计薪规则',NULL,'salary/salaryTaxRuleManagement','showInMenu','10','update','vscode','vscode','2022-11-15T11:01:29+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'workbench','工作台',NULL,NULL,'showInMenu','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,'jobPostingsManagement','[招聘]招聘职位管理',NULL,'job/jobPostingsManagement','showInMenu','5','insert','insert',NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (44,'jobResumeManagement','[招聘]投递简历列表',NULL,'job/jobResumeManagement','showInMenu','5','insert','insert',NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (46,'jobResumePreview','简历预览',NULL,'job/jobResumePreview','dynamicInMenu',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (47,'insuranceSchemeDetail','[社保]月社保详情',NULL,NULL,'dynamicInMenu',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (48,'insuranceSchemeManagement','[社保]社保管理',NULL,NULL,'showInMenu','5','update','vscode','vscode','2022-11-08T09:57:49+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (49,'archivesManagement','[薪资]薪资档案',NULL,'salary/archivesManagement','showInMenu','4','update','vscode','vscode','2022-11-10T22:42:17+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (50,'monthEmpRecord','[薪资]薪资管理',NULL,'salary/monthEmpRecord','showInMenu','11','update','vscode','vscode','2022-11-22T15:58:21+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (51,'salarySlipManagement','[薪资]发放记录2',NULL,'salary/salarySlipManagement','dynamicInMenu','8','update','vscode','vscode','2022-11-23T16:29:41+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (52,'slipRecordManagement','[薪资]发放记录',NULL,'salary/slipRecordManagement','showInMenu','2','update','vscode','vscode','2022-11-23T16:29:51+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (53,'jobs','[招聘]招聘列表-web','{\n  \"beforeHook\":[\n    {\"field\": \"constantUiMap\", \"service\": \"constantUi\", \"serviceFunc\": \"getConstantUiMap\"},\n\t\t{\"field\": \"userInfo\", \"service\": \"user\", \"serviceFunc\": \"userInfo\"},\n\t\t{\"field\": \"jobList\", \"service\": \"job\", \"serviceFunc\": \"list\"},\n\t\t{\"field\": \"hotJobList\", \"service\": \"job\", \"serviceFunc\": \"hotList\"}\n  ]\n}','job/jobs','showInMenu','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (54,'detail','[招聘]岗位详情-web','{\n  \"beforeHook\":[\n    {\"field\": \"constantUiMap\", \"service\": \"constantUi\", \"serviceFunc\": \"getConstantUiMap\"},\n\t\t{\"field\": \"userInfo\", \"service\": \"user\", \"serviceFunc\": \"userInfo\"},\n\t\t{\"field\": \"job\", \"service\": \"job\", \"serviceFunc\": \"detail\"}\n  ]\n}','job/detail','seo','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (55,'form','[招聘]填写简历-web',NULL,'job/form','seo','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (56,'jobResumeOfJobPosition','[招聘]招聘职位的候选人',NULL,'job/jobResumeOfJobPosition','dynamicInMenu','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageHook`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (57,'employeeDepartApproved','[员工组织]员工离职批准',NULL,NULL,'showInMenu','3','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text NOT NULL COMMENT '数据JSON',
  `packageContent` text NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_record_id` (`recordId`) USING BTREE,
  KEY `index_table_action` (`table`, `operation`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 547 COMMENT = '数据历史表';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_resource`;
CREATE TABLE `_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accessControlTable` varchar(255) DEFAULT NULL COMMENT '数据规则控制表',
  `resourceHook` text COMMENT '[ "before": {"service": "xx", "serviceFunction": "xxx"}, "after": [] }',
  `pageId` varchar(255) DEFAULT NULL COMMENT 'page id; E.g: index',
  `actionId` varchar(255) DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `resourceType` varchar(255) DEFAULT NULL COMMENT 'resource 类型; E.g: auth service sql',
  `appDataSchema` text COMMENT 'appData 参数校验',
  `resourceData` text COMMENT 'resource 数据; { "service": "auth", "serviceFunction": "passwordLogin" } or  { "table": "${tableName}", "action": "select", "whereCondition": ".where(function() {this.whereNot( { recordStatus: \\"active\\" })})" }',
  `requestDemo` text COMMENT '请求Demo',
  `responseDemo` text COMMENT '响应Demo',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 506 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';



INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"passwordLogin\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"logout\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"userInfo\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (258,NULL,NULL,'allPage','getConstantList','✅查询常量','sql','{}','{ \"table\": \"_constant\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (317,NULL,NULL,'employeeManagement','selectItemList','✅员工管理-查询列表','sql','{}','{ \"table\": \"view01_employee\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (318,NULL,'{ \"before\": [{\"service\": \"employee\", \"serviceFunction\": \"addEmployeeInsertBeforeHook\"}]}','employeeManagement','insertItem','✅员工管理-添加成员','sql','{}','{ \"table\": \"employee\", \"operation\": \"jhInsert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (319,NULL,NULL,'employeeManagement','updateItem','✅员工管理-更新成员','sql','{}','{ \"table\": \"employee\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (320,NULL,NULL,'employeeManagement','deleteItem','✅员工管理-删除信息','sql','{}','{ \"table\": \"employee\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (321,NULL,NULL,'employeeManagement','getEmployeeField','✅员工管理-获取自定义字段','sql','{}','{ \"table\": \"employee_field\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (322,NULL,NULL,'employeeManagement','getStatusCount','✅员工管理-状态统计','service','{}','{ \"service\": \"employee\", \"serviceFunction\": \"getStatusCount\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (323,NULL,NULL,'employeeManagement','getInsuranceScheme','✅员工管理-查询社保方案','sql','{}','{ \"table\": \"view01_insurance_month\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (324,NULL,NULL,'employeeManagement','insuranceSave','✅员工管理-修改参保方案','sql','{}','{ \"table\": \"employee_social_security_info\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (325,NULL,'{ \"before\": [{\"service\": \"employee\", \"serviceFunction\": \"quitInsertBeforeHook\"}], \"after\": [\n{\"service\": \"employee\", \"serviceFunction\": \"quitAfterHook\"}\n] }','employeeManagement','quitInfoSave','✅员工管理-办理离职','sql','{}','{ \"table\": \"employee_quit_info\", \"operation\": \"jhInsert\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (326,NULL,'{ \"before\": [{\"service\": \"employee\", \"serviceFunction\": \"changeInsertBeforeHook\"}], \"after\": [\n{\"service\": \"employee\", \"serviceFunction\": \"changeAfterHook\"}\n] }','employeeManagement','changeSave','✅员工管理-调整部门/岗位、晋升/降级','sql','{}','{ \"table\": \"employee_change_record\", \"operation\": \"jhInsert\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (327,NULL,NULL,'employeeManagement','getDept','✅员工管理-查询部门','sql','{}','{ \"table\": \"org\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (328,NULL,NULL,'employeeManagement','getEmployee','✅员工管理-查询员工','sql','{}','{ \"table\": \"view01_employee\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (329,NULL,'{ \"before\": [{\"service\": \"employee\", \"serviceFunction\": \"addEmployeeInsertBeforeHook\"}]}','employeeManagement','addEmployeeSave','✅员工管理-新建员工','sql','{}','{ \"table\": \"employee\", \"operation\": \"jhInsert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (330,NULL,NULL,'employeeManagement','getAdminUser','✅员工管理-查询系统用户','sql','{}','{ \"table\": \"admin_user\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (331,NULL,NULL,'employeeManagement','getExcelData','✅员工管理-导出','service','{}','{ \"service\": \"employee\", \"serviceFunction\": \"getExcelData\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (332,NULL,NULL,'employeeManagement','uploadItem','✅员工管理-导入','service','{}','{ \"service\": \"employee\", \"serviceFunction\": \"uploadItem\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (365,NULL,NULL,'orgManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"org\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (366,NULL,NULL,'orgManagement','insertItem','✅添加','service','{}','{\"service\": \"org\", \"serviceFunction\": \"insertItem\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (367,NULL,NULL,'orgManagement','updateItem','✅更新','service','{}','{\"service\": \"org\", \"serviceFunction\": \"updateItem\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (368,NULL,NULL,'orgManagement','deleteItem','✅删除','service','{}','{\"service\": \"org\", \"serviceFunction\": \"deleteItem\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (369,NULL,NULL,'memberOrgRoleManagement','selectItemList','✅查询组织下所有成员','service','{}','{\"service\": \"member\", \"serviceFunction\": \"selectMemberFromOgrId\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (370,NULL,NULL,'memberOrgRoleManagement','deleteItem','✅删除组织成员','sql','{}','{ \"table\": \"member_org_role\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (371,NULL,NULL,'memberOrgRoleManagement','batchAddMemberOrgRole','✅批量添加组织成员','service','{}','{ \"service\": \"org\", \"serviceFunction\": \"batchAddMemberOrgRole\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (372,NULL,NULL,'memberOrgRoleManagement','updateItem','✅更新成员组织','sql','{}','{ \"table\": \"member_org_role\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (373,NULL,NULL,'memberOrgRoleManagement','selectItem','✅查询组织成员','sql','{}','{ \"table\": \"view01_member_org_role\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (374,NULL,NULL,'appraisalPlanManagement','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"achievement_appraisal\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (375,NULL,NULL,'archivesSetup','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"achievement_employee_appraisal\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (376,NULL,NULL,'studentManagement','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"student\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (377,NULL,NULL,'studentManagement','insertItem','✅服务端查询-添加成员','sql','{}','{ \"table\": \"student\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (378,NULL,NULL,'studentManagement','updateItem','✅服务端查询-更新成员','sql','{}','{ \"table\": \"student\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (379,NULL,NULL,'studentManagement','deleteItem','✅服务端查询-删除信息','sql','{}','{ \"table\": \"student\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (380,NULL,NULL,'clockManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"view01_attendance_clock\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (381,NULL,NULL,'clockManagement','insertItem','✅添加','sql','{}','{ \"table\": \"attendance_clock\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (382,NULL,NULL,'clockManagement','updateItem','✅更新','sql','{}','{ \"table\": \"attendance_clock\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (383,NULL,NULL,'clockManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"attendance_clock\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (384,NULL,NULL,'studentManagement','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"student\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (385,NULL,NULL,'studentManagement','insertItem','✅服务端查询-添加成员','sql','{}','{ \"table\": \"student\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (386,NULL,NULL,'studentManagement','updateItem','✅服务端查询-更新成员','sql','{}','{ \"table\": \"student\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (387,NULL,NULL,'studentManagement','deleteItem','✅服务端查询-删除信息','sql','{}','{ \"table\": \"student\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (388,NULL,'{\"before\":[],\"after\":[{\"service\":\"insurance\",\"serviceFunction\":\"afterSchemeAppendProjectHook\"}]}','insuranceSchemeSetup','selectItemList','✅查询列表','sql','{}','{ \"table\": \"insurance_scheme\", \"operation\": \"select\" }','','','update','vscode','vscode','2022-11-14T22:40:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (389,NULL,'{\"before\":[{\"service\":\"insurance\",\"serviceFunction\":\"beforeCreateSchemeIdHook\"}],\"after\":[]}','insuranceSchemeSetup','insertItem','✅添加','sql','{}','{ \"table\": \"insurance_scheme\", \"operation\": \"insert\" }','','','update','vscode','vscode','2022-11-14T22:40:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (390,NULL,NULL,'insuranceSchemeSetup','updateItem','✅更新','sql','{}','{ \"table\": \"insurance_scheme\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-14T22:40:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (391,NULL,NULL,'insuranceSchemeSetup','deleteItem','✅删除','sql','{}','{ \"table\": \"insurance_scheme\", \"operation\": \"jhDelete\" }','','','update','vscode','vscode','2022-11-14T22:40:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (392,NULL,NULL,'salaryGroupManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"salary_group\", \"operation\": \"select\" }','','','update','vscode','vscode','2022-11-15T10:48:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (393,NULL,'{\"before\":[{\"service\":\"salary\",\"serviceFunction\":\"beforeInsertSalaryGroupHook\"}],\"after\":[]}','salaryGroupManagement','insertItem','✅添加','sql','{}','{ \"table\": \"salary_group\", \"operation\": \"insert\" }','','','update','vscode','vscode','2022-11-15T10:48:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (394,NULL,NULL,'salaryGroupManagement','updateItem','✅更新','sql','{}','{ \"table\": \"salary_group\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-15T10:48:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (395,NULL,NULL,'salaryGroupManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_group\", \"operation\": \"jhDelete\" }','','','update','vscode','vscode','2022-11-15T10:48:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (396,NULL,NULL,'salaryGroupManagement','getSalaryTaxRuleList','✅查询-查询列表','sql',NULL,'{\"table\":\"salary_tax_rule\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-15T10:48:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (397,NULL,NULL,'salaryTaxRuleManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"salary_tax_rule\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (398,NULL,NULL,'salaryTaxRuleManagement','insertItem','✅添加','sql','{}','{ \"table\": \"salary_tax_rule\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (399,NULL,NULL,'salaryTaxRuleManagement','updateItem','✅更新','sql','{}','{ \"table\": \"salary_tax_rule\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (400,NULL,NULL,'salaryTaxRuleManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_tax_rule\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (401,NULL,NULL,'candidateManagement','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"recruit_candidate\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (402,NULL,NULL,'recruitPpostManagement','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"recruit_post\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (403,NULL,NULL,'employeeManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"employee\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (404,NULL,'{ \"before\": [{\"service\": \"employee\", \"serviceFunction\": \"addEmployeeInsertBeforeHook\"}]}','employeeManagement','insertItem','✅添加','sql','{}','{ \"table\": \"employee\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (405,NULL,NULL,'employeeManagement','updateItem','✅更新','sql','{}','{ \"table\": \"employee\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (406,NULL,NULL,'employeeManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"employee\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (408,NULL,NULL,'jobPostingsManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"job_postings\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (409,NULL,'{\"after\": [], \"before\": [{\"service\": \"job\", \"serviceFunction\": \"beforHookForGenerateJobId\"}]}','jobPostingsManagement','insertItem','✅添加','sql','{}','{ \"table\": \"job_postings\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (410,NULL,NULL,'jobPostingsManagement','updateItem','✅更新','sql','{}','{ \"table\": \"job_postings\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (411,NULL,NULL,'jobPostingsManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"job_postings\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (412,NULL,NULL,'jobResumeManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"job_resume\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (413,NULL,NULL,'jobResumeManagement','selectJobList','✅添加','sql','{}','{ \"table\": \"job_postings\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (414,NULL,NULL,'jobResumeManagement','updateItem','✅更新','sql','{}','{ \"table\": \"job_resume\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (415,NULL,NULL,'jobResumeManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"job_resume\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (416,NULL,NULL,'jobResumePreview','getResumeData','✅查询简历','sql',NULL,'{ \"table\": \"job_resume\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (417,NULL,'{\"after\":[{\"service\":\"insurance\",\"serviceFunction\":\"checkNewMonthRecord\"}]}','insuranceSchemeManagement','selectItemList','✅查询列表','sql','{}','{\"table\":\"view01_insurance_month\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:29:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (418,NULL,NULL,'insuranceSchemeManagement','insertMonthRecord','✅添加','service','{}','{\"service\":\"insurance\",\"serviceFunction\":\"insertMonthRecord\"}','','','update','vscode','vscode','2022-11-10T15:29:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (419,NULL,NULL,'insuranceSchemeManagement','updateItem','✅更新','sql','{}','{ \"table\": \"insurance_month_emp_record\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-10T15:29:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (420,NULL,'{\"before\":[{\"service\":\"insurance\",\"serviceFunction\":\"beforeCheckDelMonthRecord\"}],\"after\":[{\"service\":\"insurance\",\"serviceFunction\":\"afterDelEmpRecord\"}]}','insuranceSchemeManagement','deleteItem','✅删除','sql','{}','{\"table\":\"insurance_month_record\",\"operation\":\"delete\"}','','','update','vscode','vscode','2022-11-10T15:29:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (421,NULL,NULL,'insuranceSchemeDetail','getMonthRecordInfo','✅查询-查询列表','sql',NULL,'{\"table\":\"insurance_month_record\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (422,NULL,NULL,'insuranceSchemeDetail','getMonthEmpList','✅查询-查询列表','sql',NULL,'{\"table\":\"view01_month_emp_record_detail\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (423,NULL,NULL,'insuranceSchemeDetail','getEmployeeList','✅查询-查询列表','sql',NULL,'{\"table\":\"view01_employee_quit_list\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (424,NULL,'{}','insuranceSchemeDetail','insertEmployeeRecord','✅新增-添加数据','service',NULL,'{\"service\":\"insurance\",\"serviceFunction\":\"insertEmployeeRecord\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (425,NULL,NULL,'insuranceSchemeDetail','getEmpProjectRecordList','✅查询-查询列表','sql',NULL,'{\"table\":\"insurance_month_emp_project_record\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (426,NULL,NULL,'insuranceSchemeDetail','getSchemeList','✅查询-查询列表','sql',NULL,'{\"table\":\"insurance_scheme\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (427,NULL,NULL,'insuranceSchemeDetail','getSchemeProjectList','✅查询-查询列表','sql',NULL,'{\"table\":\"insurance_project\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (428,NULL,NULL,'insuranceSchemeDetail','updateEmpSchemeRecord','✅查询-查询列表','service',NULL,'{\"service\":\"insurance\",\"serviceFunction\":\"updateEmpSchemeRecord\"}','','','update','vscode','vscode','2022-11-10T15:07:51+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (429,NULL,NULL,'monthRecordManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"salary_month_record\", \"operation\": \"select\" }','','','update','vscode','vscode','2022-11-23T16:42:20+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (430,NULL,NULL,'monthRecordManagement','insertItem','✅添加','sql','{}','{ \"table\": \"salary_month_record\", \"operation\": \"insert\" }','','','update','vscode','vscode','2022-11-23T16:42:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (431,NULL,NULL,'monthRecordManagement','updateItem','✅更新','sql','{}','{ \"table\": \"salary_month_record\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-23T16:42:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (432,NULL,NULL,'monthRecordManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_month_record\", \"operation\": \"jhDelete\" }','','','update','vscode','vscode','2022-11-23T16:42:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (433,NULL,'{\"before\":[],\"after\":[{\"service\":\"salary\",\"serviceFunction\":\"afterAppendNewChangeRecordHook\"}]}','archivesManagement','selectItemList','✅查询列表','sql','{}','{\"table\":\"view01_employee_archives\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-12T22:07:01+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (434,NULL,NULL,'archivesManagement','insertItem','✅添加','sql','{}','{ \"table\": \"salary_archives\", \"operation\": \"insert\" }','','','update','vscode','vscode','2022-11-12T22:07:01+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (435,NULL,NULL,'archivesManagement','updateItem','✅更新','sql','{}','{ \"table\": \"salary_archives\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-12T22:07:01+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (436,NULL,NULL,'archivesManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_archives\", \"operation\": \"jhDelete\" }','','','update','vscode','vscode','2022-11-12T22:07:01+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (437,NULL,NULL,'slipTmp','selectItemList','✅查询列表','sql','{}','{\"table\":\"view01_salary_slip_template\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (438,NULL,NULL,'slipTmp','insertItem','✅添加','service','{}','{\"service\":\"salary\",\"serviceFunction\":\"updateSlipOption\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (439,NULL,NULL,'slipTmp','updateItem','✅更新','service','{}','{\"service\":\"salary\",\"serviceFunction\":\"updateSlipOption\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (440,NULL,NULL,'slipTmp','deleteItem','✅删除','service','{}','{\"service\":\"salary\",\"serviceFunction\":\"deleteSlipOption\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (441,NULL,NULL,'archivesManagement','getSalaryOption','✅查询-查询列表','sql',NULL,'{\"table\":\"_constant\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-12T22:07:02+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (442,NULL,NULL,'changeTmp','selectItemList','✅查询列表','sql','{}','{\"table\":\"salary_change_template\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (443,NULL,'{\"before\": [{\"service\": \"salary\", \"serviceFunction\": \"beforeCreateChangeTmpHook\"}]}','changeTmp','insertItem','✅添加','sql','{}','{\"table\":\"salary_change_template\",\"operation\":\"jhInsert\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (444,NULL,NULL,'changeTmp','updateItem','✅更新','sql','{}','{\"table\":\"salary_change_template\",\"operation\":\"jhUpdate\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (445,NULL,NULL,'changeTmp','deleteItem','✅删除','sql','{}','{\"table\":\"salary_change_template\",\"operation\":\"jhDelete\"}','','','update','vscode','vscode','2022-11-11T15:09:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (446,NULL,NULL,'archivesManagement','makeEmployeeArchives','✅定薪','service',NULL,'{\"service\":\"salary\",\"serviceFunction\":\"makeEmployeeArchives\"}','','','update','vscode','vscode','2022-11-12T22:07:02+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (447,NULL,NULL,'archivesManagement','updateEmployeeArchives','✅调薪','service',NULL,'{\"service\":\"salary\",\"serviceFunction\":\"updateEmployeeArchives\"}','','','insert','vscode','vscode','2022-11-12T22:07:02+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (448,NULL,NULL,'changeRecord','selectItemList','✅查询列表','sql','{}','{\"table\":\"salary_change_record\",\"operation\":\"select\"}','','','update','vscode','vscode','2022-11-14T15:25:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (449,NULL,NULL,'changeRecord','insertItem','✅添加','sql','{}','{ \"table\": \"salary_change_record\", \"operation\": \"insert\" }','','','update','vscode','vscode','2022-11-14T15:25:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (450,NULL,NULL,'changeRecord','updateItem','✅更新','sql','{}','{ \"table\": \"salary_change_record\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-14T15:25:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (451,NULL,NULL,'changeRecord','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_change_record\", \"operation\": \"jhDelete\" }','','','update','vscode','vscode','2022-11-14T15:25:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (452,NULL,NULL,'monthEmpRecord','selectItemList','✅查询列表','service','{}','{\"service\":\"salary\",\"serviceFunction\":\"monthEmpRecord\"}','','','update','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (453,NULL,NULL,'monthEmpRecord','insertItem','✅添加','service','{}','{\"service\":\"salary\",\"serviceFunction\":\"createMonthRecord\"}','','','update','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (454,NULL,NULL,'monthEmpRecord','updateItem','✅更新','sql','{}','{ \"table\": \"salary_month_emp_record\", \"operation\": \"jhUpdate\" }','','','update','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (455,NULL,NULL,'monthEmpRecord','deleteItem','✅删除','service','{}','{\"service\":\"salary\",\"serviceFunction\":\"delMonthRecord\"}','','','update','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (456,NULL,NULL,'monthEmpRecord','createMonthRecord','✅核算工资','service',NULL,'{\"service\":\"salary\",\"serviceFunction\":\"createMonthRecord\"}','','','update','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (457,NULL,NULL,'monthEmpRecord','getLastConfig','✅查询-查询列表','service',NULL,'{\"service\":\"salary\",\"serviceFunction\":\"getLastConfig\"}','','','update','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (458,NULL,NULL,'salarySlipManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"salary_slip\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (459,NULL,NULL,'salarySlipManagement','insertItem','✅添加','sql','{}','{ \"table\": \"salary_slip\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (460,NULL,NULL,'salarySlipManagement','updateItem','✅更新','sql','{}','{ \"table\": \"salary_slip\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (461,NULL,NULL,'salarySlipManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_slip\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (462,NULL,NULL,'slipRecordManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"view01_salary_month_record\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (463,NULL,NULL,'slipRecordManagement','insertItem','✅添加','sql','{}','{ \"table\": \"salary_slip_record\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (464,NULL,NULL,'slipRecordManagement','updateItem','✅更新','sql','{}','{ \"table\": \"salary_slip_record\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (465,NULL,NULL,'slipRecordManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"salary_slip_record\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (466,NULL,NULL,'monthEmpRecord','createSlipRecord','✅查询-查询列表','service',NULL,'{\"service\":\"salary\",\"serviceFunction\":\"createSlipRecord\"}','','','insert','vscode','vscode','2022-11-23T15:44:48+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (467,NULL,NULL,'monthRecordManagement','monthEmpRecordByYearMonth','✅查询-查询列表','service',NULL,'{\"service\":\"salary\",\"serviceFunction\":\"monthEmpRecordByYearMonth\"}','','','insert','vscode','vscode','2022-11-23T16:42:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (468,NULL,NULL,'form','getResumeData','✅列表','sql',NULL,'{ \"table\": \"job_resume\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (469,NULL,'{\"after\": [], \"before\": [{\"service\": \"job\", \"serviceFunction\": \"beforHookForGenerateJobResumeId\"}]}','form','submitResume','✅提交','sql',NULL,'{ \"table\": \"job_resume\", \"operation\": \"jhInsert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (470,NULL,NULL,'form','getJobData','✅列表','sql',NULL,'{ \"table\": \"job_postings\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (471,NULL,NULL,'jobResumeOfJobPosition','selectItemList','✅查询列表','sql','{}','{ \"table\": \"view01_job_resume2\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (472,NULL,NULL,'jobResumeOfJobPosition','getStatusCount','✅简历管理-状态统计','sql','{}','{ \"table\": \"view01_job_resume2\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (473,NULL,NULL,'jobResumeOfJobPosition','insertItem','✅添加','sql','{}','{ \"table\": \"job_resume\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (474,NULL,NULL,'jobResumeOfJobPosition','updateItem','✅更新','sql','{}','{ \"table\": \"job_resume\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (475,NULL,NULL,'jobResumeOfJobPosition','deleteItem','✅删除','sql','{}','{ \"table\": \"job_resume\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (486,NULL,NULL,'performanceManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"performance\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (487,NULL,'{ \"before\": [{\"service\": \"performance\", \"serviceFunction\": \"addPerformanceInsertBeforeHook\"}]}','performanceManagement','insertItem','✅添加','sql','{}','{ \"table\": \"performance\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (488,NULL,NULL,'performanceManagement','updateItem','✅更新','sql','{}','{ \"table\": \"performance\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (489,NULL,NULL,'performanceManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"performance\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (490,NULL,NULL,'jobResumeManagement','getStatusCount','✅简历管理-状态统计','service','{}','{ \"service\": \"job\", \"serviceFunction\": \"getStatusCount\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (491,NULL,NULL,'performanceManagement','getEmployeeList','✅查询','sql',NULL,'{ \"table\": \"employee\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (492,NULL,'{ \"before\": [{\"service\": \"employee\", \"serviceFunction\": \"addEmployeeInsertBeforeHook\"}]}','jobResumeOfJobPosition','creatEmployeeItem','✅已入职后创建员工信息','sql','{}','{ \"table\": \"employee\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (493,NULL,NULL,'employeeManagement','getInsuranceList','✅获取社保方案列表','sql',NULL,'{ \"table\": \"insurance_scheme\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (494,NULL,'{ \"before\": [{\"service\": \"performance\", \"serviceFunction\": \"addPerformanceInsertBeforeHook\"}]}','performanceManagement','insertPerformanceRateItem','✅新增评分数据','sql','{}','{ \"table\": \"performance_employee_rate\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (495,NULL,'{ \"after\": [{\"service\": \"job\", \"serviceFunction\": \"afterEmployItemHook\"}]}','jobResumeManagement','employItem','✅录用员工','sql',NULL,'{ \"table\": \"job_resume\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (496,NULL,NULL,'performanceRateManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"performance_employee_rate\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (497,NULL,NULL,'performanceRateManagement','insertItem','✅添加','sql','{}','{ \"table\": \"performance_employee_rate\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (498,NULL,NULL,'performanceRateManagement','updateItem','✅更新','sql','{}','{ \"table\": \"performance_employee_rate\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (499,NULL,NULL,'performanceRateManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"performance_employee_rate\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (500,NULL,'','performanceManagement','insertEndPerformanceItem','✅新增归档数据','sql','{}','{ \"table\": \"performance_result\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (501,NULL,NULL,'performanceManagement','selectResultItemList','✅查询归档数据','sql','{}','{ \"table\": \"performance_result\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (502,NULL,NULL,'performanceResultManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"performance_result\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (503,NULL,NULL,'performanceResultManagement','insertItem','✅添加','sql','{}','{ \"table\": \"performance_result\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (504,NULL,NULL,'performanceResultManagement','updateItem','✅更新','sql','{}','{ \"table\": \"performance_result\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (505,NULL,NULL,'performanceResultManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"performance_result\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_role`;
CREATE TABLE `_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(255) DEFAULT NULL COMMENT 'roleId',
  `roleName` varchar(255) DEFAULT NULL COMMENT 'role name',
  `roleDesc` varchar(255) DEFAULT NULL COMMENT 'role desc',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '角色表; 软删除未启用;';



INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'appAdmin','系统管理员','','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _test_case
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_test_case`;
CREATE TABLE `_test_case` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT '页面Id',
  `testId` varchar(255) DEFAULT NULL COMMENT '测试用例Id; 10000 ++',
  `testName` varchar(255) DEFAULT NULL COMMENT '测试用例名',
  `uiActionIdList` varchar(255) DEFAULT NULL COMMENT 'uiAction列表; 一个测试用例对应多个uiActionId',
  `testOpeartion` text COMMENT '测试用例步骤;',
  `expectedResult` text COMMENT '期望结果',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = '测试用例表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _ui
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_ui`;
CREATE TABLE `_ui` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT 'page id; E.g: index',
  `uiActionType` varchar(255) DEFAULT NULL COMMENT 'ui 动作类型，如：fetchData, postData, changeUi',
  `uiActionId` varchar(255) DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `uiActionConfig` text COMMENT 'ui 动作数据',
  `appDataSchema` text COMMENT 'ui 校验数据',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = 'ui 施工方案';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user`;
CREATE TABLE `_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` varchar(255) DEFAULT NULL COMMENT '自增id; 用于生成userId',
  `userId` varchar(255) DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名(登陆)',
  `clearTextPassword` varchar(255) DEFAULT NULL COMMENT '明文密码',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `md5Salt` varchar(255) DEFAULT NULL COMMENT 'md5Salt',
  `userStatus` varchar(255) DEFAULT 'active' COMMENT '用户账号状态：活跃或关闭',
  `userType` varchar(255) DEFAULT NULL COMMENT '用户类型; staff, student.',
  `config` mediumtext COMMENT '配置信息',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 49 COMMENT = '用户表';



INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,NULL,'admin','系统管理员','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,NULL,'W10001','静静','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_group_role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_group_role`;
CREATE TABLE `_user_group_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL COMMENT '用户id',
  `groupId` varchar(255) NOT NULL COMMENT '群组Id',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `groupId_index` (`groupId`) USING BTREE,
  KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 569 COMMENT = '用户群组角色关联表; 软删除未启用;';



INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (568,'admin','adminGroup','appAdmin','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_group_role_page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_group_role_page`;
CREATE TABLE `_user_group_role_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `page` varchar(255) DEFAULT NULL COMMENT 'pageId id',
  `allowOrDeny` varchar(255) DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '用户群组角色 - 页面 映射表; 软删除未启用;';



INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','public','*','login','allow','登陆页面; 开放所有用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','login','*','help,manual','allow','工具页; 开放给登陆用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'*','login','*','*','allow','所有页面; 开放给登陆用户;','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_group_role_resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_group_role_resource`;
CREATE TABLE `_user_group_role_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `resource` varchar(255) DEFAULT NULL COMMENT 'resourceId 或者 通配符; 通配符: *, !resourceId',
  `allowOrDeny` varchar(255) DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '用户群组角色 - 请求资源 映射表; 软删除未启用;';



INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','public','*','login.passwordLogin','allow','登陆resource, 开放给所有用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','login','*','allPage.*','allow','工具类resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'*','login','*','*','allow','所有resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_session`;
CREATE TABLE `_user_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `userIp` varchar(255) DEFAULT NULL COMMENT '用户ip',
  `userIpRegion` varchar(255) DEFAULT NULL COMMENT '用户Ip区域',
  `userAgent` text COMMENT '请求的 agent',
  `deviceId` varchar(255) DEFAULT NULL COMMENT '设备id',
  `deviceType` varchar(255) DEFAULT 'web' COMMENT '设备类型; flutter, web, bot_databot, bot_chatbot, bot_xiaochengxu',
  `socketStatus` varchar(255) DEFAULT 'offline' COMMENT 'socket状态',
  `authToken` varchar(255) DEFAULT NULL COMMENT 'auth token',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId_index` (`userId`) USING BTREE,
  KEY `userId_deviceId_index` (`userId`, `deviceId`) USING BTREE,
  KEY `authToken_index` (`authToken`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 COMMENT = '用户session表; deviceId 维度;软删除未启用;';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_appraisal
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_appraisal`;
CREATE TABLE `achievement_appraisal` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `appraisalId` int(11) NOT NULL AUTO_INCREMENT,
  `appraisalName` varchar(50) DEFAULT NULL COMMENT '考核名称',
  `cycleType` int(11) DEFAULT NULL COMMENT '1 月 2 季 3 年 4 半年',
  `startTime` date DEFAULT NULL COMMENT '考核开始时间',
  `endTime` date DEFAULT NULL COMMENT '考核结束时间',
  `tableId` int(11) DEFAULT NULL COMMENT '考核表模板id',
  `writtenBy` int(11) DEFAULT '1' COMMENT '考核目标填写人 1 本人',
  `resultConfirmors` varchar(1024) DEFAULT NULL COMMENT '考核结果确认人\n',
  `fullScore` decimal(7, 2) DEFAULT NULL COMMENT '考评总分数',
  `isForce` int(11) DEFAULT NULL COMMENT '是否开启强制分布 1 是 0 否',
  `employeeIds` varchar(1024) DEFAULT NULL COMMENT '考核员工',
  `deptIds` varchar(1024) DEFAULT NULL COMMENT '考核部门',
  `appraisalSteps` int(11) DEFAULT '-1' COMMENT '考核步骤进度',
  `activateSteps` int(11) DEFAULT '-1' COMMENT '进行中步骤进度',
  `status` int(11) DEFAULT '0' COMMENT '绩效状态 0 未开启考核 1 绩效填写中 2 绩效评定中 3 结果确认中 4 归档',
  `isStop` int(11) DEFAULT '0' COMMENT '是否终止 0 否 1 是',
  `stopTime` datetime DEFAULT NULL COMMENT '终止时间',
  `createUserId` bigint(20) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`appraisalId`) USING BTREE
) ENGINE = InnoDB COMMENT = '绩效考核';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_appraisal_evaluators
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_appraisal_evaluators`;
CREATE TABLE `achievement_appraisal_evaluators` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `evaluatorsId` int(11) NOT NULL AUTO_INCREMENT,
  `appraisalId` int(11) NOT NULL COMMENT '考核id',
  `type` int(11) NOT NULL COMMENT '1 员工本人 2 直属上级 3 所在部门负责人 4 上级部门负责人 5 指定目标确认人',
  `employeeId` int(11) DEFAULT NULL COMMENT '指定确认人id',
  `weight` decimal(5, 2) NOT NULL COMMENT '权重',
  `sort` int(11) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`evaluatorsId`) USING BTREE
) ENGINE = InnoDB COMMENT = '考核结果评定人';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_appraisal_score_level
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_appraisal_score_level`;
CREATE TABLE `achievement_appraisal_score_level` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `levelId` int(11) NOT NULL AUTO_INCREMENT,
  `appraisalId` int(11) NOT NULL COMMENT '考核id',
  `levelName` varchar(50) NOT NULL COMMENT '等级名称',
  `minScore` decimal(7, 2) DEFAULT NULL COMMENT '最小分数',
  `maxScore` decimal(7, 2) NOT NULL COMMENT '最大分数',
  `minNum` int(11) NOT NULL COMMENT '最小人数比例',
  `maxNum` int(11) NOT NULL COMMENT '最大人数比例',
  `sort` int(11) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`levelId`) USING BTREE
) ENGINE = InnoDB COMMENT = '考评规则等级';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_appraisal_target_confirmors
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_appraisal_target_confirmors`;
CREATE TABLE `achievement_appraisal_target_confirmors` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `targetConfirmorsId` int(11) NOT NULL AUTO_INCREMENT,
  `appraisalId` int(11) DEFAULT NULL COMMENT '考核id',
  `type` int(11) DEFAULT NULL COMMENT '1 员工本人 2 直属上级 3 所在部门负责人 4 上级部门负责人 5 指定目标确认人',
  `employeeId` int(11) DEFAULT NULL COMMENT '指定确认人id',
  `sort` int(11) DEFAULT NULL COMMENT '步骤号 从小到大',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`targetConfirmorsId`) USING BTREE
) ENGINE = InnoDB COMMENT = '考核目标确认人';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_appraisal
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_appraisal`;
CREATE TABLE `achievement_employee_appraisal` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `employeeAppraisalId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` int(11) NOT NULL COMMENT '员工id',
  `appraisalId` int(11) DEFAULT NULL COMMENT '绩效id',
  `status` int(11) DEFAULT NULL COMMENT '考核状态 1 待填写 2 待目标确认 3 待评定 4 待结果确认 5 终止绩效 6 考核完成',
  `score` double(10, 2) DEFAULT NULL COMMENT '评分',
  `levelId` int(11) DEFAULT NULL COMMENT '考核结果',
  `readStatus` int(11) DEFAULT '0' COMMENT '结果阅读状态 0 未读 1 已读',
  `followUpEmployeeId` int(11) DEFAULT NULL COMMENT '跟进员工id',
  `followSort` int(11) DEFAULT NULL COMMENT '跟进员工排序',
  `createTime` datetime DEFAULT NULL,
  `isDraft` int(11) DEFAULT '0' COMMENT '是否为草稿 0否 1是',
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employeeAppraisalId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工绩效考核';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_evaluato
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_evaluato`;
CREATE TABLE `achievement_employee_evaluato` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `employeeEvaluatoId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeAppraisalId` int(11) DEFAULT NULL COMMENT '员工端考核id',
  `appraisalId` int(11) DEFAULT NULL COMMENT '绩效id',
  `employeeId` int(11) NOT NULL COMMENT '确认人',
  `weight` decimal(5, 2) DEFAULT NULL COMMENT '权重',
  `score` decimal(7, 2) DEFAULT NULL COMMENT '评分',
  `levelId` int(11) DEFAULT NULL COMMENT '考核等级',
  `evaluate` varchar(1024) DEFAULT NULL COMMENT '评语',
  `rejectReason` varchar(1024) DEFAULT NULL COMMENT '驳回原因',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0 待评定 1 已评定',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employeeEvaluatoId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工绩效结果评定表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_evaluato_seg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_evaluato_seg`;
CREATE TABLE `achievement_employee_evaluato_seg` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `employeeEvaluatoSegId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeAppraisalId` int(11) DEFAULT NULL COMMENT '员工端考核id',
  `employeeEvaluatoId` int(11) DEFAULT NULL COMMENT '结果评定id',
  `segId` int(11) DEFAULT NULL COMMENT '考核项id',
  `employeeId` int(11) NOT NULL COMMENT '评定人',
  `score` decimal(7, 2) DEFAULT NULL COMMENT '评分',
  `evaluate` varchar(1024) DEFAULT NULL COMMENT '评语',
  `status` int(11) DEFAULT '1' COMMENT '0 待评定 1 已评定',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employeeEvaluatoSegId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工绩效考核项评定表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_result_confirmors
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_result_confirmors`;
CREATE TABLE `achievement_employee_result_confirmors` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `confirmorsId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` int(11) DEFAULT NULL,
  `appraisalId` int(11) DEFAULT NULL COMMENT '绩效id',
  `status` int(11) DEFAULT '0' COMMENT '0 未确认 1 已确认',
  `sort` int(11) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`confirmorsId`) USING BTREE
) ENGINE = InnoDB COMMENT = '绩效结果确认表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_seg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_seg`;
CREATE TABLE `achievement_employee_seg` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `segId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeAppraisalId` int(11) DEFAULT NULL,
  `tempSegId` int(11) DEFAULT '0' COMMENT '模板考核项id',
  `employeeId` int(11) DEFAULT NULL,
  `segName` varchar(50) DEFAULT NULL COMMENT '考核项名称',
  `value` varchar(255) DEFAULT NULL COMMENT '值',
  `isFixed` int(11) DEFAULT NULL COMMENT '是否固定 1 是 0 否',
  `weight` decimal(5, 2) DEFAULT NULL COMMENT '权重 -1 员工写权重比 0~100',
  `schedule` int(11) DEFAULT '0' COMMENT '目标进度',
  `explainDesc` varchar(1024) DEFAULT NULL COMMENT '完成情况说明',
  `sort` int(11) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`segId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工绩效考核项';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_seg_item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_seg_item`;
CREATE TABLE `achievement_employee_seg_item` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `itemId` int(11) NOT NULL AUTO_INCREMENT,
  `segId` int(11) DEFAULT NULL,
  `tempItemId` int(11) DEFAULT '0' COMMENT '模板考核项id',
  `itemName` varchar(50) DEFAULT NULL COMMENT '选项名称',
  `value` varchar(255) DEFAULT NULL COMMENT '值',
  `sort` int(11) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`itemId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工考核项选项';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_employee_target_confirm
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_employee_target_confirm`;
CREATE TABLE `achievement_employee_target_confirm` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `employeeConfirmId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeAppraisalId` int(11) DEFAULT NULL COMMENT '员工端考核id',
  `appraisalId` int(11) DEFAULT NULL COMMENT '绩效id',
  `employeeId` int(11) NOT NULL COMMENT '确认人',
  `rejectReason` varchar(1024) DEFAULT NULL COMMENT '驳回原因',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0 待确认 1 已确认 2 驳回 ',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employeeConfirmId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工考核目标确认表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_seg
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_seg`;
CREATE TABLE `achievement_seg` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `segId` int(11) NOT NULL AUTO_INCREMENT,
  `tableId` int(11) DEFAULT NULL,
  `segName` varchar(50) DEFAULT NULL COMMENT '考核项名称',
  `isFixed` int(11) DEFAULT NULL COMMENT '是否固定 1 是 0 否',
  `weight` decimal(5, 2) DEFAULT NULL COMMENT '权重 -1 员工写权重比 0~100',
  `sort` int(11) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`segId`) USING BTREE
) ENGINE = InnoDB COMMENT = '绩效考核项模板';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_seg_item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_seg_item`;
CREATE TABLE `achievement_seg_item` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `itemId` int(11) NOT NULL AUTO_INCREMENT,
  `segId` int(11) DEFAULT NULL,
  `itemName` varchar(50) DEFAULT NULL COMMENT '选项名称',
  `sort` int(11) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`itemId`) USING BTREE
) ENGINE = InnoDB COMMENT = '考核项选项';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: achievement_table
# ------------------------------------------------------------

DROP TABLE IF EXISTS `achievement_table`;
CREATE TABLE `achievement_table` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `tableId` int(11) NOT NULL AUTO_INCREMENT,
  `tableName` varchar(50) DEFAULT NULL COMMENT '考核名称',
  `type` int(11) DEFAULT NULL COMMENT '1 OKR模板 2 KPI模板',
  `description` longtext COMMENT '考核表描述',
  `isEmpWeight` int(11) DEFAULT '0' COMMENT '是否员工填写权重 0 否 1 是',
  `status` int(11) DEFAULT '1' COMMENT ' 1 使用 0 删除',
  `createTime` datetime DEFAULT NULL,
  `createUserId` bigint(20) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tableId`) USING BTREE
) ENGINE = InnoDB COMMENT = '绩效考核表模板';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: attendance_clock
# ------------------------------------------------------------

DROP TABLE IF EXISTS `attendance_clock`;
CREATE TABLE `attendance_clock` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `clockId` varchar(255) NOT NULL COMMENT '打卡记录id',
  `clockEmployeeId` varchar(255) DEFAULT NULL,
  `clockTime` varchar(255) NOT NULL COMMENT '打卡时间',
  `clockType` int(11) NOT NULL COMMENT '打卡类型 1 上班打卡 2 下班打卡',
  `attendanceTime` varchar(255) NOT NULL COMMENT '上班日期',
  `type` int(11) NOT NULL DEFAULT '1' COMMENT '打卡类型 1手机端打卡 2手工录入',
  `address` varchar(255) NOT NULL COMMENT '考勤地址',
  `lng` varchar(50) DEFAULT NULL COMMENT '精度',
  `lat` varchar(50) DEFAULT NULL COMMENT '维度',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = '打卡记录表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: employee
# ------------------------------------------------------------

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` varchar(255) DEFAULT NULL COMMENT '员工id',
  `employeeName` varchar(255) DEFAULT NULL COMMENT '员工姓名',
  `idSequence` int(11) DEFAULT NULL COMMENT '员工序号',
  `sex` varchar(255) DEFAULT NULL COMMENT '员工性别',
  `age` int(11) DEFAULT NULL COMMENT '员工年龄',
  `contactNumber` varchar(255) DEFAULT NULL COMMENT '联系电话',
  `emergencyContactNumber` varchar(255) DEFAULT NULL COMMENT '紧急联系电话',
  `post` varchar(255) DEFAULT NULL COMMENT '岗位1',
  `post2` varchar(255) DEFAULT NULL COMMENT '岗位2',
  `post3` varchar(255) DEFAULT NULL COMMENT '岗位3',
  `politicalBackground` varchar(255) DEFAULT NULL COMMENT '政治面貌',
  `icNumber` varchar(255) DEFAULT NULL COMMENT '身份证号码',
  `dateOfBirth` varchar(255) DEFAULT NULL COMMENT '出生日期',
  `institution` varchar(255) DEFAULT NULL COMMENT '毕业学校',
  `major` varchar(255) DEFAULT NULL COMMENT '专业',
  `highestEducation` varchar(255) DEFAULT NULL COMMENT '学历层次',
  `teacherQualification` varchar(255) DEFAULT NULL COMMENT '教师资格证类别',
  `teacherQualificationLeaver` varchar(255) DEFAULT NULL COMMENT '教师资格证学段',
  `teacherQualificationSubject` varchar(255) DEFAULT NULL COMMENT '教师资格证学科',
  `teacherCertificationNumber` varchar(255) DEFAULT NULL COMMENT '教师资格证编号',
  `teachingLevel` varchar(255) DEFAULT NULL COMMENT '任教学段',
  `teachingSubject` varchar(255) DEFAULT NULL COMMENT '任教学科',
  `residentialAddress` varchar(255) DEFAULT NULL COMMENT '家庭地址',
  `province` varchar(255) DEFAULT NULL COMMENT '省',
  `city` varchar(255) DEFAULT NULL COMMENT '市',
  `county` varchar(255) DEFAULT NULL COMMENT '县',
  `operationAt` varchar(255) DEFAULT NULL,
  `dateOfEntry` varchar(255) DEFAULT NULL COMMENT '入职',
  `dateOfContractExpiration` varchar(255) DEFAULT NULL COMMENT '到期',
  `leaveRequestStatus` varchar(255) DEFAULT NULL COMMENT '申请离职状态',
  `cardNumber` varchar(255) DEFAULT NULL COMMENT '建设银行卡卡号',
  `licensePlateNumber` varchar(255) DEFAULT NULL COMMENT '车牌号',
  `employmentForms` varchar(255) DEFAULT NULL COMMENT '聘用形式',
  `entryStatus` varchar(255) DEFAULT NULL COMMENT '在职状态',
  `status` varchar(255) DEFAULT NULL COMMENT '员工状态',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `contactPerson` varchar(255) DEFAULT NULL COMMENT '联系人',
  `educationExperience` varchar(255) DEFAULT NULL COMMENT '教育经历',
  `certificate` varchar(255) DEFAULT NULL COMMENT '证书',
  `salaryCard` varchar(255) DEFAULT NULL COMMENT '薪资卡信息',
  `socialSecurity` varchar(255) DEFAULT NULL COMMENT '社保卡信息',
  `trainingExperience` varchar(255) DEFAULT NULL COMMENT '培训经历',
  `workExperience` varchar(255) DEFAULT NULL COMMENT '工作经历',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16;



INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (4,'E1B','张三',1,'男',NULL,NULL,NULL,'高中部老师',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-17T14:18:06+08:00',NULL,NULL,'已批准',NULL,NULL,NULL,'已离职',NULL,'家庭原因【admin系统管理员】2023-03-17T14:08:17+08:00\n',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (5,'E2D','李四',2,'男',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-24T23:05:25+08:00',NULL,NULL,'审核中',NULL,NULL,NULL,'待离职',NULL,'不错【admin系统管理员】2023-03-17T09:34:12+08:00不错【admin系统管理员】Fri Mar 17 2023 09:32:34 GMT+0800 (中国标准时间)表现良好【admin系统管理员】Fri Mar 17 2023 09:32:25 GMT+0800 (中国标准时间)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (6,'E3F','王五',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-16T16:04:58+08:00',NULL,NULL,'已批准',NULL,NULL,NULL,'已离职',NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (7,'E4J','赵六',4,'男',33,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-17T09:38:44+08:00','2022-01-01',NULL,'',NULL,NULL,'正式','在职','全职','态度好【admin系统管理员】2023-03-17\n不错【admin系统管理员】2023-03-17T09:37:15+08:00\n测试2【admin系统管理员】2023-03-17T09:36:50+08:00\n\n测试【admin系统管理员】2023-03-17T09:36:42+08:00\n\n',NULL,NULL,NULL,'{\"salaryCardNum\":\"123\",\"accountOpeningCity\":\"上海\",\"bankName\":\"北京银行\"}','{\"isFirstSocialSecurity\":\"是\",\"isFirstAccumulationFund\":\"是\",\"socialSecurityNum\":\"123\",\"accumulationFundNum\":\"123\",\"socialSecurityStartMonth\":\"2022-02\",\"schemeId\":\"k2IAVe6GXsh_vU4yZURds\"}',NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (8,'E5M','小七',5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-16T14:17:22+08:00','2022-01-01','2024-01-01','',NULL,NULL,'试用','在职','全职','',NULL,NULL,NULL,'{\"salaryCardNum\":\"123\",\"accountOpeningCity\":\"上海\",\"bankName\":\"上海\"}','{\"isFirstSocialSecurity\":\"是\",\"isFirstAccumulationFund\":\"是\",\"socialSecurityNum\":\"123\",\"accumulationFundNum\":\"1234\",\"socialSecurityStartMonth\":\"2022-01\",\"schemeId\":\"tib5XOBe4LdAgEKHRCfum\"}',NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (9,'b5c5208d90464cbf80a1e924c407d9e4','赵虎',6,'男',35,'13567180821',NULL,'高中部老师',NULL,NULL,NULL,'610404198508010521',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'高中','化学',NULL,NULL,NULL,NULL,'2023-03-24T23:49:13+08:00','2023-01-01','2024-01-01','',NULL,NULL,'试用','在职','兼职','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (11,'E7W','熊大',7,'男',22,'13399998888',NULL,'小学美术老师',NULL,NULL,NULL,'411123090087678876',NULL,NULL,NULL,'本科',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-06T10:45:08+08:00',NULL,NULL,'',NULL,NULL,NULL,'在职',NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'insert','admin','系统管理员');
INSERT INTO `employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (12,'E8B','熊大',8,'男',22,'13399998888',NULL,'小学美术老师',NULL,NULL,NULL,'411123090087678876',NULL,NULL,NULL,'本科',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-03-16T15:03:27+08:00','2022-01-01',NULL,'已批准',NULL,NULL,'试用','已离职','全职','拒绝了【admin系统管理员】Thu Mar 16 2023 15:03:14 GMT+0800 (中国标准时间)同意了【admin系统管理员】Thu Mar 16 2023 15:02:00 GMT+0800 (中国标准时间)',NULL,NULL,NULL,'{\"salaryCardNum\":\"123\",\"accountOpeningCity\":\"上海\",\"bankName\":\"上海\"}','{\"isFirstSocialSecurity\":\"是\",\"isFirstAccumulationFund\":\"是\",\"socialSecurityNum\":\"123\",\"accumulationFundNum\":\"1234\",\"socialSecurityStartMonth\":\"2022-01\",\"schemeId\":\"tib5XOBe4LdAgEKHRCfum\"}',NULL,NULL,'jhUpdate','admin','系统管理员');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: employee_contract
# ------------------------------------------------------------

DROP TABLE IF EXISTS `employee_contract`;
CREATE TABLE `employee_contract` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `contractId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` int(11) NOT NULL,
  `contractNum` varchar(40) DEFAULT NULL COMMENT '合同编号',
  `contractType` int(11) DEFAULT NULL COMMENT '1、固定期限劳动合同 2、无固定期限劳动合同 3、已完成一定工作任务为期限的劳动合同 4、实习协议 5、劳务合同 6、返聘协议 7、劳务派遣合同 8、借调合同 9、其他',
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `term` int(11) DEFAULT NULL COMMENT '期限',
  `status` int(11) DEFAULT NULL COMMENT '合同状态  0未执行 1 执行中、 2已到期、 ',
  `signCompany` varchar(255) DEFAULT NULL COMMENT '签约公司',
  `signTime` datetime DEFAULT NULL COMMENT '合同签订日期',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `isExpireRemind` int(11) DEFAULT NULL COMMENT '是否到期提醒 0 否 1 是',
  `sort` int(11) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `createUserId` bigint(20) DEFAULT NULL,
  `batchId` varchar(32) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contractId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工合同';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: employee_file
# ------------------------------------------------------------

DROP TABLE IF EXISTS `employee_file`;
CREATE TABLE `employee_file` (
  `id` int(11) DEFAULT NULL COMMENT '自增主键',
  `employeeFileId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` int(11) NOT NULL COMMENT '员工id',
  `fileId` bigint(20) NOT NULL COMMENT 'admin模块附件id',
  `type` int(11) DEFAULT NULL COMMENT '1 员工基本资料 2 员工档案资料 3 员工离职资料',
  `subType` int(11) NOT NULL COMMENT '11、身份证原件 12、学历证明 13、个人证件照 14、身份证复印件 15、工资银行卡 16、社保卡 17、公积金卡 18、获奖证书 19、其他 21、劳动合同 22、入职简历 23、入职登记表 24、入职体检单 25、离职证明 26、转正申请表 27、其他\n31、离职审批 32、离职证明 33 、其他\n',
  `createUserId` bigint(20) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employeeFileId`) USING BTREE
) ENGINE = InnoDB COMMENT = '员工附件表';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: employee_quit_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `employee_quit_info`;
CREATE TABLE `employee_quit_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `quitInfoId` varchar(100) NOT NULL,
  `employeeId` varchar(100) DEFAULT NULL,
  `planQuitTime` datetime DEFAULT NULL COMMENT '计划离职日期',
  `applyQuitTime` datetime DEFAULT NULL COMMENT '申请离职日期',
  `salarySettlementTime` datetime DEFAULT NULL COMMENT '薪资结算日期',
  `quitType` int(11) DEFAULT NULL COMMENT '离职类型 1 主动离职 2 被动离职 3 退休',
  `quitReason` int(11) DEFAULT NULL COMMENT '离职原因 1家庭原因 2身体原因 3薪资原因 4交通不便 5工作压力 6管理问题 7无晋升机会 8职业规划 9合同到期放弃续签 10其他个人原因  11试用期内辞退 12违反公司条例 13组织调整/裁员 14绩效不达标辞退 15合同到期不续签 16 其他原因被动离职',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `oldStatus` int(11) DEFAULT NULL COMMENT '离职前状态',
  `createTime` datetime DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = '离职信息';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: employee_request
# ------------------------------------------------------------

DROP TABLE IF EXISTS `employee_request`;
CREATE TABLE `employee_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` varchar(255) DEFAULT NULL COMMENT '员工编号',
  `employeeName` varchar(255) DEFAULT NULL COMMENT '员工姓名',
  `sex` varchar(255) DEFAULT NULL COMMENT '员工性别',
  `age` varchar(255) DEFAULT NULL COMMENT '员工年龄',
  `contactNumber` varchar(255) DEFAULT NULL COMMENT '联系电话',
  `icNumber` varchar(255) DEFAULT NULL COMMENT '身份证号',
  `post` varchar(255) DEFAULT NULL COMMENT '员工岗位',
  `teachingLevel` varchar(255) DEFAULT NULL COMMENT '任教学段',
  `teachingSubject` varchar(255) DEFAULT NULL COMMENT '任教学科',
  `status` varchar(255) DEFAULT NULL COMMENT '员工状态',
  `employmentForms` varchar(255) DEFAULT NULL COMMENT '聘用形式',
  `entryStatus` varchar(255) DEFAULT NULL COMMENT '入职状态',
  `dateOfEntry` varchar(255) DEFAULT NULL COMMENT '入职日期',
  `dateOfContractExpiration` varchar(255) DEFAULT NULL COMMENT '到期日期',
  `leaveRequestStatus` varchar(255) DEFAULT NULL COMMENT '申请离职状态',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 24;



INSERT INTO `employee_request` (`id`,`employeeId`,`employeeName`,`sex`,`age`,`contactNumber`,`icNumber`,`post`,`teachingLevel`,`teachingSubject`,`status`,`employmentForms`,`entryStatus`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'E3F','王五',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'已离职',NULL,NULL,'已批准',NULL,'jhUpdate','admin','系统管理员','2023-03-16T15:03:44+08:00');
INSERT INTO `employee_request` (`id`,`employeeId`,`employeeName`,`sex`,`age`,`contactNumber`,`icNumber`,`post`,`teachingLevel`,`teachingSubject`,`status`,`employmentForms`,`entryStatus`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (20,'E8B','熊大','男','22','13399998888','411123090087678876','小学美术老师',NULL,NULL,'全职','试用','已离职','2022-01-01',NULL,'已批准','拒绝了【admin系统管理员】Thu Mar 16 2023 15:03:14 GMT+0800 (中国标准时间)同意了【admin系统管理员】Thu Mar 16 2023 15:02:00 GMT+0800 (中国标准时间)','jhUpdate','admin','系统管理员','2023-03-16T15:03:26+08:00');
INSERT INTO `employee_request` (`id`,`employeeId`,`employeeName`,`sex`,`age`,`contactNumber`,`icNumber`,`post`,`teachingLevel`,`teachingSubject`,`status`,`employmentForms`,`entryStatus`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (21,'E1B','张三','男',NULL,NULL,NULL,'高中部老师',NULL,NULL,NULL,NULL,'已离职',NULL,NULL,'已批准','家庭原因【admin系统管理员】2023-03-17T14:08:19+08:00\n','jhUpdate','admin','系统管理员','2023-03-17T14:18:04+08:00');
INSERT INTO `employee_request` (`id`,`employeeId`,`employeeName`,`sex`,`age`,`contactNumber`,`icNumber`,`post`,`teachingLevel`,`teachingSubject`,`status`,`employmentForms`,`entryStatus`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (22,'E2D','李四','男',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'在职',NULL,NULL,'已拒绝',NULL,'jhUpdate','admin','系统管理员','2023-03-17T14:36:58+08:00');
INSERT INTO `employee_request` (`id`,`employeeId`,`employeeName`,`sex`,`age`,`contactNumber`,`icNumber`,`post`,`teachingLevel`,`teachingSubject`,`status`,`employmentForms`,`entryStatus`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (23,'E2D','李四','男',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'待离职',NULL,NULL,'审核中',NULL,'jhInsert','admin','系统管理员','2023-03-24T23:05:27+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: insurance_month_emp_record
# ------------------------------------------------------------

DROP TABLE IF EXISTS `insurance_month_emp_record`;
CREATE TABLE `insurance_month_emp_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `iEmpRecordId` varchar(100) NOT NULL,
  `iRecordId` varchar(100) DEFAULT NULL COMMENT '每月生成社保id',
  `employeeId` varchar(100) DEFAULT NULL COMMENT '员工id',
  `schemeId` varchar(100) DEFAULT NULL COMMENT '社保方案id',
  `year` int(11) DEFAULT NULL COMMENT '年',
  `month` int(11) DEFAULT NULL COMMENT '月',
  `personalInsuranceAmount` decimal(10, 2) DEFAULT NULL COMMENT '个人社保金额',
  `personalProvidentFundAmount` decimal(10, 2) DEFAULT NULL COMMENT '个人公积金金额',
  `corporateInsuranceAmount` decimal(10, 2) DEFAULT NULL COMMENT '公司社保金额',
  `corporateProvidentFundAmount` decimal(10, 2) DEFAULT NULL COMMENT '公司社保金额',
  `optionList` text COMMENT '明细列表',
  `createTime` datetime DEFAULT NULL,
  `status` int(11) DEFAULT '1' COMMENT '每月社保状态 0 停保 1 正常',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 64 COMMENT = '员工每月社保记录';



INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (38,'vFotAj1-NTxKwVqExFKZc','u9WQR1p4xLV1qpjYUG8yf','E8B','tib5XOBe4LdAgEKHRCfum',2022,1,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-07 21:26:16',1,'insert',NULL,NULL,'2023-03-07T21:26:16+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (39,'qUxHrDTy0rQxAQWVpm0a9','D5GW28xFUdBwT03kDJcAs','E4J','k2IAVe6GXsh_vU4yZURds',2022,2,1160.00,150.00,3040.00,1350.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"1000\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":800,\"personalAmount\":200},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"900\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":630,\"personalAmount\":270},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":480,\"personalAmount\":320},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"700\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":490,\"personalAmount\":210},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":640,\"personalAmount\":160},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"1500\",\"corporateProportion\":\"90\",\"personalProportion\":\"10\",\"corporateAmount\":1350,\"personalAmount\":150}]','2023-03-07 21:26:43',1,'insert',NULL,NULL,'2023-03-07T21:26:43+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (40,'3-SbsPvMSzKXJsLXSpZS1','D5GW28xFUdBwT03kDJcAs','E8B','tib5XOBe4LdAgEKHRCfum',2022,2,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-07 21:26:43',1,'insert',NULL,NULL,'2023-03-07T21:26:43+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (41,'ZPgufxWI7wqm-LHD333QB','WPszjTUSvsXqQz6w_2UR7','E4J','k2IAVe6GXsh_vU4yZURds',2022,3,1160.00,150.00,3040.00,1350.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"1000\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":800,\"personalAmount\":200},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"900\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":630,\"personalAmount\":270},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":480,\"personalAmount\":320},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"700\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":490,\"personalAmount\":210},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":640,\"personalAmount\":160},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"1500\",\"corporateProportion\":\"90\",\"personalProportion\":\"10\",\"corporateAmount\":1350,\"personalAmount\":150}]','2023-03-07 21:26:57',1,'insert',NULL,NULL,'2023-03-07T21:26:57+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'p2imeRQGMIqBsWv_lckI3','WPszjTUSvsXqQz6w_2UR7','E8B','tib5XOBe4LdAgEKHRCfum',2022,3,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-07 21:26:57',1,'insert',NULL,NULL,'2023-03-07T21:26:57+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (55,'E2dUkHGUPIg8GMbtSQQII','q5MdrF25WCgta70VMYUlk','E4J','k2IAVe6GXsh_vU4yZURds',2022,4,1160.00,150.00,3040.00,1350.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"1000\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":800,\"personalAmount\":200},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"900\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":630,\"personalAmount\":270},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":480,\"personalAmount\":320},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"700\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":490,\"personalAmount\":210},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":640,\"personalAmount\":160},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"1500\",\"corporateProportion\":\"90\",\"personalProportion\":\"10\",\"corporateAmount\":1350,\"personalAmount\":150}]','2023-03-08 23:38:11',1,'insert',NULL,NULL,'2023-03-08T23:38:11+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (56,'qxeg1IFRRtrrreG1AcpCE','q5MdrF25WCgta70VMYUlk','E5M','tib5XOBe4LdAgEKHRCfum',2022,4,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-08 23:38:11',1,'insert',NULL,NULL,'2023-03-08T23:38:11+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (57,'udYjFLTdosKvZxGkOpv9s','q5MdrF25WCgta70VMYUlk','E8B','tib5XOBe4LdAgEKHRCfum',2022,4,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-08 23:38:11',1,'insert',NULL,NULL,'2023-03-08T23:38:11+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (58,'OjemmYgNXZC_j3zZDk8OX','5TfMHI7zs9PtOuOzulVfJ','E4J','k2IAVe6GXsh_vU4yZURds',2022,5,1160.00,150.00,3040.00,1350.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"1000\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":800,\"personalAmount\":200},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"900\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":630,\"personalAmount\":270},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":480,\"personalAmount\":320},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"700\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":490,\"personalAmount\":210},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":640,\"personalAmount\":160},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"1500\",\"corporateProportion\":\"90\",\"personalProportion\":\"10\",\"corporateAmount\":1350,\"personalAmount\":150}]','2023-03-08 23:38:26',1,'insert',NULL,NULL,'2023-03-08T23:38:26+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (59,'ffWJq7okx9bc21lpRyLXF','5TfMHI7zs9PtOuOzulVfJ','E5M','tib5XOBe4LdAgEKHRCfum',2022,5,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-08 23:38:26',1,'insert',NULL,NULL,'2023-03-08T23:38:26+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (60,'pYhAS4H0yMdYZmpQgrBYp','5TfMHI7zs9PtOuOzulVfJ','E8B','tib5XOBe4LdAgEKHRCfum',2022,5,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-08 23:38:26',1,'insert',NULL,NULL,'2023-03-08T23:38:26+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (61,'l339MzSytwvClINYnu5j8','jE9r3EiLS0m7gB5exEIaf','E4J','k2IAVe6GXsh_vU4yZURds',2022,6,1160.00,150.00,3040.00,1350.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"1000\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":800,\"personalAmount\":200},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"900\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":630,\"personalAmount\":270},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":480,\"personalAmount\":320},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"700\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":490,\"personalAmount\":210},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":640,\"personalAmount\":160},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"1500\",\"corporateProportion\":\"90\",\"personalProportion\":\"10\",\"corporateAmount\":1350,\"personalAmount\":150}]','2023-03-08 23:38:46',1,'insert',NULL,NULL,'2023-03-08T23:38:46+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (62,'U8pXBunZ4lqZ6H_lCg96Y','jE9r3EiLS0m7gB5exEIaf','E5M','tib5XOBe4LdAgEKHRCfum',2022,6,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-08 23:38:46',1,'insert',NULL,NULL,'2023-03-08T23:38:46+08:00');
INSERT INTO `insurance_month_emp_record` (`id`,`iEmpRecordId`,`iRecordId`,`employeeId`,`schemeId`,`year`,`month`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`optionList`,`createTime`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (63,'CGLjMsqAFoGh_-m8MPBL9','jE9r3EiLS0m7gB5exEIaf','E8B','tib5XOBe4LdAgEKHRCfum',2022,6,592.00,80.00,588.00,320.00,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80}]','2023-03-08 23:38:46',1,'insert',NULL,NULL,'2023-03-08T23:38:46+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: insurance_month_record
# ------------------------------------------------------------

DROP TABLE IF EXISTS `insurance_month_record`;
CREATE TABLE `insurance_month_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `iRecordId` varchar(100) NOT NULL,
  `title` varchar(40) DEFAULT NULL COMMENT '报表名称',
  `year` int(11) DEFAULT NULL COMMENT '年份',
  `month` int(11) DEFAULT NULL COMMENT '月份',
  `status` int(11) DEFAULT '0' COMMENT '每月社保状态 0 未归档 1 已归档',
  `createTime` datetime DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 63 COMMENT = '每月社保记录';



INSERT INTO `insurance_month_record` (`id`,`iRecordId`,`title`,`year`,`month`,`status`,`createTime`,`operation`,`operationAt`,`operationByUser`,`operationByUserId`) VALUES (51,'u9WQR1p4xLV1qpjYUG8yf','1月社保表',2022,1,0,NULL,'insert','2023-03-07T21:26:16+08:00',NULL,NULL);
INSERT INTO `insurance_month_record` (`id`,`iRecordId`,`title`,`year`,`month`,`status`,`createTime`,`operation`,`operationAt`,`operationByUser`,`operationByUserId`) VALUES (52,'D5GW28xFUdBwT03kDJcAs','2月社保表',2022,2,0,NULL,'insert','2023-03-07T21:26:43+08:00',NULL,NULL);
INSERT INTO `insurance_month_record` (`id`,`iRecordId`,`title`,`year`,`month`,`status`,`createTime`,`operation`,`operationAt`,`operationByUser`,`operationByUserId`) VALUES (53,'WPszjTUSvsXqQz6w_2UR7','3月社保表',2022,3,0,NULL,'insert','2023-03-07T21:26:56+08:00',NULL,NULL);
INSERT INTO `insurance_month_record` (`id`,`iRecordId`,`title`,`year`,`month`,`status`,`createTime`,`operation`,`operationAt`,`operationByUser`,`operationByUserId`) VALUES (60,'q5MdrF25WCgta70VMYUlk','4月社保表',2022,4,0,NULL,'insert','2023-03-08T23:38:10+08:00',NULL,NULL);
INSERT INTO `insurance_month_record` (`id`,`iRecordId`,`title`,`year`,`month`,`status`,`createTime`,`operation`,`operationAt`,`operationByUser`,`operationByUserId`) VALUES (61,'5TfMHI7zs9PtOuOzulVfJ','5月社保表',2022,5,0,NULL,'insert','2023-03-08T23:38:26+08:00',NULL,NULL);
INSERT INTO `insurance_month_record` (`id`,`iRecordId`,`title`,`year`,`month`,`status`,`createTime`,`operation`,`operationAt`,`operationByUser`,`operationByUserId`) VALUES (62,'jE9r3EiLS0m7gB5exEIaf','6月社保表',2022,6,0,NULL,'insert','2023-03-08T23:38:46+08:00',NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: insurance_scheme
# ------------------------------------------------------------

DROP TABLE IF EXISTS `insurance_scheme`;
CREATE TABLE `insurance_scheme` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `schemeId` varchar(100) DEFAULT NULL COMMENT '社保方案id',
  `schemeName` varchar(40) DEFAULT NULL COMMENT '方案名称',
  `city` varchar(40) DEFAULT NULL COMMENT '参保城市',
  `houseType` varchar(50) DEFAULT NULL COMMENT '户籍类型',
  `schemeType` int(11) DEFAULT NULL COMMENT '参保类型 1 比例 2 金额',
  `projectList` text COMMENT '社保明细项',
  `isDel` int(11) DEFAULT '0' COMMENT '1 删除 0 使用',
  `createUserId` varchar(255) DEFAULT NULL COMMENT '创建人id',
  `createTime` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 COMMENT = '社保方案表';



INSERT INTO `insurance_scheme` (`id`,`schemeId`,`schemeName`,`city`,`houseType`,`schemeType`,`projectList`,`isDel`,`createUserId`,`createTime`,`operation`,`operationByUserId`,`operationAt`,`operationByUser`) VALUES (1,'tib5XOBe4LdAgEKHRCfum','普通员工社保方案','北京市',NULL,1,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"500\",\"corporateProportion\":\"50\",\"personalProportion\":\"50\",\"corporateAmount\":250,\"personalAmount\":250,\"isDel\":0},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"300\",\"corporateProportion\":\"30\",\"personalProportion\":\"70\",\"corporateAmount\":90,\"personalAmount\":210,\"isDel\":0},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"200\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":120,\"personalAmount\":80,\"isDel\":0},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"100\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":80,\"personalAmount\":20,\"isDel\":0},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"80\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":48,\"personalAmount\":32,\"isDel\":0},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"400\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":320,\"personalAmount\":80,\"isDel\":0}]',0,NULL,'2023-03-01 14:46:19','jhUpdate','L00001','2023-03-06T21:56:17+08:00','刘老师');
INSERT INTO `insurance_scheme` (`id`,`schemeId`,`schemeName`,`city`,`houseType`,`schemeType`,`projectList`,`isDel`,`createUserId`,`createTime`,`operation`,`operationByUserId`,`operationAt`,`operationByUser`) VALUES (4,'k2IAVe6GXsh_vU4yZURds','领导社保方案','上海','',1,'[{\"type\":1,\"projectName\":\"养老保险基数\",\"defaultAmount\":\"1000\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":800,\"personalAmount\":200,\"isDel\":0},{\"type\":2,\"projectName\":\"医疗保险基数\",\"defaultAmount\":\"900\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":630,\"personalAmount\":270,\"isDel\":0},{\"type\":3,\"projectName\":\"失业保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"60\",\"personalProportion\":\"40\",\"corporateAmount\":480,\"personalAmount\":320,\"isDel\":0},{\"type\":4,\"projectName\":\"工伤保险基数\",\"defaultAmount\":\"700\",\"corporateProportion\":\"70\",\"personalProportion\":\"30\",\"corporateAmount\":490,\"personalAmount\":210,\"isDel\":0},{\"type\":5,\"projectName\":\"生育保险基数\",\"defaultAmount\":\"800\",\"corporateProportion\":\"80\",\"personalProportion\":\"20\",\"corporateAmount\":640,\"personalAmount\":160,\"isDel\":0},{\"type\":10,\"projectName\":\"公积金\",\"defaultAmount\":\"1500\",\"corporateProportion\":\"90\",\"personalProportion\":\"10\",\"corporateAmount\":1350,\"personalAmount\":150,\"isDel\":0}]',1,NULL,NULL,'insert','L00001','2023-03-06T22:19:48+08:00','刘老师');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: job_postings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `job_postings`;
CREATE TABLE `job_postings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobId` varchar(255) DEFAULT NULL COMMENT '职位ID',
  `recruitmentType` varchar(255) DEFAULT NULL COMMENT '招聘渠道：campus-校园招聘 | social-社会招聘 | internship-实习生',
  `jobTitle` varchar(255) DEFAULT NULL COMMENT '职位名称',
  `employmentType` varchar(20) DEFAULT NULL COMMENT '职位类型：full-全职 | part-兼职',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `headcount` varchar(255) DEFAULT NULL COMMENT '招聘人数',
  `company` varchar(255) DEFAULT NULL COMMENT '招聘公司',
  `publishStatus` varchar(255) DEFAULT NULL COMMENT '招聘状态',
  `publishTime` varchar(255) DEFAULT NULL COMMENT '发布时间',
  `responsibilities` text COMMENT '工作职责',
  `requirements` text COMMENT '工作要求顺序 list',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 COMMENT = '招聘职位表';



INSERT INTO `job_postings` (`id`,`jobId`,`recruitmentType`,`jobTitle`,`employmentType`,`address`,`headcount`,`company`,`publishStatus`,`publishTime`,`responsibilities`,`requirements`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'Z10001','internship','小学美术老师','full','江西省永新县','3','致远学校','招聘中','2023-02-01','岗位职责：1.可以承担小学生的各种绘画教学.教研等方面的工作；2.承担课程辅导和答疑；3.参与教学改革的研究或改革试点工作，为教学研究新思路.新方法提供建议；4.参与学校招生工作；4.完成教学部门主任安排的其他任务。任职要求：1.本科及以上学历，美术类专业毕业；2.普通话标准，性格活泼开朗，耐心细致，有亲和力；3.善于沟通.思维灵敏.表述能力强,形象气质好，愿意长期发展；4.持有教师资格证者，有同行业教学经验者优先。','1. 专科以上学历2. 具备专业教师资格证3. 具有较强的学习能力. 表达能力和沟通能力，有良好的团队合作精神；4.具有较强的亲和力.','jhUpdate','admin','系统管理员','2023-03-06T09:42:01+08:00');
INSERT INTO `job_postings` (`id`,`jobId`,`recruitmentType`,`jobTitle`,`employmentType`,`address`,`headcount`,`company`,`publishStatus`,`publishTime`,`responsibilities`,`requirements`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'Z10002','internship','初中英语老师','full','江西省永新县','2','致远学校','招聘中','2023-02-01','岗位职责1.负责对所报科目学生进行授课及辅导，根据学生学习情况及性格特点制定适宜的教学方案；2.与学生.家长保持良好的沟通，及时接收学生.家长反馈意见，不断提高教学服务质量；3.培养学生良好的学习习惯，进行学习方法指导和适度的课后跟踪服务；4.积极参加教研活动，配合和完成上级布置的教研任务。任职要求1.专业基本功扎实，对教学有很好的理解，具备一定的教研能力；2.工作严谨，认真负责，具有良好沟通能力.协调能力.亲和力；3.有良好的团队合作精神。4.有教师资格证者优先。','\n1、接受过教育类培训；有初中/高中及以上英语教师资格证优先。\n2、英语口语发音标准。\n3、不限专业；英语等级要求：非英语专业CET6，英语专业TEM4及以上。\n\n','jhUpdate','admin','系统管理员','2023-03-06T09:41:53+08:00');
INSERT INTO `job_postings` (`id`,`jobId`,`recruitmentType`,`jobTitle`,`employmentType`,`address`,`headcount`,`company`,`publishStatus`,`publishTime`,`responsibilities`,`requirements`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'Z10003','social','小学体育老师','full','江西省九江市','1','致远学校','招聘中','2023-03-06','1.教授高质量并且充满乐趣的运动技能为主的课程；(基础体能，包括爬.跑.跳.攀.翻滚等)；2.协助教学主任研发课程，定期参加课程创新大赛，成绩纳入晋升考核标准。','任职资格：1.大专学历及以上，80后或90后，有活力.有朝气；2.喜爱孩子，积极乐观，沟通能力强，表现能力强；3.幼教专业.体育教育专业.运动训练专业以及艺术体操专业等，有体操.空手道.跆拳道等特长者将予以优先考虑；4.良好的服务意识，肯于学习，勇于挑战，具有较好的抗压度及承受度；5.对工作生活充满激情，愿意通过自身不懈努力与学校一起成长。','jhUpdate','admin','系统管理员','2023-03-06T10:00:45+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: job_resume
# ------------------------------------------------------------

DROP TABLE IF EXISTS `job_resume`;
CREATE TABLE `job_resume` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobId` varchar(255) DEFAULT NULL,
  `jobTitle` varchar(255) DEFAULT NULL,
  `jobResumeId` varchar(255) DEFAULT NULL COMMENT '简历ID',
  `employeeId` varchar(255) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL COMMENT '姓名',
  `gender` varchar(50) DEFAULT NULL COMMENT '性别',
  `age` varchar(50) DEFAULT NULL COMMENT '年龄',
  `ethnicity` varchar(50) DEFAULT NULL COMMENT '民族',
  `height` varchar(50) DEFAULT NULL COMMENT '身高',
  `weight` varchar(50) DEFAULT NULL COMMENT '体重',
  `bloodType` varchar(50) DEFAULT NULL COMMENT '血型',
  `maritalStatus` varchar(50) DEFAULT NULL COMMENT '婚姻状况',
  `politicalAffiliation` varchar(50) DEFAULT NULL COMMENT '政治面貌',
  `physicalCondition` varchar(255) DEFAULT NULL COMMENT '身体状况',
  `religiousBeliefs` varchar(255) DEFAULT NULL COMMENT '宗教信仰',
  `phoneNumber` varchar(255) DEFAULT NULL COMMENT '手机号码',
  `IDNumber` varchar(255) DEFAULT NULL COMMENT '身份证号',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `highestEducation` varchar(255) DEFAULT NULL COMMENT '最高学历',
  `wechatID` varchar(255) DEFAULT NULL COMMENT '微信',
  `nativePlace` varchar(255) DEFAULT NULL COMMENT '籍贯',
  `homeAddress` varchar(255) DEFAULT NULL COMMENT '家庭住址',
  `currentAddress` varchar(255) DEFAULT NULL COMMENT '现住址',
  `academicRanking` varchar(255) DEFAULT NULL COMMENT '专业成绩排名',
  `workplace` varchar(255) DEFAULT NULL COMMENT '意向工作地',
  `salaryExpectation` varchar(255) DEFAULT NULL COMMENT '薪资期望',
  `domicilePlace` varchar(255) DEFAULT NULL COMMENT '户口所在地',
  `earliestAvailability` varchar(255) DEFAULT NULL COMMENT '最快可到岗日期',
  `education` text COMMENT '教育经历 json',
  `educationCertificate` varchar(255) DEFAULT NULL COMMENT '教育职称/资格证书',
  `experience` text COMMENT '工作经历 json',
  `familyMember` text COMMENT '家庭成员 json',
  `teacherContact` text COMMENT '教师证明',
  `studentSocialization` varchar(255) DEFAULT NULL COMMENT '在校社交',
  `socialActivities` text COMMENT '社交活动',
  `achievement` varchar(500) DEFAULT NULL COMMENT '工作成就',
  `socialHobbies` varchar(255) DEFAULT NULL COMMENT '社交爱好',
  `personality` varchar(255) DEFAULT NULL COMMENT '个人特点',
  `careerPlanning` varchar(255) DEFAULT NULL COMMENT '职业规划',
  `offence` varchar(255) DEFAULT NULL COMMENT '是否有违反法纪、解雇等',
  `resumeStatus` varchar(255) DEFAULT NULL COMMENT '状态：new-新候选 | passedInitialScreening\nscheduledInterview\npassedInterview\noffer\npending rejected\nhired',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 COMMENT = '简历投递信息表';



INSERT INTO `job_resume` (`id`,`jobId`,`jobTitle`,`jobResumeId`,`employeeId`,`user`,`gender`,`age`,`ethnicity`,`height`,`weight`,`bloodType`,`maritalStatus`,`politicalAffiliation`,`physicalCondition`,`religiousBeliefs`,`phoneNumber`,`IDNumber`,`email`,`highestEducation`,`wechatID`,`nativePlace`,`homeAddress`,`currentAddress`,`academicRanking`,`workplace`,`salaryExpectation`,`domicilePlace`,`earliestAvailability`,`education`,`educationCertificate`,`experience`,`familyMember`,`teacherContact`,`studentSocialization`,`socialActivities`,`achievement`,`socialHobbies`,`personality`,`careerPlanning`,`offence`,`resumeStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'Z10001','小学美术老师','J10001','E10L','熊大','男','22','汉','180','180','O','未婚','党员','健康','伊斯兰教','13399998888','411123090087678876','333@163.com','本科','微信号','北京','北京','北京','1','北京','50K','户口所在地','马上','[{\"startDate\":\"2023-10\",\"school\":\"北大\",\"major\":\"建筑\",\"position\":\"班长\",\"teacherPhoneNumber\":\"主任\"}]','资格证','[{\"startDate\":\"2022-10\",\"company\":\"组长\",\"companyContact\":\"133\",\"desc\":\"很多\"}]','[{\"name\":\"熊二\",\"relationship\":\"兄弟\",\"phoneNumber\":null,\"address\":null,\"birthday\":\"2022-10\",\"phone\":\"122\",\"currentAddress\":\"北京\"}]','[{\"name\":\"黄老师\",\"occupation\":\"主任\",\"phoneNumber\":\"189\",\"address\":\"北京\"}]','无','无','无','无','无',NULL,'无','已录用','jhUpdate','admin','系统管理员','2023-03-09T23:55:22+08:00');
INSERT INTO `job_resume` (`id`,`jobId`,`jobTitle`,`jobResumeId`,`employeeId`,`user`,`gender`,`age`,`ethnicity`,`height`,`weight`,`bloodType`,`maritalStatus`,`politicalAffiliation`,`physicalCondition`,`religiousBeliefs`,`phoneNumber`,`IDNumber`,`email`,`highestEducation`,`wechatID`,`nativePlace`,`homeAddress`,`currentAddress`,`academicRanking`,`workplace`,`salaryExpectation`,`domicilePlace`,`earliestAvailability`,`education`,`educationCertificate`,`experience`,`familyMember`,`teacherContact`,`studentSocialization`,`socialActivities`,`achievement`,`socialHobbies`,`personality`,`careerPlanning`,`offence`,`resumeStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,'Z10002','初中英语老师','J10002','E11Q','赵小花','男','1','1','1','1','1','1','1','1','1','1','1','1','1','1',NULL,'1','1','1','1','1',NULL,'1','[{\"startDate\":\"1\",\"school\":\"1\",\"major\":\"1\",\"position\":\"1\",\"teacherPhoneNumber\":\"1\"}]','1','[{\"startDate\":\"1\",\"company\":\"1\",\"companyContact\":\"1\",\"desc\":\"1\"}]','[{\"name\":\"1\",\"relationship\":\"1\",\"phoneNumber\":null,\"address\":null,\"birthday\":\"1\",\"currentAddress\":\"1\",\"phone\":\"1\"}]','[{\"name\":\"1\",\"occupation\":\"1\",\"phoneNumber\":\"1\",\"address\":\"1\"}]','1','无','无','无','无','1','无','已录用','update','L00001','刘老师','2023-03-08T15:21:26+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: member_org_role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `member_org_role`;
CREATE TABLE `member_org_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orgId` varchar(255) DEFAULT NULL COMMENT '组织Id;',
  `memberId` varchar(255) DEFAULT NULL COMMENT '职员Id;',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id; 负责人、成员',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `orgId_memberId_roleId_index` (`orgId`, `memberId`, `roleId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 45 COMMENT = '组织员工表';



INSERT INTO `member_org_role` (`id`,`orgId`,`memberId`,`roleId`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'10000','E1B',NULL,NULL,'insert','admin','系统管理员','2023-03-17T10:49:07+08:00');
INSERT INTO `member_org_role` (`id`,`orgId`,`memberId`,`roleId`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,'10000','E2D',NULL,NULL,'insert','admin','系统管理员','2023-03-17T10:49:07+08:00');
INSERT INTO `member_org_role` (`id`,`orgId`,`memberId`,`roleId`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (44,'10000','E3F',NULL,NULL,'insert','admin','系统管理员','2023-03-17T10:49:07+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: notes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `notesId` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(1024) NOT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `reminderTime` datetime NOT NULL,
  `createTime` datetime DEFAULT NULL,
  `createUserId` bigint(20) NOT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`notesId`) USING BTREE,
  KEY `wk_hrm_notes_employee_id_index` (`employeeId`) USING BTREE
) ENGINE = InnoDB COMMENT = '备忘';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: org
# ------------------------------------------------------------

DROP TABLE IF EXISTS `org`;
CREATE TABLE `org` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orgId` varchar(255) DEFAULT NULL COMMENT '组织Id; 路径法生成 01-03-01-11',
  `orgParentId` varchar(255) DEFAULT NULL COMMENT '组织父结点id',
  `orgPath` text COMMENT '组织树节点路径',
  `orgName` varchar(255) DEFAULT NULL COMMENT '组织名',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 COMMENT = '组织表';



INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'10000',NULL,'10000','致远',NULL,'jhUpdate',NULL,NULL,'2023-02-27T21:48:17+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'10001','10000','10000-10001','致远永新县',NULL,'jhUpdate',NULL,NULL,'2023-02-27T23:36:55+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'10002','10001','10000-10001-10002','高中部',NULL,'jhUpdate',NULL,NULL,'2023-02-28T16:21:01+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (9,'10003','10001','10000-10001-10003','初中部',NULL,'jhInsert',NULL,NULL,'2023-02-27T21:48:54+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,'10004','10001','10000-10001-10004','小学部',NULL,'jhInsert',NULL,NULL,'2023-02-27T21:49:02+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (11,'10005','10001','10000-10001-10005','行政办',NULL,'jhInsert',NULL,NULL,'2023-02-27T21:49:11+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (12,'10006','10001','10000-10001-10006','后勤服务中心',NULL,'jhInsert',NULL,NULL,'2023-02-27T21:49:19+08:00');
INSERT INTO `org` (`id`,`orgId`,`orgParentId`,`orgPath`,`orgName`,`remark`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (13,'10007','10001','10000-10001-10007','安保处',NULL,'jhInsert',NULL,NULL,'2023-02-27T21:49:26+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: performance
# ------------------------------------------------------------

DROP TABLE IF EXISTS `performance`;
CREATE TABLE `performance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `performanceId` varchar(255) NOT NULL,
  `performanceName` varchar(255) DEFAULT NULL COMMENT '考核名称',
  `performanceCycle` varchar(255) DEFAULT NULL COMMENT '考核周期',
  `performanceContent` varchar(455) DEFAULT NULL COMMENT '考核内容',
  `actualTargetData` varchar(255) DEFAULT NULL COMMENT '实际指标',
  `startTime` varchar(255) DEFAULT NULL COMMENT '考核开始时间',
  `endTime` varchar(255) DEFAULT NULL COMMENT '考核结束时间',
  `employeeId` varchar(255) DEFAULT NULL COMMENT '考核员工Id',
  `employeeName` varchar(255) DEFAULT NULL COMMENT '考核员工名称',
  `raterId` varchar(255) DEFAULT NULL COMMENT '考核评分人Id',
  `raterName` varchar(255) DEFAULT NULL COMMENT '考核评分人名称',
  `status` varchar(255) DEFAULT NULL COMMENT '考核状态',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`, `performanceId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21;



INSERT INTO `performance` (`id`,`performanceId`,`performanceName`,`performanceCycle`,`performanceContent`,`actualTargetData`,`startTime`,`endTime`,`employeeId`,`employeeName`,`raterId`,`raterName`,`status`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (17,'6kK4ZX70On6nL6ME6XGUm','高中部备课与上课','月度考核','{\"indicator\":\"备课与上课\",\"indicatorPercentage\":\"40\",\"standard\":\"25分\"}',NULL,'2023-03-01','2023-04-01',NULL,'赵六',NULL,'小七','未开启',NULL,'jhUpdate','admin','系统管理员','2023-03-14T13:23:41+08:00');
INSERT INTO `performance` (`id`,`performanceId`,`performanceName`,`performanceCycle`,`performanceContent`,`actualTargetData`,`startTime`,`endTime`,`employeeId`,`employeeName`,`raterId`,`raterName`,`status`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (18,'BHalGY0bAegKPpEhXQc0i','高中部作业与考试','月度考核','{\"indicator\":\"作业与考试\",\"indicatorPercentage\":\"40\",\"standard\":\"25分\"}',NULL,'2023-03-01','2023-04-01',NULL,'赵六',NULL,'小七','未开启',NULL,'insert','admin','系统管理员','2023-03-14T13:24:25+08:00');
INSERT INTO `performance` (`id`,`performanceId`,`performanceName`,`performanceCycle`,`performanceContent`,`actualTargetData`,`startTime`,`endTime`,`employeeId`,`employeeName`,`raterId`,`raterName`,`status`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'VPuo2IVyTrkba4H_kw8oL','高中部教研活动','月度考核','{\"indicator\":\"教研活动\",\"indicatorPercentage\":\"30\",\"standard\":\"30分\"}',NULL,'2023-03-01','2023-04-01',NULL,'赵六',NULL,'小七','已开启',NULL,'jhUpdate','admin','系统管理员','2023-03-29T17:28:15+08:00');
INSERT INTO `performance` (`id`,`performanceId`,`performanceName`,`performanceCycle`,`performanceContent`,`actualTargetData`,`startTime`,`endTime`,`employeeId`,`employeeName`,`raterId`,`raterName`,`status`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (20,'AuxcWc5Q2j5u1H_MgQvoY','1','月度考核','{}',NULL,'2023-03-01','2023-04-01',NULL,'小七',NULL,'赵六','未开启','1','insert','admin','系统管理员','2023-03-29T17:37:32+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: performance_employee_rate
# ------------------------------------------------------------

DROP TABLE IF EXISTS `performance_employee_rate`;
CREATE TABLE `performance_employee_rate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `performanceId` varchar(255) DEFAULT NULL,
  `performanceName` varchar(255) DEFAULT NULL COMMENT '考核名称',
  `performanceContent` varchar(255) DEFAULT NULL COMMENT '考核内容',
  `performanceCycle` varchar(255) DEFAULT NULL COMMENT '考核周期',
  `startTime` varchar(255) DEFAULT NULL COMMENT '考核开始时间',
  `endTime` varchar(255) DEFAULT NULL COMMENT '考核结束时间',
  `actualTargetData` varchar(255) DEFAULT NULL COMMENT '实际指标',
  `employeeId` varchar(255) DEFAULT NULL COMMENT '考核员工Id',
  `employeeName` varchar(255) DEFAULT NULL COMMENT '考核员工名称',
  `raterId` varchar(255) DEFAULT NULL COMMENT '考核评分人Id',
  `raterName` varchar(255) DEFAULT NULL COMMENT '考核评分人名称',
  `gradePerformance` varchar(255) DEFAULT NULL COMMENT '指标评分',
  `status` varchar(255) DEFAULT NULL COMMENT '考核状态',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8;



INSERT INTO `performance_employee_rate` (`id`,`performanceId`,`performanceName`,`performanceContent`,`performanceCycle`,`startTime`,`endTime`,`actualTargetData`,`employeeId`,`employeeName`,`raterId`,`raterName`,`gradePerformance`,`status`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'x6hE2ex43__raHcjfBqMO','招聘考核','{\"indicator\":\"招聘人员统计\",\"standard\":\"10\",\"indicatorPercentage\":\"50\",\"indicatorDescription\":\"招聘人数\"}','月度考核','2023-03-01','2023-06-01',NULL,NULL,'小七',NULL,'赵虎',NULL,'未开始','招聘人数','insert','admin','系统管理员','2023-03-10T13:43:43+08:00');
INSERT INTO `performance_employee_rate` (`id`,`performanceId`,`performanceName`,`performanceContent`,`performanceCycle`,`startTime`,`endTime`,`actualTargetData`,`employeeId`,`employeeName`,`raterId`,`raterName`,`gradePerformance`,`status`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'wxU6is93OgPqWWgd9iaCA','高中部作业与考试','{\"indicator\":\"作业与考试\",\"indicatorPercentage\":\"40\",\"standard\":\"25分\"}','月度考核','2023-03-01','2023-04-01',NULL,NULL,'赵六',NULL,'小七',NULL,'未开启',NULL,'insert','admin','系统管理员','2023-03-14T23:33:58+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: performance_result
# ------------------------------------------------------------

DROP TABLE IF EXISTS `performance_result`;
CREATE TABLE `performance_result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `performanceId` varchar(255) DEFAULT NULL COMMENT '考核内容',
  `performanceName` varchar(255) DEFAULT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `employeeId` varchar(255) DEFAULT NULL,
  `employeeName` varchar(255) DEFAULT NULL,
  `actualTargetData` varchar(255) DEFAULT NULL,
  `raterId` varchar(255) DEFAULT NULL,
  `raterName` varchar(255) DEFAULT NULL,
  `gradePerformance` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6;



INSERT INTO `performance_result` (`id`,`performanceId`,`performanceName`,`startTime`,`endTime`,`employeeId`,`employeeName`,`actualTargetData`,`raterId`,`raterName`,`gradePerformance`,`status`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (5,'ZaTsNp11f-xSOba2Ihr9z','招聘考核','2023-03-01 00:00:00','2023-06-01 00:00:00',NULL,'小七',NULL,NULL,'赵虎',NULL,'已归档','insert','admin','系统管理员','2023-03-10T13:44:16+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_archives
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_archives`;
CREATE TABLE `salary_archives` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `changeReason` int(11) NOT NULL COMMENT '调薪原因 1 入职核定 2 转正 3 晋升 4 调动 5 年中调薪 6 年度调薪 7 特别调薪 8 其他',
  `changeDate` date NOT NULL COMMENT '最近调整日期',
  `employeeId` varchar(255) NOT NULL COMMENT '员工id',
  `changeType` varchar(255) DEFAULT '0' COMMENT '0 未定薪 1 已定薪 2 已调薪',
  `remarks` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `salary_archives_change_reason_index` (`changeReason`) USING BTREE,
  KEY `salary_archives_employee_id_index` (`employeeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 67 COMMENT = '薪资档案表';



INSERT INTO `salary_archives` (`id`,`changeReason`,`changeDate`,`employeeId`,`changeType`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (62,0,'2023-03-03','E1B','已定薪','','insert',NULL,NULL,'2023-03-03T14:30:14+08:00');
INSERT INTO `salary_archives` (`id`,`changeReason`,`changeDate`,`employeeId`,`changeType`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (63,0,'2023-03-09','E4J','已定薪','','update',NULL,NULL,'2023-03-09T10:54:08+08:00');
INSERT INTO `salary_archives` (`id`,`changeReason`,`changeDate`,`employeeId`,`changeType`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (64,0,'2023-03-09','E4J','已定薪','','update',NULL,NULL,'2023-03-09T10:54:08+08:00');
INSERT INTO `salary_archives` (`id`,`changeReason`,`changeDate`,`employeeId`,`changeType`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (65,0,'2023-03-09','E5M','已定薪','','update',NULL,NULL,'2023-03-09T11:27:35+08:00');
INSERT INTO `salary_archives` (`id`,`changeReason`,`changeDate`,`employeeId`,`changeType`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (66,0,'2023-03-09','E4J','已定薪','','update',NULL,NULL,'2023-03-09T10:54:08+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_archives_option
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_archives_option`;
CREATE TABLE `salary_archives_option` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `employeeId` varchar(255) NOT NULL COMMENT '员工id',
  `isPro` int(11) NOT NULL COMMENT '是否是试用期 0 正式 1 试用期',
  `code` int(11) NOT NULL COMMENT '薪资项code',
  `name` varchar(20) NOT NULL COMMENT '薪资项名称',
  `value` varchar(20) NOT NULL COMMENT '薪资',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `salary_archives_option_employee_id_index` (`employeeId`) USING BTREE,
  KEY `salary_archives_option_is_pro_index` (`isPro`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 151;



INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (115,'E4J',1,10101,'基本工资','3000','insert',NULL,NULL,'2023-03-09T10:54:26+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (116,'E4J',1,10102,'岗位工资','2000','insert',NULL,NULL,'2023-03-09T10:54:26+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (117,'E4J',1,10103,'职务工资','0','insert',NULL,NULL,'2023-03-09T10:54:26+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (118,'E4J',0,10101,'基本工资','7000','insert',NULL,NULL,'2023-03-09T10:54:26+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (119,'E4J',0,10102,'岗位工资','3000','insert',NULL,NULL,'2023-03-09T10:54:26+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (120,'E4J',0,10103,'职务工资','0','insert',NULL,NULL,'2023-03-09T10:54:26+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (145,'E5M',1,10101,'基本工资','5000','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (146,'E5M',1,10102,'岗位工资','5000','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (147,'E5M',1,10103,'职务工资','0','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (148,'E5M',0,10101,'基本工资','15000','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (149,'E5M',0,10102,'岗位工资','5000','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');
INSERT INTO `salary_archives_option` (`id`,`employeeId`,`isPro`,`code`,`name`,`value`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (150,'E5M',0,10103,'职务工资','0','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_change_record
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_change_record`;
CREATE TABLE `salary_change_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` varchar(255) NOT NULL COMMENT '员工id',
  `recordType` int(11) NOT NULL DEFAULT '1' COMMENT '记录类型 1 定薪 2 调薪',
  `changeReason` int(11) NOT NULL COMMENT '调薪原因 1 入职核定 2 转正 3 晋升 4 调动 5 年中调薪 6 年度调薪 7 特别调薪 8 其他',
  `enableDate` date NOT NULL COMMENT '生效时间',
  `proBeforeSum` varchar(20) NOT NULL DEFAULT '0' COMMENT '试用期调整前工资',
  `proAfterSum` varchar(20) NOT NULL DEFAULT '0' COMMENT '试用期调整后工资',
  `proSalary` varchar(4096) NOT NULL DEFAULT '' COMMENT '试用期工资明细',
  `beforeSum` varchar(20) NOT NULL DEFAULT '0' COMMENT '正式调整前工资 json',
  `afterSum` varchar(20) NOT NULL DEFAULT '0' COMMENT '正式调整后工资',
  `salary` varchar(4096) NOT NULL DEFAULT '' COMMENT '正式工资明细 json',
  `status` varchar(255) NOT NULL DEFAULT '0' COMMENT '状态 0 未生效 1 已生效 2 已取消',
  `employeeStatus` varchar(255) DEFAULT NULL,
  `beforeTotal` varchar(20) NOT NULL DEFAULT '0' COMMENT '调整前总薪资',
  `afterTotal` varchar(20) NOT NULL DEFAULT '0' COMMENT '调整后总薪资',
  `remarks` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `createUserId` varchar(255) NOT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `salary_change_record_employee_id_index` (`employeeId`) USING BTREE,
  KEY `salary_change_record_status_index` (`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 COMMENT = '定薪调薪记录表';



INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'b5c5208d90464cbf80a1e924c407d9e4',1,0,'2022-11-12','0','0','[{\"code\":10101,\"name\":\"基本工资\",\"value\":0},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','0','3333222111','[{\"code\":10101,\"name\":\"基本工资\",\"value\":\"3333\"},{\"code\":10102,\"name\":\"岗位工资\",\"value\":\"222\"},{\"code\":10103,\"name\":\"职务工资\",\"value\":\"111\"}]','1','1','0','3333222111','定薪','2022-11-12 17:15:13','admin','insert',NULL,NULL,'2022-11-12T17:15:13+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'b5c5208d90464cbf80a1e924c407d9e4',2,0,'2022-11-12','0','0','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":0},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":0},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','3333222111','444775','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":\"3333\"},{\"code\":10102,\"name\":\"岗位工资\",\"value\":\"222\"},{\"code\":10103,\"name\":\"职务工资\",\"value\":\"111\"}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":444442},{\"code\":10102,\"name\":\"岗位工资\",\"value\":222},{\"code\":10103,\"name\":\"职务工资\",\"value\":111}]}','0','1','3333222111','444775','','2022-11-12 22:20:42','admin','update',NULL,NULL,'2022-11-14T16:25:44+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'7bfcc8f873cf4ee69021bfae5f2f2fa0',1,0,'2022-11-14','0','100','[{\"code\":10101,\"name\":\"基本工资\",\"value\":40},{\"code\":10102,\"name\":\"岗位工资\",\"value\":50},{\"code\":10103,\"name\":\"职务工资\",\"value\":10}]','0','880','[{\"code\":10101,\"name\":\"基本工资\",\"value\":800},{\"code\":10102,\"name\":\"岗位工资\",\"value\":60},{\"code\":10103,\"name\":\"职务工资\",\"value\":20}]','1','2','0','880','定薪','2022-11-12 23:13:46','admin','update',NULL,NULL,'2022-11-14T16:17:40+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (5,'fwW81K19WvhDrtTfuSBph',1,0,'2022-11-14','0','900','[{\"code\":10101,\"name\":\"基本工资\",\"value\":100},{\"code\":10102,\"name\":\"岗位工资\",\"value\":300},{\"code\":10103,\"name\":\"职务工资\",\"value\":500}]','0','1200','[{\"code\":10101,\"name\":\"基本工资\",\"value\":200},{\"code\":10102,\"name\":\"岗位工资\",\"value\":400},{\"code\":10103,\"name\":\"职务工资\",\"value\":600}]','1',NULL,'0','1200','','2022-11-14 13:47:37','admin','insert',NULL,NULL,'2022-11-14T13:47:37+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'yrZ60Lc0gjRgNLJaAoPTd',1,0,'2022-11-14','0','900','[{\"code\":10101,\"name\":\"基本工资\",\"value\":100},{\"code\":10102,\"name\":\"岗位工资\",\"value\":300},{\"code\":10103,\"name\":\"职务工资\",\"value\":500}]','0','1200','[{\"code\":10101,\"name\":\"基本工资\",\"value\":200},{\"code\":10102,\"name\":\"岗位工资\",\"value\":400},{\"code\":10103,\"name\":\"职务工资\",\"value\":600}]','1',NULL,'0','1200','','2022-11-14 13:50:23','admin','insert',NULL,NULL,'2022-11-14T13:50:23+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'E1B',1,0,'2023-03-03','0','2000','[{\"code\":10101,\"name\":\"基本工资\",\"value\":1000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":1000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','0','6000','[{\"code\":10101,\"name\":\"基本工资\",\"value\":3000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":3000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','1',NULL,'0','6000','','2023-03-03 14:30:15','admin','insert',NULL,NULL,'2023-03-03T14:30:15+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'E4J',1,0,'2023-03-07','0','4000','[{\"code\":10101,\"name\":\"基本工资\",\"value\":3000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":1000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','0','6200','[{\"code\":10101,\"name\":\"基本工资\",\"value\":5000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":1200},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','1','全职','0','6200','','2023-03-07 15:59:16','L00001','insert',NULL,NULL,'2023-03-07T15:59:16+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (9,'E5M',1,0,'2023-03-07','0','200','[{\"code\":10101,\"name\":\"基本工资\",\"value\":200},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','0','500','[{\"code\":10101,\"name\":\"基本工资\",\"value\":500},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','1','兼职','0','500','','2023-03-07 16:42:51','L00001','insert',NULL,NULL,'2023-03-07T16:42:51+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,'E4J',1,0,'2023-03-07','0','5000','[{\"code\":10101,\"name\":\"基本工资\",\"value\":3000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":2000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','0','8000','[{\"code\":10101,\"name\":\"基本工资\",\"value\":5000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":3000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]','1','全职','0','8000','','2023-03-07 22:47:19','L00001','insert',NULL,NULL,'2023-03-07T22:47:19+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (11,'E4J',2,0,'2023-03-07','0','0','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":3000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":2000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":3000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":2000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','8000','11000','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":5000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":3000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":8000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":3000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','1','全职','8000','11000','','2023-03-07 22:51:46','L00001','insert',NULL,NULL,'2023-03-07T22:51:46+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (12,'E5M',2,0,'2023-03-08','0','0','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":200},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":200},{\"code\":10102,\"name\":\"岗位工资\",\"value\":0},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','1000030000','20000','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":\"10000\"},{\"code\":10102,\"name\":\"岗位工资\",\"value\":\"3000\"},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":15000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":5000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','1','全职','1000030000','20000','','2023-03-08 23:42:42','L00001','insert',NULL,NULL,'2023-03-08T23:42:42+08:00');
INSERT INTO `salary_change_record` (`id`,`employeeId`,`recordType`,`changeReason`,`enableDate`,`proBeforeSum`,`proAfterSum`,`proSalary`,`beforeSum`,`afterSum`,`salary`,`status`,`employeeStatus`,`beforeTotal`,`afterTotal`,`remarks`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (16,'E5M',2,0,'2023-03-08','0','10000','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":\"5000\"},{\"code\":10102,\"name\":\"岗位工资\",\"value\":\"3000\"},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":5000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":5000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','13000','20000','{\"oldSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":10000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":3000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}],\"newSalary\":[{\"code\":10101,\"name\":\"基本工资\",\"value\":15000},{\"code\":10102,\"name\":\"岗位工资\",\"value\":5000},{\"code\":10103,\"name\":\"职务工资\",\"value\":0}]}','1','全职','13000','20000','','2023-03-09 11:27:35','L00001','insert',NULL,NULL,'2023-03-09T11:27:35+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_change_template
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_change_template`;
CREATE TABLE `salary_change_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `templateName` varchar(20) NOT NULL COMMENT '模板名称',
  `isDefault` int(11) NOT NULL DEFAULT '0' COMMENT '是否默认 0 否 1 是',
  `value` varchar(4096) NOT NULL DEFAULT '',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createUserId` varchar(255) NOT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34636 COMMENT = '调薪模板';



INSERT INTO `salary_change_template` (`id`,`templateName`,`isDefault`,`value`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'默认定薪模板',1,'[{\"code\":10101,\"name\":\"基本工资\"},{\"code\":10102,\"name\":\"岗位工资\"},{\"code\":10103,\"name\":\"职务工资\"}]','2020-11-24 21:20:43','0','jhUpdate','admin','系统管理员','2022-11-12T10:26:14+08:00');
INSERT INTO `salary_change_template` (`id`,`templateName`,`isDefault`,`value`,`createTime`,`createUserId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (34635,'津贴模板',0,'[{\"code\":10101,\"name\":\"基本工资\"},{\"code\":10102,\"name\":\"岗位工资\"},{\"code\":10103,\"name\":\"职务工资\"},{\"code\":20101,\"name\":\"住房补贴\"}]','2022-11-12 10:33:21','admin','jhInsert','admin','系统管理员','2022-11-12T10:33:21+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_config`;
CREATE TABLE `salary_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `configId` varchar(255) NOT NULL,
  `salaryCycleStartDay` int(11) DEFAULT NULL COMMENT '计薪周期开始日',
  `salaryCycleEndDay` int(11) DEFAULT NULL COMMENT '计薪周期结束日',
  `payType` int(11) DEFAULT NULL COMMENT '发薪日期类型 1 当月 2 次月',
  `payDay` int(11) DEFAULT NULL COMMENT '发薪日期',
  `socialSecurityMonthType` int(11) DEFAULT NULL COMMENT '对应社保自然月 0上月 1当月 2次月',
  `salaryStartMonth` varchar(20) DEFAULT NULL COMMENT '薪酬起始月份（例2020.05）',
  `socialSecurityStartMonth` varchar(20) DEFAULT NULL COMMENT '社保开始月（例2020.05）',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '薪资初始配置';



INSERT INTO `salary_config` (`id`,`configId`,`salaryCycleStartDay`,`salaryCycleEndDay`,`payType`,`payDay`,`socialSecurityMonthType`,`salaryStartMonth`,`socialSecurityStartMonth`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'1',1,31,NULL,NULL,0,'2022-03','2022-01',NULL,NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_group`;
CREATE TABLE `salary_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `groupId` varchar(255) NOT NULL COMMENT '薪资组id',
  `groupName` varchar(50) DEFAULT NULL COMMENT '薪资组名称',
  `deptIds` varchar(1024) DEFAULT NULL COMMENT '部门范围',
  `employeeIds` varchar(1024) DEFAULT NULL COMMENT '员工范围',
  `salaryStandard` varchar(20) DEFAULT '21.75' COMMENT '月计薪标准',
  `changeRule` varchar(20) DEFAULT '按转正/调薪前后的工资混合计算' COMMENT '转正、调薪月规则',
  `ruleId` varchar(255) DEFAULT NULL COMMENT '计税规则id',
  `createTime` datetime NOT NULL,
  `createUserId` varchar(255) NOT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 COMMENT = '薪资组';



INSERT INTO `salary_group` (`id`,`groupId`,`groupName`,`deptIds`,`employeeIds`,`salaryStandard`,`changeRule`,`ruleId`,`createTime`,`createUserId`,`operationByUser`,`operation`,`operationByUserId`,`operationAt`) VALUES (1,'2','默认薪资组','','E5M','21.75','按转正/调薪前后的工资混合计算','49','2022-11-01 21:14:00','1','刘老师','jhUpdate','L00001','2023-03-07T14:34:31+08:00');
INSERT INTO `salary_group` (`id`,`groupId`,`groupName`,`deptIds`,`employeeIds`,`salaryStandard`,`changeRule`,`ruleId`,`createTime`,`createUserId`,`operationByUser`,`operation`,`operationByUserId`,`operationAt`) VALUES (2,'7JjtK4CONwP-Ku2aPTE8p','测试薪资组','测试','E4J,E1B','21.75','按转正/调薪前后的工资混合计算','50','2023-03-07 14:26:39','L00001','刘老师','insert','L00001','2023-03-07T14:26:39+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_month_emp_record
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_month_emp_record`;
CREATE TABLE `salary_month_emp_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `sEmpRecordId` varchar(255) NOT NULL,
  `sRecordId` varchar(255) DEFAULT NULL COMMENT '每月生成薪资id',
  `employeeId` varchar(255) DEFAULT NULL COMMENT '员工id',
  `actualWorkDay` decimal(10, 2) DEFAULT NULL COMMENT '实际计薪时长',
  `needWorkDay` decimal(10, 2) DEFAULT NULL COMMENT '月计薪时长',
  `year` int(11) DEFAULT NULL COMMENT '年',
  `month` int(11) DEFAULT NULL COMMENT '月',
  `optionList` text COMMENT '明细项',
  `realSalary` decimal(10, 2) DEFAULT NULL COMMENT '实发工资',
  `readStatus` varchar(255) DEFAULT '未发送' COMMENT '工资条状态：未发送 | 未读 | 已读',
  `createTime` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 124 COMMENT = '员工每月薪资记录';



INSERT INTO `salary_month_emp_record` (`id`,`sEmpRecordId`,`sRecordId`,`employeeId`,`actualWorkDay`,`needWorkDay`,`year`,`month`,`optionList`,`realSalary`,`readStatus`,`createTime`,`operationByUserId`,`operation`,`operationByUser`,`operationAt`) VALUES (70,'4dPTheWMduSlneQbkYsX5','M8qylZNtgjT-8P5_-FwOT','E4J',21.75,0.00,2022,3,'[{\"code\":10101,\"value\":8000},{\"code\":10102,\"value\":3000},{\"code\":10103,\"value\":0},{\"code\":20101,\"value\":0},{\"code\":20102,\"value\":0},{\"code\":20103,\"value\":0},{\"code\":20104,\"value\":0},{\"code\":30101,\"value\":0},{\"code\":40101,\"value\":0},{\"code\":40102,\"value\":0},{\"code\":40103,\"value\":0},{\"code\":50101,\"value\":0},{\"code\":60101,\"value\":0},{\"code\":70101,\"value\":0},{\"code\":80101,\"value\":0},{\"code\":80102,\"value\":0},{\"code\":90101,\"value\":0},{\"code\":90102,\"value\":0},{\"code\":90103,\"value\":0},{\"code\":100101,\"value\":1160},{\"code\":100102,\"value\":150},{\"code\":110101,\"value\":3040},{\"code\":120101,\"value\":1350},{\"code\":130101,\"value\":0},{\"code\":140101,\"value\":0},{\"code\":150101,\"value\":0},{\"code\":160101,\"value\":0},{\"code\":160102,\"value\":0},{\"code\":160103,\"value\":0},{\"code\":170101,\"value\":0},{\"code\":180101,\"value\":0},{\"code\":190101,\"value\":0},{\"code\":190102,\"value\":0},{\"code\":190103,\"value\":0},{\"code\":190104,\"value\":0},{\"code\":190105,\"value\":0},{\"code\":190106,\"value\":0},{\"code\":200101,\"value\":0},{\"code\":210101,\"value\":11000},{\"code\":220101,\"value\":0},{\"code\":230101,\"value\":0},{\"code\":240101,\"value\":9690}]',9690.00,'未读','2023-03-07 23:29:44.717',NULL,'update',NULL,'2023-03-07T23:34:49+08:00');
INSERT INTO `salary_month_emp_record` (`id`,`sEmpRecordId`,`sRecordId`,`employeeId`,`actualWorkDay`,`needWorkDay`,`year`,`month`,`optionList`,`realSalary`,`readStatus`,`createTime`,`operationByUserId`,`operation`,`operationByUser`,`operationAt`) VALUES (122,'MO4X9VS9fA6AIdEC-1MlD','7Fj-X-xOHby2eCBjOENzL','E4J',21.75,0.00,2022,4,'[{\"code\":10101,\"parentCode\":10,\"value\":7000},{\"code\":10102,\"parentCode\":10,\"value\":3000},{\"code\":10103,\"parentCode\":10,\"value\":0},{\"code\":20101,\"parentCode\":20,\"value\":0},{\"code\":20102,\"parentCode\":20,\"value\":0},{\"code\":20103,\"parentCode\":20,\"value\":0},{\"code\":20104,\"parentCode\":20,\"value\":0},{\"code\":30101,\"parentCode\":30,\"value\":0},{\"code\":40101,\"parentCode\":40,\"value\":0},{\"code\":40102,\"parentCode\":40,\"value\":0},{\"code\":40103,\"parentCode\":40,\"value\":0},{\"code\":50101,\"parentCode\":50,\"value\":0},{\"code\":60101,\"parentCode\":60,\"value\":0},{\"code\":70101,\"parentCode\":70,\"value\":0},{\"code\":80101,\"parentCode\":80,\"value\":0},{\"code\":80102,\"parentCode\":80,\"value\":0},{\"code\":90101,\"parentCode\":90,\"value\":0},{\"code\":90102,\"parentCode\":90,\"value\":0},{\"code\":90103,\"parentCode\":90,\"value\":0},{\"code\":100101,\"parentCode\":100,\"value\":1160},{\"code\":100102,\"parentCode\":100,\"value\":150},{\"code\":110101,\"parentCode\":110,\"value\":3040},{\"code\":120101,\"parentCode\":120,\"value\":1350},{\"code\":130101,\"parentCode\":130,\"value\":0},{\"code\":140101,\"parentCode\":140,\"value\":0},{\"code\":150101,\"parentCode\":150,\"value\":0},{\"code\":160101,\"parentCode\":160,\"value\":0},{\"code\":160102,\"parentCode\":160,\"value\":0},{\"code\":160103,\"parentCode\":160,\"value\":0},{\"code\":170101,\"parentCode\":170,\"value\":0},{\"code\":180101,\"parentCode\":180,\"value\":0},{\"code\":190101,\"parentCode\":190,\"value\":0},{\"code\":190102,\"parentCode\":190,\"value\":0},{\"code\":190103,\"parentCode\":190,\"value\":0},{\"code\":190104,\"parentCode\":190,\"value\":0},{\"code\":190105,\"parentCode\":190,\"value\":0},{\"code\":190106,\"parentCode\":190,\"value\":0},{\"code\":200101,\"parentCode\":200,\"value\":0},{\"code\":210101,\"parentCode\":210,\"value\":10000},{\"code\":220101,\"parentCode\":220,\"value\":\"5690.00\"},{\"code\":230101,\"parentCode\":230,\"value\":\"910.40\"},{\"code\":240101,\"parentCode\":240,\"value\":7779.6}]',0.00,'未发送','2023-03-09 15:27:31.823',NULL,'insert',NULL,'2023-03-09T15:27:32+08:00');
INSERT INTO `salary_month_emp_record` (`id`,`sEmpRecordId`,`sRecordId`,`employeeId`,`actualWorkDay`,`needWorkDay`,`year`,`month`,`optionList`,`realSalary`,`readStatus`,`createTime`,`operationByUserId`,`operation`,`operationByUser`,`operationAt`) VALUES (123,'t6qQLA7TPVO9oPuWXDlew','7Fj-X-xOHby2eCBjOENzL','E5M',21.75,0.00,2022,4,'[{\"code\":10101,\"parentCode\":10,\"value\":5000},{\"code\":10102,\"parentCode\":10,\"value\":5000},{\"code\":10103,\"parentCode\":10,\"value\":0},{\"code\":20101,\"parentCode\":20,\"value\":0},{\"code\":20102,\"parentCode\":20,\"value\":0},{\"code\":20103,\"parentCode\":20,\"value\":0},{\"code\":20104,\"parentCode\":20,\"value\":0},{\"code\":30101,\"parentCode\":30,\"value\":0},{\"code\":40101,\"parentCode\":40,\"value\":0},{\"code\":40102,\"parentCode\":40,\"value\":0},{\"code\":40103,\"parentCode\":40,\"value\":0},{\"code\":50101,\"parentCode\":50,\"value\":0},{\"code\":60101,\"parentCode\":60,\"value\":0},{\"code\":70101,\"parentCode\":70,\"value\":0},{\"code\":80101,\"parentCode\":80,\"value\":0},{\"code\":80102,\"parentCode\":80,\"value\":0},{\"code\":90101,\"parentCode\":90,\"value\":0},{\"code\":90102,\"parentCode\":90,\"value\":0},{\"code\":90103,\"parentCode\":90,\"value\":0},{\"code\":100101,\"parentCode\":100,\"value\":592},{\"code\":100102,\"parentCode\":100,\"value\":80},{\"code\":110101,\"parentCode\":110,\"value\":588},{\"code\":120101,\"parentCode\":120,\"value\":320},{\"code\":130101,\"parentCode\":130,\"value\":0},{\"code\":140101,\"parentCode\":140,\"value\":0},{\"code\":150101,\"parentCode\":150,\"value\":0},{\"code\":160101,\"parentCode\":160,\"value\":0},{\"code\":160102,\"parentCode\":160,\"value\":0},{\"code\":160103,\"parentCode\":160,\"value\":0},{\"code\":170101,\"parentCode\":170,\"value\":0},{\"code\":180101,\"parentCode\":180,\"value\":0},{\"code\":190101,\"parentCode\":190,\"value\":0},{\"code\":190102,\"parentCode\":190,\"value\":0},{\"code\":190103,\"parentCode\":190,\"value\":0},{\"code\":190104,\"parentCode\":190,\"value\":0},{\"code\":190105,\"parentCode\":190,\"value\":0},{\"code\":190106,\"parentCode\":190,\"value\":0},{\"code\":200101,\"parentCode\":200,\"value\":0},{\"code\":210101,\"parentCode\":210,\"value\":10000},{\"code\":220101,\"parentCode\":220,\"value\":4328},{\"code\":230101,\"parentCode\":230,\"value\":\"129.84\"},{\"code\":240101,\"parentCode\":240,\"value\":9198.16}]',0.00,'未发送','2023-03-09 15:27:31.823',NULL,'insert',NULL,'2023-03-09T15:27:32+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_month_record
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_month_record`;
CREATE TABLE `salary_month_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `sRecordId` varchar(255) NOT NULL,
  `title` varchar(40) DEFAULT NULL COMMENT '报表标题',
  `year` int(11) DEFAULT NULL COMMENT '年',
  `month` int(11) DEFAULT NULL COMMENT '月',
  `startTime` date DEFAULT NULL COMMENT '计薪开始日期',
  `endTime` date DEFAULT NULL COMMENT '计薪结束日期',
  `personalInsuranceAmount` decimal(10, 2) DEFAULT NULL COMMENT '个人社保金额',
  `personalProvidentFundAmount` decimal(10, 2) DEFAULT NULL COMMENT '个人公积金金额',
  `corporateInsuranceAmount` decimal(10, 2) DEFAULT NULL COMMENT '公司社保金额',
  `corporateProvidentFundAmount` decimal(10, 2) DEFAULT NULL COMMENT '公司社保金额',
  `expectedPaySalary` decimal(10, 2) DEFAULT NULL COMMENT '预应发工资',
  `personalTax` decimal(10, 2) DEFAULT NULL COMMENT '个人所得税',
  `realPaySalary` decimal(10, 2) DEFAULT NULL COMMENT '预计实发工资',
  `optionHead` longtext COMMENT '薪资项表头',
  `examineRecordId` varchar(255) DEFAULT NULL COMMENT '审核记录id',
  `checkStatus` int(11) DEFAULT '5' COMMENT '状态  0待审核、1通过、2拒绝、3审核中 4:撤回 5 未提交  10 历史薪资 11核算完成',
  `createUserId` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 101 COMMENT = '每月薪资记录';



INSERT INTO `salary_month_record` (`id`,`sRecordId`,`title`,`year`,`month`,`startTime`,`endTime`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`expectedPaySalary`,`personalTax`,`realPaySalary`,`optionHead`,`examineRecordId`,`checkStatus`,`createUserId`,`createTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (61,'M8qylZNtgjT-8P5_-FwOT','3月薪资报表',2022,3,'2022-03-01','2022-03-31',1160.00,150.00,3040.00,1350.00,NULL,NULL,NULL,NULL,NULL,0,'L00001','2023-03-07 23:29:44.490','insert',NULL,NULL,'2023-03-07T23:29:44+08:00');
INSERT INTO `salary_month_record` (`id`,`sRecordId`,`title`,`year`,`month`,`startTime`,`endTime`,`personalInsuranceAmount`,`personalProvidentFundAmount`,`corporateInsuranceAmount`,`corporateProvidentFundAmount`,`expectedPaySalary`,`personalTax`,`realPaySalary`,`optionHead`,`examineRecordId`,`checkStatus`,`createUserId`,`createTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (100,'7Fj-X-xOHby2eCBjOENzL','4月薪资报表',2022,4,'2022-04-01','2022-04-30',1752.00,230.00,3628.00,1670.00,NULL,NULL,NULL,NULL,NULL,0,'L00001','2023-03-09 15:27:31.474','insert',NULL,NULL,'2023-03-09T15:27:31+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: salary_tax_rule
# ------------------------------------------------------------

DROP TABLE IF EXISTS `salary_tax_rule`;
CREATE TABLE `salary_tax_rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `ruleId` varchar(255) NOT NULL,
  `ruleName` varchar(50) NOT NULL COMMENT '规则名称',
  `taxType` int(255) DEFAULT NULL COMMENT '个税类型 1 工资薪金所得税 2 劳务报酬所得税 3 不计税',
  `isTax` int(11) DEFAULT NULL COMMENT '是否计税 0 否 1 是',
  `markingPoint` int(11) DEFAULT NULL COMMENT '起征点',
  `decimalPoint` int(11) DEFAULT NULL COMMENT '个税结果(保留小数点)',
  `cycleType` int(11) DEFAULT NULL COMMENT '计税周期类型 1 上年12月到今年11月（对应的工资发放方式为次月发上月工资） 2 今年1月到12月（对应的工资发放方式为当月发当月工资）',
  `operation` varchar(255) DEFAULT NULL,
  `operationByUserId` varchar(255) DEFAULT NULL,
  `operationByUser` varchar(255) DEFAULT NULL,
  `operationAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55 COMMENT = '计税规则';



INSERT INTO `salary_tax_rule` (`id`,`ruleId`,`ruleName`,`taxType`,`isTax`,`markingPoint`,`decimalPoint`,`cycleType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (52,'49','工资薪金所得税',1,1,5000,2,1,NULL,NULL,NULL,NULL);
INSERT INTO `salary_tax_rule` (`id`,`ruleId`,`ruleName`,`taxType`,`isTax`,`markingPoint`,`decimalPoint`,`cycleType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (53,'50','劳务报酬所得税',2,1,800,2,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `salary_tax_rule` (`id`,`ruleId`,`ruleName`,`taxType`,`isTax`,`markingPoint`,`decimalPoint`,`cycleType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (54,'51','不计税',3,0,0,NULL,NULL,NULL,NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _view01_user
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `_view01_user` AS
select
  `_user`.`id` AS `id`,
  `_user`.`idSequence` AS `idSequence`,
  `_user`.`userId` AS `userId`,
  `_user`.`username` AS `username`,
  `_user`.`clearTextPassword` AS `clearTextPassword`,
  `_user`.`password` AS `password`,
  `_user`.`md5Salt` AS `md5Salt`,
  `_user`.`userStatus` AS `userStatus`,
  `_user`.`userType` AS `userType`,
  `_user`.`config` AS `config`,
  `_user`.`operation` AS `operation`,
  `_user`.`operationByUserId` AS `operationByUserId`,
  `_user`.`operationByUser` AS `operationByUser`,
  `_user`.`operationAt` AS `operationAt`
from
  `_user`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_archives_option_by_emp
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_archives_option_by_emp` AS
select
  `salary_archives_option`.`employeeId` AS `employeeId`,
  sum(`salary_archives_option`.`value`) AS `totalSalary`
from
  `salary_archives_option`
group by
  `salary_archives_option`.`employeeId`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_attendance_clock
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_attendance_clock` AS
select
  `employee`.`employeeName` AS `employeeName`,
  `attendance_clock`.`id` AS `id`,
  `attendance_clock`.`clockId` AS `clockId`,
  `attendance_clock`.`clockEmployeeId` AS `clockEmployeeId`,
  `attendance_clock`.`clockTime` AS `clockTime`,
  `attendance_clock`.`clockType` AS `clockType`,
  `attendance_clock`.`attendanceTime` AS `attendanceTime`,
  `attendance_clock`.`type` AS `type`,
  `attendance_clock`.`address` AS `address`,
  `attendance_clock`.`lng` AS `lng`,
  `attendance_clock`.`lat` AS `lat`,
  `attendance_clock`.`remark` AS `remark`,
  `attendance_clock`.`operationByUserId` AS `operationByUserId`,
  `attendance_clock`.`operation` AS `operation`,
  `attendance_clock`.`operationByUser` AS `operationByUser`,
  `attendance_clock`.`operationAt` AS `operationAt`
from
  (
  `attendance_clock`
  left join `employee` on(
    (
    `attendance_clock`.`clockEmployeeId` = `employee`.`employeeId`
    )
  )
  );





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_employee
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_employee` AS
select
  distinct `employee`.`id` AS `id`,
  `employee`.`employeeId` AS `employeeId`,
  `employee`.`employeeName` AS `employeeName`,
  `employee`.`idSequence` AS `idSequence`,
  `employee`.`sex` AS `sex`,
  `employee`.`age` AS `age`,
  `employee`.`contactNumber` AS `contactNumber`,
  `employee`.`emergencyContactNumber` AS `emergencyContactNumber`,
  `employee`.`post` AS `post`,
  `employee`.`politicalBackground` AS `politicalBackground`,
  `employee`.`icNumber` AS `icNumber`,
  `employee`.`dateOfBirth` AS `dateOfBirth`,
  `employee`.`institution` AS `institution`,
  `employee`.`major` AS `major`,
  `employee`.`highestEducation` AS `highestEducation`,
  `employee`.`teacherQualification` AS `teacherQualification`,
  `employee`.`teacherQualificationLeaver` AS `teacherQualificationLeaver`,
  `employee`.`teacherQualificationSubject` AS `teacherQualificationSubject`,
  `employee`.`teacherCertificationNumber` AS `teacherCertificationNumber`,
  `employee`.`teachingLevel` AS `teachingLevel`,
  `employee`.`teachingSubject` AS `teachingSubject`,
  `employee`.`residentialAddress` AS `residentialAddress`,
  `employee`.`province` AS `province`,
  `employee`.`city` AS `city`,
  `employee`.`county` AS `county`,
  `employee`.`dateOfEntry` AS `dateOfEntry`,
  `employee`.`dateOfContractExpiration` AS `dateOfContractExpiration`,
  `employee`.`cardNumber` AS `cardNumber`,
  `employee`.`licensePlateNumber` AS `licensePlateNumber`,
  `employee`.`employmentForms` AS `employmentForms`,
  `employee`.`entryStatus` AS `entryStatus`,
  `employee`.`status` AS `status`,
  `employee`.`remarks` AS `remarks`,
  `employee`.`leaveRequestStatus` AS `leaveRequestStatus`,
  `employee`.`contactPerson` AS `contactPerson`,
  `employee`.`educationExperience` AS `educationExperience`,
  `employee`.`certificate` AS `certificate`,
  `employee`.`salaryCard` AS `salaryCard`,
  `employee`.`socialSecurity` AS `socialSecurity`,
  `employee`.`trainingExperience` AS `trainingExperience`,
  `employee`.`workExperience` AS `workExperience`,
  `employee`.`operation` AS `operation`,
  `employee`.`operationByUserId` AS `operationByUserId`,
  `employee`.`operationByUser` AS `operationByUser`,
  `employee`.`operationAt` AS `operationAt`,
  `view01_member_org_role`.`orgId` AS `orgId`,
  `view01_member_org_role`.`orgName` AS `orgName`
from
  (
  `employee`
  left join `view01_member_org_role` on(
    (
    `employee`.`employeeId` = `view01_member_org_role`.`memberId`
    )
  )
  );





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_employee_archives
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_employee_archives` AS
select
  distinct `employee`.`employeeId` AS `employeeId`,
  `employee`.`id` AS `id`,
  `employee`.`employeeName` AS `employeeName`,
  `employee`.`county` AS `country`,
  `employee`.`status` AS `status`,
  `salary_archives`.`changeDate` AS `changeDate`,
  `salary_archives`.`changeReason` AS `changeReason`,
  `employee`.`dateOfEntry` AS `dateOfEntry`,
  `view01_archives_option_by_emp`.`totalSalary` AS `totalSalary`,
  `salary_archives`.`changeType` AS `changeType`,
  `employee`.`entryStatus` AS `entryStatus`,
  `employee`.`employmentForms` AS `employmentForms`,
  `employee`.`dateOfContractExpiration` AS `dateOfContractExpiration`
from
  (
  (
    `employee`
    left join `salary_archives` on(
    (
      `employee`.`employeeId` = `salary_archives`.`employeeId`
    )
    )
  )
  left join `view01_archives_option_by_emp` on(
    (
    `employee`.`employeeId` = `view01_archives_option_by_emp`.`employeeId`
    )
  )
  );





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_employee_quit_list
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_employee_quit_list` AS
select
  `employee`.`id` AS `id`,
  `employee`.`employeeId` AS `employeeId`,
  `employee`.`employeeName` AS `employeeName`,
  `employee`.`idSequence` AS `idSequence`,
  `employee`.`sex` AS `sex`,
  `employee`.`age` AS `age`,
  `employee`.`contactNumber` AS `contactNumber`,
  `employee`.`emergencyContactNumber` AS `emergencyContactNumber`,
  `employee`.`post` AS `post`,
  `employee`.`politicalBackground` AS `politicalBackground`,
  `employee`.`icNumber` AS `icNumber`,
  `employee`.`dateOfBirth` AS `dateOfBirth`,
  `employee`.`institution` AS `institution`,
  `employee`.`major` AS `major`,
  `employee`.`highestEducation` AS `highestEducation`,
  `employee`.`teacherQualification` AS `teacherQualification`,
  `employee`.`teacherQualificationLeaver` AS `teacherQualificationLeaver`,
  `employee`.`teacherQualificationSubject` AS `teacherQualificationSubject`,
  `employee`.`teacherCertificationNumber` AS `teacherCertificationNumber`,
  `employee`.`teachingLevel` AS `teachingLevel`,
  `employee`.`teachingSubject` AS `teachingSubject`,
  `employee`.`residentialAddress` AS `residentialAddress`,
  `employee`.`province` AS `province`,
  `employee`.`city` AS `city`,
  `employee`.`county` AS `county`,
  `employee`.`dateOfEntry` AS `dateOfEntry`,
  `employee`.`dateOfContractExpiration` AS `dateOfContractExpiration`,
  `employee`.`cardNumber` AS `cardNumber`,
  `employee`.`licensePlateNumber` AS `licensePlateNumber`,
  `employee`.`employmentForms` AS `employmentForms`,
  `employee`.`entryStatus` AS `entryStatus`,
  `employee`.`status` AS `status`,
  `employee`.`remarks` AS `remarks`,
  `employee`.`operation` AS `operation`,
  `employee`.`operationByUserId` AS `operationByUserId`,
  `employee`.`operationByUser` AS `operationByUser`,
  `employee`.`operationAt` AS `operationAt`,
  `employee_quit_info`.`planQuitTime` AS `planQuitTime`
from
  (
  `employee`
  left join `employee_quit_info` on(
    (
    `employee`.`employeeId` = `employee_quit_info`.`employeeId`
    )
  )
  );





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_insurance_month
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_insurance_month` AS
select
  `insurance_month_record`.`iRecordId` AS `iRecordId`,
  `insurance_month_record`.`title` AS `title`,
  `insurance_month_record`.`year` AS `year`,
  `insurance_month_record`.`month` AS `month`,
  count(distinct `insurance_month_emp_record`.`id`) AS `num`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`personalInsuranceAmount`,
    0
  )
  ) AS `personalInsuranceAmount`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`personalProvidentFundAmount`,
    0
  )
  ) AS `personalProvidentFundAmount`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`corporateInsuranceAmount`,
    0
  )
  ) AS `corporateInsuranceAmount`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`corporateProvidentFundAmount`,
    0
  )
  ) AS `corporateProvidentFundAmount`,
  count(
  if(
    (`insurance_month_emp_record`.`status` = 0),
    `insurance_month_emp_record`.`iEmpRecordId`,
    NULL
  )
  ) AS `stopCount`,
  `insurance_month_record`.`status` AS `monthStatus`
from
  (
  `insurance_month_record`
  left join `insurance_month_emp_record` on(
    (
    (
      `insurance_month_record`.`year` = `insurance_month_emp_record`.`year`
    )
    and (
      `insurance_month_record`.`month` = `insurance_month_emp_record`.`month`
    )
    and (
      `insurance_month_record`.`iRecordId` = `insurance_month_emp_record`.`iRecordId`
    )
    )
  )
  )
group by
  `insurance_month_record`.`year`,
  `insurance_month_record`.`month`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_insurance_scheme
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_insurance_scheme` AS
select
  `insurance_month_record`.`iRecordId` AS `iRecordId`,
  `insurance_month_record`.`title` AS `title`,
  `insurance_month_record`.`year` AS `year`,
  `insurance_month_record`.`month` AS `month`,
  count(`insurance_month_emp_record`.`id`) AS `num`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`personalInsuranceAmount`,
    0
  )
  ) AS `personalInsuranceAmount`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`personalProvidentFundAmount`,
    0
  )
  ) AS `personalProvidentFundAmount`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`corporateInsuranceAmount`,
    0
  )
  ) AS `corporateInsuranceAmount`,
  sum(
  if(
    (`insurance_month_emp_record`.`status` = 1),
    `insurance_month_emp_record`.`corporateProvidentFundAmount`,
    0
  )
  ) AS `corporateProvidentFundAmount`,
  count(
  if(
    (`insurance_month_emp_record`.`status` = 0),
    `insurance_month_emp_record`.`iEmpRecordId`,
    NULL
  )
  ) AS `stopCount`,
  `insurance_month_record`.`status` AS `monthStatus`
from
  (
  `insurance_month_record`
  left join `insurance_month_emp_record` on(
    (
    (
      `insurance_month_record`.`year` = `insurance_month_emp_record`.`year`
    )
    and (
      `insurance_month_record`.`month` = `insurance_month_emp_record`.`month`
    )
    and (
      `insurance_month_record`.`iRecordId` = `insurance_month_emp_record`.`iRecordId`
    )
    )
  )
  )
group by
  `insurance_month_record`.`year`,
  `insurance_month_record`.`month`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_job_resume
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_job_resume` AS
select
  `job_resume`.`id` AS `id`,
  `job_resume`.`jobId` AS `jobId`,
  `job_resume`.`jobTitle` AS `jobTitle`,
  `job_resume`.`jobResumeId` AS `jobResumeId`,
  `job_resume`.`user` AS `user`,
  `job_resume`.`gender` AS `gender`,
  `job_resume`.`age` AS `age`,
  `job_resume`.`ethnicity` AS `ethnicity`,
  `job_resume`.`height` AS `height`,
  `job_resume`.`weight` AS `weight`,
  `job_resume`.`bloodType` AS `bloodType`,
  `job_resume`.`maritalStatus` AS `maritalStatus`,
  `job_resume`.`politicalAffiliation` AS `politicalAffiliation`,
  `job_resume`.`physicalCondition` AS `physicalCondition`,
  `job_resume`.`religiousBeliefs` AS `religiousBeliefs`,
  `job_resume`.`phoneNumber` AS `phoneNumber`,
  `job_resume`.`IDNumber` AS `IDNumber`,
  `job_resume`.`email` AS `email`,
  `job_resume`.`highestEducation` AS `highestEducation`,
  `job_resume`.`wechatID` AS `wechatID`,
  `job_resume`.`nativePlace` AS `nativePlace`,
  `job_resume`.`homeAddress` AS `homeAddress`,
  `job_resume`.`currentAddress` AS `currentAddress`,
  `job_resume`.`academicRanking` AS `academicRanking`,
  `job_resume`.`workplace` AS `workplace`,
  `job_resume`.`salaryExpectation` AS `salaryExpectation`,
  `job_resume`.`domicilePlace` AS `domicilePlace`,
  `job_resume`.`earliestAvailability` AS `earliestAvailability`,
  `job_resume`.`education` AS `education`,
  `job_resume`.`educationCertificate` AS `educationCertificate`,
  `job_resume`.`experience` AS `experience`,
  `job_resume`.`familyMember` AS `familyMember`,
  `job_resume`.`teacherContact` AS `teacherContact`,
  `job_resume`.`studentSocialization` AS `studentSocialization`,
  `job_resume`.`socialActivities` AS `socialActivities`,
  `job_resume`.`achievement` AS `achievement`,
  `job_resume`.`socialHobbies` AS `socialHobbies`,
  `job_resume`.`personality` AS `personality`,
  `job_resume`.`careerPlanning` AS `careerPlanning`,
  `job_resume`.`offence` AS `offence`,
  `job_resume`.`resumeStatus` AS `resumeStatus`,
  `job_resume`.`operation` AS `operation`,
  `job_resume`.`operationByUserId` AS `operationByUserId`,
  `job_resume`.`operationByUser` AS `operationByUser`,
  `job_resume`.`operationAt` AS `operationAt`
from
  `job_resume`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_member_org_role
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_member_org_role` AS
select
  `member_org_role`.`id` AS `id`,
  `member_org_role`.`orgId` AS `orgId`,
  `member_org_role`.`memberId` AS `memberId`,
  `member_org_role`.`roleId` AS `roleId`,
  `member_org_role`.`remark` AS `remark`,
  `org`.`orgParentId` AS `orgParentId`,
  `org`.`orgPath` AS `orgPath`,
  `org`.`orgName` AS `orgName`,
  `employee`.`employeeId` AS `employeeId`,
  `employee`.`employeeName` AS `employeeName`,
  `employee`.`idSequence` AS `idSequence`,
  `employee`.`sex` AS `sex`,
  `employee`.`age` AS `age`,
  `employee`.`contactNumber` AS `contactNumber`,
  `employee`.`emergencyContactNumber` AS `emergencyContactNumber`,
  `employee`.`post` AS `post`,
  `employee`.`politicalBackground` AS `politicalBackground`,
  `employee`.`icNumber` AS `icNumber`,
  `employee`.`dateOfBirth` AS `dateOfBirth`,
  `employee`.`institution` AS `institution`,
  `employee`.`major` AS `major`,
  `employee`.`highestEducation` AS `highestEducation`,
  `employee`.`teacherQualification` AS `teacherQualification`,
  `employee`.`teacherQualificationLeaver` AS `teacherQualificationLeaver`,
  `employee`.`teacherQualificationSubject` AS `teacherQualificationSubject`,
  `employee`.`teacherCertificationNumber` AS `teacherCertificationNumber`,
  `employee`.`teachingLevel` AS `teachingLevel`,
  `employee`.`teachingSubject` AS `teachingSubject`,
  `employee`.`residentialAddress` AS `residentialAddress`,
  `employee`.`province` AS `province`,
  `employee`.`city` AS `city`,
  `employee`.`county` AS `county`,
  `employee`.`dateOfEntry` AS `dateOfEntry`,
  `employee`.`dateOfContractExpiration` AS `dateOfContractExpiration`,
  `employee`.`cardNumber` AS `cardNumber`,
  `employee`.`licensePlateNumber` AS `licensePlateNumber`,
  `employee`.`employmentForms` AS `employmentForms`,
  `employee`.`entryStatus` AS `entryStatus`,
  `employee`.`status` AS `status`,
  `employee`.`remarks` AS `remarks`
from
  (
  (
    `member_org_role`
    left join `org` on((`member_org_role`.`orgId` = `org`.`orgId`))
  )
  left join `employee` on(
    (
    `member_org_role`.`memberId` = `employee`.`employeeId`
    )
  )
  );





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_salary_group_rule
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_salary_group_rule` AS
select
  `salary_group`.`id` AS `id`,
  `salary_group`.`groupId` AS `groupId`,
  `salary_group`.`groupName` AS `groupName`,
  `salary_group`.`deptIds` AS `deptIds`,
  `salary_group`.`employeeIds` AS `employeeIds`,
  `salary_group`.`salaryStandard` AS `salaryStandard`,
  `salary_group`.`changeRule` AS `changeRule`,
  `salary_group`.`ruleId` AS `ruleId`,
  `salary_group`.`createTime` AS `createTime`,
  `salary_group`.`createUserId` AS `createUserId`,
  `salary_group`.`operationByUser` AS `operationByUser`,
  `salary_group`.`operation` AS `operation`,
  `salary_group`.`operationByUserId` AS `operationByUserId`,
  `salary_group`.`operationAt` AS `operationAt`,
  `salary_tax_rule`.`taxType` AS `taxType`,
  `salary_tax_rule`.`isTax` AS `isTax`,
  `salary_tax_rule`.`ruleName` AS `ruleName`,
  `salary_tax_rule`.`markingPoint` AS `markingPoint`,
  `salary_tax_rule`.`decimalPoint` AS `decimalPoint`,
  `salary_tax_rule`.`cycleType` AS `cycleType`
from
  (
  `salary_group`
  left join `salary_tax_rule` on(
    (
    `salary_group`.`ruleId` = `salary_tax_rule`.`ruleId`
    )
  )
  );





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_salary_month_record
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_salary_month_record` AS
select
  `salary_month_record`.`id` AS `id`,
  `salary_month_record`.`sRecordId` AS `sRecordId`,
  `salary_month_record`.`title` AS `title`,
  `salary_month_record`.`year` AS `year`,
  `salary_month_record`.`month` AS `month`,
  `salary_month_record`.`startTime` AS `startTime`,
  `salary_month_record`.`endTime` AS `endTime`,
  `salary_month_record`.`personalInsuranceAmount` AS `personalInsuranceAmount`,
  `salary_month_record`.`personalProvidentFundAmount` AS `personalProvidentFundAmount`,
  `salary_month_record`.`corporateInsuranceAmount` AS `corporateInsuranceAmount`,
  `salary_month_record`.`corporateProvidentFundAmount` AS `corporateProvidentFundAmount`,
  `salary_month_record`.`expectedPaySalary` AS `expectedPaySalary`,
  `salary_month_record`.`personalTax` AS `personalTax`,
  `salary_month_record`.`realPaySalary` AS `realPaySalary`,
  `salary_month_record`.`optionHead` AS `optionHead`,
  `salary_month_record`.`examineRecordId` AS `examineRecordId`,
  `salary_month_record`.`checkStatus` AS `checkStatus`,
  `salary_month_record`.`createUserId` AS `createUserId`,
  `salary_month_record`.`createTime` AS `createTime`,
  `salary_month_record`.`operation` AS `operation`,
  `salary_month_record`.`operationByUserId` AS `operationByUserId`,
  `salary_month_record`.`operationByUser` AS `operationByUser`,
  `salary_month_record`.`operationAt` AS `operationAt`,
  count(`salary_month_emp_record`.`id`) AS `num`
from
  (
  `salary_month_record`
  left join `salary_month_emp_record` on(
    (
    `salary_month_record`.`sRecordId` = `salary_month_emp_record`.`sRecordId`
    )
  )
  );





