const moment = require('moment');
const validateErrorHander = require('../utils/validate-error-handler');
const messageFormate = require('../utils/message-formate');
const dateFormate = require('../utils/date-formate');
const Messages = require('../services/messages');
// 分页配置
const MESSAGE_PAGINATOR_CONFIG = {
    page: 1,
    count: 6
};

/*
* 获取消息列表
* @param  {number} page 当前页数
* @param  {number} count 每页请求数
* @return {Object} code 请求状态码, msg 错误提示, list 消息列表
* */
async function getMsgList (ctx) {
    const page = ctx.checkQuery('page').default(MESSAGE_PAGINATOR_CONFIG.page).toInt(0).value;
    const limit = ctx.checkQuery('count').default(MESSAGE_PAGINATOR_CONFIG.count).toInt(0).value;
    const skip = (page - 1) * limit;
    const userid = ctx.user.username;
    // 获取消息列表
    let messagesModel = await Messages.getMsgList(userid, skip, limit);
    // 验证是否请求成功，如果请求成功则messagesModel有list、total属性
    if(messagesModel.hasOwnProperty('list') && messagesModel.hasOwnProperty('total')){
        let  { total, list } = messagesModel;
        let formateList = [];
        console.log(list);
        for(let item of list){
            let { _id, body, readed, createDate } = item;

            formateList.push({
                _id,
                readed,
                createDate: dateFormate(createDate),
                ...messageFormate(body)
            });
        }

        ctx.body = Object.assign({
            code: 0,
            msg: '',
            total,
            list: formateList
        });
    }else{
        ctx.body = {
            code: 1,
            msg: '获取消息列表失败!!!'
        };
    }
}

/*
* 通过发布平台获取消息列表
* @query  {number} page 当前页数
* @query  {number} count 每页请求数
* @param  {number} platform 发布平台
* @return {Object} code 请求状态码, msg 错误提示, list 消息列表
* */
async function getMsgListByPlatform (ctx) {
    const page = ctx.checkQuery('page').default(MESSAGE_PAGINATOR_CONFIG.page).toInt(0).value;
    const limit = ctx.checkQuery('count').default(MESSAGE_PAGINATOR_CONFIG.count).toInt(0).value;
    const platform = ctx.checkParams('platform').notEmpty('发布平台不能为空').value;
    // 验证参数是否正确
    const { code, msg } = validateErrorHander(ctx.errors);
    // 参数异常
    if(code === 1){
        ctx.body = {
            code,
            msg
        };
        return false;
    }

    const skip = (page - 1) * limit;
    // 获取消息列表
    let messagesModel = await Messages.getMsgListByPlatform(platform, skip, limit);
    // 验证是否请求成功，如果请求成功则messagesModel有list、total属性
    if(messagesModel.hasOwnProperty('list') && messagesModel.hasOwnProperty('total')){
        ctx.body = Object.assign({
            code: 0,
            msg: ''
        }, messagesModel);
    }else{
        ctx.body = {
            code: 1,
            msg: '获取消息列表失败!!!'
        };
    }
}

/*
* 获取消息未读数量
* @return {Object} code 请求状态码, msg 错误提示, unread 未读数量
* */
async function getNewMsgCount (ctx) {
    const userid = ctx.user.username;
    // 获取未读消息数量
    let count = await Messages.getNewMsgCount(userid);

    if(typeof count === 'number'){
        ctx.body = {
            code: 0,
            msg: '',
            count
        };
    }else{
        ctx.body = {
            code: 1,
            msg: '获取新消息数量失败!!!'
        };
    }
}

/*
* 清空新消息数量
* @return {Object} code 请求状态码, msg 错误提示
* */
async function clearMsgCount (ctx) {
    const userid = ctx.user.username;
    const status = await Messages.clearMsgCount(userid);

    ctx.body = {
        code: status ? 0 : 1,
        msg: status ? '新消息数量设置为0!!!' : '新消息数量设置为0失败!!!'
    };
}

/*
* 新增消息(监测消息队列)
* @param  {Object} body
* @return {Object} code 请求状态码, msg 错误提示
* */
async function addMsg (message) {
    if(typeof message !== 'object'){
        return ;
    }

    return Messages.addMsg(message);
}

/*
* 单用户新消息加1 (监测消息队列)
* @param  {string} userid
* @return {Object} code 请求状态码, msg 错误提示
* */
async function updateCount (userid) {
    if(!userid){
        return false;
    }

    return Messages.updateCount(userid);
}

/*
* 更新消息已读已读状态
* @param  {string} id 消息id
* @return {Object} code 请求状态码, msg 错误提示
* */
async function updateReaded (ctx) {
    const id = ctx.checkParams('id').notEmpty('消息id不能为空!').value;

    // 验证参数是否正确
    const { code, msg } = validateErrorHander(ctx.errors);
    // 参数异常
    if(code === 1){
        ctx.body = {
            code,
            msg
        };
        return false;
    }

    const status = await Messages.updateReaded(id);

    ctx.body = {
        code: status ? 0 : 1,
        msg: status ? '消息设置为已读!!!' : '消息设置已读失败!!!'
    };
}


module.exports = {
    getMsgList,
    getMsgListByPlatform,
    getNewMsgCount,
    clearMsgCount,
    updateCount,
    addMsg,
    updateReaded
};