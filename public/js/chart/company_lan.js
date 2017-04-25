function company_lan(data){
	var option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    legend: {
        top: 0,
    	left: 0,
        bottom: '5%'
    },

    visualMap: {
        show: false,
        min: 0,
        max: 14,
        inRange: {
            colorLightness: [0.2, 0.7]
        }
    },
    series : [
        {
            name:'项目使用语言',
            type:'pie',
            radius : '80%',
            center: ['50%', '50%'],
            data:data.sort(function (a, b) { return a.value - b.value}),
            roseType: 'angle',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#DC143C',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.4)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
};
	return option;
}