$(document).ready(function(){
  //页面初始化
  $("#liShowType").attr("value","项目影响力"); 
  $("#liType").attr("value","reposScoreTotal");
  getOrg("reposScoreTotal","项目影响力",10);
  d3.selectAll(".radioInput").on("change", change);
  //radio改变事件
  function change(){
    var type = this.value;
    var showType;
    $('#readme').empty();
    if(type=="reposScoreTotal"){
      $("<p/>").appendTo("#readme").html("本排名是根据中国组织2016年创建的热门项目的综合评分总和得到的，右侧可以看到该组织拥有的"
        +"热门项目链接及其综合排名情况。本排名前十名分别是：腾讯，饿了么，中国freeCodeCamp,阿里巴巴，中国laravel学院"
        +"iview,伯乐在线，exacity,expressif等。");
      showType = "项目影响力";
    }
    else{
      $("<p/>").appendTo("#readme").html("本排名首先根据热门项目获取热门的中国组织，再根据组织拥有的开源项目数目排序得到的。可以看到，拥有开源项目较多的"
        +"前十名分别是，百度ecomfe团队，thoughtworksInc团队，百度前端fex-team团队，leancloud公司，饿了么，阿里巴巴，dataman-cloud,"
        +"DaoCloud公司，thoughtworks公司，阿里云等。其中阿里巴巴，百度和thoughtworks公司的团队最为活跃。");
      showType = "开源项目数";
    }
    $("#liShowType").attr("value",showType); 
    $("#liType").attr("value",type);
    getOrg(type,showType,10);
  }

  //查询按钮点击事件
  $("#searchBtn").click(function(){
    var top = $("#topNum").val();
    if(!/^([12][0-9]|30|[1-9])$/.test(top)){
      alert("请输入1-30以内数字");
    }
    else{
      var showType = $("#liShowType").val();
      var type = $("#liType").val();
      getOrg(type,showType,top);
    }
  });

})

//发送请求显示主页面
function getOrg(type,showType,top){
    $('#orgMain').empty();
    $('#orgInfo').empty();
   $(function(){
        $.ajax({
              url:"/repo_action/orgChina_show",
              type:"get",
              data:"type="+type+"&top="+top,
              success:function(data){
                var margin = {top: 30, right: 100, bottom: 10, left: 80},
                    width = 700 - margin.left - margin.right,
                    height = 40*top - margin.top - margin.bottom;

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], .1);

                var svg = d3.select("#orgMain").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                x.domain([0, d3.max(data, function(d,i) { return data[i][type]; })]);
                y.domain(d3.range(data.length));

                var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([0, 10])
                .html(function(d,i) { 
                  return "<strong>"+d.org.login+":</strong> <span style='color:red'>" + data[i][type]+ "</span><strong>";
                });

                svg.call(tip);

                svg.selectAll(".bar")
                    .data(data)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("y", function(d, i) { return y(i); })
                    .attr("width", function(d,i) { return x(data[i][type]); })
                    .attr("height", y.rangeBand())
                    .on('mouseover',function(d,i){tipeShow(d,i);})
                    .on('mouseout', tipeHide)
                    .on('click',function(d){
                      var repos = new Array();
                      d.reposOrg.forEach(function(repo){
                        var temp = {};
                        temp["description"] = repo.description;
                        repos.push(temp);
                      })
                      reposWords(repos);
                    });

                  svg.append("g")
                      .attr("class", "x axis")
                    .call(d3.svg.axis()
                      .scale(x)
                      .orient("top")
                      .ticks(12)
                      .tickSize(-height))
                  .append("text")
                    .attr("class","axisTitle")
                    .attr("y", -10)
                    .attr("x",width+90)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(showType);


                  svg.selectAll(".name")
                      .data(data)
                    .enter().append("text")
                      .attr("class", "name")
                      .attr("x", 10-margin.left)
                      .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
                      .attr("dx", -3)
                      .attr("dy", ".35em")
                      .text(function(d) { return d.org.login; });

                  //添加Y坐标轴轴头
                  var xName = ['组织名称'];
                  var texts = svg.selectAll(".MyYText")
                    .data(xName)
                    .enter()
                    .append("text")
                    .attr("class","axisTitle")
                    .attr("x", function(d){
                        return 10-margin.left;
                    })
                    .attr("y",function(d){
                        return 0;
                    })
                    .text(function(d){
                      return d;
                    });

                  svg.append("g")
                      .attr("class", "y axis")
                    .append("line")
                      .attr("y2", height);
                function tipeShow(d,i){
                  tip.show(d,i);
                  $('#orgInfo').empty();
                  $('#orgLanguages').empty();
                  $("<span/>").appendTo("#orgInfo").attr("class","smallHeader").html("用户链接");
                  $("<a/>").appendTo("#orgInfo").attr("class", "repoHref").attr('href',d.org.html_url).html("&nbsp;&nbsp;&nbsp;&nbsp;"+d.org.login);
                  $("<p/>").appendTo("#orgInfo").attr("class","smallHeader").html("热门项目");
                  $("<a/>").appendTo("#orgInfo").html("项目链接");
                  $("<span/>").appendTo("#orgInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;项目名次<br>");
                  for(var i =0;i<(10>d.reposOrg.length?d.reposOrg.length:10);i++){
                    $("<a/>").appendTo("#orgInfo").attr("class", "repoHref").attr('href',d.reposOrg[i].html_url).html(d.reposOrg[i].name);
                     $("<span/>").appendTo("#orgInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;"+d.reposOrg[i].rank+"<br>");
                  }

                  if(d.languages.length!=0){
                    $("<p/>").appendTo("#orgLanguages").attr("class","smallHeader").html("热门项目语言分布");
                    drawPie(d.languages,"#orgLanguages");
                  }
                  else{
                    $("<p/>").appendTo("#orgLanguages").attr("class", "smallHeader").html("该组织所有项目语言都为null,暂无该组织语言分布");
                  }
                }
                function tipeHide(){
                  tip.hide();
                }

              }
        });
  });
}
//发送请求显示组织关键词
function reposWords(repos){
  $("#bubbleMain").empty();
  $(function(){
    $.ajax({
      url:"/repo_action/reposWords_show",
      type:"get",
      data:{v:repos},
      success:function(data){
        drawBubble(data);
      }
    })  
  })

  $('#myModal').modal();
}