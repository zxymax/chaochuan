const uuid = require('uuid');
const consoleLogger = require('./console-logger');

function koaLogger () {
    return async function logger (ctx, next) {
        let start = new Date();
        ctx.uuid = uuid.v4();

        try {
            await next();
            ctx.responseTime = new Date() - start;
            consoleLogger.log({ '@responseTime': ctx.responseTime, uid: ctx.uuid, req: ctx, reqBody: ctx.request.body, res: ctx });
        }
        catch (err) {
            ctx.responseTime = new Date() - start;
            consoleLogger.error({ '@responseTime': ctx.responseTime, uid: ctx.uuid, req: ctx, reqBody: ctx.request.body, res: ctx, err: err});
        }
    }
}

module.exports = koaLogger;