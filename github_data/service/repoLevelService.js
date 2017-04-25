var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var repoClass = require('../handle/getRepoLevel.js')

var db = monk('127.0.0.1:27017/github');
var repo_db = db.get('repo_china_final_rank');

exports.GetRepoClass = function(type,callback){
	async.waterfall([
	    function(callback) {
	    	repo_db.find({}).then((docs) => {
	    		callback(null,docs);
	    	});
	    },
	    function(repos,callback){
	    	var temp = repoClass.getClass(repos,type);
	    	callback(null,temp)
		}
	], function (err, result) {
		db.close();
	    callback(null, result);
	});
}