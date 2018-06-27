/**
 * Created by wsd on 17/2/23.
 */


const amqp = require('./amqp');

let mq = new amqp([
    {
        protocol:'amqp',
        port: 5672,
        hostname:'47.94.99.69',
        password:'pilipA000!',
        username: 'message',
        vhost:'message',
        queue:'queue_customer'
    }
]);

mq.createChannel(function() {
  
    mq.send({
        header: {
            type: "push",//push 推送消息
            platform: "erp", //erp,channel,agent,cms,customer
            fromUser: {
                userid: "xxxx",//微信id
                mobile: "13266666666",
            },
            toUser: {//单用户
                userid: "xxxx",//微信id
                // mobile: "13241338952",
                // mobile: "15710009117",
                // mobile: "13522807924",
                // mobile: '15711376076',
                // mobile: "17788888888",
                // mobile: '13761616161',
                // mobile: '18900001111',
                // mobile: '15688889999',
                // mobile: '15901069641'
                // mobile: '18502146922'
                // mobile: '18888888888'
                // mobile: '18899995555'
                // mobile: '15566667777'
                // mobile: '13100009999'
                // mobile: '15788889999'
                // mobile: '17600300887'
                // mobile: '15666665555'
                mobile: '18766666666'
            },
            /*toGroup: {
                group: ['test']
            }*/
        },
        body: {
            img: 'https://assets.pilipa.cn/app/customerFrontend/static/media/logo.af3fba37.png',
            type: "custom",//contract 合同, worker 外勤, account 账务, custom 自定义消息
            /*worker: {//外勤
                company: {//企业信息
                    id: "101",
                    mobile: "13266666666",
                    name: "北京测试公司test111",
                    contacts:"xxx"//联系人
                },
                contractID: "1",//合同id
                parentTask: "17788888888主任务", //主任务名称
                childTask:"子任务11",//子任务
                start: "", //开始时间
                end: "", //结束时间
                statusCode:"进行时", //执行状态
                handler:"测试员sdf"//操作员
            }*/
            /*contract: {//合同
                company: {//企业信息
                    id: "101",
                    mobile: "13266666666",
                    name: "北京15666665555公司",
                    contacts:"18900001111"//联系人
                },
                contractID: "1",//合同id
                statusCode: "未开始1"//合同状态
            }*/
            custom: {
                title: '通知',
                content: '年终签约代理记账！',
                url: 'https://www.pilipa.cn/activity'
            }
            /*custom: {
                title: '首页test2',
                content: '首页内容',
                url: 'pilipa://tab.home'
            }*/
            /*custom: {
                title: '服务',
                content: '服务内容',
                url: 'pilipa://tab.service'
            }*/
            /*custom: {
                title: '消息',
                content: '消息内容',
                url: 'pilipa://tab.messages'
            }*/
            /*custom: {
                title: '我的',
                content: '我的内容',
                url: 'pilipa://tab.me'
            }*/
            /*custom: {
                title: 'h5123',
                content: 'h5内容',
                // url: 'pilipa://tab.messages'
                // url: 'https://x-www.i-counting.cn/register/limited?platform=app'
                url: 'https://x-www.i-counting.cn/notify'
            }*/
            /*custom: {
                title: '订单列表',
                content: '订单列表内容',
                url: 'pilipa://view.orders'
            }*/
            /*custom: {
                title: 'test group2',
                content: '订单详情内容',
                url: 'pilipa://view.orders.detail?orderno=1'
            }*/
            /*custom: {
                title: '现金流',
                content: '现金流内容',
                url: 'pilipa://view.services/cashflow?companyid=111&year=2016&month=06'
            }*/
            /*custom: {
                title: '利润表',
                content: '利润表内容',
                url: 'pilipa://view.services/profit?companyid=111&year=2016&month=06'
            }*/
            /*custom: {
                title: '纳税表',
                content: '纳税表内容',
                url: 'pilipa://view.services/tax?companyid=111&year=2016&month=06'
            }*/
            /*custom: {
                title: '应收账款',
                content: '应收账款内容',
                url: 'pilipa://view.services/accounts/receivable?companyid=111&year=2016&month=06'
            }*/
            /*custom: {
                title: '应付账款',
                content: '应付账款内容',
                url: 'pilipa://view.services/accounts/payable?companyid=111&year=2016&month=06'
            }*/
            /*custom: {
                title: '免费核名',
                content: '免费核名内容',
                url: 'pilipa://view.company.check'
            }*/
        }
    });
    // mq.send(JSON.stringify({h: 'h', l: 'o', w:'w'}));
    // mq.send(JSON.stringify({h: 'h', l: 'o', w:'w'}));
    // mq.close();
});


/*
var amqp = require('amqplib');
var when = require('when');
//连接本地消息队列服务
amqp.connect('amqp://localhost').then(function(conn){
//创建通道，让when立即执行promise


conn.once('close', function() {
  console.log('i am connection closed');
});

  return when(conn.createChannel().then(function(ch){
    ch.once('close', function() {
      console.log('i am channel closed');
    });
    var q = 'hello';
    var msg = {h: 'h', l: 'o', w:'w'};
  //监听q队列，设置持久化为false。
    return ch.assertQueue(q,{durable: false}).then(function(_qok){
  //监听成功后向队列发送消息，这里我们就简单发送一个字符串。发送完毕后关闭通道。
      ch.sendToQueue(q,new Buffer(JSON.stringify(msg)));
      console.log(" [x] Sent '%s'",msg);
      return ch.close()
    });
  })).ensure(function(){ //ensure是promise.finally的别名，不管promise的状态如何都会执行的函数
//这里我们把连接关闭
    conn.close();
  });
}).then(null,console.warn);
*/
