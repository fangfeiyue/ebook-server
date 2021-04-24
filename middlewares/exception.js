const { env } = require('../config/config')
const { HttpException } = require('../core/http-exception')
const catchError = async (ctx, next) => {
  try {
    await next()
  }catch(err) {
    const isHttpException = err instanceof HttpException
    const isDev = env == 'dev'
    // 开发环境抛出错误，方便后端调试
    if (isDev && !isHttpException) {
      throw err
    }

    if (isHttpException) {
      ctx.body = {
        msg: err.msg,
        errorCode: err.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = err.code
    }
  }
}

module.exports = catchError
