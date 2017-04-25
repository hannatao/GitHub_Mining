function hot_chart(json){
	var score = json.score;
	var rank = [];
	for(var key in score){
		score[key] = parseInt(score[key]) + 1;
		rank.push(parseInt(key) + 1);
	}
	option = {
     title:{
       show: true,
       text:'热门用户排行榜',
       textStyle:{
        color :'#fff'
       }
     },
     tooltip:{
       show:true,
       trigger:'axis',
       formatter:function(params){
         var relVal =login[params[0].dataIndex];
         relVal +=' : ' + score[params[0].dataIndex];
         return relVal;
       },
       showDelay:0,
       hideDelay:50,
       transitionDuration:0,
       backgroundColor:'rgba(50,50,50,1)',
       borderColor:'#aaa',
       showContent: true,
       borderRadius:8,
       padding:10
     },
     dataZoom:[
       {
         type:'slider',
         show:true,
         height:15,
         backgroundColor:'rgba(38,227,189,0.3)',
//         fillerColor: 'rgba(167,183,204,0.4)',
         borderColor:'#0a2b24',
       }
     ],
     axisPointer:{
       type:'line',
       axis:'auto'
     },
    legend:{
      top: '2%',
       data:[{
          name: '评分',
          // 设置文本为红色
          textStyle: {
              color: 'white'
          }
        }]
     },
     xAxis:{
       data: rank,
       axisLabel: {margin: 2, textStyle: {color: '#aaa'}}
     },
     yAxis:{axisLabel: {margin: 2, textStyle: {color: '#aaa'}}},
     series:[{
       name:'评分',
       type:'bar',
       // scale: true,
       barMaxWidth:60,

       data: score,
       itemStyle:{
         normal:{
           color:new echarts.graphic.LinearGradient(0,0,0.5,1,[{
             offset:0,
             color:'rgba(35,123,105,1)'
           },{
             offset:1,
             color:'rgba(103,237,210,.5)'
           }]),
           borderColor:'#23a5e2',
           borderWidth:2,
           barBorderRadius:[10,10,0,0],
//           shadowBlur:10,
           shadowColor:'rgba(168,225,226,0.5)',
//           shadowOffsetX:10,
//           shadowOffsetY:10,
           opacity:.6

         },
         emphasis:{
           color:new echarts.graphic.LinearGradient(0,0,0,1,[{
             offset:0,
             color:'rgba(13,164,171,1)'
           },{
             offset:1,
             color:'rgba(64,180,157,.1)'
           }]),
           borderColor:'#0ea4a6',
           borderWidth:2,
           barBorderRadius:[9,9,0,0],
           shadowBlur:30,
           shadowColor:'rgba(32,188 ,157,0.8)',
//           shadowOffsetX:10,
//           shadowOffsetY:10,
           opacity:.7,
           label:{
             show:true,
             textStyle:{
               color:'rgba(150,197,188,1)'
               // color: 'white'
             }

           }
         }
       },
       markPoint:{
         symbol: 'circle',
         symbolSize:50,
         symbolOffset: [0,0],
         silent:true

       }

     }],
     label:{
       normal:{
         show:true,
         position:'top'

       }
      // emphasis:{
      //   show:false,
      //   position:[10,10],
      //   formatter:'{b}:{c}',
      //   textStyle:{
      //     color:'#fff',
      //     fontWeight:'bolder',
      //     fontSize:14
      //   }
      // }
     }

   };
	return option;
}

function listen(){
	graph.on('mouseover',function(param){
		document.getElementById('title').innerHTML = login[param.dataIndex] + '详细信息：';
		document.getElementById('count').innerHTML = '2016年上榜热门项目数 : ' + count[param.dataIndex];
		document.getElementById('pr').innerHTML = 'Public_repos : ' + public_repos[param.dataIndex];
		document.getElementById('followers').innerHTML = 'Followers : ' + follower[param.dataIndex];
		var string = '';
		var repos = repo[param.dataIndex];
		for(var key in repos){
			string = string + '</br>' + repos[key];
		}
		document.getElementById('repo').innerHTML = '项目名称 : ' + string;
	});

	graph.on('click',function(param){
		window.open('https://github.com/' + encodeURIComponent(login[param.dataIndex]));
	})
}