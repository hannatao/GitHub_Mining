//切换Pie
var pie;
var pie1;
var pie2;
function chinaOnclick(){
  pie=pie1;
}

function worldOnclick(){
  pie=pie2;
}
//bootstrap js
$(function () { $("[data-toggle='popover']").popover();});


$(document).ready(function(){
      //初始化
      var title1 ="中国流行项目编程语言分布";
      var title2 ="世界流行项目编程语言分布";
      getLanguage("/repo_action/language_show",title1,title2);
      //二级导航点击事件
      $("#repoType  li").click(function(){
          var temp=$(this).val();
          $('.active').attr("class",null);
          $(this).attr("class","active");
          var URL;
          if(temp ==1){
            URL = "/repo_action/language_show";
            $("#readme1").empty();
            $("#readme2").empty();
            $("<p/>").appendTo("#readme1").html("中国整体");
            $("<p/>").appendTo("#readme2").html("世界整体");
          }
          else if(temp ==2){
            URL = "/repo_action/languageChina_show";
            var title1 ="中国个人用户喜爱的编程语言分布";
            var title2 ="中国组织用户喜爱的编程语言分布";
            $("#readme1").empty();
            $("#readme2").empty();
            $("<p/>").appendTo("#readme1").html("在中国个人用户喜爱的编程语言中，Java占39%，占据很大优势。"
              +"可见对于个人用户而言,普遍擅长使用Java。接下来是前端语言JavaScript,占17%,可见前端语言依旧在"
              +"中国个人用户很热门。Object-c占11%，可见IOS等依旧很热门。前三名占总数的67%，其余语言占比均较小。"
              +"总体来说，中国个人用户对编程语言的喜爱程度差别较大，主要喜欢Java,JavaScript和Object-c。占比超过"
              +"3%的语言总数为10个，分布较为集中。");
            $("<p/>").appendTo("#readme2").html("在中国组织用户喜爱的编程语言中，前五名分别是Java、JavaScript"
              +"、Object-c、C、C++，但是总体来说差距不是很大，前三名和用户喜爱的前三名保持一致。占比超过3%的"
              +"语言数目为12个，分布较为平均。");
          }
          else if(temp ==3){
            URL = "/repo_action/languageWorld_show";
            var title1 ="世界个人用户喜爱的编程语言分布";
            var title2 ="世界组织用户喜爱的编程语言分布";
            $("#readme1").empty();
            $("#readme2").empty();
            $("<p/>").appendTo("#readme1").html("在世界个人用户喜爱的编程语言中，前五名分别是Java、JavaScript"
              +"Python、Html、Object-C。占比超过3%的语言总数为13个，喜爱的编程语言分布较为平均。");
            $("<p/>").appendTo("#readme2").html("在世界组织用户喜爱的编程语言中，前五名分别是JavaScript、"
              +"Ruby、Java、Python、Html。占比超过3%的语言总数为13个，喜爱的编程语言分布较为平均。");
          }
          getLanguage(URL,title1,title2);
      })
      //说明的显示与隐藏
      $("#readme").mouseover(function(){
        $('#readme').popover('show');
      });

      $("#readme").mouseout(function(){
        $('#readme').popover('hide');
      });   
})

//获取数据
function getLanguage(URL,title1,title2){
  $("#chinaMain").empty();
  $("#worldMain").empty();

   $(function(){
        $.ajax({
              url:URL,
              type:"get",
              success:function(data){

                var dataChina = data[0];
                var dataWorld = data[1];
                var chinaWidth = $("#chinaMain").width()
                var worldWidth = $("#worldMain").width()
                var colors = d3.scale.category20();

                for(var i=0;i<dataChina.length;i++){
                  dataChina[i]["color"] = colors[i%20];
                }

                for(var i=0;i<dataChina.length;i++){
                  dataChina[i]["color"] = colors[i%20];
                }
                pie1 =newPie("chinaMain","#chinaRepo",dataChina,title1,chinaWidth);
                pie2 =newPie("worldMain","#worldRepo",dataWorld,title2,worldWidth);     
              }
        });
  });
}
//主显示界面
function newPie(divID,repoID,data,str,width){
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
        "pieDistance": 5
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
      },
    callbacks: {
      onClickSegment: function(pieData){
        $(repoID).empty();
        if(pieData.expanded==true){

        }
        else{
          $("<p/>").appendTo(repoID).html(pieData.data.label+"的热门项目");
          $("<a/>").appendTo(repoID).html("项目链接");
          $("<span/>").appendTo(repoID).html("&nbsp;&nbsp;项目名次<br/>");
          for(var i =0;i<(15>pieData.data.repos.length?pieData.data.repos.length:15);i++){
            $("<a/>").appendTo(repoID).attr("class", "repoHref").attr('href',pieData.data.repos[i].html_url)
                      .html(pieData.data.repos[i].repoName.substring(0,10));
            $("<span/>").appendTo(repoID).html("&nbsp;&nbsp;&nbsp;&nbsp;"+pieData.data.repos[i].rank+"<br/>");
          }
        }
      }
    }
  });
}
