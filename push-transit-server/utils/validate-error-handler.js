/*
* koa-validate错误处理
* */
function validateErrorHander (errors) {
    // koa-validate将错误信息放入ctx.errors数组中, 将错误信息的第一条返回给客户端
    let code = 0, msg;

    if(Array.isArray(errors)){
        code = 1;
        msg = Object.values(errors[0])[0];
    }

    return {
        code,
        msg
    }
}

module.exports = validateErrorHander;