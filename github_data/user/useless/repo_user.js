var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user_follower = require('./user_follower.js');
var users = require('./user_get.js');

var db1 = monk('127.0.0.1:27017/github');
var db2 = monk('192.168.1.104:27017/github'); 

async.waterfall([
	users.Get_User,
	repo_user
	],function(err,result){

	}
);

function repo_user(result,callback){
	var repo = db2.get('pop_repo_contributors');
	var repo_user = db1.get('repo_user');
	var conclusion = [];

	async.waterfall([
		function(callback){
			repo.find({}).then((doc) => {
				callback(null,doc);
			});
		},function(json,callback){
			json.forEach(function(element1){
				var temp = {};
				var contributor = [];
				temp['repo_name'] = element1.name;
				var contributors = element1.contributors;
				contributors.forEach(function(element2){				
					result.forEach(function(element3){
						if(element3.login == element2.login){						
							contributor.push(element3.login);
						}
					});
				});
				if(contributor != ''){
					temp['contributors'] = contributor;
					conclusion.push(temp);
				}
			});
			callback(null,conclusion);
		},function(conclusion,callback){
			repo_user.insert(conclusion);
			callback(null,conclusion);
		}
		],function(err,json){		
			console.log(json);
			db2.close();
			callback(null,json);
	});
}