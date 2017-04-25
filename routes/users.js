var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/company', function(req, res, next) {
  res.render('user_company', { title: 'GitHub_Mining' });
});

router.get('/location',function(req, res){
	res.render('user_location', { title: 'GitHub_Mining' });
});

router.get('/time',function(req, res){
	res.render('user_time', { title: 'GitHub_Mining' });
});

router.get('/follower',function(req, res){
	res.render('user_follower', { title: 'GitHub_Mining' });
});

router.get('/repo',function(req, res){
	res.render('user_repo', { title: 'GitHub_Mining' });
});

router.get('/hot',function(req, res){
	res.render('user_hot', { title: 'GitHub_Mining' });
});

module.exports = router;
