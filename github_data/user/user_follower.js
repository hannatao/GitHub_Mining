var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user = require('./user_get.js');

var db = monk('127.0.0.1:27017/github');

exports.user_follower = function(callback){
	// var follower = db.get('follower');
	var follower = db.get('follower_user_rank');
	async.waterfall([
	//获取全部follower
	function(callback){
		var result = new Array();
		follower.find({}).then((doc) => {
			for(var key in doc){
				var temp = {};
				temp['source'] = doc[key].source;
				temp['target'] = doc[key].target;
				result.push(temp);
			}
			callback(null, result);
		});
	},
	function(result,callback){
		var result_temp = {};
		var node = [];
		node.push({'id' : result[0].source});
		for(var i in result){
			var flag1 = true;
			var flag2 = true;
			for(var j in node){
				if(result[i].source == node[j].id){
					flag1 = false;
				}
				if(result[i].target == node[j].id){
					flag2 = false;
				}
			}
			if(flag1){
				node.push({'id' : result[i].source});
			}
			if(flag2){
				node.push({'id' : result[i].target});
			}
		}
		result_temp['nodes'] = node;
		result_temp['edges'] = result;
		callback(null,result_temp);
	}],
	function(err,result){
		db.close();
		callback(null, result);
	});
}