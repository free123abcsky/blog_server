/**
 * User: kfs
 * Date：2016/11/5
 * Desc：认证控制器
 */
var crypto = require('crypto');
var validator      = require('validator');
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var logger  = require('../utils/logger');
var mail = require('../utils/mail');

function genLoginToken(user) {
    _user = {
        _id: user._id,
        email: user.email
    };

    var token = jwt.sign(user, config.sessionSecret, {
        expiresInMinutes: 60 * 24 * 30
    });

    return token;
}

exports.signin = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    // 验证信息的正确性
    if ([email, password].some(function (item) { return item === ''; })) {
        return res.status(403).send({
            error: '信息不完整'
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(403).send({
            error: '邮箱不合法'
        });
    }

    User
        .findOne({
            email: email
        })
        .exec(function(err, user) {
            if (!user) {
                return res.status(403).send({
                    error: '用户不存在'
                });
            }

            if (user.auth(password)) {
                user = user.toObject();
                delete user.passwordHash;
                var token = genLoginToken(user);

                return res.status(200).send({
                    user: user,
                    token: token
                });
            } else {
                return res.status(403).send({
                    error: '用户名或密码错误'
                });
            }
        });
};

exports.signup = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    // 验证信息的正确性
    if ([email, password].some(function (item) { return item === ''; })) {
        return res.status(403).send({
            error: '信息不完整'
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(403).send({
            error: '邮箱不合法'
        });
    }

    User
        .findOne({
            email: email
        })
        .exec(function(err, user) {
            if (user) {
                return res.status(403).send({
                    error: '该用户已存在'
                });
            }

            user = new User({
                email: email,
                password: password
            });

            user.save(function(err, user) {

                mail.sendActiveMail(email, user._id);
                user = user.toObject();
                delete user.passwordHash;
                var token = genLoginToken(user);

                return res.status(200).send({
                    user: user,
                    token: token
                });
            });
        });
};

exports.activeAccount = function(req, res) {
    var userId = req.params.userId;
    var token = req.query.confirm_token;
    var md5 = crypto.createHash('md5');
    var testToken = md5.update(config.sessionSecret + userId).digest('hex');
    if (token === testToken) {

        User
            .findById(userId)
            .exec(function(err, user) {

                if (user.activated === true) {

                    user = user.toObject();
                    delete user.passwordHash;
                    var token = genLoginToken(user);

                    return res.status(403).send({
                        user: user,
                        token: token
                    });
                }

                user.activated = true;
                user.save(function(err, user) {

                    user = user.toObject();
                    delete user.passwordHash;
                    var token = genLoginToken(user);

                    return res.status(200).send({
                        user: user,
                        token: token
                    });

                });
            });

    } else {
        return res.status(403).send({
            error: '帐号验证失败'
        });
    }
};

