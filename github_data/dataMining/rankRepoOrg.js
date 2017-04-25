var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var sortFun = require('./getSortFun.js');

var db = monk('127.0.0.1:27017/github');
var org_db = db.get('repo_china_org');
var repo_org_rank = db.get('repo_org_rank');

rankRepoUser();
function rankRepoUser(){
	async.waterfall([
	    function(callback) {
	    	org_db.find({}).then((users) => {
	    		callback(null,users);
	    	});
	    },
	   	function(users,callback) { 
			users.sort(sortFun.getSortFun('desc', "reposScoreTotal"));
			var orgs = new Array();
			for (var i = 0;i<users.length;i++) {
				var temp = {};
				temp["login"] = users[i].org.login;
				temp["score"] = users[i].reposScoreTotal;
				temp["rank"] = i+1;
				orgs.push(temp);
			}
			callback(null,orgs);
	    },
	    function(users,callback){
	    	console.log(users.length);
	    	repo_org_rank.insert(users); 	
	    }
	], function (err, result) {
		db.close();
	    console.log("All done");
	});
}