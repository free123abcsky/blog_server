/**
 * User: kfs
 * Date：2016/11/5
 * Desc：邮箱模板配置
 */
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var mail = config.mail;

module.exports = {
    subject: 'Node.JS通过SMTP协议从163邮箱发送邮件',
    text: '',
    html: '',
    prefixText: '',
    suffixText: '',
    prefixHtml: '<p>'+mail.account+',您好：<p/>'
    + '<p>我们收到您在 '+ config.app.name +' 的注册申请，请点击下面的链接激活帐户：</p>'
    + '<a href="',
    suffixHtml: '"> 请点击本链接激活帐号 </a>'
}
