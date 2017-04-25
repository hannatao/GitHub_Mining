function word_cloud(json){
	var json_temp = [];
	for(var key in json){
		var temp = {};
		temp['name'] = json[key].word;
		temp['value'] = json[key].weight;
		json_temp.push(temp);
	}
	option = {
	// title: {
 //        text: '用户BIO词频分析',
 //        link: 'https://www.baidu.com/s?wd=' + encodeURIComponent('ECharts'),
 //        x: 'center',
 //        textStyle: {
 //            fontSize: 23
 //        }

 //    },
    tooltip: {
        show: true
    },
    toolbox: {
        feature: {
            saveAsImage: {
                iconStyle: {
                    normal: {
                        color: '#FFFFFF'
                    }
                }
            }
        }
    },
    series: [{
        name: '热点分析',
        type: 'wordCloud',
        gridSize: 21,
        // gridSize: '50%',
        size: ['30%', '60%'],
        // sizeRange: [17, 60],
        // textRotation: [0],
        rotationRange: [0, 0],
        shape: 'circle',
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 2
        },
        textStyle: {
            normal: {
                color: function() {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: json_temp
    }]
};
	return option;
}