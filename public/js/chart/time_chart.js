function time_chart(json){
	var data_val = [];
    var xAxis_val = [];
    var data_val1=[0,0,0,0,0,0,0];
    for(var key in json){
        xAxis_val.push(key);
        data_val.push(json[key]);
    }
    
    var min = data_val.slice(0);
    min.sort();

    var option = {
    grid:{
        left:10,
        bottom:50,
        right:40,
        containLabel:true
    },
    tooltip:{
        show:true,
        backgroundColor:'#384157',
        borderColor:'#384157',
        borderWidth:1,
        formatter:'{b}:{c}',
        extraCssText:'box-shadow: 0 0 5px rgba(0, 0, 0, 1)'
    },
    legend:{
        right:0,
        top:0,
        data:['统计数目'],
         textStyle:{
            color :'#5c6076'
        }
    },
    title: {
        top: '1%',
        text: '自然周内分布',
        left:'center',
        textStyle:{
        color :'#EEAD0E'
        }
    },
    xAxis: {
        data: xAxis_val,
        boundaryGap:false,
        axisLine:{
            show:false
        },
        axisLabel: {
            textStyle: {
                color: '#DCDCDC'
            }  
        },
        axisTick:{
            show:false
        }
    },
    yAxis: { 
        min: min[0] - 100,
        ayisLine:{
            show:false
        },
        axisLabel: {
            textStyle: {
                color: '#DCDCDC'
            }  
        },
        splitLine:{
            show:true,
            lineStyle:{
                color:'#2e3547'
            }
        },
        axisLine: {
                lineStyle: {
                    color: '#384157'
                }
            }
    },
    
    series: [
        {
            type: 'bar',
            name:'linedemo',
            
            
            tooltip:{
                show:false
            },
            animation:false,
            barWidth:1.4,
            hoverAnimation:false,
            data:data_val,
            itemStyle:{
                normal:{
                    color:'#f17a52',
                    opacity:0.6,
                    label:{
                        show:false
                    }
                }
            }
        },
        {
            type: 'line',
            name: '数目',
            
            animation:false,
            symbol:'circle',
    
            hoverAnimation:false,
            data:data_val1,
            itemStyle:{
                normal:{
                    color:'#f17a52',
                    opacity:0,
                }
            },
            lineStyle:{
                normal:{
                    width:1,
                    color:'#384157',
                    opacity:1
                }
            }
        },
        {
            type: 'line',
            name:'linedemo',
            smooth:true,
            symbolSize:10,
            animation:false,
            lineWidth:1.2,
            hoverAnimation:false,
            data:data_val,
            symbol:'circle',
            itemStyle:{
                normal:{
                    color:'#f17a52',
                    shadowBlur: 40,
                    label:{
                        show:true,
                        position:'top',
                        textStyle:{
                            color:'#f17a52',
                    
                        }
                    }
                }
            },
           areaStyle:{
                normal:{
                    color:'#f17a52',
                    opacity:0.08
                }
            }
            
        }
    ]
};
	return option;
}

function listen(json){
    chart.on('click',function(param){
        pie.setOption(time_pie(json,param.dataIndex));
    });
}