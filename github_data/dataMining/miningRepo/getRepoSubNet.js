var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");

var db = monk('127.0.0.1:27017/github');
var repo_pre = db.get('repo_china_full');
var repo_after = db.get('repo_china_final_pre');

var client = github.client({
	username: '490506863@qq.com',
    password: 'ssh640034'
});

handleRepoChina();
//remove();
function remove(){
	repo_contri.remove({ "month": 13 },function(){
		console.log("repo remove done");
	})
}

function handleRepoChina(){
	async.waterfall([
	function(callback){
	  	repo_pre.find({"month":12}).then((repos) => {
	  		console.log(repos.length);
	    	callback(null,repos);
	    });
	},
		getSubNet
	],
	function(err,result){
		db.close();
		console.log("All done");
	})
}

function getSubNet(arg,callback){
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
		console.log("two");
		reposTemp.forEach(function(Repo){
			if(!Repo.flag){
				var ghrepo = client.repo(Repo.repo.full_name);
	   			ghrepo.info(function(err, body, headers){
		   			if(err==null && headers.status== '200 OK' && !Repo.flag){
						Repo['flag'] = true;
						Repo.repo["network_count"] = body.network_count;
						Repo.repo["subscribers_count"] = body.subscribers_count;
						repo_after.insert(Repo.repo);
						console.log(Repo.repo.name+"||"+body.subscribers_count);
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