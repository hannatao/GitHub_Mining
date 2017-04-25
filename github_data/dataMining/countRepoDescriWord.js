var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var sortFun = require('../handle/getSortFun.js');
var Segment = require('segment');
var repo_language = require('../handle/getRepoLanguage.js');

var db = monk('127.0.0.1:27017/github');
var repodb = db.get('repo_china_final_rank');
var repo_word = db.get('repo_word');

getRepoWord();
function getRepoWord(){
//exports.getRepoWord = function(callback){
	async.waterfall([
	function(callback){
	  	repodb.find().then((repos) => {
	    	callback(null,repos);
	    });
		},
		countWord,
		insertRepo
	],
	function(err,result){
		db.close();
		callback(null,result);
	})
}

function countWord(repos,callback){
	console.log("countWord");
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
			  //convertSynonym:true,
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

	wordCount["微信"] = wordCount["微"]+wordCount["wechat"];
	wordCount["信"] = wordCount["信"] - wordCount["微"];
	delete wordCount["微"];

	for(var key in wordCount){
		var temp = {};
		temp["word"] = key;
		temp["count"] = wordCount[key];
		wordsTemp.push(temp);
	}

	wordsTemp.sort(sortFun.getSortFun('desc', "count"));
	wordsTemp = wordsTemp.slice(0,100);
	callback(null,wordsTemp,repos)
}

function insertRepo(words,repos,callback){
	console.log(words.length);
	var wordRepos = new Array();
	words.forEach(function(Word){
		//console.log(Word.word);
		var reg = new RegExp(Word.word,"i");
		var reposTemp = new Array();
		var temp = {};
		repos.forEach(function(repo){
			if(repo.description!=null && repo.description.match(reg)!=null){
				reposTemp.push(repo);
			}
		})
		reposTemp.sort(sortFun.getSortFun('desc', "myScore"));
		var languages = repo_language.getRepoLanguage(reposTemp);
		temp["word"] = Word.word;
		temp["count"] = Word.count;
		temp["repos"] = reposTemp;
		temp["languages"] = languages;
		wordRepos.push(temp);
	})
	console.log("insert");
	repo_word.insert(wordRepos);
}