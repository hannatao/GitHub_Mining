var async = require('async');
var get_org = require('./get_org.js');

async.waterfall([
	get_org.get_org
],function(err,result){
	console.log(result);
})

