var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var repo_user = db.get('repo_user_1');
var user_follower = db.get('follower_repo_user');

var client = github.client({
	username: 'raychenNJU',
  	password: 'cr112358132134'
});

async.waterfall([
	get_repo_user,
	get_follower
],function(err,result){

});

function get_repo_user(callback){
	repo_user.find({}).then((doc) => {
		var user = [];
		for(var key in doc){
			doc[key].contributors.forEach(function(element){
				user.push(element);
			});
		}
		callback(null,user);
	});
}

function get_follower(result,callback){
	var j = 0;
	result.forEach(function(value,index,array){
		
			array.forEach(function(value1,index1,array1){
				
					if(index1 != index){
						client.get('/users/' + array[index] + '/following/' + array1[index1], function (err, status, body, headers){
							console.log(j);
							if(status == '204'){
								var temp = {};
								temp['source'] = array1[index1];
								temp['target'] = array[index];
								console.log(temp);
								user_follower.insert(temp);
							}
							j ++;
						});
					}
				
			});
		
	});
	callback(null, 0);
}