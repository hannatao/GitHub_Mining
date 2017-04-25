var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var sortFun = require('../handle/getSortFun.js');

var db = monk('127.0.0.1:27017/github');
var repo_db = db.get('repo_china_final_rank');
var org_db = db.get('repo_china_org');

handleRepoOrg();
function handleRepoOrg(){
	async.waterfall([
		function(callback){
		  	repo_db.find().then((repos) => {
		  		console.log(repos.length);
		    	callback(null,repos);
		    });
		},
		getOrgs,
		getOrgRepos
	],
	function(err,result){
		db.close();
		console.log("All done");
	})
}
function getOrgs(repos,callback){
	var tempOrgs = {};
	var orgLogins = new Array();
	repos.forEach(function(repo){
		if(repo.owner.type=="Organization"){

			if(!tempOrgs[repo.owner.login]){
				tempOrgs[repo.owner.login] = 0;
			}
			tempOrgs[repo.owner.login]++;
		}
	})
	for (var key in tempOrgs) {
		orgLogins.push(key);
	}
	callback(null,repos,orgLogins);
}

function getOrgRepos(repos,orgLogins,callback){
	console.log(orgLogins.length);
	var Orgs = new Array();
	orgLogins.forEach(function(orgLogin){
		var temp = {};
		var reposOrg = new Array();
		var myScoreTotal = 0;
		repos.forEach(function(repo){
			if(repo.owner.type=="Organization"){
				if(repo.owner.login == orgLogin){
					temp["org"] = repo.ownerInfo;
					temp["public_repos"] = repo.ownerInfo.public_repos;
					myScoreTotal += parseFloat(repo.myScore);
					reposOrg.push(repo);
				}
			}
		})
		reposOrg = reposOrg.sort(sortFun.getSortFun('desc', "myScore"));
		temp["reposScoreTotal"] = parseFloat(myScoreTotal.toFixed(6));
		temp["reposOrg"] = reposOrg;
		Orgs.push(temp);
	})
	org_db.insert(Orgs)
}