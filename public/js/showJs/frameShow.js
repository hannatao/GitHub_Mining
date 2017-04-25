//bootstrap js
$(function () { $("[data-toggle='popover']").popover();});

$(document).ready(function(){
    //初始化页面
    getFrame("uiFrame");
    //二级导航点击事件
    $("#frameType li").click(function(){
        $('.active').attr("class",null);
        $(this).attr("class","active");
         var showType=$(this).text();
         if(showType =="Ui框架"){
            getFrame("uiFrame");
         }
         else if(showType =="Android框架"){
            getFrame("androidFrame");
         }
          else if(showType =="Web框架"){
            getFrame("javaFrame");
         }
    })

    //说明的隐藏与显示
    $("#readme").mouseover(function(){
      $('#readme').popover('show');
    });

    $("#readme").mouseout(function(){
      $('#readme').popover('hide');
    });     
})
//页面主要显示 
function getFrame(type){
  $('#frameMain').empty();
  $('#repoInfo').empty();
  $('#frameLanguages').empty();
  $('#pieHead').hide();
  $('#reposHead').hide();
   $(function(){
        $.ajax({
              url:"/repo_action/frameChina_show",
              type:"get",
              data:"type="+type,
              success:function(data){

              var margin = {top: 40, right: 30, bottom: 30, left: 40};
              var width = (data.length*70>$("#frameMain").width()?$("#frameMain").width():data.length*70) - margin.left 
                           - margin.right;
              var height = 500 - margin.top - margin.bottom;

              var svg = d3.select("#frameMain").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              var x = d3.scale.ordinal()
                  .rangeRoundBands([0, width], .1);
              var y = d3.scale.linear()
                  .range([height, 0]);

              x.domain(data.map(function(d) { return d.name.substring(0,8); }));
              y.domain([0, d3.max(data, function(d) { return d.repos_count; })]);

              var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")

              var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>"+d.name+":</strong> <span style='color:red'>" + d.repos_count + "</span>";
                });

              svg.call(tip);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                  .append("text")
                    .attr("y", 0)
                    .attr("x",width+30)
                    .attr("dy", ".71em")
                    .attr("class","axisTitle")
                    .style("text-anchor", "end")
                    .text("框架");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                  .append("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("y", -20)
                    .attr("x",20)
                    .attr("dy", ".71em")
                    .attr("class","axisTitle")
                    .style("text-anchor", "end")
                    .text("项目数目");

                svg.selectAll(".bar")
                    .data(data)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.name.substring(0,8)); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.repos_count); })
                    .attr("height", function(d) { return height - y(d.repos_count); })
                    .on('mouseover', function(d,i){tipeShow(d,i);})
                    .on('mouseout', tipeHide);

                function tipeShow(d,i){
                  tip.show(d);
                  $('#repoInfo').empty();
                  $('#frameLanguages').empty();
                  $('#pieHead').show();
                  $('#reposHead').show();
                  $("<a/>").appendTo("#repoInfo").html("项目链接");
                  $("<span/>").appendTo("#repoInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;项目名次<br/>");
                  for(var i =0;i<(10>d.repos_count?d.repos_count:10);i++){
                    $("<a/>").appendTo("#repoInfo").attr("class", "repoHref").attr('href',d.repos[i].html_url).html(d.repos[i].name);
                    $("<span/>").appendTo("#repoInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;"+d.repos[i].rank+"<br/>");
                  }
                  drawPie(d.languages,"#frameLanguages")
                }

                function tipeHide(){
                  tip.hide();
                }
              }
        });
  });
}
 