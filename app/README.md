##### 目录结构（该目录是基于以express作框架）

``` js
.

├── app                       # 源码目录
│   ├── controllers/          # 控制器资源
│   ├── models/               # 模型资源
│   ├── middlewares/          # 中间件资源
│   ├── config                # 配置资源
│   │   ├── api.js            # api接口配置
│   │   ├── config.js         # 基本配置
│   │   ├── mailtpl.js        # 邮箱模板配置
│   ├── util                  # 公用方法资源
│   │   ├── mail.js           # 邮箱
│   │   ├── qiniu.js          # 七牛
│   │   ├── wechat.js         # 微信
│   ├── app.js                # 本地server入口
├── package.json              # 项目配置
├── README.md                 # 项目说明
```