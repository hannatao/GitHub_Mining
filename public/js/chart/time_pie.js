function time_pie(json,index){
	// function data(){
 //        var d = [];
 //        var time_temp = json[1];
 //        for (var i = 0; i < 24; i++) {          
 //            d.push({name:i+'~'+(i+1),value:time_temp[i] / 2 + 5});
 //        }
 //        return d;
 //    } 
    var option = {
    title : {
        text: '自然日内分布',
        left:'center',
        textStyle: {
            color: '#A4D3EE'
        }
    },
    grid: {
        top: '15%',
        bottom: '5%'
    },
    tooltip: {
        trigger: 'item',
        position: ['48.5%', '49.2%'],
        backgroundColor: 'rgba(50,50,50,0)',
        textStyle : {
            color: 'yellow',
            fontWeight: 'bold'
        },
        formatter: "{d}%"
    },
    series : [
        {
            name: 'Push时间',
            type: 'pie',
            radius : ['5%', '70%'],
            roseType: 'area',
            color:['#3fa7dc'],
            data:data(json[index]),
            labelLine: {
                normal: {
                    show: false
                }
            },
            label: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        {
            name: '',
            type: 'gauge',
            min: 0,
            max: 24,
            startAngle: 90,
            endAngle: 449.9,
            radius: '82%',
            splitNumber: 24,
            clockwise: false,
            animation: false,
            detail: {
                formatter: '{value}',
                textStyle: {
                    color: '#63869e'
                }
            },
            detail:{
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: [
                        [0.25, '#63869e'],
                        [0.75, '#ffffff'],
                        [1, '#63869e']
                    ],
                    width: '40%',
                    shadowColor: '#0d4b81', //默认透明
                    shadowBlur: 40,
                    opacity: 1
                }
            },
            splitLine: {
                length: 5,
                lineStyle: {
                    color: '#ffffff',
                    width: 2
                }
            },
            axisLabel: {
                formatter: function(v){
                    return v?v:'';
                },
                textStyle: {
                    color: "#212121",
                    fontWeight: 700
                }
            },
            itemStyle: {
                normal: {
                    color: 'green',
                    width: 2
                }
            }
        },
        {
            name: '',
            type: 'gauge',
            min: 0,
            max: 24,
            startAngle: 90,
            endAngle: 449.9,
            radius: '72%',
            splitNumber: 24,
            clockwise: false,
            animation: false,
            detail: {
                formatter: '{value}',
                textStyle: {
                    color: '#63869e'
                }
            },
            detail:{
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: [
                        [1, '#CAE1FF']
                    ],
                    width: '10%',
                    opacity:0.8
                }
            },
            splitLine: {
                show:true,
                length: '92%',
                lineStyle: {
                    color: 'grey',
                    width: '1'
                }
            },
            axisLabel: {
                show:false,
                formatter: function(v){
                    return v?v:'';
                },
                textStyle: {
                    color: "#fb5310",
                    fontWeight: 700
                }
            },
            itemStyle: {
                normal: {
                    color: 'green',
                    width: 2,
                    borderWidth: 3,
                }
            }
        }
    ]
};
	return option;
}

function data(temp){
        var d = [];
        for (var i = 0; i < 24; i ++) {
            if(temp[i] == 0){temp[i] += 1;}      
            d.push({name:i+'~'+(i+1),value:temp[i]});
        }
        return d;
    } 