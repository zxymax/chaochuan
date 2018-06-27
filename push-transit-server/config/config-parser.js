const configParser = (config) => {
    // mongo配置
    const mongo = {
        url: config.get('spring.data.mongodb.uri') + (config.get('spring.data.mongodb.database') ? ('/' + config.get('spring.data.mongodb.database')) : ''),
        option : {
            poolSize: config.get('spring.data.mongodb.option.poolSize'),
            autoReconnect: config.get('spring.data.mongodb.option.autoReconnect'),
            connectTimeoutMS: config.get('spring.data.mongodb.option.connectTimeoutMS')
        }
    };
    // uaa auth2
    const oauth2 = {
        server: config.get('pilipa.oauth2.server'),
        appid: config.get('pilipa.oauth2.appid'),
        secret: config.get('pilipa.oauth2.secret'),
        redirect_url: config.get('pilipa.oauth2.redirect_url'),
        timeout: config.get('pilipa.oauth2.timeout'),
        redirect_url_encode: encodeURIComponent(config.get('pilipa.oauth2.redirect_url'))
    };
    // jpush
    const jpush = {
        appKey: config.get('pilipa.jpush.appKey'),
        secret: config.get('pilipa.jpush.secret')
    };
    // amqp
    let amqp = [];

    const addresss = config.get('spring.rabbitmq.addresses').split(','),
          protocol = 'amqp',
          queue = 'queue_customer',
          username = config.get('spring.rabbitmq.username'),
          password = config.get('spring.rabbitmq.password'),
          vhost = config.get('spring.rabbitmq.virtual-host');

    // 遍历addresss, 获取每个地址的hostname, port
    if(Array.isArray(addresss)){
        for(let address of addresss){
            let [hostname, port] = address.split(':');
            amqp.push({
                protocol,
                hostname,
                port,
                username,
                password,
                vhost,
                queue
            });
        }
    }

    return {
        mongo,
        oauth2,
        jpush,
        amqp
    }
};

module.exports = configParser;