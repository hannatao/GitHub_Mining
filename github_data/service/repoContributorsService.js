var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var sortFun = require('../handle/getSortFun.js');
var repoContri = require('../handle/getRepoContributors.js');

var db = monk('127.0.0.1:27017/github');
var repo_pre = db.get('repo_china_final_rank')

exports.getContri = function(type,top,callback){
	async.waterfall([
		function(callback){
		  	repo_pre.find().then((docs) => {
		  		docs.sort(sortFun.getSortFun('desc', "myScore"));
		  		var repos = new Array();
				for(var i=0;i<500;i++){
					repos.push(docs[i]);
				}
		    	callback(null,repos);
		    });
		},
		repoContri.countContributors,
	  	repoContri.getContributors,
	   	function(contriRepos,callback) {
			contriRepos.sort(sortFun.getSortFun('desc', type));
			callback(null,contriRepos);
	    },
	], function (err, result) {
		var result = result.slice(0,top);
	    callback(null, result);
	});
}