const bcrypt = require('bcryptjs');
const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../core/db');
const { AuthFailed } = require('../../core/http-exception');

class User extends Model {
	static async verifyEmailPassword(email, plainPassword) {
		const user = await User.findOne({
			where: {
				email
			}
		});

		if (!user) {
			throw new AuthFailed('账号不存在');
		}

		const isCorrect = bcrypt.compareSync(plainPassword, user.password);

		if (!isCorrect) {
			throw new AuthFailed('密码不正确');
		}

		return user;
	}

	// 查询小程序用户是否存在
	static async getUserByOpenid(openid) {
		const user = await User.findOne({
			where: {
				openid
			}
		});
		return user;
	}

  // 新增小程序用户
	static async registerByOpenid(openid) {
		return await User.create({
			openid
		});
	}
}

User.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nickname: Sequelize.STRING,
		email: {
			type: Sequelize.STRING(128),
			unique: true
		},
		password: {
			type: Sequelize.STRING,
			// 这样的写法实际是观察者模式的一种使用
			// es6中可以使用Reflect实现观察者模式
			set(val) {
				const salt = bcrypt.genSaltSync(10);
				const pwd = bcrypt.hashSync(val, salt);
				// 存入数据库，sequelize自带方法
				this.setDataValue('password', pwd);
			}
		},
		// test: Sequelize.STRING, // 不会默认将代码中的新增的字段添加到表中
	},
	{
		sequelize,
		tableName: 'user' // 命名表名
	}
);

module.exports = {
	User
};
