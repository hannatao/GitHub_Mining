var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');

exports.user_repo = function(callback){
	var follower = db.get('follower_repo_user');
	var repo = db.get('repo_user_1');
	// var follower = db.get('follower_repo');
	async.waterfall([
	//获取全部follower
	function(callback){
		var result = new Array();
		follower.find({}).then((doc) => {
			for(var key in doc){
				var temp = {};
				temp['source'] = doc[key].source;
				temp['target'] = doc[key].target;
				result.push(temp);
			}
			callback(null, result);
		});
	},
	function(result,callback){
		var result1 = [];
		repo.find({}).then((doc) => {
			var categories = [];
			for(var key in doc){
				doc[key].contributors.forEach(function(element){
					var temp = {};
					temp['repo_name'] = doc[key].repo_name;
					temp['id'] = element;
					temp['name'] = element;
					result1.push(temp);
				});
				categories.push(doc[key].repo_name);
			}
			callback(null,result,result1,categories);
		});
	},
	function(result,result1,categories,callback){
		var result_temp = {};
		result_temp['categories'] = categories;
		result_temp['nodes'] = result1;
		result_temp['edges'] = result;
		callback(null,result_temp);
	}],
	function(err,result){
		db.close();
		callback(null, result);
	});
}

// user.Insert_User_repo();