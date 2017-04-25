var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var user_location = db.get('repo_china_owner_pre');
var repo_china_owner_filter = db.get('repo_china_owner_filter');

async.waterfall([
	function(callback){
		user_location.find(
			{type : 'User'}
			,{ fields: 
				{ login: 1, location: 1, company: 1 ,repoFullName: 1, public_repos: 1, followers: 1, bio: 1}
			})
			.then((doc) => {
				callback(null,doc);
		});
	},function(result,callback){
		var result_f = [];
		for(var key in result){
			if(result_f == ''){
				var temp = result[key];
				var repo = [];
				repo.push(result[key].repoFullName);
				temp['repo'] = repo;
				temp['count'] = 1;
				delete temp['_id'];
				delete temp['repoFullName'];
				result_f.push(temp);
			}else{
				var flag = false;
				for(var i in result_f){
					if(result[key].login == result_f[i].login){
						result_f[i].repo.push(result[key].repoFullName);
						result_f[i].count ++;
						flag = true;
						break;
					}
				}
				if(!flag){
					var temp = result[key];
					var repo = [];
					repo.push(result[key].repoFullName);
					temp['repo'] = repo;
					temp['count'] = 1;
					delete temp['_id'];
					delete temp['repoFullName'];
					result_f.push(temp);
				}
			}
		}
		callback(null,result_f);
	}
	]
	,function(err,result){
		repo_china_owner_filter.insert(result);
		
		console.log(result);
})