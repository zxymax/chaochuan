const JPush = require('jpush-sdk');
const { jpush: { appKey, secret: masterSecret}  } = require('../config');
const consoleLogger = require('../logger/console-logger');
const client = JPush.buildClient({ appKey, masterSecret, isDebug: false });

/*
* jpush
* @param {object} message 消息对象
* @param {array} audience tag 如果array中含有'all'，则设置JPush.ALL
* @param {boolean} isGroup 是否全局发送
* */
function jpush (message, audience, isGroup = false) {
    if(typeof message !== 'object'){
        consoleLogger.error({ message: 'message不为对象!!!'});
        return ;
    }

    let setAudience;
    // audience为字符串，则是单用户推送
    if(typeof audience === 'string'){
        setAudience = JPush.alias([audience]);
    }
    // audience为数组，则是多用户推送
    else if(Array.isArray(audience)){
        if(audience.includes('all')){
            setAudience = JPush.ALL;
        }else{
            setAudience = JPush.tag(audience);
        }
    }

    let { title, content } = message;

    let extras = Object.assign({}, message, {
        isGroup
    });

    return new Promise((resolve, reject) => {
        // 所有平台全部发送
        client.push().setPlatform('ios', 'android')
            // 设置听众
            .setAudience(setAudience)
            // 通知
            .setNotification(
                JPush.ios(content, 'sound', 1, false, extras),
                JPush.android(content, title, null, extras)
            )
            // 自定义消息
            .setMessage(content, title, '', extras)
            .setOptions(null, 60)
            .send(function(err, res) {
                if (err) {
                    reject(err.message);
                    consoleLogger.error({ api: '极光发送消息失败', message: err.message });
                } else {
                    resolve(res);
                }
            });
    });
}
module.exports = jpush;