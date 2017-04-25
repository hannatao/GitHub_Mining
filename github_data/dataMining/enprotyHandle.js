var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var sortFun = require('./getSortFun.js');

var db = monk('127.0.0.1:27017/github');
var repo_pre = db.get('repo_china_final_pre');
var repo_after = db.get('repo_china_final_rank');

handleRepoChina();
function handleRepoChina(){
	async.waterfall([
	function(callback){
	  	repo_pre.find().then((repos) => {
	  		console.log(repos.length);
	    	callback(null,repos);
	    });
		},
		entropyHandle,
		grayRelational,
		linearChange
	],
	function(err,result){
		db.close();
		console.log("All done");
	})
}

function entropyHandle(repos,callback){
	var typeE = [{"name":"stargazers_count","total":0,"E":0,"wE":0,"wAhp":0.3655,"W":0},
				 {"name":"forks","total":0,"E":0,"wE":0,"wAhp":0.1931,"W":0},
				 {"name":"subscribers_count","total":0,"E":0,"wE":0,"wAhp":0.1651,"W":0},
				 {"name":"contributors_count","total":0,"E":0,"wE":0,"wAhp":0.1061,"W":0},
				 {"name":"prs_count","total":0,"E":0,"wE":0,"wAhp":0.0778,"W":0},
				 {"name":"open_issues_count","total":0,"E":0,"wE":0,"wAhp":0.0531,"W":0},
				 {"name":"network_count","total":0,"E":0,"wE":0,"wAhp":0.0393,"W":0}];
				 //var wAhp = [0.3655,0.1931,0.1651,0.1061,0.0778,0.0531,0.0393];
				 //wAhp = {"stargazers_count":0.3655,"forks":0.1931,"subscribers_count":0.1651,"contributors_count":0.1061,
				//		"prs_count":0.0778,"open_issues_count":0.0531,"network_count":0.0393}; 
	repos.forEach(function(repo){
		for(var i=0 ; i<typeE.length ; i++){
			typeE[i].total += repo[typeE[i].name]; 
		}
	})

	repos.forEach(function(repo){
		for(var i=0 ; i<typeE.length ; i++){
			var tempStr = typeE[i].name+"P";
			if(repo[typeE[i].name]!=0){
				repo[tempStr] = repo[typeE[i].name]/typeE[i].total;
				typeE[i].E += repo[tempStr]*Math.log(repo[tempStr]);
			} 
		}
	})

	for(var i=0 ; i<typeE.length ; i++){
		typeE[i].E = -typeE[i].E/Math.log(repos.length);
	}

	var totalE = 7;
	var totalW = 0;
	var Wei = new Array();

	for (var i = 0; i<typeE.length; i++) {
		totalE -=typeE[i].E; 
	}

	for (var i = 0; i<typeE.length; i++) {
		typeE[i].eW = (1-typeE[i].E)/totalE;
		typeE[i].W = typeE[i].eW*typeE[i].wAhp;
		totalW += typeE[i].W;
	}

	for (var i = 0; i<typeE.length; i++) {
		typeE[i].W = typeE[i].W/totalW;
		 Wei.push(typeE[i].W);
	}

	//删除无用repo属性
	repos.forEach(function(repo){
		for(var i=0 ; i<typeE.length ; i++){
			var tempStr = typeE[i].name+"P";
			delete repo[tempStr];
		}
	})
	callback(null,repos,Wei);
}

function grayRelational(repos,W,callback){
	var P = 0.5;
	var limitType = [{"name":"stargazers_count","max":repos[0].stargazers_count,"min":repos[0].stargazers_count},
					 {"name":"forks","max":repos[0].forks,"min":repos[0].forks},
					 {"name":"subscribers_count","max":repos[0].subscribers_count,"min":repos[0].subscribers_count},
					 {"name":"contributors_count","max":repos[0].contributors_count,"min":repos[0].contributors_count},
					 {"name":"prs_count","max":repos[0].prs_count,"min":repos[0].prs_count},
					 {"name":"open_issues_count","max":repos[0].open_issues_count,"min":repos[0].open_issues_count},
					 {"name":"network_count","max":repos[0].network_count,"min":repos[0].network_count}];

	repos.forEach(function(repo){
		if(repo.stargazers_count > limitType[0].max)
			limitType[0].max = repo.stargazers_count;
		else if(repo.stargazers_count < limitType[0].min)
			limitType[0].min = repo.stargazers_count;

		if(repo.forks > limitType[1].max)
			limitType[1].max = repo.forks;
		else if(repo.forks < limitType[1].min)
			limitType[1].min = repo.forks;

		if(repo.subscribers_count > limitType[2].max)
			limitType[2].max = repo.subscribers_count;
		else if(repo.forks < limitType[2].min)
			limitType[2].min = repo.subscribers_count;

		if(repo.contributors_count > limitType[3].max)
			limitType[3].max = repo.contributors_count;
		else if(repo.forks < limitType[3].min)
			limitType[3].min = repo.contributors_count;

		if(repo.prs_count > limitType[4].max)
			limitType[4].max = repo.prs_count;
		else if(repo.prs_count < limitType[4].min)
			limitType[4].min = repo.prs_count;

		if(repo.open_issues_count > limitType[5].max)
			limitType[5].max = repo.open_issues_count;
		else if(repo.open_issues_count < limitType[5].min)
			limitType[5].min = repo.open_issues_count;

		if(repo.network_count > limitType[6].max)
			limitType[6].max = repo.network_count;
		else if(repo.network_count < limitType[6].min)
			limitType[6].min = repo.network_count;
	})

	repos.forEach(function(repo){
		for (var i = 0; i < limitType.length; i++) {
			var temp = limitType[i].name+"G";
			repo[temp] = P*(limitType[i].max-limitType[i].min)/((limitType[i].max-repo[limitType[i].name])+
						P*(limitType[i].max-limitType[i].min));
		}
	})

	repos.forEach(function(repo){
		var score = 0;
		for (var i = 0; i < limitType.length; i++) {
			var temp = limitType[i].name+"G";
			score += W[i]*repo[temp];
			delete repo[temp];
		}
		repo["myScore"] = score.toFixed(6);
	})

	callback(null,repos);
}

