var github = require('octonode');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user = require('../user_get.js');

var db = monk('127.0.0.1:27017/github');
// var user_follower = db.get('follower');
var user_follower = db.get('follower_user_rank');

var client = github.client({
	username: 'raychenNJU',
  	password: 'cr112358132134'
});

async.waterfall([
	user.Get_User,
	get_follower,
],function(err,result){

})

function get_follower(result,callback){
	var i = 30;
	var j = 0;
	result.forEach(function(value,index,array){
		if(index < i){
			array.forEach(function(value1,index1,array1){
				if(index1 < i){
					if(index1 != index){
						client.get('/users/' + array[index].login + '/following/' + array1[index1].login, function (err, status, body, headers){
							console.log(j);
							if(status == '204'){
								var temp = {};
								temp['source'] = array1[index1].login;
								temp['target'] = array[index].login;
								console.log(temp);
								user_follower.insert(temp);
							}
							j ++;
						});
					}
				}
			});
		}
	});
	callback(null, i);
}