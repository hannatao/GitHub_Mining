var async = require('async');
var github = require("octonode");
var monk = require("monk");
var mongo = require("mongodb");
var sortFun = require('./getSortFun.js');

var db = monk('127.0.0.1:27017/github');
var repodb = db.get('repo_china_final_rank');
var framedb = db.get('repo_china_frame');

var javaFrame = ["springMVC","struts2","hibernate","spring","jsf","vaadin","gwt",
			"grails","jfinal","springboot","maven","mybatis"];
var uiFrame = ["Bootstrap","Vue","AngularJS","JQuery","React","React-Native","Laravel",
			 "Django","Express", "Meteor","Codelgniter","Famo"];
var androidFrame = ["Rxjava","Retrofit","EventBus","Glide","Fresco",
					"LeakCanaary","Butterknife","Realm","Dagger","android-architecture",
					"awesome-android-ui","RXAndroid","MVP","MaterialDesign","MPAndroidChart"];
var Frames = [{"name":"javaFrame","frames":javaFrame},{"name":"uiFrame","frames":uiFrame},
				{"name":"androidFrame","frames":androidFrame}];

handleRepoChina();
function handleRepoChina(){
	async.waterfall([
	function(callback){
	  	repodb.find().then((repos) => {
	  		var temp = new Array();
	    	callback(null,repos,Frames);
	    });
		},
		frameCount,
		insertFrames
	],
	function(err,result){
		db.close();
		console.log("All done");
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
				reposFrame.sort(sortFun.getSortFun('desc', "myScore"));
				tempFrame["name"] = frame;
				tempFrame["repos"] = reposFrame;
				tempFrame["type"] = frames.name;
				tempFrame["repos_count"] = reposFrame.length;
				ReposFrames.push(tempFrame);
			}
		})
	})
	callback(null,ReposFrames);
}

function insertFrames(ReposFrames){
	framedb.insert(ReposFrames);
}