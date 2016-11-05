/**
 * User: kfs
 * Date：2016/11/5
 * Desc：日志
 */
var log4js = require('log4js');
var env = process.env.NODE_ENV || 'development';

log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: '../logs/access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'normal'
        }
    ]
});
var logger = log4js.getLogger('cheese');
logger.setLevel(env == 'development' ? 'DEBUG' : 'ERROR');

module.exports = logger;
