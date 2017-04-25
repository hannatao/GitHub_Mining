function user_follower(json){
    var temp = num_count(json);
	var option = {
        title: {
            text: 'TOP30 用户关系图',
            textStyle: {
            color: 'white'
            }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [
            {
                type: 'graph',
                layout: 'circular',
                edgeSymbol: ['none', 'arrow'],
                // progressiveThreshold: 700,
                data: temp.nodes.map(function (node) {
                    return {
                        id: node.id,
                        name: node.id,
                        // value: node.size,
                        symbolSize: node.size,
                        itemStyle: {
                            normal: {
                                color: node.color
                            }
                        }
                    };
                }),
                edges: temp.edges,
                label: {
                    emphasis: {
                        position: 'right',
                        show: true
                    }
                },
                roam: true,
                focusNodeAdjacency: true,
                lineStyle: {
                    normal: {
                        width: 0.5,
                        curveness: 0.3,
                        opacity: 0.7
                    }
                }
            }
        ]
    }
    return option;
}

function num_count(json){
    var result = {};
    var nodes = json.nodes;
    var edges = json.edges;
    var count = new Array(json.nodes.length);

    for(var i in nodes){
        if(count[i] == null){count[i] = 0;}
        for(var j in edges){
            if(nodes[i].id == edges[j].target){count[i] ++;}
        }
    }

    var temp = count.slice(0);
    temp.sort();
    var k = temp[temp.length - 1] - temp[0];

    for(var key in nodes){
        var node_temp = {};
        node_temp['id'] = nodes[key].id;
        node_temp['name'] = nodes[key].id;
        node_temp['size'] = parseInt(count[key] * (35 / k) + 10);
        node_temp['count'] = count[key];
        node_temp['color'] = count_color(count[key]);
        nodes[key] = node_temp;
    }

    result['nodes'] = nodes;
    result['edges'] = edges;

    return result;
}

function listen(){
    graph.on('click',function(param){
        var detail = document.getElementById('detail');
        var image_temp = document.getElementById('image');
        var period = document.getElementById('period')
        var hotRepo = document.getElementById('hotRepo');
        var help = document.getElementById('help');

        detail.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>Loading';

        $.getJSON('/user_action/image',{name:param.name},function(data){
            console.log(data);
            image_temp.src = data.image;
            image_temp.style.visibility = 'visible';
            detail.innerHTML = param.name + ':';
            period.innerHTML = '<i class="fa fa-location-arrow"></i> 该用户在' + data.period + '期间于'
            + data.maxMonth + '贡献值达到最大，贡献值为' + data.maxValue + '。';
            help.innerHTML = 'Learn how to count contributions';
            hotRepo.innerHTML = '<i class="fa fa-location-arrow"></i> 个人最热门项目为: ' + data.hotRepo + '。';
        });
    });
}

function count_color(color){
    switch(color){
        case 0:
            return '#FFE4E1';
        case 1:
            return '#FFC0CB';
        case 2:
            return '#FFAEB9';
        case 3:
            return '#FF82AB';
        case 4:
            return '#FF6A6A';
        case 5:
            return '#FF4500';
        case 7:
            return '#FF3030';
        case 8:
            return '#FF0000';
        default:
            return '#FF0000';
    }
}