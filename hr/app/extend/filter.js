exports.recruitmentType = function(recruitmentType) {
    // 招聘渠道：campus-校园招聘 | social-社会招聘 | internship-实习生
    const recruitmentTypeMap = {
      campus: '校园招聘',
      social: '社会招聘',
      internship: '实习生招聘',
    };
    return recruitmentTypeMap[recruitmentType] || '';
  }
  exports.employmentType = function(type) {
    // 职位类型：full-全职 | part-兼职
    const typeMap = {
      full: '全职',
      part: '兼职',
    };
    return typeMap[type] || '';
  }
  exports.parseUrl = function(path, pageUrl) {
    path = path || ''
    return (path.indexOf('http') === 0 || path == 'javascript:' || path[0] == '#') ? path : pageUrl + path;
  }
  
  /**
   * 格式化时间显示
   * @param {(Object|string|number)} time
   * @param {string} cFormat
   * @return {string}
   */
   exports.parseTime = (time, cFormat = '{y}-{m}-{d}') => {
    if (arguments.length === 0) {
      return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time);
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return [ '日', '一', '二', '三', '四', '五', '六' ][value];
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  };