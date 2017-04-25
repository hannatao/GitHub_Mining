var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");

var sortFun = require('./getSortFun.js');

var client  = github.client({
	username: 'raychenNJU',
    password: 'cr112358132134'
});

var db = monk('localhost:27017/github');
var repo_pre = db.get('repo_china_pre_contri')
var repo_after = db.get('repo_china_pre_contri_add2')

getRepoContri();
function getRepoContri(){
	async.waterfall([
	  function(callback){
	  	repo_pre.find().then((docs) => {
	  		console.log(docs.length);
	    	callback(null,docs);
	    });
	  },
	  //countContri,
	  //getContributors
	  function(reposPre,callback){
	  	repo_after.find().then((reposAfter) => {
	  		console.log(reposAfter.length);
	    	callback(null,reposPre,reposAfter);
	    });
	  },
	  updateCon,
	], 
	function (err, result) {
	  console.log("All done");
	});
}


function countContri(tempRepos,callback){
	var repos = new Array();
	tempRepos.forEach(function(repo){
		if(repo.contributors.length==100){
			repos.push(repo);
		}
	})
	console.log(repos.length);
	callback(null,repos)
}

function updateCon(reposPre,reposAfter,callback){
	reposAfter.forEach(function(Repo){
		repo_pre.remove({"full_name":Repo.full_name});
		repo_pre.insert(Repo);
		console.log(Repo.contributors.length);
	})
	callback(null)
}

function getContributors(arg,repoNames,callback){
	var reposTemp = new Array();
	arg.forEach(function(repo){
		var temp = {};
		temp["flag"] = false;
		temp["repo"] = repo;  
		reposTemp.push(temp);
	})

	var myInterval=setInterval(myfunc,30000,"Interval");

	setTimeout(stopInterval,100000);

	function stopInterval(){
	 	clearTimeout(myInterval);
	}

	function myfunc(Interval){
		reposTemp.forEach(function(Repo){
			//Pages.forEach(function(Page){
				if(!Repo.flag){
					var ghrepo = client.repo(Repo.repo.full_name);
		   			ghrepo.contributors({page:5,per_page:100},function(err, body, headers){
			   			if(err==null && body.length!=0 && headers.status== '200 OK' && !Repo.flag){
							Repo['flag'] = true;
							var newCon = Repo.repo.contributors.concat( body);
							Repo.repo["contributors"] = newCon;
							repo_after.remove({"full_name":Repo.repo.full_name});
							repo_after.insert(Repo.repo);
							console.log(Repo.repo.name+"||"+Repo.repo.contributors.length);
						}
						else{
							if(body==null){
								console.log(err);
							}
						}		
		   			});
				} 	
			//})	
		});
	}
}