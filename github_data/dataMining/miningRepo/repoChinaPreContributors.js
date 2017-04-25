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
var repo_contri = db.get('repo_china_pre_contri');

//remove();
getRepoContri();
function remove(){
	repo_contri.remove({ "month": 13 },function(){
		console.log("repo remove done");
	})
}

function getRepoContri(){
	async.waterfall([
	  function(callback){
	  	repo_pre.find({"month":12}).then((docs) => {
	  		console.log(docs.length);
	    	callback(null,docs);
	    });
	  },
	  getContributors,
	], 
	function (err, result) {
	  db.close();
	  console.log("All done");
	});
}


function getContributors(arg,callback){
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
			if(!Repo.flag){
				var ghrepo = client.repo(Repo.repo.full_name);
	   			ghrepo.contributors({per_page:100},function(err, body, headers){
		   			if(err==null && headers.status== '200 OK' && !Repo.flag){
						Repo['flag'] = true;
						Repo.repo["contributors"] = body;
						repo_contri.insert(Repo.repo);
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