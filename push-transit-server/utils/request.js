const rp = require('request-promise');
const consoleLogger = require('../logger/console-logger');

async function request (uri, options = {}) {
    let defaultOptions = {
        uri,
        method: 'GET',
        json: true
    };

    let mergeOptions = Object.assign({}, defaultOptions, options),
        res;

    try {
        res = await rp(mergeOptions);
        consoleLogger.log({ ...mergeOptions, res});
        return res;
    }
    catch (err) {
        let { message, statusCode } = res;
        consoleLogger.error({ ...mergeOptions, message});

        if([302, 401].includes(statusCode)){
            return err;
        }

        return res;
    }
}

module.exports = request;