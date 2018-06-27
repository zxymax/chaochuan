const healthCheck = async (ctx, next) => {
    const url = ctx.request.url;
    switch ( url ) {
        case '/health/check':
            ctx.body = {status: 'live'};
            break;
        default:
            await next();
    }
};

module.exports = healthCheck;