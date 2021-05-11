const express = require('express');
const { User } = require('../../models/user');
const { Success } = require('../../../core/http-exception');
const bodyParser = require('body-parser');
const router = express.Router();
const { RegisterValidator } = require('../../validators/validator');

router.post('/register', bodyParser.json(), async (req, res, next) => {
  const v = await new RegisterValidator().validate(req);
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password1'),
    nickname: v.get('body.nickname')
  }

  const r = await User.create(user)
  throw new Success()
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
