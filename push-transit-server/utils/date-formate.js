const moment = require('moment');

/*
*  日期格式化
*  @param  {string} utc date
*  @return {string} formate date
* */
function dateFormate (utc) {
    const utcDate = moment.utc(utc);

    // 判断日期是否格式正确
    if(!utcDate.isValid()){
        return '';
    }

    const now = moment().format('YYYY-MM-DD');
    const formatUtcDate = moment(utcDate.format('YYYY-MM-DD'));

    // 判断是否为今天, 返回 小时:分钟
    if(formatUtcDate.isSame(now, 'day')){
        return moment(utcDate).utcOffset(8).format('HH:mm');
    }
    // 判断是否为昨天, 返回 昨天
    else if(formatUtcDate.diff(now, 'days') === -1){
        return '昨天 ' + moment(utcDate).utcOffset(8).format('HH:mm');
    }
    // 判断是否为今年
    else if(utcDate.year() === moment().year()){
        return `${(utcDate.month() + 1)}月${(utcDate.date())}日 ` + moment(utcDate).utcOffset(8).format('HH:mm');
    }
    // 其他情况返回日期
    else{
        return `${utcDate.year()}年${(utcDate.month() + 1)}月${(utcDate.date())}日 ` + moment(utcDate).utcOffset(8).format('HH:mm');
    }
}

module.exports = dateFormate;

