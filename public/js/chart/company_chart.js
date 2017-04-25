function company_chart(json){
	var company = [];
    var value = [];
        for(var key in json){
            var key_temp = Chinese(key);
            if(key_temp != 0){
              company.push(key_temp);
              value.push(json[key]);
            }  		
        }

    option = {
    color: ['#3398DB'],
    title: {
        text: 'Github热门用户公司分布',
        left: 'center',
        textStyle:{
        color :'#fff'
        }
    },
    tooltip : {
        trigger: 'axis',
        formatter: '{b}:{c}',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        
        containLabel: true
    },
    xAxis : {
            type : 'category',
            data : company,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#7FFFD4'
                }  
            }
        },
    yAxis : {
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                textStyle: {
                    color: '#7FFFD4'
                }  
            }
        },
    series : [
        {
            name:'公司名',
            type:'bar',
            barWidth: '40%',
            data:value
        },
        
    ],
    label: {
            normal: {
                show: true,
                position: 'top',
                formatter: '{c}'
            }
        },
    itemStyle: {
                normal: {
                 
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(17, 168,171, 1)'
                    }, {
                        offset: 1,
                        color: 'rgba(17, 168,171, 0.1)'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            }
};
    return option;
}

function university_chart(json){
  var company = [];
    var value = [];
        for(var key in json){
            var key_temp = university_Chinese(key);
            if(key_temp != 0 && json[key] > 1){
              company.push(key_temp);
              value.push(json[key]);
            }     
        }

    option1 = {
    color: ['#3398DB'],
    title: {
        text: 'Github热门用户高校分布',
        left: 'center',
        textStyle:{
        color :'#fff'
        }
    },
    tooltip : {
        trigger: 'axis',
        formatter: '{b}:{c}',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        containLabel: true
    },
    xAxis : {
            type : 'category',
            data : company,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: 'rgb(147,112,219)'
                }  
            }
        },
    yAxis : {
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                textStyle: {
                    color: 'rgb(147,112,219)'
                }  
            }
        },
    series : [
        {
            name:'高校',
            type:'bar',
            barWidth: '40%',
            data:value
        },
        
    ],
    label: {
            normal: {
                show: true,
                position: 'top',
                formatter: '{c}'
            }
        },
    itemStyle: {
                normal: {
                 
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(147,112,219,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(147,112,219, 0.1)'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            }
};
    return option1;
}

function company_show(){
      chart.setOption(company_chart(json_company));
      config = 1;
      color = '#00C5CD';
      chart_on(config,color);
    }

function university_show(){
      chart.setOption(university_chart(json_university));
      config = 0;
      color = '#9370DB';
      chart_on(config,color);
}
    
function chart_on(config,color){
    chart.on('click',function(params){
      document.getElementById('subtitle').innerHTML = params.name + '热门用户：';
        if(config == 1){var result = English(params.name);}
            else{var result = university_English(params.name);}    
            $.getJSON('/user_action/company_user',{name:result},function(data){
                var i = 0;
                for(var key in data){
                  var temp = 'user' + key;
                  document.getElementById(temp).innerHTML = data[key].login;
                  document.getElementById(temp).href = 'https://github.com/' + data[key].login;
                  document.getElementById(temp).style.color = color;
                  i ++;
                }
                if(i < 8){
                  for(;i < 8;i ++){
                    var temp = 'user' + i;
                    document.getElementById(temp).innerHTML = '';
                  }
                }
              });
        for(var key in json_lan_temp){
          if(config == 1){
            if(json_lan_temp[key].company == English(params.name)){
              pie.setOption(company_lan(json_lan_temp[key].language));
              return;
            }
          }else{
            if(json_lan_temp[key].company == university_English(params.name)){
              pie.setOption(company_lan(json_lan_temp[key].language));
              return;
            }
          }
        }
    });
}

function Chinese(temp){
    switch(temp){
        case 'alibaba':
          return '阿里';
        case 'tencent':
          return '腾讯';
        case 'baidu':
          return '百度'
        case 'xiaomi':
          return '小米';
        case 'yy':
          return 'YY';
        case 'meitu':
          return '美图';
        case 'douban inc.':
          return '豆瓣';
        case 'sina':
          return '新浪';
        case 'google':
          return '谷歌';
        case 'netease':
          return '网易';
        case 'microsoft':
          return '微软';
        case 'bytedance':
          return '头条';
        case 'zhihu':
          return '知乎'
        case 'ctrip':
          return '携程';
        default:
          return 0;
    }
}

function English(temp){
        switch(temp){
        case '阿里':
          return 'alibaba';
        case '腾讯':
          return 'tencent';
        case '百度':
          return 'baidu'
        case '小米':
          return 'xiaomi';
        case '美图':
          return 'meitu';
        case '谷歌':
          return 'google';
        case '新浪':
          return 'weibo';
        case '知乎':
          return 'zhihu';
        case '网易':
          return 'netease';
        case '头条':
          return 'bytedance';
        case '微软':
          return 'microsoft';
        case '携程':
          return 'ctrip';
        case '豆瓣':
          return 'douban inc.';
        case '知乎':
          return 'zhihu inc.';
        default:
          return temp;
    }
}

function university_Chinese(temp){
  switch(temp){
        case 'tsinghua university':
          return '清华';
        case 'zhejiang university':
          return '浙大';
        case 'hust':
          return '华科'
        case 'uestc':
          return '电子科大';
        case 'fudan university':
          return '复旦';
        case 'peking university':
          return '北大';
        case 'shanghai jiao tong university':
          return '上交';
        case 'wuhan university':
          return '武大';
        case 'bupt':
          return '北邮';
        case 'nju':
          return '南京大学';
        case 'tongji university':
          return '同济';
        case 'shandong university':
          return '山东大学';
        case '华南理工大学':
          return '华南理工';
        default:
          return 0;
    }
}

function university_English(temp){
  switch(temp){
        case '清华':
          return 'tsinghua university';
        case '浙大':
          return 'zhejiang university';
        case '华科':
          return 'hust'
        case '电子科大':
          return 'uestc';
        case '复旦':
          return 'fudan university';
        case '北大':
          return 'peking university';
        case '上交':
          return 'shanghai jiao tong university';
        case '武大':
          return 'wuhan university';
        case '北邮':
          return 'bupt';
        case '南京大学':
          return 'nju';
        case '同济':
          return 'tongji university';
        case '山东大学':
          return 'shandong university';
        case '华南理工':
          return '华南理工大学';
        default:
          return temp;
    }
}