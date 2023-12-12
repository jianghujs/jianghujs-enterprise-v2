'use strict';

class ValidateError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'ValidateError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

class BizError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'BizError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

const errorInfoEnum = Object.freeze({
  data_exception: { errorCode: 'data_exception', errorReason: '数据异常' },
  data_has_loop: { errorCode: 'data_has_loop', errorReason: '数据出现循环' },
  data_has_multi_root: { errorCode: 'data_has_multi_root', errorReason: '数据有多个根节点' },
  data_has_not_root: { errorCode: 'data_has_not_root', errorReason: '数据没有根节点' },
  data_has_children: { errorCode: 'data_has_children', errorReason: '数据有子节点，不能删除' },
  
  data_dont_exists: {
    errorCode: "data_dont_exists",
    errorReason: "数据表不存在",
  },
  data_expection: {
    errorCode: "data_expection",
    errorReason: "数据异常",
  },
  album_queryType_error: {
    errorCode: "album_queryType_error",
    errorReason: "查询类型不匹配",
  },
  article_not_found: {
    errorCode: "article_not_found",
    errorReason: "文章找不到",
  },
  material_is_not_file: {
    errorCode: "material_is_not_file",
    errorReason: "所选素材不是文件类型",
  },
  path_invalid: {
    errorCode: "path_invalid",
    errorReason: "无效的路径",
  },
  target_file_not_exist: {
    errorCode: "target_file_not_exist",
    errorReason: "文件不存在",
  },
  target_folder_invalid: {
    errorCode: "target_folder_invalid",
    errorReason: "粘贴目录不存在",
  },
  design_article_not_exist: {
    errorCode: "design_article_not_exist",
    errorReason: "三稿不存在",
  },
  noEmployee: {
    errorCode: "no_employee",
    errorReason: "没有员工",
  },
  noEmployeeScheme: {
    errorCode: "no_employee_scheme",
    errorReason: "员工无社保方案",
  },
  onlyOneMonthRecord: {
    errorCode: "only_one_month_record",
    errorReason: "只有一个月的记录、不能删除",
  },
  insurance_month_record_not_exist: {
    errorCode: "insurance_month_record_not_exist",
    errorReason: "社保记录未生成",
  },
  salary_change_record_exist: {
    errorCode: "salary_change_record_exist",
    errorReason: "存在未生效工资调薪记录",
  },
});

module.exports = {
  ValidateError,
  BizError,
  errorInfoEnum,
};
