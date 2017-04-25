var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var AHP = require('ahp');

var ahpContext = new AHP();
var db = monk('127.0.0.1:27017/github');
var users = db.get('repo_china_owner_filter');
var rank = db.get('user_rank');

async.waterfall([
	function(callback){
		users.find({},{fields:{login: 1, public_repos: 1, followers: 1, count: 1}})
		.then((doc) => {
			for(var key in doc){
				if(doc[key].count > 1){
					continue;
				}else
				if(doc[key].followers < 1){
					doc.splice(key,key + 1);
					key --;
				}else
				if(doc[key].public_repos < 1){
					doc.splice(key,key + 1);
					key --;
				}
			}
			callback(null, doc);
		})
	}
	,function(doc,callback){
		console.log(doc.length);
		ahpContext.addCriteria(['count','followers','public_repos']);
		var login = [];
		var count = [];
		var followers = [];
		var public_repos = [];
		for(var i in doc){
			login.push(doc[i].login);
			for(var j in doc){
				var temp1 = [];
				var temp2 = [];
				var temp3 = [];
				temp1.push(doc[i].login);
				temp2.push(doc[i].login);
				temp3.push(doc[i].login);
				temp1.push(doc[j].login);
				temp2.push(doc[j].login);
				temp3.push(doc[j].login);
				temp1.push(doc[i].count/doc[j].count);
				temp2.push(doc[i].followers/doc[j].followers);
				temp3.push(doc[i].public_repos/doc[j].public_repos);

				count.push(temp1);
				followers.push(temp2);
				public_repos.push(temp3);
			}
		}
		ahpContext.addItems(login);
		ahpContext.rankCriteriaItem('count',count);
		ahpContext.rankCriteriaItem('followers',followers);
		ahpContext.rankCriteriaItem('public_repos',public_repos);
		ahpContext.rankCriteria(
			[
				['count','followers',5],
				['count','public_repos',7],
				['followers','public_repos',3],
			]
		);
		var output = ahpContext.run();
		callback(null, output);
	},function(result,callback){
		var weight = result.criteriaRankMetaMap.weightedVector;
		var result_sort = result.rankedScoreMap;
		var conclusion = [];
		for(var key in result_sort){
			var temp = {};
			temp['login'] = key;
			temp['score'] = result_sort[key];
			conclusion.push(temp);
		}
		conclusion = sortArray(conclusion);
		var first = conclusion[0].score / 100;
		for(var key in conclusion){
			conclusion[key].score = conclusion[key].score / first;
		}
		rank.insert(conclusion);
		callback(null,{'weight':weight, 'score': conclusion});
	}
	]
	,function(err,result){
		console.log(result);
		db.close();
	});

function sortArray(result){
	for(var i = 0; i < result.length - 1; i++){
		for(var j = i + 1; j < result.length; j++){
			if(result[i].score < result[j].score){
				var temp = result[i];
				result[i] = result[j];
				result[j] = temp;
			}
		}
	}
	return result;
}