const request = require('../utils/request');
const config = require('../config');
const consoleLogger = require('../logger/console-logger');

/*
*获取用户信息
* @param  {string} accessToken 用户登陆token
* @return {Object} user
* */
async function getUser (accessToken) {
    if(!accessToken){
        consoleLogger.error({ api: '/ua/api/user/me', msg: 'accessToken为空'});
        return null;
    }

    const uri = `${config.oauth2.server}/ua/api/user/me`;

    try {
        const res = await request(uri, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(res.statusCode === 401) {
            return null;
        }

        return res;
    }
    catch(err) {
        let { message: msg, error } = err;
        consoleLogger.error({ api: '/ua/api/user/me', msg, error});
    }
}

/*
*通过手机号码获取用户信息
* @param  {string} mobile 用户手机号
* @return {Object} user
* */
async function getUserByMobile (mobile) {
    if(!mobile){
        consoleLogger.error({ msg: '手机号码为空!!!'});
        return null;
    }

    const mobileReg = /(^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/;

    if(!mobileReg.test(moblie)){
        consoleLogger.error({ api: '/uaapi/internal/user/:mobile', msg: '手机号码格式不正确!!!'});
        return null;
    }
    const uri = `${config.oauth2.server}/uaapi/internal/user/${mobile}`;
    try {
        return await request(uri);
    }
    catch(err) {
        let { message: msg, error } = err;
        consoleLogger.error({ api: '/ua/api/internal/user/:mobile', msg, error});
    }
}

module.exports = {
    getUser,
    getUserByMobile
};