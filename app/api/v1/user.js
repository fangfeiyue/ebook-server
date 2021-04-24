const express = require('express');
const { User } = require('../../models/user');
const bodyParser = require('body-parser');
const router = express.Router();
const { RegisterValidator } = require('../../validators/validator');

router.post('/register', bodyParser.json(), function(req, res, next) {
	const v = new RegisterValidator()
		.validate(req)
		.then(() => {
			registerSuccess(req, res)
		})
		.catch((err) => {
			console.log('报错了', err);
      res.json(err)
		});
	return;
});

function registerSuccess(req, res) {
	const { nickname, password1, email } = req.body;

	const user = {
		email,
		nickname,
		password: password1
	};

	const r = User.create(user).then(() => {
    res.json({
      code: 0,
      msg: '注册成功'
    });
	});
}

module.exports = router;
