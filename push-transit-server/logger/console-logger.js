const config = require('../config');

function wrap( json = {} ) {
    return JSON.stringify(Object.assign({}, json, {
        'logtype': 102,
        '@target_index': config.serviceId,
        '@timestamp': new Date()
    }));
}

/*
* 打印日志
* */
module.exports = {
    log ( json = {} ) {
        json.status = 1;
        console.log(wrap(json));
    },
    warn ( json = {} ) {
        json.status = 2;
        console.warn(wrap(json));
    },
    error ( json = {} ) {
        json.status = 3;
        console.warn(wrap(json));
    },
};