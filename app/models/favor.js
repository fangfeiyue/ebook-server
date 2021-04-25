const { sequelize } = require('../../core/db');
const { Sequelize, Model, Op } = require('sequelize');
const { Art } = require('./art');
const { LikeError, DislikeError, NotFound } = require('../../core/http-exception');

// favor是一个业务表
class Favor extends Model {
	/* 
  一次操作需要操作两张数据表
  1.favor添加是否喜欢记录
  2.操作其他表里的fav_nums
  必须确保两个都执行，不能出现一个执行一个不执行的情况，可以使用数据库事务，数据库事务可以保证数据一致性
  */
	static async like(art_id, type, uid) {
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		});
		// 如果有值表明用户已经点过赞了
		if (favor) {
			throw new LikeError();
		}
		// 执行事务
		return sequelize.transaction(async (t) => {
			// 往数据表中插入一条数据
			await Favor.create(
				{
					art_id,
					type,
					uid
				},
				{
					transaction: t
				}
			);
			// 查看用户操作的哪种媒体哪个id
			const art = await Art.getData(art_id, type, false);

			// 对数字进行加一
			// 当我们使用scope后，当再次用art的实例去调用increament的时候，会生成一条错误的sql语句，所以需要给getData传递第三个参数，控制哪些地方不是用scope
			await art.increment('fav_nums', {
				by: 1, // 增加多少
				transaction: t
			});
		});
	}
	static async disLike(art_id, type, uid) {
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		});
		if (!favor) {
			throw new DislikeError();
		}
		// Favor 表 favor 记录
		return sequelize.transaction(async (t) => {
			// 删除一条记录，对查询出来的favor进行destroy
			await favor.destroy({
				force: true, // false软删除 true物理删除
				transaction: t
			});
			const art = await Art.getData(art_id, type, false);
			// 减一
			await art.decrement('fav_nums', {
				by: 1,
				transaction: t
			});
		});
	}
	static async userLikeIt(art_id, type, uid) {
		const favor = await Favor.findOne({
			where: {
				uid,
				art_id,
				type
			}
		});
		return favor ? true : false;
	}

	static async getMyClassicFavors(uid) {
		const arts = await Favor.findAll({
			where: {
				uid,
				type: {
					[Op.not]: 400
				}
			}
		});
		if (!arts) {
			throw new NotFound();
		}

		return await Art.getList(arts);
	}

  static async getBookFavor(uid, bookID){
    const favorNums = await Favor.count({
      where: {
        art_id:bookID,
        type:400
      }
    })
    const myFavor = await Favor.findOne({
      where:{
        art_id:bookID,
        uid,
        type:400
      }
    })
    return {
      fav_nums:favorNums, // 图书总的点赞数量
      like_status:myFavor?1:0 // 对于用户来说当前图书是否点赞了
    }
  }
}

Favor.init(
	{
		uid: Sequelize.INTEGER, // 表示用户id
		art_id: Sequelize.INTEGER, // 用户对哪个媒体进行了点赞
		type: Sequelize.INTEGER // 用户对哪种类型的媒体进行了点赞
	},
	{
		sequelize,
		tableName: 'favor'
	}
);

module.exports = {
	Favor
};
