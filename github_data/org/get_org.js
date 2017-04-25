var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var user_location = db.get('repo_china_owner_pre');

exports.get_org = function(callback){
	async.waterfall([
		function(callback){
			user_location.find({type : 'Organization'},{ fields: { location: 1, company: 1 }}).then((doc) => {
				callback(null,doc);
			});
		}
		]
		,function(err,result){
			db.close();
			callback(null,result);
	})
}