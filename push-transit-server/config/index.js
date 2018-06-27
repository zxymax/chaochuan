const configLoader = require('./config-loader');
const configParser = require('./config-parser');

let config = {
    // 端口
    port: 3000,
    serviceId: 'pilipa-push-transit-server'
};

let serverEndpoint,
    profiles = [],
    serveName = 'push-transit-server';

let { NODE_ENV } = process.env;

if(NODE_ENV === 'svt'){
    serverEndpoint = 'http://pilipa-configserver:8888';
    profiles.push('svt');
}else if(NODE_ENV === 'production'){
    serverEndpoint = 'http://pilipa-configserver:8888';
    profiles.push('production');
}else {
    serverEndpoint = 'http://localhost:8888';
}

// 初始化config，从configserver中获取配置
config.init = async function () {
    let configFromServer = null,
        status = false;

    try {
        configFromServer = await configLoader({
            endpoint: serverEndpoint,
            name: serveName,
            profiles
        });
        // 请求服务端配置成功
        status = true;
        // 配置config
        Object.assign(config, configParser(configFromServer));
    } catch (err) {
        console.error({msg: '服务端获取配置失败'});
    }

    return new Promise((resolve, reject) => {
        status ? resolve(status) : reject(status);
    });
};

module.exports = config;