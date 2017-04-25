var sortFun = require('../handle/getSortFun.js');
exports.getClass=function(repos,type){
	repos.sort(sortFun.getSortFun('desc', type));
	var levelNum = 2;
	var MAX = repos[0][type];
	var MIN = repos[repos.length-1][type];
	var interval = Math.round((MAX-MIN+1)/levelNum);
	var deviation = MAX-MIN+1-levelNum*interval;
	var levels = new Array();

	for(var i=1;i<levelNum+1;i++){
		var temp = {};
		temp["name"] = i;
		temp["max"] = MAX;//上闭
		temp["min"] = MAX-interval;//下开
		MAX = MAX-interval;
		levels.push(temp);
	}

	levels[levelNum-1].min = 0;

	var result = new Array();

	levels.forEach(function(level){
		var count = 0;
		var temp = {};
		repos.forEach(function(repo){
			if(repo[type]>level.min && repo[type]<=level.max){
				count++;
			}
		})

		temp["name"] = "第"+level.name+"级（"+level.min+","+level.max+"]";
		temp["count"] = count;
		result.push(temp);
	})
	return result;
}