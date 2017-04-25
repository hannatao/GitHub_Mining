var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var company = require('./company_users');
var language = require('../repo/popLanguageChina2.js');
// var frame = require('../repo/repoChinaFrame.js');

exports.company_lan = function(callback){
	async.waterfall([
			company.company_users,
			language.GetRepoLanguage
			,function(json, result, callback){
				var conclusion = [];
				for(var i in json){
					var company_temp = json[i];
					var temp = [];
					for(var z in company_temp){
						var repo = company_temp[z].repo;
						for(var y in repo){
							for(var j in result){
								var repos = result[j].repos;
								for(var x in repos){
									if(repo[y] == repos[x]){
										temp.push(result[j].name);
									}
								}
							}
						}
					}
					var result_temp = {};
					result_temp['company'] = i;
					result_temp['language'] = temp;
					conclusion.push(result_temp);
				}
				callback(null, conclusion);
			}
			,function(result, callback){
				var conclusion = [];
				for(var key in result){
					var language_temp = result[key].language;
					var count = [];
					for(var i in language_temp){
						if(i == 0){
							var count_temp = {};
							count_temp['name'] = language_temp[i];
							count_temp['value'] = 1;
							count.push(count_temp);
						}else{
							var flag = true;
							for(var j in count){
								if(language_temp[i] == count[j].name){
									count[j].value ++;
									flag = false; 
								}
							}
							if(flag){
								var count_temp = {};
								count_temp['name'] = language_temp[i];
								count_temp['value'] = 1;
								count.push(count_temp);
							}
						}
					}
					count.sort(function decs(x,y){return x.value < y.value});
					var temp = {};
					temp['company'] = result[key].company;
					temp['language'] = count;
					conclusion.push(temp);
				}
				callback(null, conclusion);
			}
		]
		,function(err,result){
			callback(null, result);
		}
	);
}