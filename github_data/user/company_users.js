var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user_detail = require('./user_detail_get.js');

var db = monk('127.0.0.1:27017/github');
var users = db.get('repo_china_owner_filter');

exports.company_users = function(callback){
	async.waterfall([
		user_detail.get_company,
		function(result,callback){
			var company = [];
			for(var key in result.company){
				company.push(key);
			}
			for(var key in result.university){
				company.push(key);
			}
			var company_user = {};
			var i = 0;
			async.whilst(
				function(){return i < company.length;},
				function(callback){
					var user_repos = [];
					users.find({company:{$regex:company[i],$options:"$i"}},{login: 1, repo: 1}).then((doc) => {
						for(var key in doc){
							var temp = {};
							temp['login'] = doc[key].login;
							temp['repo'] = doc[key].repo;
							user_repos.push(temp);
						}
						company_user[company[i]] = user_repos;
						i ++;
						callback(null, i);
					});
				},
				function(err, n){
					callback(null, company_user);
				}
			);
		}
		]
		,function(err,result){
			db.close();
			callback(null, result);
	});
}