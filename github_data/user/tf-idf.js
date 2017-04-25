var jieba = require('nodejieba');
var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var users = db.get('repo_china_owner_filter');

var topN = 80;

exports.TF = function(param,callback){
	var string = '';
	async.waterfall([
	function(callback){
		users.find({location:{$regex:param,$options:"$i"}},'bio').then((doc) => {
			var count = 0;
			for(var key in doc){
				if(doc[key].bio != null){
					string = string + doc[key].bio + '.';
					count ++;
				}
			}
			callback(null, string);
		})
	}
	,function(result,callback){
		var freq = jieba.extract(result.toLowerCase(),topN);
		callback(null, freq);
	}
	]
	,function(err,result){
		db.close();
		callback(null, result);
	}
);
}



