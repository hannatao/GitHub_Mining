function location_chart(json){
    var geoCoordMap = {
        '上海':[121.48,31.22],
        '厦门':[118.1,24.46],
        '深圳':[114.07,22.62],
        '苏州':[120.62,31.32],
        '成都':[104.06,30.67],
        '西安':[108.95,34.27],
        '南京':[118.78,32.04],
        '北京':[116.46,39.92],
        '杭州':[120.19,30.26],
        '天津':[117.2,39.13],
        '广州':[113.23,23.16],
        "郑州": [113.65,34.76],
        "长沙": [113,28.21],
        "大连": [121.62,38.92],
        "无锡": [120.29,31.59],
        "重庆": [106.54,29.59],
        '武汉':[114.31,30.52]
    };
    var data = [];  
    var city = [];
    var value = [];

    for(var key in json){
      var temp = {};
      var key_temp = Chinese(key);
      if(key_temp != 0){
        temp['name'] = key_temp;
        temp['value'] = json[key];
        city.push(key_temp);
        value.push(json[key]);
        data.push(temp);
      }
    }
    city.reverse();
    value.reverse();
    function convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
        return res;
    };

    var option = {
    title: {
        text: 'Github热门用户地域分布',
        subtext: 'data from Github',
        sublink: 'https://api.github.com/search/users?q=location:china&type=user&sort=follwer&order=desc',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip : {
        trigger: 'item'
    },
    grid: {
        right: 60,
        top: 150,
        bottom: 120,
        width: '25%'
    },
    xAxis: {
        type: 'value',
        scale: true,
        position: 'top',
        boundaryGap: false,
        splitLine: {show: false},
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
    },
    yAxis: {
        type: 'category',
        name: 'TOP',
        nameGap: 16,
        axisLine: {show: false, lineStyle: {color: '#ddd'}},
        axisTick: {show: false, lineStyle: {color: '#ddd'}},
        axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
        data: city
    },
    label:{
        normal:{position:'right',show:true}
    },
    geo: {
        map: 'china',
        left: '10',
        top: '5%',
        bottom: '8%',
        right: '35%',
        label: {
            emphasis: {
                show: false
            }
        },
        roam: false,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    series : [
        {
            id: 'bar',
            zlevel: 2,
            type: 'bar',
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            },
            data: value
        },
        {
            name: '城市名',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function (val) {
                return val[2] / 8 + 5;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#f4e925',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }       
    ]
    };
    return option;
}       

function Chinese(temp){
      switch(temp){
        case 'beijing':
          return '北京';
        case 'guangzhou':
          return '广州';
        case 'shanghai':
          return '上海'
        case 'hangzhou':
          return '杭州';
        case 'shenzhen':
          return '深圳';
        case 'chengdu':
          return '成都';
        case 'xiamen':
          return '厦门';
        case 'nanjing':
          return '南京';
        case 'suzhou':
          return '苏州';
        case 'xi\'an':
          return '西安';
        case 'wuhan':
          return '武汉';
        case 'tianjin':
          return '天津';
        case 'zhengzhou':
          return '郑州';
        case 'wuxi':
          return '无锡';
        case 'changsha':
          return '长沙';
        case 'chongqing':
          return '重庆';
        case 'dalian':
          return '大连';
        default:
          return 0;
      }
}

function English(temp){
      switch(temp){
        case '北京':
          return 'beijing';
        case '广州':
          return 'guangzhou';
        case '上海':
          return 'shanghai'
        case '杭州':
          return 'hangzhou';
        case '深圳':
          return 'shenzhen';
        case '成都':
          return 'chengdu';
        case '厦门':
          return 'xiamen';
        case '南京':
          return 'nanjing';
        case '苏州':
          return 'suzhou';
        case '西安':
          return 'xi\'an';
        case '武汉':
          return 'wuhan';
        case '天津':
          return 'tianjin';
        case '郑州':
          return 'zhengzhou';
        case '无锡':
          return 'wuxi';
        case '长沙':
          return 'changsha';
        case '重庆':
          return 'chongqing';
        case '大连':
          return 'dalian';
        default:
          return '';
      }
}