/**
 * User: kfs
 * Date：2016/11/5
 * Desc：邮箱公用方法
 */
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var mail = config.mail;
var mailtpl = require('../config/mailtpl');

function genVerifyLink(userId) {
    var md5 = crypto.createHash('md5');
    var sign = md5.update(config.sessionSecret + userId).digest('hex');
    return config.web + '/users/' + userId + '/verify?confirm_token=' + sign;
}

exports.sendVerifyEmail = function(toEmail, userId, callback) {

    var transporter = nodemailer.createTransport({

        service: mail.service,
        //host: "smtp.163.com",
        //secureConnection: true,
        //port: 25,  // port for secure SMTP
        auth: {
            user: mail.account,
            pass: mail.password
        }
    });

    var verifyLink = genVerifyLink(userId);

    var mailOptions = {
        from: mail.account,
        to: toEmail,
        subject: mailtpl.subject,
        text: mailtpl.prefixText + verifyLink + mailtpl.suffixText,
        html: mailtpl.prefixHtml + verifyLink + mailtpl.suffixHtml
    };

    transporter.sendMail(mailOptions, callback);
};

