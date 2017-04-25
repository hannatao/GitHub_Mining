var sortFun = require('../handle/getSortFun.js');
var Segment = require('segment');

exports.getRepoWord = function(repos){
	var wordCount = {};
	var words = [];

	var segment = new Segment();
	segment.loadDict('dict2.txt')   
	segment.loadSynonymDict('synonym.txt');
	segment.loadStopwordDict('stopword.txt');
	segment.loadStopwordDict('english_stopword.txt');
	segment.useDefault();

	var descri;
	var wordsTemp = [];
	repos.forEach(function(repo){
		descri=repo.description;
		if(descri!=null){
			descri = descri.replace(/\d+/g,''); 
			var words = segment.doSegment(descri.toLowerCase(),{
			  stripPunctuation: true,
			  stripStopword:true,
			  simple: true
			});

			words.forEach(function(word){
				if(!wordCount[word]){
					wordCount[word] = 0;
				}
				wordCount[word]++;
			})
		}
	})

	if(wordCount["微"] && wordCount["信"]){
		wordCount["微信"] = (wordCount["微"]>=wordCount["信"]?wordCount["微"]:wordCount["信"]);
		delete wordCount["微"];
		delete wordCount["信"];
	}

	if(wordCount["wechat"] && wordCount["微信"]){
		wordCount["微信"] += wordCount["wechat"];
		delete wordCount["wechat"];
	}

	for(var key in wordCount){
		var temp = {};
		temp["key"] = key;
		temp["value"] = wordCount[key];
		wordsTemp.push(temp);
	}

	wordsTemp.sort(sortFun.getSortFun('desc', "value"));
	wordsTemp = wordsTemp.slice(0,30);
	return wordsTemp;
}