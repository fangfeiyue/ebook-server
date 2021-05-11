const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { success } = require('../../lib/helper');
const { Auth } = require('../../../middlewares/auth');
const { Comment } = require('../../models/book-comment');
const { Favor } = require('../../models/favor');
const { Book } = require('../../models/book');
const { PositiveIntegerValidator, SearchValidator, AddShortCommentValidator, DetailValidator } = require('../../validators/validator');

// 获取我喜欢的书籍的数量
// router.get('/favor/count', new Auth().m, async (ctx) => {
// 	const count = await Book.getMyFavorBookCount(ctx.auth.uid);
// 	ctx.body = {
// 		count
// 	};
// });

router.get('/hot_list', async (req, res, next) => {
	const books = await Book.getAll();
	console.log('books', books);
	res.json({
		code: 0,
		data: {
			...books
		}
	});
});

router.get('/detail', async (req, res, next) => {
  const v = await new DetailValidator().validate(req)
	const book = await Book.getDetail(v.get('query.fileName'));
	res.json({
		error_code: 0,
		msg: '获取成功',
		data: book
	});
});

// 获取书籍点赞情况以及当前书籍用户是否点赞了
router.get('/:book_id/favor', new Auth().m, bodyParser.json(), async (req, res, next) => {
	const v = await new PositiveIntegerValidator().validate(req, {
		id: 'book_id'
	});
	const favor = await Favor.getBookFavor(req.auth.uid, v.get('path.book_id'));
	res.json(favor);
	// await new PositiveIntegerValidator().validate(req, {
	// 	id: 'book_id'
	// }).then(v => {
	//   return Favor.getBookFavor(req.auth.uid, v.get('path.book_id'));
	// }).then(favor => {
	//   res.json(favor)
	// }).catch(err => {
	//   console.log('err', err);
	//   res.json(err)
	// })
});

// 新增短评
router.post('/add/short_comment', new Auth().m, bodyParser.json(), async (req, res, next) => {
	const v = await new AddShortCommentValidator().validate(req, {
		id: 'book_id'
	});

  console.log('book_id', v)
	Comment.addComment(v.get('body.book_id'), v.get('body.content'));
	res.json({
		code: 0,
		msg: 'ok'
	});
});

// // 获取短评
router.get('/:book_id/short_comment', bodyParser.json(), async (req, res, next) => {
	const v = await new PositiveIntegerValidator().validate(req, {
		id: 'book_id'
	});
	const book_id = v.get('path.book_id');
	const comments = await Comment.getComments(book_id);
	res.json({
		comments,
		book_id
	});
});

module.exports = router;
