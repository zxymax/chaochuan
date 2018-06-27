const ObjectID = require('mongodb').ObjectID;
const { messages: messagesCollection, messageStatistics:  statisticsCollection } = require('../models/mongo');

/*
* 获取消息列表
* @param  {number} userid 用户userid
* @param  {number} skip 跳过个数
* @param  {number} limit 请求个数
* @return {Object} total消息总数, list 消息列表
* */
async function getMsgList (userid, skip, limit = 6) {
    const query = { 'status': true, 'header.toUser.userid': userid };
    const total = await messagesCollection.count( query );
    const list = await messagesCollection.find( query, { sort: { createDate: -1 }, skip, limit});

    return JSON.parse(JSON.stringify({
        total,
        list
    }));
}

/*
* 通过发布平台获取消息列表
* @param  {number} platform 发布平台
* @param  {number} skip 跳过个数
* @param  {number} limit 请求个数
* @return {Object} total消息总数, list 消息列表
* */
async function getMsgListByPlatform (platform, skip, limit = 6) {
    const query = { 'status': true, 'header.platform': platform };
    const total = await messagesCollection.count( query );
    const list = await messagesCollection.find( query, { sort: { createDate: -1 }, skip, limit});

    return {
        total,
        list
    };
}

/*
* 获取新消息数量
* @param  {number} userid 用户userid
* @return {number} 未读数量
* */
async function getNewMsgCount (userid) {
    const query = { 'status': true, userid };
    try{
        const { count } = await statisticsCollection.findOne( query );
        return count;
    }
    catch (err) {
        return null;
    }
}

/*
* 新消息设置为0
* @param  {string} userid 用户userid
* @return {bollean} true成功, false:失败
* */
async function clearMsgCount (userid) {
    try {
        await statisticsCollection.update({userid}, {'$set': { count: 0 }});
        return true;
    }
    catch (err) {
        return false;
    }
}

/*
* 未读消息加1
* @param  {string} userid 用户userid
* @return {bollean} true成功, false:失败
* */
async function updateCount (userid) {
    if(!userid){
        return false;
    }

    let count = await statisticsCollection.count({userid});

    try {
        if(count > 0){
            await statisticsCollection.update({userid}, {'$inc': { count: 1 }});
        }else{
            await statisticsCollection.insert({userid, status: true, count: 1, createDate: new Date()});
        }

        return true;
    }
    catch (err) {
        return false;
    }
}


/*
* 添加新消息
* @param  {object} 消息体
* @return {boolean} true 添加成功, false 添加失败
* */
async function addMsg (message) {
    Object.assign(message, {
        // 创建时间
        createDate: new Date(),
        status: true,
        // 消息默认未读
        readed: false
    });

    try {
        await messagesCollection.insert(message);
        return true;
    }
    catch (err) {
        return false;
    }
}

/*
* 设置消息已读
* @param  {object} 消息体
* @return {boolean} true 添加成功, false 添加失败
* */
async function updateReaded (id) {
    const _id = new ObjectID(id);

    try {
        await messagesCollection.update({_id}, {'$set': { readed: true }});
        return true;
    }
    catch (err) {
        return false;
    }
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