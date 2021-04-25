const { sequelize } = require('../../core/db');
const { Sequelize, Model } = require('sequelize');

class Comment extends Model {
  // constructor() {
  //   super()
  // }

	static async addComment(bookID, content) {
		const comment = await Comment.findOne({ // 查询评论是否已经存在
			where: {
				book_id: bookID,
				content
			}
		});
		if (!comment) {
			return await Comment.create({
				book_id: bookID,
				content,
				nums: 1
			});
		} else { // 如果评论已经存在对已存在评论加一即可 
			return await comment.increment('nums', {
				by: 1
			});
		}
	}

	static async getComments(bookID) {
		const comments = await Comment.findAll({
			where: {
				book_id: bookID
			}
		});
		return comments;
	}

  // 使用JSON序列话去掉update_time等无用字段，但是这样太麻烦，每个模型中都要定义，可以在db中给Model添加

	// toJSON(){
	//     return {
	//       content:this.getDataValue('content'),
	//       nums:this.getDataValue('nums'),
	//     }
	// }
}

// 不要在这里写，因为这样会写死代码，建议在api接口方法中根据具体情况使用
// Comment.prototype.exclude = ['book_id','id']

Comment.init(
	{
		content: Sequelize.STRING(12),
		nums: { // 短评加1
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		book_id: Sequelize.INTEGER
		// exclude:['book_id','id']
	},
	{
		sequelize,
		tableName: 'comment'
	}
);

module.exports = {
	Comment
};
