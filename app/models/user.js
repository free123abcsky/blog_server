/*
 * user model
 */

var bcrypt = require('bcrypt');  //引入加密模块
var mongoose = require('mongoose');
var Schema = mongoose.Schema;  //一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力

//定义一个Schema  schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义
var UserSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, default: ''},
    passwordHash: {type: String, default: ''},
    nickname: {type: String, default: ''},
    avatar: {type: String, default: ''},
    site: {type: String, default: ''},
    info: {type: String, default: ''},
    contributeCount: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    activated: {type: Boolean, default: false}
});

UserSchema
    .virtual('password')
    .set(function (password) {
        var salt = bcrypt.genSaltSync(10);
        this.passwordHash = bcrypt.hashSync(password, salt);
    })
    .get(function () { return this.passwordHash; });

UserSchema.methods = {
    auth: function (password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }
};

UserSchema.index({email: 1});

//Model 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
//将该Schema发布为Model并导出
mongoose.model('User', UserSchema);
