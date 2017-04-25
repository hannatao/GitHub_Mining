
$(function () { $("[data-toggle='tooltip']").tooltip(); });
$(function () { $("[data-toggle='popover']").popover();});

$(document).ready(function(){
      //初始化显示
      $("#liShowType").attr("value","星数"); 
      $("#liType").attr("value","stargazers_count");
      getRepo("星数","stargazers_count",10);
      $("<p/>").appendTo("#myModalLabel").html("项目整体分布（按照星数目)");
      //二级导航栏点击事件
      $("#repoType  li").click(function(){
          var showType=$(this).text();
          $('.active').attr("class",null);
          $(this).attr("class","active");
           var type;
           if(showType =="星数"){
              type = "stargazers_count";
           }
           else if(showType =="分支数"){
              type = "forks";
           }
           else if(showType =="贡献者数"){
              type = "contributors_count";
           }
           else if(showType == "pr数"){
              type = "prs_count";
           }
           else if(showType == "综合评分"){
              type = "myScore";
           }
           getRepo(showType,type,10);
           $("#myModalLabel").empty();
           $("<p/>").appendTo("#myModalLabel").html("项目整体分布（按照"+showType+")");
           $("#liShowType").attr("value",showType); 
           $("#liType").attr("value",type); 
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
          getRepo(showType,type,top);
        }
      });

      //整体分布点击事件
      $("#levelBtn").click(function(){
        $("#classMain").empty();
        var typeTemp = $("#liType").val();

        $(function(){
          $.ajax({
            url:"/repo_action//repoClass_show",
            type:"get",
            data:{type:typeTemp},
            success:function(data){
              drawPie(data,"#classMain");
            }
          })  
        })

        $('#myModal').modal();
      });


      //说明显示与隐藏事件
      $("#readme").mouseover(function(){
        $('#readme').popover('show');
      });

      $("#readme").mouseout(function(){
        $('#readme').popover('hide');
      });   
})  

//主体显示函数
function getRepo(showType,type,top){
  $("#repoInfo").hide();
   $(function(){
        $.ajax({
              url:"/repo_action/repoChina_show",
              type:"get",
              data:"type="+type+"&top="+top,
              success:function(Data){

              $('#repoMain').empty();
              $("#repoUser").empty();
              $("#repoLanguages").empty();
          
                data = Data[0];
                languages = Data[1];
                repoUser = Data[2];             

                var margin = {top: 30, right: 100, bottom: 10, left: 110},
                    width = $("#repoMain").width() - margin.left - margin.right,
                    height = 350 - margin.top - margin.bottom;

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], .1);

                var svg = d3.select("#repoMain").append("svg")
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
                  return "<strong>"+d.name+":</strong> <span style='color:red'>" + data[i][type]+ "</span><strong>";
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
                    .on('mouseout', tipeHide);

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
                    .attr("x",width+70)
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
                      .text(function(d) { return d.name; });

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

                drawPie(repoUser,"#repoUser");
                drawPie(languages,"#repoLanguages");

                function tipeShow(d,i){
                  tip.show(d,i);                  
                  $("#repoInfo td").empty();
                  $("#repoInfo").show();
                  $("<a/>").appendTo("#repoName").html("<a href="+d.html_url+">"+d.name+"</a>");
                  $("<a/>").appendTo("#repoOwner").html("<a href="+d.owner.html_url+">"+d.owner.login+"</a>");
                  $("<p/>").appendTo("#repoDescrip").html(d.description);
                  $("<p/>").appendTo("#repolanguage").html(d.language);
                  $("<p/>").appendTo("#repoStars").html(d.stargazers_count);
                  $("<p/>").appendTo("#repoForks").html(d.forks);
                  $("<p/>").appendTo("#repoContributors").html(d.contributors.length);
                  $("<a/>").appendTo("#repoMostCon").html("<a href="+d.contributors[0].html_url+">"+d.contributors[0].login+"</a>");
                  $("<p/>").appendTo("#repoMostCon").html("次数："+d.contributors[0].contributions);
                  $("<p/>").appendTo("#repoPrs").html(d.prs.length);
                  $("<p/>").appendTo("#myScore").html(d.myScore);
                  $("<p/>").appendTo("#myScore").html("综合名次："+d.rank);
                  if(d.owner["rank"]){
                     $("<p/>").appendTo("#repoOwner").html("类型："+d.owner.type);
                     $("<p/>").appendTo("#repoOwner").html("名次："+d.owner.rank);
                  }
                }

                function tipeHide(){
                  tip.hide();
                }

              }
        });
  });
}