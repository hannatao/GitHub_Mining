var express = require('express');
var router = express.Router();
var async = require('async');
var user_detail = require('../github_data/user/user_detail_get.js');
var events = require('../github_data/user/time_analyze.js');
var Company_user = require('../github_data/user/company_user.js');
var	user_follower = require('../github_data/user/user_follower.js');
var	user_hot = require('../github_data/user/user_hot.js');
var	user_word = require('../github_data/user/tf-idf.js');
var	company_languague = require('../github_data/user/company_language.js');
var crawler = require('../github_data/user/github-crawler');

router.get('/location', function(req, res, next) {
  	async.waterfall([
		user_detail.get_location
	],function(err,result){
		res.json(result);
	});
});

router.get('/event', function(req, res, next) {
  	async.waterfall([
		events.get_event
	],function(err,result){
		res.json(result);
	});
});

router.get('/company', function(req, res, next) {
  	async.waterfall([
		user_detail.get_company
	],function(err,result){
		res.json(result);
	});
});

router.get('/company_user', function(req, res, next) {
	var value = req.query.name;
	async.waterfall([
		async.apply(Company_user.company_user, value)
	],function(err,result){
		res.json(result);
	});
});

router.get('/user_follower', function(req, res, next) {
  	async.waterfall([
		user_follower.user_follower
	],function(err,result){
		res.json(result);
	});
});

router.get('/user_hot', function(req, res, next) {
  	async.waterfall([
		user_hot.user_hot
	],function(err,result){
		res.json(result);
	});
});

router.get('/user_word', function(req, res, next) {
	var value = req.query.name;
  	async.waterfall([
		async.apply(user_word.TF, value)
	],function(err,result){
		res.json(result);
	});
});

router.get('/language', function(req, res, next) {
  	async.waterfall([
		company_languague.company_lan
	],function(err,result){
		res.json(result);
	});
});

router.get('/image', function(req, res, next) {
	var value = req.query.name;
  	async.waterfall([
		async.apply(crawler.image_get,value)
	],function(err,result){
		res.json(result);
	});
});

module.exports = router;