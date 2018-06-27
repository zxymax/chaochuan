/*
* 获取access_token
* */
function getAccessToken (authoration) {
    const bearer = 'Bearer ';
    if(authoration && authoration.includes(bearer)) {
        return authoration.slice(bearer.length);
    }
    return null;
}

module.exports = {
    getAccessToken
};