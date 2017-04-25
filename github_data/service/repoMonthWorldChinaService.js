var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var handle = require("../handle/getRepoMonthWorldChina.js");

var db = monk('127.0.0.1:27017/github');
var repo_china = db.get('repo_china_final_rank');
var repo_world = db.get('repo_world_pre');

exports.GetRepoMonth = function(callback){
	async.waterfall([
  	function(callback){
      repo_china.find().then((reposChina) => {
        callback(null,reposChina);
      });
    },
    function(reposChina,callback){
      repo_world.find().then((reposWorld) => {
        callback(null,reposChina,reposWorld);
      });
    },

	function handRepoMonth(reposChina,reposWorld,callback){
		var data = new Array();
		var reposChina = handle.countChinaWorld(reposChina,"china");
		var reposWorld = handle.countChinaWorld(reposWorld,"world");
		var result1 = handle.countUserOrg(reposChina,"china");
		var result2 = handle.countUserOrg(reposWorld,"world");
		data = [result1[0],result2[0],result1[1],result2[1]];    
        callback(null,data);
	}
  ],

  function (err, result) {
    //console.log(result);
    callback(null,result);
  });
}