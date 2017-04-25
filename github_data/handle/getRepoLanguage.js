var sortFun = require('./getSortFun.js');
exports.getRepoLanguage = function(repos){
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
		temp["name"] = key;
		temp["count"] = languages[key];
		Lang.push(temp);
	}

	var sum=0;
	Lang.forEach(function(language){
		sum = language.count+sum;
	})

	var temp = {"name":"others","count":0};
	var j = 0;
	for(var i=0;i<Lang.length;i++){
		if((Lang[i].count/sum)<0.03){;
			temp.count += Lang[i].count;
			Lang.splice(i,1);
			i--;
		}
	}

	if(temp.count>0){
		Lang.push(temp);
	}

	Lang.sort(sortFun.getSortFun('desc', "count"));
   	return Lang;
}