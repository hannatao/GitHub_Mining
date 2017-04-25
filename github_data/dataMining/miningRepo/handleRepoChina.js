var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");

var db = monk('127.0.0.1:27017/github');
var repo_pre = db.get('repo_china_pre_contri_pr');
var ownerdb = db.get('repo_china_owner_pre');
var repodb = db.get('repo_china_full');

//remove();
handleRepoChina();
function handleRepoChina(){
	async.waterfall([
	function(callback){
	  	repo_pre.find().then((repos) => {
	  		console.log(repos.length);
	    	callback(null,repos);
	    });
		},
		contract
	],
	function(err,result){
		db.close();
		console.log("All done");
	})
}

function contract(repos,callback){
  	repos.forEach(function(repo){
  		ownerdb.findOne({"repoFullName":repo.full_name}).then((owner)=>{
  			repo["ownerInfo"] = owner;
  			repo["contributors_count"] = repo.contributors.length;
  			repo["prs_count"] = repo.prs.length;
  			repodb.insert(repo);
  		})
  	})
}
