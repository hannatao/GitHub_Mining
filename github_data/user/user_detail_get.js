var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var stringSimilarity = require('string-similarity');

var db = monk('127.0.0.1:27017/github');
// var user_location = db.get('user_location');
var user_location = db.get('repo_china_owner_filter');

//获取location
exports.get_location = function(callback){
	async.waterfall([
	function(callback){
		var city = new Array();
		user_location.find({},'location').then((doc) => {
			for(var key in doc){
				var city_temp = doc[key].location;
				if(city_temp != null){
					var temp = city_temp.split(',');		
					city.push(temp[0].toLowerCase());	
				}
			}
			
			callback(null, city);
		});
	},
	function(city, callback){
		for(var key in city){
			var temp = new Array();
			temp = city[key].split(' ');
			if(temp.length > 1){city.splice(key,1,temp[0]);}
			if(city[key] == 'china'){
				city.splice(key,1);
				key --;
			}
		}
		for(var i = 0; i < city.length; i ++){
			for(var j = 1; j < city.length; j++){
				if(stringSimilarity.compareTwoStrings(city[i], city[j]) > 0.8){//0.7
					city.splice(j,1);
					if(j > i + 1){j --;}
				}
			}
		}
		for(var key in city){
			if(city[key].indexOf('china') > -1 || city[key] == ''){
				city.splice(key,1);
			}
		}
		callback(null, city);
	},
	function(city,callback){
		var city_count = {};
		var i = 0;
		async.whilst(
			function(){return i < city.length;},
			function(callback){
				user_location.count({location:{$regex:city[i],$options:"$i"}},{},function(err,result){	
					// var temp1 = '{"' + city[i] + '":' + result + '}';
					// var temp2 = JSON.parse(temp1);
					if(result > 1){city_count[city[i]] = result;}
					i ++;
					callback(null, i);	
				});	
			},
			function(err, n){
				callback(null, city_count);
			}
		);

	}],
	function(err,result){
		var last = sortJSON(result);
		db.close();	
		callback(null, last);		
	}
);
}

//获取company
exports.get_company = function(callback){
	async.waterfall([
	//获取全部公司
	function(callback){
		var company = new Array();
		user_location.find({},'company').then((doc) => {
			for(var key in doc){
				var company_temp = doc[key].company;
				if(company_temp != null){		
					company.push(company_temp.toLowerCase());	
				}
			}
			callback(null, company);
		});
	},
	//处理相似数据
	function(company, callback){
		for(var i = 0; i < company.length; i ++){
			for(var j = 1; j < company.length; j++){
				if(stringSimilarity.compareTwoStrings(company[i], company[j]) >= 0.8){//0.75
					company.splice(j,1);
					if(j > i + 1){j --;}
				}
			}
		}
		company.push('tencent');
		company.push('microsoft');
		company.push('xiaomi');
		company.push('baidu');
		company.push('bytedance');
		company.push('wuhan university');
		callback(null, company);
	},
	function(company,callback){
		var company_count = {};
		var i = 0;
		async.whilst(
			function(){return i < company.length;},
			function(callback){
				user_location.count({company:{$regex:company[i],$options:"$i"}},{},function(err,result){	
					if(result > 0){company_count[company[i]] = result;}
					i ++;
					callback(null, i);	
				});	
			},
			function(err, n){
				callback(null, company_count);
			}
		);
	}
	],
	function(err,result){
		var content = merge(result);
		db.close();
		callback(null, content);
	}
);
}

function merge(result){
	var result_merge = {};
	var university = {};

	var ali_count = 0;
	ali_count = result['alibaba'] + result['alipay'];
	result['alibaba'] = ali_count;
	delete result['alipay'];

	var sina_count = 0;
	sina_count = result['weibo.com'] + result['新浪'];
	result['sina'] = sina_count;
	delete result['weibo.com'];
	delete result['新浪'];

	var thu_count = 0;
	thu_count = result['tsinghua university'] + result['thu'];
	result['tsinghua university'] = thu_count;
	delete result['thu'];

	delete result['cr'];
	delete result['stu'];
	delete result['null'];

	for(var key in result){
		if(key.indexOf('university') > -1 || key.indexOf('大学') > -1 || key == 'nju' || key == 'uestc' || key == 'hust' || key =='bupt'){
			university[key] = result[key];
			delete result[key];
		}
		if(result[key] < 2){
			delete result[key];
		}
	}

	
	// delete result['taobao'];

	// var xm_count = 0;
	// xm_count = result['xiaomi'] + result['小米'];
	// result['xiaomi'] = xm_count;
	// delete result['小米'];

	// var ele_count = 0;
	// ele_count = result['ele.me'] + result['eleteam'];
	// result['ele.me'] = ele_count;
	// delete result['eleteam'];

	// var uestc_count = 0;
	// uestc_count = university['university of electronic science and technology of china'] + result['uestc'];
	// university['uestc'] = uestc_count;
	// delete university['university of electronic science and technology of china'];

	result_merge['company'] = sortJSON(result);
	result_merge['university'] = sortJSON(university);

	return result_merge;
}

function sortJSON(result){
	var keys = [];
	for(var key in result){keys.push(result[key] + '_' + key);}
	keys.sort(function compare(a,b){return parseInt(b) - parseInt(a)});
	var last = {};
	for(var i = 0; i < keys.length; i++){
		var key = keys[i].split('_');
		last[key[1]] = key[0];
	}
	return last;
}