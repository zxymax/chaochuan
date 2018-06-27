'use strict';

const amqplib = require('amqplib');
const async = require('async');
const _ = require('underscore');
/**
 * 
 * @param {*} options 
 * [
 *  {   
 *      protocol: <protocol>
 *      hostname: <hostname>
 *      username: <user>
 *      password: <passwd>
 *      vhost: <vhost>
 *      queue: <queue>
 *  }
 * ]
 *
 */

function amqp(ops) {
    this.options = [];
    if(ops.length > 0) {
        for(let option of ops) {
            const protocol = option.protocol || 'amqp';
            const hostname = option.hostname || 'localhost';
            const port = option.port || (protocol == 'ampq' ? 5672 : 5671);
            this.options.push({
                protocol: protocol,
                hostname: hostname,
                port: port,
                vhost: option.vhost,
                username: option.username,
                password: option.password,
                queue: option.queue
            });
        }
    }
}

amqp.prototype.createChannel = function(fb) {
    this.sets = [];

    let create = function(option, callback) {
        amqplib.connect({
            protocol: option.protocol,
            hostname: option.hostname,
            port: option.port,
            vhost: option.vhost,
            username: option.username,
            password: option.password
        }).then(function(conn){
            // process.once('SIGN',function(){
            //     conn.close();
            // });
            conn.once('close', function() {
                for(let i = 0; i < this.sets.length; i++) {
                    let set =  this.sets[i];
                    if(set.conn == conn) {
                        // set.conn.close();
                        // set.channel.close();
                        this.sets.splice(i, 1);
                        break;
                    }
                }
            }.bind(this));
    
            conn.createChannel().then(function(channel) {
                channel.once('close', function() {
                    console.log('close');
                    for(let i = 0; i < this.sets.length; i++) {
                        let set =  this.sets[i];
                        if(set.channel == channel) {
                            // set.conn.close();
                            // set.channel.close();
                            this.sets.splice(i, 1);
                            break;
                        }
                    }
                }.bind(this));
                callback(null, conn, channel, option);
            }.bind(this));
        }.bind(this));
    }.bind(this);

    let ops = [];
    for(let option of this.options) {
        let op = function(callback) {
            create(option, callback);
        };
        ops.push(op);
    }

    async.parallel(ops, function(err, results) {
        for(let r of results) {
            this.sets.push({
                conn: r[0],
                channel: r[1],
                option: r[2]
            });
        }
        fb();
    }.bind(this));
};

amqp.prototype.consume = function(cb) {
    if(!this.sets || this.sets.length == 0) {
        throw Error('no connection');
    }
    for(let set of this.sets) {
        let channel = set.channel;
        let option = set.option;
        let ok = channel.assertQueue(option.queue,{durable:false}).then(function() {
            return channel.consume(option.queue, function(message) {
                cb(JSON.parse(message.content.toString()));
            }, {noAck:true});
        });

        ok.then(function() {
            console.log(option.hostname, option.queue + ' is wait for message ~');
        });
    }
};

amqp.prototype.send = function(message) {
    if(!this.sets || this.sets.length == 0) {
        throw Error('no connection');
    }
    let size = this.sets.length;
    let random = _.random(0, size - 1);
    let set = this.sets[random];
    message.index = random;
    console.log(set.option.queue);
    set.channel.sendToQueue(set.option.queue,new Buffer(JSON.stringify(message)));
};

amqp.prototype.close = function() {
    for(let set of this.sets) {
        set.conn.close();
        // set.channel.close();
    }
};

module.exports = amqp;