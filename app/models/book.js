const { sequelize } = require('../../core/db');
const { Sequelize, Model, Op } = require('sequelize');
const { Favor } = require('./favor');
const config = require('../../config/config');
const { NotFound } = require('../../core/http-exception')
class Book extends Model {
	static async getAll() {
		const books = await Book.findAll({
			order: [ 'index' ] // 指明排序字段，按照哪个字段进行排序
		});

		// 保存所有书籍的id号
		const ids = [];
		books.forEach((book) => {
			ids.push(book.id);
		});

		const favors = await Favor.findAll({
			where: {
				art_id: {
					// 表明对哪个字段进行in操作
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
			Book._getEachBookStatus(book, favors);
		});

		return Book._formatBook(books);
	}

  static async getBook(book_id, type, useScope = true) {
    let book = null
    const finder = {
      where: {
        id: book_id
      }
    }
    const scope = useScope ? 'bh' : null

    book = Book.scope(scope).findOne(finder)

    return book
  }
  
	static _formatBook(books) {
		let mainList = [],
			recommendList = [];

		books = Book._formatCovers(books);

		recommendList = books.slice(0, 3);
		mainList = books.slice(3, 6);

		return {
			mainList,
			recommendList
		};
	}

	static async getDetail(file_name) {
		let book = await Book.findOne({
			where: {
				file_name
			}
		});

		if (!book) {
			throw new NotFound()
      // throw new Error('查无此书')
		}

		return Book._formatCover(book)
	}

	static _formatCovers(books = []) {
		return books.map(book => Book._formatCover(book));
	}

	static _formatCover(book) {
		book = book && book.dataValues;

		if (book && book.cover && !book.cover.startsWith('http://')) {
			book['cover'] = `${config.host}/img${book.cover}`;
		}

    return book
	}

	static _getEachBookStatus(book, favors) {
		let count = 0;
		favors.forEach((favor) => {
			if (book.id === favor.art_id) {
				count = favor.get('count');
			}
		});
		book.setDataValue('fav_nums', count);
		return book;
	}
}

Book.init(
	{
    book_id: Sequelize.INTEGER,
		index: Sequelize.INTEGER, // 主要做排序用
		cover: Sequelize.STRING, // 图书封面图
		author: Sequelize.STRING, // 图书作者
		title: Sequelize.STRING, // 书名
		file_name: Sequelize.STRING,
		publisher: Sequelize.STRING,
		category_id: Sequelize.INTEGER,
		category: Sequelize.STRING,
		language: Sequelize.STRING,
		root_file: Sequelize.STRING,
		fav_nums: Sequelize.INTEGER
	},
	{
		sequelize,
		tableName: 'book'
	}
);

module.exports = {
	Book
};
