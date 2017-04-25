//bootstrap js
$(function () { $("[data-toggle='popover']").popover();});
$(document).ready(function () {
  var conInfo= document.getElementById("conInfo"); 
  conInfo.style.display="none";
  //发送请求显示主页面
  $(function(){
    $.ajax({
      url:"/repo_action/repoWord_show",
      type:"get",
      success:function(data){
        var colors = ["#2828FF","#00CACA","#02DF82","#00DB00","#E1E100"];
        data.forEach(function(word){
          word["color"] = colors[parseInt(Math.random()*5)];
        })

        draw(data);
      }
    });
  });

  //说明的显示与隐藏
  $("#readme").mouseover(function(){
    $('#readme').popover('show');
  });

  $("#readme").mouseout(function(){
    $('#readme').popover('hide');
  }); 
});

//显示主界面内容
function draw(data){
    //alert(data.length);
    var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 /5,
    outerRadius: 600/2,
    radiusMin: 30,
    //radiusMax: 50,
    intersectDelta: 0,
    //intersectInc: use @default
    //circleColor:d3.scale.category20,
    data: {
      items: data,
      eval: function (item) {return item.count;},
      color: 
      function(item){
        return item.color;
      },
      classed: function (item) {return item.word.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          text: "(点击查看详情)",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function(item) {
            var conInfo= document.getElementById("conInfo"); 
            conInfo.style.display="block";
            var conInfo = $(".table td");
            conInfo.empty();
            $("#language").empty();
            $("<p/>").appendTo("#word").html(item.word);
            $("<p/>").appendTo("#count").html(item.count);
            for(var i =0;i<(10>item.repos.length?item.repos.length:10);i++){
              $("<a/>").appendTo("#repos").attr("class", "repoHref").attr('href',item.repos[i].html_url).html(item.repos[i].name.substring(0,10));
              $("<span/>").appendTo("#repos").html("&nbsp;&nbsp;&nbsp;&nbsp;名次："+item.repos[i].rank+"<br>");
            }
            if(item.languages==null){
              $("<p/>").appendTo("#language").html("无该热词语言分布<br>");
            }
            else{
              drawPie(item.languages,"#language");
            }

          }
        }
      },
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "15px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "word",
              classed: {text: true},
              style: {
                "font-size": "20px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
}