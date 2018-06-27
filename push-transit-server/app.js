const config = require('./config');

config.init().then(() => {
    start();
});

function start() {
    const Koa = require('koa');
    const bodyParser = require('koa-bodyparser');
    const compress = require('koa-compress');
    const router = require('./router');
    const amqp = require('./amqp');
    const heathCheck = require('./utils/heath-check');
    const koaLogger = require('./logger/koa-logger');
    const consoleLogger = require('./logger/console-logger');
    // 实例化koa
    const app = new Koa();
    // 解析body
    app.use(bodyParser());
    // 验证参数
    require('koa-validate')(app);
    // gzip压缩
    app.use(compress());
    // health check
    app.use(heathCheck);
    // koa router日志
    app.use(koaLogger());
    // 处理异常信息中间件
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            Object.assign(ctx, {
                status: 200,
                body: {
                    code: -1,
                    msg: '系统异常'
                }
            });
            consoleLogger.error({ api: '中间件异常', message: err.message, err: err.stack });
        }
    });
    // 添加路由
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(config.port);
    // 监听消息队列
    amqp();

    console.log(`start!!! port ${config.port}`);
}
