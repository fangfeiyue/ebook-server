const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator');
const { User } = require('../../models/user');
const { generateToken } = require('../../../core/util');
const { Auth } = require('../../../middlewares/auth');

// router.post('/', bodyParser.json(), function(req, res, next) {
// 	new TokenValidator().validate(req).then(v => {
//     return emailLogin(v.get('body.account'), v.get('body.secret'));
//   }).then(token => {
//     res.json({
//       code: 0,
//       token
//     })
//   }).catch(err => {
//     console.log('err', err)
//     res.json(err)
//   })
// });

router.post('/', bodyParser.json(), async (req, res, next) => {
  const v = await new TokenValidator().validate(req)
  let token = await emailLogin(v.get('body.account'), v.get('body.secret'))

  res.json({
    token
  })
})

router.post('/verify', bodyParser.json(), async (req, res, next) => {
	// token
	const v = await new NotEmptyValidator().validate(req);
	const result = Auth.verifyToken(v.get('body.token'));
  res.json({
    code: 0,
    msg: 'token有效',
    data: {
      is_valid: result
    }
  })
	// ctx.body = {
	// 	is_valid: result
	// };
});

async function emailLogin(account, secret) {
	const user = await User.verifyEmailPassword(account, secret);
	// 给令牌中加入权限数字
	return generateToken(user.id, Auth.USER);
}

module.exports = router;
