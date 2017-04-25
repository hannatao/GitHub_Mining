function relation(index,data){
	  var size = index;
    var category = [];
    var categories = [];
    var node = [];
    var links = [];
    node.push({
            "name" : 'TOP ' + size,
            "value" : size,
            "itemStyle" : {normal : {color:"#FF0000"}},
            "symbolSize" : 80,
            "draggable" : "true" 
          });
    for(var i = 0; i < size; i ++){
      categories.push({'name' : data[i].login});
      category.push(data[i].login);
      var repo_temp = data[i].repo
      node.push({
        "name" : data[i].login,
        "value" : repo_temp.length,
        "itemStyle" : {normal : {color:"#FF6347"}},
        "symbolSize" : 50,
        "draggable" : "true"
      });
      links.push({"source" : data[i].login, "target" : 'TOP ' + size});
      for(var j in repo_temp){
        var temp = repo_temp[j].split('/');
        node.push({
          "name" : temp[1],
          "value" : 1,
          "category" : data[i].login,
          "symbolSize" : 20,
          "draggable" : "true"
        });
        links.push({
          "source" : temp[1],
          "target" : data[i].login
        });
      }
    }
    var option = {
    //    title:{
    //     text: "Billboard Year End——2007-2016 Top 5",
    //     subtext: "By ZBH",
    //     top: "top",
    //     left: "center"
    // },
      tooltip: {},
      legend: [{
          formatter: function (name) {
        return echarts.format.truncateText(name, 40, '14px Microsoft Yahei', '…');
    },
    tooltip: {
        show: true
    },
      }],
      selectedMode : 'false',
      bottom : 10,
      data : category,
      toolbox: {
        show : true,
        // feature : {
        //     dataView : {show: true, readOnly: true},
        //     restore : {show: true},
        //     saveAsImage : {show: true}
        // }
    },
      animationDuration: 3000,
      animationEasingUpdate: 'quinticInOut',
      series: [{
          name: 'TOP ' + size,
          type: 'graph',
          layout: 'force',
          force: {
              repulsion: 200
          },
          data: node,
          links: links,
          categories: categories,
          focusNodeAdjacency: true,
          roam: true,
          label: {
              normal: {
                  show: true,
                  position: 'top',
              }
          },
          lineStyle: {
              normal: {
                  color: 'source',
                  curveness: 0,
                  type: "solid"
              }
          }
      }]
  };
  return option;
}