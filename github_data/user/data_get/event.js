var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user = require('../user_get.js');

var db = monk('127.0.0.1:27017/github');
var events = db.get('event');

var client = github.client({
	username: 'raychenNJU',
  	password: 'cr112358132134'
});

async.waterfall([
	user.Get_User,
	get_Event,
],function(err,result){
	console.log(result);
})

function get_Event(result, callback){
	var i = 0;
	result.forEach(function(temp){
		if(i < 20){
			var name = temp.login;
			var ghuser = client.user(name);
			ghuser.events(['PushEvent'],2,function(error, body, headers){
				console.log(name);
				body.forEach(function(key){
					events.insert({actor:key.actor.login, repo:key.repo.name, time: key.created_at});
				});		
			});	
		}
		i ++;
	});
	callback(null, key);	
}



