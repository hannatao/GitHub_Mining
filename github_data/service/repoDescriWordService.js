var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var repo_word = db.get('repo_word');

exports.getRepoWord = function(callback){
	async.waterfall([
	    function(callback) {
	    	repo_word.find().then((words) => {
	    		words = words.slice(0,30);
	    		callback(null,words);
	    	});
	    },
	], function (err, result) {
		db.close();
	    callback(null, result);
	});
}