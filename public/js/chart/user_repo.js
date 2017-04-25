function user_repo(json){
    var nodes = json.nodes;
    var links = json.edges;
    var categories = json.categories;
    var size = num_count(json);

    for(var index in nodes) {
        
        nodes[index].symbolSize = size[index].size;
        nodes[index].value = size[index].count;
        for(var i in categories){
            if(nodes[index].repo_name == categories[i]){
               nodes[index].category = parseInt(i); 
            }
        }
        
        // Use random x, y
        nodes[index].initLayout = 'circular';
        nodes[index].draggable = true;
    };
    option = {
    title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'top',
            left: 'left'
        },
        tooltip: {},
        legend: [{
            // selectedMode: 'single',
            data: categories
            
        }],
        animation: false,
        series : [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                categories: categories,
                roam: false,
                label: {
                    normal: {
                        position: 'right'
                    }
                },
                force: {
                    repulsion: 100
                }
            }
        ]
    };
    return option;
}

function num_count(json2){
    var result = [];
    var nodes_temp = json2.nodes.slice(0);
    var edges = json2.edges;
    var count = [];

    for(var i in nodes_temp){
        if(count[i] == null){count[i] = 0;}
        for(var j in edges){
            if(nodes_temp[i].id == edges[j].target){count[i] ++;}
        }
    }

    var temp = count.slice(0);
    temp.sort();
    var k = temp[temp.length - 1] - temp[0];

    for(var key in nodes_temp){
        var node_temp = {};
        node_temp['size'] = parseInt(count[key] * (20 / k) + 10);
        node_temp['count'] = count[key];
        nodes_temp[key] = node_temp;
        result.push(node_temp);
    }
    return result;
}