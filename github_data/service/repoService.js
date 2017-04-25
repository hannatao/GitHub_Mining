var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var sortFun = require('../handle/getSortFun.js');
var getLanguage = require('../handle/getRepoLanguages.js');

var db = monk('127.0.0.1:27017/github');
var repo_db = db.get('repo_china_final_rank');
var user_rank = db.get('repo_user_rank');
var org_rank = db.get('repo_org_rank');

exports.GetRepo = function(type,top,callback){
	async.waterfall([

		//获取数据库数据
	    function(callback) {
	    	repo_db.find({}).then((docs) => {
	    		callback(null,docs,type);
	    	});
	    },

	   	function(repos,type,callback) {
			repos.sort(sortFun.getSortFun('desc', type));
			repos = repos.slice(0,top);
			callback(null,repos);
	    },

	    //获取个人用户排名
	    function(repos,callback){
	    	var i = 0;
			async.whilst(
				function(){return i < repos.length;},
				function(callback){
					user_rank.findOne({login:repos[i].owner.login})
					.then((doc) => {
						if(doc!=null){
							//console.log(doc.login);
							repos[i].owner["score"] = doc.score;
							repos[i].owner["rank"] = doc.rank;
						}
						i++;
						callback(null, i);
					});
				},
				function(err,n){
					callback(null, repos);
				}
			);
	    },

	    //获取组织用户排名
	    function(repos,callback){
	    	var i = 0;
			async.whilst(
				function(){return i < repos.length;},
				function(callback){
					org_rank.findOne({login:repos[i].owner.login})
					.then((doc) => {
						if(doc!=null){
							//console.log(doc.login);
							repos[i].owner["score"] = doc.score;
							repos[i].owner["rank"] = doc.rank;
						}
						i++;
						callback(null, i);
					});
				},
				function(err,n){
					callback(null, repos);
				}
			);
	    },

	    //获取编程语言分布及用户类型分布
	    function(repos,callback){
	    	var languages = getLanguage.getRepoLanguage(repos);
	    	var repoUser = new Array();
                var userCount=0,orgCount=0;
                repos.forEach(function(repo){
                  if(repo.owner.type=="User"){
                    userCount++;
                  }
                  else{
                    orgCount++;
                  }
                })
            repoUser.push({"name":"个人","count":userCount});
            repoUser.push({"name":"组织","count":orgCount});
            var temp = [repos,languages,repoUser];
	    	callback(null,temp); 
	    }
	], function (err, result) {
		db.close();
	    callback(null, result);
	});
}