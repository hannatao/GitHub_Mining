var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user = require('../user_get.js');

var client = github.client({
	username: 'raychenNJU',
  	password: 'cr112358132134'
});

var db = monk('127.0.0.1:27017/github');
var user_location = db.get('user_location');

async.waterfall([
	user.Get_User,
	get_location,
],function(err,result){
	console.log(result);
})

function get_location(result, callback){
	for(var key in result){
		var name = result[key].login;
		client.get('/users/' + name, function(err,status,body,headers){
			if(body != null && body.updated_at > '2016-01-01'){
				user_location.insert({login : body.login, location : body.location, company : body.company});
			}
			key ++;
		});
	}
	callback(null, key);	
}

// user.Insert_User();
