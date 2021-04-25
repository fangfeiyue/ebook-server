const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { LikeValidator } = require('../../validators/validator');
const { Favor } = require('../../models/favor');
const { success } = require('../../lib/helper');

const { Auth } = require('../../../middlewares/auth');

router.post('/', new Auth().m, bodyParser.json(), (req, res, next) => {
	new LikeValidator().validate(req, {
		id: 'art_id'
	}).then(v => {
    return Favor.like(v.get('body.art_id'), v.get('body.type'), req.auth.uid)
  }).then(_ => {
    success()
  }).catch(err => {
    res.json(err)
  })
});

router.post('/cancel', new Auth().m, bodyParser.json(), (req, res, next) => {
	new LikeValidator().validate(req, {
		id: 'art_id'
	}).then(v => {
    return Favor.disLike(v.get('body.art_id'), v.get('body.type'), req.auth.uid);
  }).then((v) => {
    success();
  }).catch(err => {
    res.json(err)
  })
});

module.exports = router;
