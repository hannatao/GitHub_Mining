var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var client = github.client();
var ghsearch = client.search();

var db = monk('127.0.0.1:27017/github');

exports.Insert_User = function(){
	var users = db.get('users');
	var i = 0;
	async.whilst(
		function(){return i < 5;},
		function(callback){
			i ++;
			ghsearch.users({
				q : 'followers:>50 location:china type:user',
				sort : 'follower',
				order : 'desc',
				page : i,
				per_page : 100
			},function(err,body,headers){
				console.log('step 3');
				users.insert(body.items);
				callback(null, i);
			})
		},
		function(err, n){
			db.close();
		}
	);
}

exports.Insert_User_repo = function(){
	var users = db.get('user_repo');
	var i = 0;
	async.whilst(
		function(){return i < 5;},
		function(callback){
			i ++;
			ghsearch.users({
				q : 'followers:>50 location:china type:user',
				sort : 'repositories',
				order : 'desc',
				page : i,
				per_page : 100
			},function(err,body,headers){
				console.log(err);
				users.insert(body.items);
				callback(null, i);
			})
		},
		function(err, n){
			db.close();
		}
	);
}

exports.Get_User = function(callback){
	var users = db.get('users');
	async.waterfall([
		function(callback){
			users.find({}, 'login').then((doc) => {
				callback(null, doc);
			});
		},
		function(arg, callback){
			callback(null, arg);
		}
	],
	function(arg, result){
		db.close();
		callback(null, result);		
	});
}

exports.Get_User_repo = function(callback){
	var users = db.get('user_repo');
	async.waterfall([
		function(callback){
			users.find({}, 'login').then((doc) => {
				callback(null, doc);
			});
		},
		function(arg, callback){
			callback(null, arg);
		}
	],
	function(arg, result){
		db.close();
		callback(null, result);		
	});
}

exports.Get_User_Rank = function(callback){
	var users = db.get('user_rank');
	async.waterfall([
		function(callback){
			users.find({}, 'login').then((doc) => {
				callback(null, doc);
			});
		},
		function(arg, callback){
			callback(null, arg);
		}
	],
	function(arg, result){
		db.close();
		callback(null, result);		
	});
}