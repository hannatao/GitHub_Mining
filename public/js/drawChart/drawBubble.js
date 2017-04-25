function drawBubble(result){
    var diameter = 400,                                 //设置宽高  
        color = d3.scale.category20();                 //设置不同颜色  
    /*布局设置*/  
    var bubble = d3.layout.pack()                       //初始化包图                         
        .sort(null)                                     //后面的数减去前面的数排序，正负都变，null顺序不变  
        .size([diameter, diameter])                     //设置范围  
        .padding(1.5);                                  //设置间距  
    /*获取并添加svg元素，并设置宽高*/  
    var svg = d3.select("#bubbleMain").append("svg")             
        .attr("width", diameter)  
        .attr("height", diameter);  

    /*以下是字符串拼接*/  
    var startString = "{\"name\": \"flare\",\"children\": [";                      //开头字符串  
    result.forEach(function(dude){                                                 //遍历result并且拼接  
        startString+="{\"name\":\""+dude.key+"\",\"size\":"+dude.value+"},";  
    })  
    /*去除最后一个末尾的逗号，这个逗号会影响后面JSON.parse的使用*/  
    startString = startString.substring(0,startString.length-1);  
    /*拼接尾部字符串*/  
    startString+="]}";  
    /*将拼接好的字符串转换成json对象*/  
    var json2 = JSON.parse(startString);  
    /*绘图部分*/  
    console.log(classes(json2));  
    var node = svg.selectAll(".node")  
                  .data(bubble.nodes(classes(json2))                                                                 //绑定数据（配置结点）  
                  .filter(function(d) { return !d.children; }))                                                      //数据过滤，满足条件返回自身（没孩子返回自身，有孩子不返回，这里目的是去除父节点）  
                  .enter().append("g")  
                  .attr("class", "node")  
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });                  //设定g移动  
          
        node.append("title")  
            .text(function(d) { return d.className + ": " + (d.value); });             //设置移入时候显示数据   数据名和值  
          
        node.append("circle")  
            .attr("r", function(d) { return d.r;})                                     //设置圆的半径  
            .style("fill", function(d) { return color(d.value); });              //为圆形涂色  
          
        node.append("text")  
            .attr("dy", ".3em")  
            .style("text-anchor", "middle")                                            //设置文本对齐  
            .text(function(d) { return d.className.substring(0, d.r / 3); });          //根据半径的大小来截取对应长度字符串（很重要）  

        // Returns a flattened hierarchy containing all leaf nodes under the root.  
        function classes(root) {  
            var classes = [];                                                                                        //存储结果的数组  
            /*自定义递归函数 
             * 
             * 第二个参数指传入的json对象 
             * */  
            function recurse(name, node) {  
                if (node.children)                                                                                   //如果有孩子结点 （这里的children不是自带的，是json里面有的）  
                {  
                    node.children.forEach(function(child) {                                                          //将孩子结点中的每条数据  
                        recurse(node.name, child); })  
                }  
                else {classes.push({ className: node.name, value: node.size})};                                     //如果自身是孩子结点的，将内容压入数组  
            }  
            recurse(null, root);  
            return {children: classes};                                                                             //返回所有的子节点  （包含在children中）                                                                            
        }  
}