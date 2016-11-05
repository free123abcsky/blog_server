/**
 * User: kfs
 * Date：2016/11/5
 * Desc：api接口配置
 */
var express = require('express');
var config = require('./config');
var auth = require('../controllers/auth');
var router = express.Router();

// 认证
router.post( '/signin', auth.signin);  //用户登录
router.post('/signup', auth.signup); //用户注册
router.get('/users/:userId/verify', auth.verify);  //邮箱链接激活帐户

module.exports = router;

