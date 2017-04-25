var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var sortFun = require('./getSortFun.js');

var db = monk('127.0.0.1:27017/github');
var user_rank = db.get('user_rank');
var repo_user_rank = db.get('repo_user_rank');

rankRepoUser();
function rankRepoUser(){
	async.waterfall([
	    function(callback) {
	    	user_rank.find({}).then((users) => {
	    		callback(null,users);
	    	});
	    },
	   	function(users,callback) { 
			users.sort(sortFun.getSortFun('desc', "score"));
			for (var i = 0;i<users.length;i++) {
				users[i]["rank"] = i+1;
			}
			callback(null,users);
	    },
	    function(users,callback){
	    	console.log(users.length);
	    	repo_user_rank.insert(users); 	
	    }
	], function (err, result) {
		db.close();
	    console.log("All done");
	});
}