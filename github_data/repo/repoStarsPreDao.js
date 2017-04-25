var request = require('request');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var async = require('async');

var client = github.client({
	username: 'raychenNJU',
    password: 'cr112358132134'
});

var ghsearch = client.search();

var db = monk('127.0.0.1:27017/github');
var repo_pre = db.get('repo_stars_pre2');

InsertPreRepo();

function InsertPreRepo(){
	var pages = new Array();
	for(var i = 1; i < 11; i ++){
		var temp ={};
		temp['page'] = i;
		temp['flag'] = false;
		pages[i - 1] = temp;
	}

	pages.forEach(function(Page,index){
		ghsearch.repos({
			q : 'created:"2016-01-01..2016-01-31" stars:>100',
			sort : 'stars',
			order : 'desc',
			page : Page.page,
			per_page : 100
		},function(err,body,headers){
			if(!err && headers.status== '200 OK'){
				Page['flag'] = true;
			body.items.forEach(function(repo){
				repo["month"] = 1;
			})
			repo_pre.insert(body.items);
			console.log(Page);
			}
			else{
				console.log(err);
			}
		})
	});
	setTimeout(function(){
		pages.forEach(function(Page){
			if(!Page.flag){
				console.log(Page.page);
				ghsearch.repos({
				q : 'created:"2016-01-01..2016-01-31" stars:>100',
				sort : 'stars',
				order : 'desc',
				page : Page.page,
				per_page : 50
			},function(err,body,headers){
				if(!err && headers.status== '200 OK'){
					Page['flag'] = true;
				body.items.forEach(function(repo){
					repo["month"] = 1;
				})
				repo_pre.insert(body.items);
				console.log(Page);
				}
				else{
					console.log(err);
				}
			})
			
			}
			})
		},60000);
}

exports.GetPreRepo = function(callback){
	async.waterfall([
	    function(callback) {
	    	repo_pre.find({}).then((docs) => {
	    		callback(null,docs);
	    	});
	    },
	    function(arg, callback) {
	        db.close();
	        callback(null, arg);
	    },
	], function (err, result) {
	    	callback(null, result);
	});
}