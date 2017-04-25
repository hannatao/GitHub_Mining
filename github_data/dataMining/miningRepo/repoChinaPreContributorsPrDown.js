var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");

var client  = github.client({
	username: 'raychenNJU',
    password: 'cr112358132134'
});

var db = monk('localhost:27017/github');
var repo_down = db.get('repo_china_pre_contri_pr_down');
var repo_pre = db.get('repo_china_pre_contri_pr');

//remove();
getRepoDownloads();
function remove(){
	repo_contri.remove({ "month": 13 },function(){
		console.log("repo remove done");
	})
}

function getRepoDownloads(){
	async.waterfall([
	  function(callback){
	  	repo_pre.find({"month":12}).then((docs) => {
	  		console.log(docs.length);
	    	callback(null,docs);
	    });
	  },
	  getDownloads
	], 
	function (err, result) {
	  db.close();
	  console.log("All done");
	});
}


function getDownloads(arg,callback){
	var reposTemp = new Array();
	arg.forEach(function(repo){
		var temp = {};
		temp["flag"] = false;
		temp["repo"] = repo;
		reposTemp.push(temp);
	})
	console.log("one");
	var myInterval=setInterval(myfunc,30000,"Interval");

	setTimeout(stopInterval,100000);

	function stopInterval(){
	 	clearTimeout(myInterval);
	}

	function myfunc(Interval){
		console.log("two");
		reposTemp.forEach(function(Repo){
			if(!Repo.flag){
				var ghrepo = client.repo(Repo.repo.full_name);
	   			ghrepo.releases(function(err, body, headers){
		   			if(err==null && body.length!=0 &&headers.status== '200 OK' && !Repo.flag){
						Repo['flag'] = true;
						Repo.repo["releases"] = body;
						repo_down.insert(Repo.repo);
						console.log(Repo.repo.name+"||"+body.length);
					}
					else{
						if(body==null){
							console.log(err);
						}
					}		
	   			});
			} 		
		});
	}
}
