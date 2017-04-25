$(document).ready(function(){
      //初始化页面
      $("#liShowType").attr("value","贡献次数"); 
      $("#liType").attr("value","contributions_count");
      getContir("贡献次数","contributions_count",10); 

      //二级导航栏点击事件
      var Uarry=$("#secondNavi li");//获取所有的li元素  
      $("#secondNavi li").click(function(){//点击事件 
          $('.active').attr("class",null);
          $(this).attr("class","active");
          var showType=$(this).text();
          var type;
          if(showType =="贡献次数"){
            type = "contributions_count";
          }
          else if(showType =="贡献项目数"){
            type = "repos_count";
          }
          else if(showType =="贡献影响力"){
            type = "reposScoreTotal";
          }
          $("#liShowType").attr("value",showType); 
          $("#liType").attr("value",type); 
          getContir(showType,type,10);
      })
      //查询按钮点击事件
      $("#searchBtn").click(function(){
        var top = $("#topNum").val();
        if(!/^([12][0-9]|30|[1-9])$/.test(top)){
          alert("请输入1-30以内数字");
        }
        else{
          var showType = $("#liShowType").val();
          var type = $("#liType").val();
          getContir(showType,type,top);
        }
      });
      //说明的显示与隐藏
      $("#readme").mouseover(function(){
        $('#readme').popover('show');
      });

      $("#readme").mouseout(function(){
        $('#readme').popover('hide');
      });    
})  

//发送请求显示主页面
function getContir(showType,type,top){

  $('#content-Main').empty();
  $('#orgInfo').empty();
   $(function(){
        $.ajax({
              url:"/repo_action/contributors_show",
              type:"get",
              data:"type="+type+"&top="+top,
              success:function(data){
                var margin = {top: 30, right: 100, bottom: 10, left: 90},
                    width = $("#content-Main").width() - margin.left - margin.right,
                    height = 40*top - margin.top - margin.bottom;

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], .1);

                var svg = d3.select("#content-Main").append("svg")
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
                  return "<strong>"+d.login+":</strong> <span style='color:red'>" + data[i][type]+ "</span><strong>";
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
                      d.repos.forEach(function(repo){
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
                    .attr("x",width+margin.right-20)
                    //.attr("textLength",25)
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
                      .text(function(d) { return d.login; });

                  //添加Y坐标轴轴头
                  var xName = ['项目名称'];
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
                  $("<a/>").appendTo("#orgInfo").attr("class", "repoHref").attr('href',d.html_url).html("&nbsp;&nbsp;&nbsp;&nbsp;"+d.login);
                  $("<p/>").appendTo("#orgInfo").attr("class","smallHeader").html("参与的热门项目");
                  $("<a/>").appendTo("#orgInfo").html("项目链接");
                  $("<span/>").appendTo("#orgInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;项目名次<br>");
                  for(var i =0;i<(10>d.repos.length?d.repos.length:10);i++){
                    $("<a/>").appendTo("#orgInfo").attr("class", "repoHref").attr('href',d.repos[i].html_url).html(d.repos[i].name);
                     $("<span/>").appendTo("#orgInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;"+d.repos[i].rank+"<br>");
                  }

                  if(d.languages.length!=0){
                    $("<p/>").appendTo("#orgLanguages").attr("class","smallHeader").html("擅长的编程语言分布");
                    drawPie(d.languages,"#orgLanguages");
                  }
                  else{
                    $("<p/>").appendTo("#orgLanguages").attr("class", "smallHeader").html("该用户所有项目语言都为null,暂无该用户语言分布");
                  }
                }

                function tipeHide(){
                  tip.hide();
                }

              }
        });
  });
}
//发送请求显示词云
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