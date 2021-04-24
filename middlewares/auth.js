const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { Forbbiden } = require('../core/http-exception')

class Auth {
  // level表示api的级别，通过比较大小来判断是否可以访问这个api
    constructor(level) {
        this.level = level || 1
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }

    get m() {
        return async (ctx, next) => {
          console.log('执行了')
            // ctx.req后去的是node.js原生的request对象
            // ctx.request获取的是koa对node.js原生request封装的一个对象
            const userToken = basicAuth(ctx.req)
            ctx.body = userToken
            let errMsg = 'token不合法'

            if (!userToken || !userToken.name) {
                throw new Forbbiden(errMsg)
            }

            try {
              // 校验令牌
                var decode = jwt.verify(userToken.name, 
                    config.security.secretKey)
            } catch (error) {
                if (error.name == 'TokenExpiredError'){
                    errMsg = 'token已过期'
                }
                throw new Forbbiden(errMsg)
            }

            // 接口做权限控制
            if(decode.scope < this.level){
                errMsg = '权限不足'
                throw new Forbbiden(errMsg)
            }

            // uid,scope 将自定义属性保存到ctx.auth属性上
            ctx.auth = {
                uid:decode.uid,
                scope:decode.scope
            }

            await next()
        }
    }

    // 验证令牌是否有效
    static verifyToken(token){
        try{
            jwt.verify(token, 
                config.security.secretKey)
            return true
        }
        catch (error){
            return false
        }
    }
}

module.exports = {
    Auth
}