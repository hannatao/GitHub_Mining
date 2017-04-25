var sortFun = require('./getSortFun.js');
exports.getLanguageRepos = function(repos){

	var languages = {};
	var Lang = new Array();
	for (var i in repos) {
	  var language = repos[i].language;
	  if(language!=null){
		  if(!languages[language]){
		    languages[language] = 0
		  }
		  languages[language]++;
	  }
	}

	for(var key in languages){
		var temp = {};
		temp["label"] = key;
		temp["value"] = languages[key];
		Lang.push(temp);
	}

	Lang.forEach(function(language){
		var Repos = new Array();
		repos.forEach(function(repo){
			if(repo.language==language.label){
				var temp = {};
				temp["repoName"] = repo.name;
				temp["html_url"] = repo.html_url;
				temp["myScore"] = repo.myScore;
				temp["rank"] = repo.rank;
				temp["stargazers_count"] = repo.stargazers_count;
				Repos.push(temp);
			}
		})
		Repos.sort(sortFun.getSortFun('asc', "rank"));
		language["repos"] = Repos;
	})

	var sum=0;
	Lang.forEach(function(language){
		sum = language.value+sum;
	})

	var temp = {"label":"Others","value":0,"repos":[]};
	var j = 0;
	for(var i=0;i<Lang.length;i++){
		if((Lang[i].value/sum)<0.02){;
			temp.value += Lang[i].value;
			temp["repos"] = temp["repos"].concat(Lang[i].repos);
			Lang.splice(i,1);
			i--;
		}
	}

	if(temp.value>0){
		Lang.push(temp);
	}

	Lang.sort(sortFun.getSortFun('desc', "value"));
   	return Lang;
}