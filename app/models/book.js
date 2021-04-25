const { sequelize } = require('../../core/db');
// const axios = require('axios');
// const util = require('util');
const { Sequelize, Model } = require('sequelize');
const { Favor } = require('./favor');
const config = require('../../config/config');

class Book extends Model {
	// async detail(id) {
  //   const url = util.format(config.yushu.detailUrl, id);
	// 	const detail = await axios.get(url); // 获取图书详情
	// 	return detail.data;
	// }

  static async getMyFavorBookCount(uid) {
    // 如果仅仅查找数量可以使用 Favor.count
    const count = await Favor.count({
        where: {
          type: 400,
          uid
        }
      })
      return count
    }

  // summary是否获取概要信息，设置为0返回详细信息
  static async searchFromYuShu(q, start, count, summary = 1) {
    // encodeURI(q) 对中文进行编码
    const url = util.format(
        config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const result = await axios.get(url)
    return result.data
  }
}

Book.init(
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		fav_nums: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		}
	},
	{
		sequelize,
		tableName: 'book'
	}
);

module.exports = {
	Book
};
