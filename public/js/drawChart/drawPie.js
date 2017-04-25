function drawPie(dataset,divId){
  var width = $(divId).width();
  height = width; 
  var svg=d3.select(divId)  
              .append("svg")  
              .attr("width",width)  
              .attr("height",height); 
  //转换数据  
  var pie=d3.layout.pie() //创建饼状图  
              .value(function(d){  
                  return d.count;  
              });//值访问器  
  //dataset为转换前的数据 piedata为转换后的数据  
  var piedata=pie(dataset);  
    
  //绘制  
  var outerRadius=width/3;  
  var innerRadius=0;//内半径和外半径  
    
  //创建弧生成器  
  var arc=d3.svg.arc()  
              .innerRadius(innerRadius)  
              .outerRadius(outerRadius);  
  var color=d3.scale.category20();  
  //添加对应数目的弧组  
  var arcs=svg.selectAll("g")  
              .data(piedata)  
              .enter()  
              .append("g")  
              .attr("transform","translate("+(width/2)+","+(height/2)+")");  
  //添加弧的路径元素  
  arcs.append("path")  
      .attr("fill",function(d,i){  
          return color(i);  
      })  
      .attr("d",function(d){  
          return arc(d);//使用弧生成器获取路径  
      });  
  //添加弧内的文字  
  arcs.append("text")  
      .attr("transform",function(d){  
          var x=arc.centroid(d)[0]*1.4;//文字的x坐标  
          var y=arc.centroid(d)[1]*1.4;  
          return "translate("+x+","+y+")";  
      })  
      .attr("text-anchor","middle")  
      .text(function(d){  
          //计算百分比  
          var percent=Number(d.value)/d3.sum(dataset,function(d){  
              return d.count;  
          })*100;  
          //保留一位小数点 末尾加一个百分号返回
            return percent.toFixed(1)+"%"; 
      });  
  //添加连接弧外文字的直线元素  
  arcs.append("line")  
      .attr("stroke","black")  
      .attr("x1",function(d){  
          return arc.centroid(d)[0]*2;  
      })  
      .attr("y1",function(d){  
          return arc.centroid(d)[1]*2;  
      })  
      .attr("x2",function(d){  
          return arc.centroid(d)[0]*2.2;  
      })  
      .attr("y2",function(d){  
          return arc.centroid(d)[1]*2.2;  
      });  
    
  var fontsize=12;  
  arcs.append("line")  
      .style("stroke","black")  
      .each(function(d){  
          d.textLine={x1:0,y1:0,x2:0,y2:0};  
      })  
      .attr("x1",function(d){  
          d.textLine.x1=arc.centroid(d)[0]*2.2;  
          return d.textLine.x1;  
      })  
      .attr("y1",function(d){  
          d.textLine.y1=arc.centroid(d)[1]*2.2;  
          return d.textLine.y1;  
      })  
      .attr("x2",function(d){  
          var strLen=getPixelLength(d.data.name,fontsize)*1.5;  
          var bx=arc.centroid(d)[0]*2.2;  
          d.textLine.x2=bx>=0?bx+strLen:bx-strLen;  
          return d.textLine.x2;  
      })  
      .attr("y2",function(d){  
          d.textLine.y2=arc.centroid(d)[1]*2.2;  
          return d.textLine.y2;  
      });  
  arcs.append("text")  
      .attr("transform",function(d){  
          var x=0;  
          var y=0;  
          x=(d.textLine.x1+d.textLine.x2)/2;  
          y=d.textLine.y1;  
          y=y>0?y+fontsize*1.1:y-fontsize*0.4;  
          return "translate("+x+","+y+")";  
      })  
      .style("text-anchor","middle")  
      .style("font-size",fontsize)  
      .text(function(d){  
          return d.data.name;  
      });  
    
  //添加一个提示框  
  var tooltip=d3.select("body")  
                  .append("div")  
                  .attr("class","tooltip")  
                  .style("opacity",0.0);  
    
  arcs.on("mouseover",function(d,i){  
                  /* 
                  鼠标移入时， 
                  （1）通过 selection.html() 来更改提示框的文字 
                  （2）通过更改样式 left 和 top 来设定提示框的位置 
                  （3）设定提示框的透明度为1.0（完全不透明） 
                  */  
      tooltip.html(d.data.name+"的项目数量为"+"<br />"+d.data.count+"个")  
          .style("left",(d3.event.pageX)+"px")  
          .style("top",(d3.event.pageY+20)+"px")  
          .style("opacity",1.0);  
      tooltip.style("box-shadow","10px 0px 0px"+color(i));//在提示框后添加阴影  
      })  
      .on("mousemove",function(d){  
          /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */  
          tooltip.style("left",(d3.event.pageX)+"px")  
                  .style("top",(d3.event.pageY+20)+"px");  
      })  
      .on("mouseout",function(d){  
          //鼠标移除 透明度设为0  
          tooltip.style("opacity",0.0);  
      })  
    
      function getPixelLength(str,fontsize){  
          var curLen=0;  
          for(var i=0;i<str.length;i++){  
              var code=str.charCodeAt(i);  
              var pixelLen=code>255?fontsize:fontsize/2;  
              curLen+=pixelLen;  
          }  
          return curLen;  
      }  
}