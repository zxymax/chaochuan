/*
* 格式化消息
* @param {object} body 消息体
* @return {object} title, content, url
* */
function messageFormate (body) {
    if(typeof body !== 'object'){
        return {};
    }

    const { type, img } = body;

    let title,
        content,
        url;

    switch (type) {
        // 合同
        case 'contract':
            {
                let { company: { name }, statusCode } = body[type];

                title = name;
                content = `尊敬的客户，您的订单已执行到【${statusCode}】步骤，请耐心等待。`;
                url = 'pilipa://view.orders';
            }
            break;
        // 外勤
        case 'worker':
            {
                let { company: { name }, parentTask, childTask, contractID, handler, statusCode } =  body[type];

                title = name;
                if(statusCode === '进行时'){
                    content = `尊敬的客户，您的外勤服务【${parentTask}->${childTask}】已经开始执行，外勤顾问【${handler}】。`
                }else if(statusCode === '已完成'){
                    content = `尊敬的客户，您的外勤服务【${parentTask}->${childTask}】已完成，外勤顾问【${handler}】。`
                }else{
                    content = `尊敬的客户，您的外勤服务【${parentTask}->${childTask}】已经开始执行，外勤顾问【${handler}】。`
                }

                url = `pilipa://view.orders.detail?orderno=${contractID}`;
            }
            break;
        // 账务
        case 'account':
            break;
        // cms
        case 'custom':
            {
                title = body[type].title;
                content = body[type].content;
                url = body[type].url;
            }
            break;
    }

    return {
        title,
        content,
        url,
        img
    };
}

module.exports = messageFormate;