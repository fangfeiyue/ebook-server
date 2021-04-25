const { sequelize } = require('../../core/db');
const { Sequelize, Model, Op } = require('sequelize');
const { Favor } = require('./favor');

class HotBook extends Model {
	static async getAll() {
		const books = await HotBook.findAll({
			order: [ 'index' ] // 指明排序字段，按照哪个字段进行排序
		});

    // 保存所有书籍的id号
		const ids = [];
		books.forEach((book) => {
			ids.push(book.id);
		});

		const favors = await Favor.findAll({
			where: {
				art_id: { // 表明对哪个字段进行in操作
					[Op.in]: ids
				},
				type: 400
			},
			group: [ 'art_id' ], // group可以根据多个字段分组，所以要是数组

      // [ Sequelize.fn('COUNT', '*'), 'count' ]前面对count进行总数求和，后面的count指的是求出来的名字是什么
      // attributes 指定查询中的结果包含哪些字段
			attributes: [ 'art_id', [ Sequelize.fn('COUNT', '*'), 'count' ] ]
		});

		books.forEach((book) => {
			HotBook._getEachBookStatus(book, favors);
		});

		return books;
	}

  static _getEachBookStatus(book, favors){
    let count = 0
    favors.forEach(favor=>{
      if(book.id === favor.art_id){
        count = favor.get('count')
      }
    })
    book.setDataValue('fav_nums',count)
    return book
  }
}

HotBook.init({
	index: Sequelize.INTEGER, // 主要做排序用
	image: Sequelize.STRING, // 图书封面图
	author: Sequelize.STRING, // 图书作者
	title: Sequelize.STRING // 书名
}, {
  sequelize,
  tableName:'hot_book'
});

module.exports = {
  HotBook
}
