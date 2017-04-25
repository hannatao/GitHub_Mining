var http = require('https')
var async = require('async');
var cheerio = require('cheerio')

exports.image_get = function(name,callback){
	var url = 'https://github.com/' + name;
	var image;
	async.waterfall([
		function(){
			http.get(url,function(res) {
				var html = ' '

				res.on('data', function(data){
					html += data
				});

				res.on('end',function(){
					image = filter(html);
					callback(null,image);
				});
			});
		}
		]
		,function(err,result){
			callback(null,result);
	});
}

function filter(html){
	var $ = cheerio.load(html)
	var image_url = $("img.rounded-1").attr("src");
	var data_count = [];
	var data_date = [];
	var repo = [];
	var temp = [];
	var total = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	var i = 0;
	var max = 0;
	var maxIndex = 0;
	$('rect.day').each(function(i,e){
		data_count.push($(e).attr('data-count'));
		data_date.push($(e).attr('data-date'));
	});

	$('span.repo').each(function(i,e){
		repo.push($(e).attr('title'));
	});

	for(var key in data_date){
		var date_1 = data_date[key].split('-');
		var date_2 = date_1[0] + '/' + date_1[1];
		if(key == 0){
			temp.push(date_2);
			total[i] += parseInt(data_count[key]);
		}else{
			if(date_2 == temp[i]){
				total[i] += parseInt(data_count[key]);
			}else{
				temp.push(date_2);
				i ++;
				total[i] += parseInt(data_count[key]);
			}
		}
	}

	for(var j in total){
		if(total[j] > max){
			max = total[j];
			maxIndex = j;
		}
	}

	var result = {};
	result['period'] = temp[0] + '~' + temp[temp.length - 1];
	result['maxMonth'] = temp[maxIndex];
	result['maxValue'] = max;
	result['image'] = image_url;
	result['hotRepo'] = repo[0];
	return result;
}