const jwt = require('jsonwebtoken')
const config = require('../config/config')
/***
 * 
 */
const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return []

        let names = Reflect.ownKeys(instance)
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
}

// scope是用来做用户的权限的
const generateToken = function(uid, scope){
    const secretKey = config.security.secretKey
    const expiresIn = config.security.expiresIn
    // sign这个方法用来生成令牌的，可以接收三个参数，第一个参数是给token令牌中放入的自定义信息，第二个参数是一个私有的钥匙，第三个参数是可选的配置项
    const token = jwt.sign({
        uid,
        scope
    },secretKey,{
        expiresIn
    })
    return token
}



module.exports = {
    findMembers,
    generateToken,
}



// const generateToken = function (uid, scope) {
//     const secretKey = global.config.security.secretKey
//     const expiresIn = global.config.security.expiresIn
//     const token = jwt.sign({
//         uid,
//         scope
//     }, secretKey, {
//         expiresIn: expiresIn
//     })
//     return token
// }