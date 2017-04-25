var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
//var rfpd = require('./repoForksPreDao.js');
var prpd = require('./repoWorldPreDao.js');

var client  = github.client({
	username: 'raychenNJU',
    password: 'cr112358132134'
   	//username: '490506863@qq.com',
    //password: 'ssh640034'
});
var ghsearch = client.search();

var db = monk('127.0.0.1:27017/github');
var owner = db.get('repo_china_owner_pre');//2进行到5月了，6月未进行。
var repo = db.get("repo_china_pre");
function getChina(){
	async.waterfall([
		prpd.GetPreRepo,
		filterLocation,
	], 
	function (err, result) {
		db.close();
	    console.log("All done");
	});
}
getChina();
//remove();
function remove(){
	repo.remove({ "month": 6 },function(){
		console.log("repo remove done");
	})

	owner.remove({ "month": 6 },function(){
		console.log("owner remove done");
	})
}

function filterLocation(arg,callback){
	console.log(arg.length);
	var reposTemp = new Array();
	arg.forEach(function(repo){
		var temp = {};
		temp["flag"] = false;
		temp["repo"] = repo;
		reposTemp.push(temp);
	})

	var myInterval=setInterval(myfunc,30000,"Interval");

	setTimeout(stopInterval,100000);

	function stopInterval(){
	 	clearTimeout(myInterval);
	}

	function myfunc(Interval){
	   	reposTemp.forEach(function(rep){
	   		if(!rep.flag){
		   		client.get('/users/'+rep["repo"].owner.login, {}, function(err, status, body, headers) {
					if (!err && status == 200 && !rep.flag) {
						rep["flag"] = true;
						var location = body.location;
						var company = body.company;
						if(filterChina(location,company)){
							console.log(location+"||"+company);
					   		body["repoFullName"] = rep.repo.full_name;
					   		body["month"] = 6;
					   		repo.insert(rep.repo);
					   		owner.insert(body);
						}
				  	}else{
				  		console.log(err);
				  	}
				});
	   		}
	   	})
    	console.log("over");
	}
}


function filterChina(location,company){
	var flag = false;
	var locations = ["china","beijing","shanghai","shenzhen","guangzhou","chongqin","chengdu","tianjin","hangzhou","wuhan","nanjing",
						"xian","changsha","qingdao","shenyang","dalian","xiamen","suzhou","ningbo","wuxi"];
	var companys = ["alibaba","tengxun","baidu","jingdong","qihu","souhu","wangyi","xiecheng","weipin","suning","xinmeida","wangsu",
						"xiaomi","xina","leshi","sufang","wuba","58","sanqi","37","dongfangcaifu","xihua"];
	if(location!=null){
		locations.forEach(function(loc){
			var reg = new RegExp(loc,"i");
			if(location.match(reg)!=null){
				flag = true;
				return flag;
			}
		})
	}

	if(company!=null){
		companys.forEach(function(com){
			var reg = new RegExp(com,"i");
			if(company.match(reg)!=null){
				flag = true;
				return flag;
			}
		})
	}
	return flag;
}