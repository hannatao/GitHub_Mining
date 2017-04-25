var async = require('async');
var monk = require("monk");
var mongo = require("mongodb");

var db = monk('127.0.0.1:27017/github');
var repodb = db.get('repo_china_pre_contri');

var javaFrame = ["springMVC","struts2","hibernate","spring","jsf","vaadin","gwt",
			"grails","jfinal","springboot","maven","mybatis"];
var uiFrame = ["Bootstrap","Vue","AngularJS","JQuery","React","React-Native","Laravel",
			 "Django","Express", "Meteor","Codelgniter","Famo"];
var androidFrame = ["Rxjava","Retrofit","EventBus","Glide","Fresco",
					"LeakCanaary","Butterknife","Realm","Dagger","android-architecture",
					"awesome-android-ui","RXAndroid","MVP","MaterialDesign","MPAndroidChart"];
var Frames = [{"name":"javaFrame","frames":javaFrame},{"name":"uiFrame","frames":uiFrame},
				{"name":"androidFrame","frames":androidFrame}];


exports.handleRepoChina = function(json,callback){
	async.waterfall([
	function(callback){
	  	repodb.find().then((repos) => {
	  		var temp = new Array();
	    	callback(null,repos,Frames);
	    });
		},
		frameCount
	],
	function(err,result){
		db.close();
		callback(null, json, result);
	})
}

function frameCount(repos,Frames,callback){
	var ReposFrames = new Array();
	Frames.forEach(function(frames){
		frames.frames.forEach(function(frame){
			var tempFrame = {};
			var reg = new RegExp(frame,"i");
			var reposFrame = new Array();

			repos.forEach(function(repo){
				var descri = repo.description;
				var name = repo.name
				if(descri!=null && name!=null){
					if(descri.match(reg)!=null ||name.match(reg)!=null){
						reposFrame.push(repo)
					}
				}
			})

			if(reposFrame.length!=0){
				var name_temp = [];
				for(var key in reposFrame){
					name_temp.push(reposFrame[key].full_name);
				}
				tempFrame["name"] = frame;
				tempFrame["repos"] = name_temp;
				tempFrame["type"] = frames.name;
				tempFrame["repos_count"] = reposFrame.length;
				ReposFrames.push(tempFrame);
			}
		})
	})
	callback(null,ReposFrames);
}