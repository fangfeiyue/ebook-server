const { LinValidator, Rule } = require('../../core/lin-validator');
const { User } = require('../models/user');
const { LoginType, ArtType } = require('../../lib/enum');
class PositiveIntegerValidator extends LinValidator {
	constructor() {
		super();
		// 属性名要和接收参数名保持一致，多个rule是 && 的关系
		this.id = [ new Rule('isInt', '需要是正整数', { min: 1 }) ];
	}
}

class RegisterValidator extends LinValidator {
	constructor() {
		super();
		this.email = [ new Rule('isEmail', '不符合Email规范') ];
		this.password1 = [
			new Rule('isLength', '密码最少6个字符，最多32个字符', {
				min: 6,
				max: 32
			}),
			new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
		];

		this.password2 = this.password1;

		this.nickname = [
			new Rule('isLength', '昵称不符合长度规范', {
				min: 4,
				max: 32
			})
		];
	}
	// 这个方法必须以validate开头
	validatePassword(vals) {
		const psw1 = vals.body.password1;
		const psw2 = vals.body.password2;

		if (psw1 != psw2) {
			// 这里直接抛出一个error就可以了，LinValidator内部会把异常汇集在一起，最终抛出一个特定的异常
			throw new Error('两个密码必须相同');
		}
	}

	// 这个方法里面包含异步代码-User.findOne，导致user.js中调用new RegisterValidator().validate(ctx)无法阻止后续代码的执行，需要加上await
	async validateEmail(vals) {
		const email = vals.body.email;
		const user = await User.findOne({
			where: {
				// key 是数据库中的字段 val是参数中的email
				email: email
				// id:5 // 这个只是个示例，表明where中可以写多个查询条件，多个查询条件的关系是且的关系
			}
		});

		if (user) {
			throw new Error('email已存在');
		}
	}
}

class TokenValidator extends LinValidator {
	constructor() {
		super();
		this.account = [
			new Rule('isLength', '不符合账号规则', {
				min: 4,
				max: 32
			})
		];

		this.secret = [
			// 是否可选，写了这个后，这个字段就是可选的，如小程序中是不需要密码登录的
			new Rule('isOptional'),

			new Rule('isLength', '至少6个字符', {
				min: 6,
				max: 128
			})
		];
	}

	validateLoginType(vals) {
		if (!vals.body.type) {
			throw new Error('type是必须参数');
		}
		if (!LoginType.isThisType(vals.body.type)) throw new Error('type参数不合法');
	}
}

class NotEmptyValidator extends LinValidator {
	constructor() {
		super();
		this.token = [
			new Rule('isLength', '不允许为空', {
				min: 1
			})
		];
	}
}

function checkArtType(vals) {
	let type = vals.body.type || vals.path.type;
	if (!type) {
		throw new Error('type是必须参数');
	}
	type = parseInt(type);

	if (!ArtType.isThisType(type)) {
		throw new Error('type参数不合法');
	}
}

class LikeValidator extends PositiveIntegerValidator {
	constructor() {
		super();
		this.validateType = checkArtType;
	}
}

class ClassicValidator extends LikeValidator {}

class SearchValidator extends LinValidator {
  constructor() {
    super()
    this.q = [
      new Rule('isLength', '搜索关键词不能为空', {
        min: 1,
        max: 16
      })
    ]
    // 新式查询方案 start和count，这种适合移动端，因为移动端不需要页码
    this.start = [
      new Rule('isInt', '不符合规范', {
        min: 0,
        max: 60000
      }),
      new Rule('isOptional', '', 0) // 设置默认值，可选
    ]
    this.count = [
      new Rule('isInt', '不符合规范', {
        min: 1,
        max: 20
      }),
      new Rule('isOptional', '', 20)
    ]
  }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.content = [
      new Rule('isLength', '必须在1到12个字符之间', {
        min: 1,
        max: 12
      })
    ]
  }
}

module.exports = {
	LikeValidator,
  TokenValidator,
  SearchValidator,
  ClassicValidator,
	RegisterValidator,
	NotEmptyValidator,
	PositiveIntegerValidator,
  AddShortCommentValidator
};
