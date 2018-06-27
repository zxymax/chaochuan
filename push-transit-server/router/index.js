const Router = require('koa-router');
const auth = require('./auth');
const messages = require('../controllers/messages');
// 实例化router
const router = new Router({
    prefix: '/api/v1'
});
// 登陆鉴权
router.use('/messages', auth.loginAuth);
// 获取消息列表
router.get('/messages', messages.getMsgList);
// 通过发布平台获取消息列表
router.get('/messages/platform/:platform', messages.getMsgListByPlatform);
// 获取新消息数量
router.get('/messages/new', messages.getNewMsgCount);
// 新增消息
router.post('/messages', messages.addMsg);
// 清空新消息数量
router.put('/messages/clear', messages.clearMsgCount);
// 更新消息已读状态
router.post('/messages/:id', messages.updateReaded);

module.exports = router;

