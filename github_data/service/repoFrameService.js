var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var sortFun = require('../handle/getSortFun.js');
var getLanguage = require('../handle/getRepoLanguages.js');

var db = monk('127.0.0.1:27017/github');
var repo_db = db.get('repo_china_frame');

exports.GetFrame = function(type,callback){
	async.waterfall([
	    function(callback) {
	    	repo_db.find({"type":type}).then((docs) => {
	    		callback(null,docs);
	    	});
	    },
	   	function(frames,callback) { 
			frames.sort(sortFun.getSortFun('desc', "repos_count"));
			callback(null,frames);
	    },

	    function(frames,callback){
	    	frames.forEach(function(frame){
	    		var languages = getLanguage.getRepoLanguage(frame.repos);
	    		frame["languages"] = languages;
	    	})
	    	callback(null,frames);
	    }
	], function (err, result) {
		db.close();
	    callback(null, result);
	});
}