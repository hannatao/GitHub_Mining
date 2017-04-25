var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user = require('./user_get.js');

var db = monk('127.0.0.1:27017/github');
var users = db.get('repo_china_owner_filter');

exports.company_user = function(json,callback){
	async.waterfall([
		function(callback){
			users.find({company:{$regex:json,$options:"$i"}}, 'login').then((doc) => {
				callback(null, doc);
			});
		},
		function(arg, callback){
			var result = [];
			if(arg.length > 10){
				for(var i = 0; i < 10; i++){
					var temp = {};
					temp['login'] = arg[i].login;
					result.push(temp);
				}
			}else{
				for(var key in arg){
					var temp = {};
					temp['login'] = arg[key].login;
					result.push(temp);
				}
			}
			callback(null, result);
		}
	],
	function(arg, result){	
		db.close();
		callback(null, result);		
	});
}