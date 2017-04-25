var async = require('async');
var monk = require("monk");
var mongo = require("mongodb");

var db = monk('127.0.0.1:27017/github');
var repo_db = db.get('repo_china_pre_contri');

exports.GetRepoLanguage = function(json,callback){
  async.waterfall([
  	function(callback){
      repo_db.find().then((docs) => {
        callback(null,docs);
      });
    },
  	getLanguageCount,
    getLanguageRepo
  ], 
  function (err, result) {
    db.close();
    callback(null,json,result);
  });
}

function getLanguageCount(arg,callback){
	var languages = {};
  for (var i in arg) {
      var language = arg[i].language;
      if(!languages[language]){
        languages[language] = 0
      }
      languages[language]++;
  }
   	callback(null,languages,arg); 
}

function getLanguageRepo(languages,repos,callback){
  var languageRepos = new Array();
  for (var key in languages) {
    var temp = {};
    var tempRepos = new Array();
    repos.forEach(function(repo){
      if(repo.language==key){
        tempRepos.push(repo);
      }
    });
    var name_temp = [];
    for(var i in tempRepos){
      name_temp.push(tempRepos[i].full_name);
    }
    temp["name"] = key;
    temp["reposCount"] = languages[key];
    temp["repos"] = name_temp;
    languageRepos.push(temp);
  }
  callback(null,languageRepos);
}
