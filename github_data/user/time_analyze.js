var monk = require('monk');
var mongo = require('mongodb');
var async = require('async');
var user = require('./user_get.js');

var db = monk('127.0.0.1:27017/github');
var events = db.get('event');

//获取time
exports.get_event = function(callback){
	async.waterfall([
	//获取全部time
	function(callback){
		var time = new Array();
		events.find({},'time').then((doc) => {
			for(var key in doc){
				var temp = time_transfer(doc[key].time);
				time.push(temp);
			}
			callback(null, time);
		});
	},
	//时间数据汇总
	function(time, callback){
		var day_temp = new Array(0,0,0,0,0,0,0);
		var time_temp = new Array();
		var time_total = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
		for(var i = 0; i < 7; i ++){
			time_temp[i] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
		}
		for(var key in time){
			day_temp[time[key].day] ++;
			time_total[time[key].time] ++;
			time_temp[time[key].day][time[key].time] ++;
		}
		var result = [];
		var day = {'星期一': day_temp[0],
				   '星期二': day_temp[1],
				   '星期三': day_temp[2],
				   '星期四': day_temp[3],
				   '星期五': day_temp[4],
				   '星期六': day_temp[5],
				   '星期日': day_temp[6],
				};
		var timegap = {};
		for(var i = 0; i < 7; i ++){
			timegap[i] = time_temp[i];
		}
		result.push(day);
		result.push({'total' : time_total});
		result.push(timegap);
		callback(null, result);
	}
	],
	function(err,result){
		db.close();
		callback(null, result);
	});
}

function time_transfer(time){
	var result = {};

	var temp1 = time.split('T');
	var date = new Date(Date.parse(temp1[0].replace(/-/g,   "/"))); 

	var temp2 = temp1[1].split('Z');
	var time_temp = temp2[0].split(':');

	var timezone = parseInt(time_temp[0]);
	if(timezone + 8 < 24){
		result['day'] = date.getDay();
		result['time'] = timezone + 8;
	}else{
		if(date.getDay() + 1 < 7){
			result['day'] = date.getDay() + 1;
		}else{
			result['day'] = date.getDay() + 1 - 7;
		}		
		result['time'] = timezone + 8 - 24;
	}
	return result;
}