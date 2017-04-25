window.onload=getRepoMonth;//初始化页面
$(function () { $("[data-toggle='popover']").popover();});//bostrap js

//说明的显示与隐藏
$("#readme").mouseover(function(){
  $('#readme').popover('show');
});

$("#readme").mouseout(function(){
  $('#readme').popover('hide');
}); 
//发送请求
function getRepoMonth(){
   $(function(){
        $.ajax({
              url:"/repo_action/repoLocMonth_show",
              type:"get",
              success:function(data){
                drawRepoMonth(data[0],"#chinaUserMain");
                drawRepoMonth(data[1],"#worldUserMain");
                drawPie("chinaPie",data[2],"GitHub上中国热门项目创建者类别对比",$("#chinaPie").width());
                drawPie("worldPie",data[3],"GitHub上全球热门项目创建者类别对比",$("#worldPie").width());
              }
        });
  });
}

//显示主页面
function drawRepoMonth(data,mainDiv){
    var svg = dimple.newSvg(mainDiv,590, 400);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(60, 30, 505, 305);
    var x = myChart.addCategoryAxis("x", "month");
    x.title = "月份";
    x.addOrderRule("month");
    var y = myChart.addMeasureAxis("y", "repos_count");
    y.tickFormat = ",.0f";
    y.title = "项目数量";
    var s = myChart.addSeries("type", dimple.plot.line);
    //s.interpolation = "cardinal";
    s.interpolation = "linear";
    myChart.addLegend(100, 10, 500, 20, "right");
    myChart.draw();
}
//显示副页面
function drawPie(divID,data,str,width){
   return new d3pie(divID, {
    "header": {
      "title": {
        "text": str,
        "fontSize": 15,
        "font": "open sans",
        "color": "#FFFFFF"
      }
    },
    "size": {
      "canvasWidth": width, 
       "canvasHeight": 350,
      "pieOuterRadius": "70%"
    },
    "data": {
      //"sortOrder": "value-desc",
      "content": data
    },
    "labels": {
      "outer": {
        "pieDistance": 10
      },
      "inner": {
        "hideWhenLessThanPercentage": 3
      },
      "mainLabel": {
        "fontSize": 8,
        "font": "arial",
        "color": "#FFFFFF"
      },
      "percentage": {
        "color": "#ffffff",
        "decimalPlaces": 0
      },
      "value": {
        "color": "#adadad",
        "fontSize": 11
      },
      "lines": {
        "enabled": true
      },
      "truncation": {
        "enabled": true
      }
    },
     "effects": {
        "pullOutSegmentOnClick": {
          "effect": "linear",
          "speed": 400,
          "size": 8
        }
      },
      "misc": {
        "gradient": {
          "enabled": true,
          "percentage": 100
        }
      }
  });
}