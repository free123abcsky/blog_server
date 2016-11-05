/**
 * User: kfs
 * Date：2016/11/5
 * Desc：本地server入口
 */

var express = require('express');
var logger  = require('./utils/logger');  //日志管理
var log4js = require('log4js');
var session = require('express-session'); //会话管理中间件
var bodyParser = require('body-parser');  //请求内容解析中间件
var compression = require('compression');  //gzip压缩中间件
var errorhandler = require('errorhandler');  //错误处理中间件
var access = require('./middlewares/access');  //CORS处理中间件

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var apiRouter = require('./config/api_router');
var app = express();
//数据库连接
require('./utils/db')(config);

//配置路由基本设置（中间件设置）
app.set('port', process.env.PORT || config.port);
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO, format:':method :url'}));
app.use(access.allowCORS);
app.use(bodyParser.json());
app.use(compression());
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));
app.use('/api', apiRouter);

if ('development' == app.get('env')) {
    app.use(errorhandler());
}
//监听端口设置
if (!module.parent) {
    app.listen(app.get('port'), function () {
        logger.info('blog_server listening on port', app.get('port'));
    });
}

module.exports = app;

