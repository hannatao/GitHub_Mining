var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var sortFun = require('./getSortFun.js');
var repo_language = require('./getRepoLanguage.js');

var db = monk('localhost:27017/github');
var repo_pre = db.get('repo_china_final')
var repo_contri = db.get('contri_repo');


//remove();
//getContriRepo();
exports.getContriRepo = function(callback){
//function getContriRepo(){
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
	  countContributors,
	  getContributors,
	], 
	function (err, result) {
	  db.close();
	  callback(null,result);
	});
}

function countContributors(repos,callback){
	var contris = {};
	repos.forEach(function(repo){
		repo.contributors.forEach(function(contributor){
			if(!contris[contributor.login]){
				contris[contributor.login] = 0;
			}
			contris[contributor.login]++;
		})
	})
	callback(null,contris,repos)
}


function getContributors(contris,repos,callback){
	var Contris = new Array();
	for(var key in contris){
		var contributionsTotal = 0;
		var reposTotal = 0;
		var contrisRepos = new Array();
		var temp = {};
		var contributorInfo;
		repos.forEach(function(repo){
			var flag = false;
			repo.contributors.forEach(function(contributor){
				if(contributor.login == key){
					flag = true;
					contributionsTotal += contributor.contributions;
				}
				contributorInfo = contributor;
			})

			if(flag){
				reposTotal++;
				contrisRepos.push(repo);
			}
		})
		contrisRepos.sort(sortFun.getSortFun('desc', "myScore"));
		temp["login"] = key;
		temp["repos"] = contrisRepos;
		temp["contriInfo"] = contributorInfo;
		temp["repos_count"] = reposTotal;
		temp["contributions_count"] = contributionsTotal;
		var languages = repo_language.getRepoLanguage(contrisRepos);
		temp["languages"] = languages;
		Contris.push(temp);
	}
	callback(null,Contris);
}

