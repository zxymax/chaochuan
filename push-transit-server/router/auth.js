const consoleLogger = require('../logger/console-logger');
const { getAccessToken } = require('../utils/access-token');
const { getUser } = require('../controllers/user');

async function loginAuth (ctx, next) {
    const accessToken = getAccessToken(ctx.header.authorization);

    if(accessToken){
        try {
            ctx.user = await getUser(accessToken);
        }
        catch (err) {
            consoleLogger.error({ msg: '获取用户失败' });
        }
    }

    if(!ctx.user) {
        Object.assign(ctx, {
            status: 401,
            body: {
                code: -1,
                msg: '未登陆!'
            }
        });
        return ;
    }

    await next();
}

module.exports = {
    loginAuth
};