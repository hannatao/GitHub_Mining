var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var rank = db.get('user_rank');
var user = db.get('repo_china_owner_filter');

exports.user_hot = function(callback){
	async.waterfall([
		function(callback){
			rank.find({}).then((doc) => {
				callback(null, doc);
			})
		}
		,function(result,callback){
			var conclusion = [];
			var i = 0;
			async.whilst(
				function(){return i < 20;},
				function(callback){
					user.find({login:result[i].login})
					.then((doc) => {
						var temp = {};
						temp['login'] = result[i].login;
						temp['score'] = result[i].score;
						temp['count'] = doc[0].count;
						temp['followers'] = doc[0].followers;
						temp['public_repos'] = doc[0].public_repos;
						temp['repo'] = doc[0].repo;
						conclusion.push(temp);
						i ++;
						callback(null, i);
					});
				},
				function(err,n){
					callback(null, conclusion);
				}
			);
		}
		]
		,function(err,result){
			db.close();
			console.log("two");
			callback(null, result);
	});
}