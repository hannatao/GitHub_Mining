var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');

var db = monk('127.0.0.1:27017/github');
var repo = db.get('repo_user');

async.waterfall([
	function(callback){
		var temp = [];
		var result = [];
		repo.find({}).then((doc) =>{
			for(var key in doc){
				var flag = contains(temp,doc[key].repo_name);
				if(flag == -1){
					var json = {};
					json['repo_name'] = doc[key].repo_name;
					json['contributors'] = doc[key].contributors;
					result.push(json);
					temp.push(doc[key].repo_name);
				}else{
					var json = {};
					var array = doc[key].contributors.slice(0);
					result[flag].contributors.forEach(function(element){
						if(contains(doc[key].contributors,element) == -1){
							array.push(element);
						}
					});
					json['repo_name'] = doc[key].repo_name;
					json['contributors'] = array;
					result[flag] = json;
				}
			}
			var con = [];
			for(var key in result){
				if(result[key].contributors.length > 1){
					con.push(result[key]);
				}
			}
			callback(null,con);
		});
	},function(result,callback){
		var repo_temp = db.get('repo_user_1');
		repo_temp.insert(result);
		callback(null,result);
	}
	],
	function(err,result) {
		console.log(result);
	}
);

function contains(arr, obj) {
	if(arr == ''){
		return -1;
	}else{
		var i = arr.length;
  		while (i --) {
    		if (arr[i] == obj) {
      			return i;
   			}
 		}
  		return -1;
	}
}