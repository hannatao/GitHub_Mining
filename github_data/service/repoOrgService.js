var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');
var sortFun = require('../handle/getSortFun.js');
var getLanguage = require('../handle/getRepoLanguages.js');
var getRepoWord = require('../handle/getRepoDescriWord.js');

var db = monk('127.0.0.1:27017/github');
var org_db = db.get('repo_china_org');

exports.GetOrg = function(type,top,callback){
	async.waterfall([
	    function(callback) {
	    	org_db.find().then((docs) => {
	    		callback(null,docs,type);
	    	});
	    },
	   	function(orgs,type,callback) { 
			orgs.sort(sortFun.getSortFun('desc', type));
			orgs = orgs.slice(0,top);
			callback(null,orgs);
	    },

	    function(orgs,callback){
	    	orgs.forEach(function(org){
	    		var languages = getLanguage.getRepoLanguage(org.reposOrg);
	    		org["languages"] = languages;
	    	})
	    	callback(null,orgs);
	    }

	], function (err, result) {
		db.close();
	    callback(null, result);
	});
}