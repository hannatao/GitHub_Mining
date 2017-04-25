var sortFun = require('./getSortFun.js');
var repo_language = require('./getRepoLanguages.js');

exports.countContributors = function(repos,callback){
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


exports.getContributors = function(contris,repos,callback){
	var Contris = new Array();
	for(var key in contris){
		var contributionsTotal = 0;
		var reposTotal = 0;
		var reposScoreTotal = 0;
		var contrisRepos = new Array();
		var temp = {};
		var contributorInfo;
		var html_url;
		repos.forEach(function(repo){
			var flag = false;
			repo.contributors.forEach(function(contributor){
				if(contributor.login == key){
					flag = true;
					contributionsTotal += contributor.contributions;
					html_url = contributor.html_url;
				}
				contributorInfo = contributor;
			})

			if(flag){
				reposTotal++;
				contrisRepos.push(repo);
			}
		})
		contrisRepos.sort(sortFun.getSortFun('desc', "myScore"));

		contrisRepos.forEach(function(repo){
			reposScoreTotal += repo.myScore;
		})
		temp["login"] = key;
		temp["repos"] = contrisRepos;
		temp["contriInfo"] = contributorInfo;
		temp["repos_count"] = reposTotal;
		temp["contributions_count"] = contributionsTotal;
		temp["reposScoreTotal"] = parseFloat(reposScoreTotal.toFixed(6));
		var languages = repo_language.getRepoLanguage(contrisRepos);
		temp["languages"] = languages;
		temp["html_url"] = html_url;
		Contris.push(temp);
	}
	callback(null,Contris);
}

