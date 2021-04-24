class HttpException extends Error {
	constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
		super();
		this.msg = msg;
		this.code = code;
		this.errorCode = errorCode;
	}
}

class ParameterException extends HttpException {
	constructor(msg = '参数错误', errorCode = 10000) {
		super();
		this.code = 400;
		this.msg = msg;
		this.errorCode = errorCode;
	}
}

class Success extends HttpException {
	constructor(msg, errorCode) {
		super();
		// this.code = 201;
    this.code = 200
		this.msg = msg || 'ok';
		this.errorCode = errorCode || 0;
	}
}

class NotFound extends HttpException {
	constructor(msg = '资源未找到', errorCode = 10000) {
		super();
		this.msg = msg;
		this.errorCode = errorCode;
		this.code = 404;
	}
}

class AuthFailed extends HttpException {
	constructor(msg = '授权失败', errorCode = 10004) {
		super();
		this.msg = msg;
		this.errorCode = errorCode;
		this.code = 401;
	}
}

class Forbbiden extends HttpException {
	constructor(msg, errorCode) {
		super();
		this.msg = msg || '禁止访问';
		this.errorCode = errorCode || 10006;
		this.code = 403;
	}
}

class LikeError extends HttpException {
	constructor(msg, error_code) {
		super();
		this.code = 400;
		this.msg = '你已经点赞过';
		this.error_code = 60001;
	}
}

class DislikeError extends HttpException {
	constructor(msg, error_code) {
		super();
		this.code = 400;
		this.msg = '你已取消点赞';
		this.error_code = 60002;
	}
}

module.exports = {
	Success,
	NotFound,
  LikeError,
	Forbbiden,
	AuthFailed,
  DislikeError,
	HttpException,
	ParameterException
};
