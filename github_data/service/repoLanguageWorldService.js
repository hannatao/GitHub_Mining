var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");

var db = monk('127.0.0.1:27017/github');
var repo_db = db.get('repo_world_pre');
var getLanguageRepos = require("../handle/getLanguageRepos.js")
var sortFun = require('../handle/getSortFun.js');

exports.GetRepoLanguage = function(callback){
  async.waterfall([
  	function(callback){
      repo_db.find().then((docs) => {
        callback(null,docs);
      });
    },
    function(repos,callback){
      repos.sort(sortFun.getSortFun('desc', "stargazers_count"));
      for(var i=0;i<repos.length;i++){
        repos[i]["rank"] = i+1;
      }
      callback(null,repos);
    },
    function(repos,callback){
      var languages = new Array();
      languages = getLanguageRepos.getLanguageRepos(repos);
      callback(null,languages);
    }
  ], 
  function (err, result) {
    callback(null,result);
  });
}

exports.GetUserOrgLanguage = function(callback){
  async.waterfall([
    function(callback){
      repo_db.find().then((docs) => {
        callback(null,docs);
      });
    },
    function(repos,callback){
      repos.sort(sortFun.getSortFun('desc', "stargazers_count"));
      for(var i=0;i<repos.length;i++){
        repos[i]["rank"] = i+1;
      }
      callback(null,repos);
    },

    function(repos,callback){
      var userRepos = new Array();
      var orgRepos = new Array();
      var userLanguages = new Array();
      var orgLanguages = new Array();
      repos.forEach(function(repo){
        if(repo.owner.type == "User"){
          userRepos.push(repo)
        }
        else{
          orgRepos.push(repo);
        }
      })
      userLanguages = getLanguageRepos.getLanguageRepos(userRepos);
      orgLanguages = getLanguageRepos.getLanguageRepos(orgRepos);
      var temp = [userLanguages,orgLanguages];
      callback(null,temp);
    }
  ], 
  function (err, result) {
    callback(null,result);
  });
}