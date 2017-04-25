var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");

var client  = github.client({
	username: 'raychenNJU',
    password: 'cr112358132134'
});

var db = monk('localhost:27017/github');
var repo_pre = db.get('repo_china_pre')
var repodb = db.get('repo_china_pre_contri');
var ownerdb = db.get('repo_china_owner_pre');
var contractdb = db.get('repo_china_owner_contri');

//remove();
contract();
function remove(){
	repo_contri.remove({ "month": 13 },function(){
		console.log("repo remove done");
	})
}

function contract(){
	async.waterfall([
	  function(callback){
	  	repodb.find().then((repos) => {
	  		console.log(repos.length);
	    	callback(null,repos);
	    });
	  },

	  function(repos,callback){
	  	repos.forEach(function(repo){
	  		ownerdb.findOne({"repoFullName":repo.full_name}).then((owner)=>{
	  			repo["ownerInfo"] = owner;
	  			contractdb.insert(repo);
	  		})
	  	})
	  }
	], 

	function (err, result) {
	  db.close();
	  console.log("All done");
	});
}
