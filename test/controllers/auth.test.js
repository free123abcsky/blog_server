/**
 * User: kfs
 * Date：2016/11/5
 * Desc：认证控制器测试
 */

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var crypto = require('crypto');
var env = process.env.NODE_ENV || 'development';
var config = require('../../app/config/config')[env];
var api = supertest('http://localhost:3000');

describe('test/controllers/auth.test.js', function() {

    var now = +new Date();
    //var email = 'fansuo_k@163.com';
    var email = 'testuser' + now + '@163.com';
    var password = '123456abc';

    describe('sign up', function () {

        it('should sign up a user', function(done){
            api.post('/api/signup')
                .send({
                    email: email,
                    password: password,
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    done();
                })
        });

        it('should not sign up a user when email is exists', function (done) {
            api.post('/api/signup')
                .send({
                    email: '9900gyu@qq.com',
                    password: password,
                })
                .expect(403)
                .end(function(err, res){
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.equal('该用户已存在')
                    done();
                })
        });

    });

    describe('account active', function () {
        var sign = '';
        var userId = '';
        before(function(done){
            api.post('/api/signup')
                .send({
                    email: 'fansuo_k@163.com',
                    password: '123456abc',
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.have.property('_id');
                    var md5 = crypto.createHash('md5');
                    userId = res.body.user._id;
                    sign = md5.update(config.sessionSecret + userId).digest('hex');
                    done();
                })
        });

        it('should active account', function (done) {
            api.get('/api/users/' + userId + '/verify?confirm_token=' + sign)
                .expect(200)
                .end(function(err, res){
                    expect(res.body).to.have.property('token');
                    done();
                })
        });
    });

    describe('sign in', function () {

        it('should error when no email or no password', function(done){
            api.post('/api/signin')
                .send({
                    email: email,
                    password: '',
                })
                .expect(403)
                .end(function(err, res){
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.equal('信息不完整');
                    done();
                })
        });

        it('should sign in a user', function(done){
            api.post('/api/signin')
                .send({
                    email: 'testuser1478396463530@163.com',
                    password: '123456abc',
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    done();
                })
        });


    });

});


