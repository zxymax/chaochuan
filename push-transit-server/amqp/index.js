const config = require('../config');
const jpush = require('../jpush');
const user = require('../controllers/user');
const messages = require('../controllers/messages');
const messageFormate = require('../utils/message-formate');
const consoleLogger = require('../logger/console-logger');
const Amqp = require('./amqp');

async function messageHandler (message) {
    if(typeof message !== 'object'){
        consoleLogger.error({ message: '消息体格式错误' });
        return ;
    }

    let {
        header: {
            toUser,
            toGroup
        },
        body
    } = message;

    // 当订单状态为 等待分配、未开始状态时，不推送给用户
    if(body && body.hasOwnProperty('contract')){
        const { contract : { statusCode } } = body;

        if(['等待分配', '未开始'].includes(statusCode)){
            return ;
        }
    }

    let pushMessage = messageFormate(body);

    // 如果toUser为对象，根据用户手机号通过uaa系统获取用户userid
    if(typeof toUser === 'object'){
        const { mobile } = toUser;
        try{
            let { username: userid } = await user.getUserByMobile(mobile);
            // let userid = '97b0efb7-4ae1-4019-a2a8-e51842d54e3f';
            // let userid = '3009ecfe-365d-4ac7-bbd6-99c2828f8285';
            Object.assign(message.header.toUser, {
                userid
            });
            // userid含有不合法的符号，极光推送的alias中不允许存在-，将-替换为_
            jpush(pushMessage, userid.replace(/-/g, '_'));
            // 单用户推送更改未读消息数量
            messages.updateCount(userid);
        }
        catch (err) {
            let { message: msg, error } = err;
            consoleLogger.error({ api: '根据手机号获取用户信息', msg, error});
        }
    }
    // 如果toGruop为对象，则直接调用极光api推送消息
    if(typeof toGroup === 'object'){
        const { group } = toGroup;
        // 多用户推送
        jpush(pushMessage, group, true);
    }

    // 存储数据库
    messages.addMsg(message);
}

function amqp () {
    let mq = new Amqp(config.amqp);

    mq.createChannel(function() {
        mq.consume(function(message){
            consoleLogger.log({ message, path: 'amqp/index.js', api: 'mq.consume' });
            messageHandler(message);
        });
    });
}

module.exports = amqp;
