const monk = require('monk');
const { mongo: { url, option } } = require('../config');
const db = monk( url, option );
// 消息Collection
const messages = db.get('messages');
// 添加索引
messages.createIndex({ "createDate": 1 }, { background: true });

// 消息统计Collection
const messageStatistics = db.get('messageStatistics');
// 添加索引
messageStatistics.createIndex({ "userid": 1 }, { background: true });

module.exports = {
    messages,
    messageStatistics
};