function linearChange(repos,callback){
	repos.sort(sortFun.getSortFun('desc', "myScore"));
	maxScore = repos[0].myScore;
	minScore = repos[repos.length-1].myScore;
	var k = 100/(maxScore-minScore);
	b = 100-k*maxScore;
	for(var i=0;i<repos.length;i++){
		repos[i].myScore = parseFloat((k*repos[i].myScore+b).toFixed(6));
		repos[i]["rank"] = i+1;
		//console.log(repos[i].myScore+"||"+repos[i].rank);
	}
	repo_after.insert(repos);
}

/*function entropyHandle2(repos,callback){
	var typeCount = {};

	starsTotal = 0;
	forksTotal = 0;
	subsTotal = 0;
	consTotal = 0;
	prsTotal = 0;
	issuesTotal = 0;
	netsTotal = 0;

	starsE = 0;
	forksE = 0;
	consE = 0;
	prsE = 0;
	issuesE = 0;
	subsE = 0;
	netsE = 0;

	repos.forEach(function(repo){
		starsTotal +=repo.stargazers_count;
		forksTotal +=repo.forks;
		subsTotal +=repo.subscribers_count;
		consTotal +=repo.contributors_count;
		prsTotal +=repo.prs_count;
		issuesTotal +=repo.open_issues_count;
		netsTotal +=repo.network_count;
	})

	var typeCount = {"starsTotal":starsTotal,
					 "forksTotal":forksTotal,
					 "subsTotal" :subsTotal,
					 "consTotal":consTotal,
					 "prsTotal":prsTotal,
					 "issuesTotal":issuesTotal,
					 "netsTotal":netsTotal
					};
	repos.forEach(function(repo){
		repo["starsP"] = repo.stargazers_count/typeCount.starsTotal;
		repo["forksP"] = repo.forks/typeCount.forksTotal;
		repo["consP"] = repo.contributors_count/typeCount.consTotal;
		repo["prsP"] = repo.prs_count/typeCount.prsTotal;
		repo["issuesP"] = repo.open_issues_count/typeCount.issuesTotal;
		repo["subsP"] = repo.subscribers_count/typeCount.subsTotal;
		repo["netsP"] = repo.network_count/typeCount.netsTotal;

		if(repo.starsP!=0){
			starsE += repo.starsP*Math.log(repo.starsP);
		}
		if(repo.forksP!=0){
			forksE += repo.forksP*Math.log(repo.forksP);
		}
		if(repo.consP!=0){
			consE += repo.consP*Math.log(repo.consP);
		}
		if(repo.issuesP!=0){
			issuesE += repo.issuesP*Math.log(repo.issuesP);
		}
		if(repo.prsP!= 0){
			prsE += repo.prsP*Math.log(repo.prsP);
		}
		if(repo.subsP!= 0){
			subsE += repo.subsP*Math.log(repo.subsP);
		}
		if(repo.netsP!= 0){
			netsE += repo.netsP*Math.log(repo.netsP);
		}
	})

	starsE = -starsE/Math.log(repos.length);
	forksE = -forksE/Math.log(repos.length);
	consE = -consE/Math.log(repos.length);
	issuesE = -issuesE/Math.log(repos.length);
	prsE = -prsE/Math.log(repos.length);
	subsE = -subsE/Math.log(repos.length);
	netsE = -netsE/Math.log(repos.length);

	var typeE = [starsE,forksE,subsE,consE,prsE,issuesE,netsE];
	var eW = new Array();
	var W = new Array();
	//wAhp = {"stargazers_count":0.3655,"forks":0.1931,"subscribers_count":0.1651,"contributors_count":0.1061,
	//		"prs_count":0.0778,"open_issues_count":0.0531,"network_count":0.0393}; 
	var wAhp = [0.3655,0.1931,0.1651,0.1061,0.0778,0.0531,0.0393];
	totalE = 7-starsE-forksE-consE-issuesE-prsE-subsE-netsE;

	var totalW = 0;
	for (var i = 0; i<typeE.length; i++) {
		eW[i] = (1-typeE[i])/totalE;
		W[i] = eW[i]*wAhp[i];
		totalW += W[i];
	}

	for (var i = 0; i<W.length; i++) {
		W[i] = W[i]/totalW;
	}
	console.log(W);
	//callback(null,repos,W);
}*/