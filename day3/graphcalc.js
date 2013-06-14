var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
    function graph(canvasDOM,expression,x1,x2) {
        /*… your code to plot the value of expression as x varies from x1 to x2 …*/
        var expr_tree;
        var ctx = canvasDOM.getContext('2d');
        var minX=0;
        var maxX=0;
        try {
            expr_tree = calculator.parse(expression);
            minX = calculator.evaluate(calculator.parse(x1));
            maxX = calculator.evaluate(calculator.parse(x2));
            console.log("got expression");
        }
        catch(err){
            /* display error on canvas as text */
            
            ctx.fillStyle="black";
            ctx.font = "12pt Verdana";
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillText(err,canvasDOM.width/2,canvasDOM.height/2);
            return;
        }
        var xStep = (maxX-minX)/canvasDOM.width;
        var temp = minX;
        var xvals = [];
        while(temp<maxX){
            xvals.push(temp+xStep);
            temp += xStep;
        }
        
        /* gridlines: find the range to get, say, 10 gridlines.
        convert to scientific notation
        use .toPrecision to snap the mantissa to a nice number, "nice"
        you will want gridlines every "nice" units*/
        var messyRange = (maxX-minX)/10;
        
        
        // console.log(xvals);
        var yvals=[];
        for(var index = 0; index < xvals.length; index+=1){
            yvals.push(calculator.evaluate(expr_tree,{x:xvals[index],
            e:Math.E,pi:Math.PI}));
        }
        var minY = yvals[0];
        var maxY = yvals[0];
        for(var index = 0; index < yvals.length; index+=1){
            if(yvals[index]<minY){
                minY=yvals[index];
            }
            if(yvals[index]>maxY){
                maxY=yvals[index];
            }
        }
        
        var yGraph = [];
        var scaleFactor = (canvasDOM.height-40)/(maxY-minY);
        for(index=0; index < yvals.length; index +=1){
            yGraph.push((canvasDOM.height-20)-((yvals[index]-minY)*scaleFactor));
        }
        
        console.log(yvals);
        console.log("ygraph:",yGraph);
        ctx.lineWidth = 5;
        ctx.strokeStyle='red';
        ctx.lineCap='round';
        ctx.lineJoin=("round");
        ctx.beginPath();
        ctx.moveTo(0, yGraph[0]);
        for(var i = 0; i<yGraph.length; i++){
            ctx.lineTo(i, yGraph[i]);
        }
        ctx.stroke();
    }
    function clear(canvasJQ, func, minX, maxX){
        var context=canvasJQ[0].getContext('2d');
        //(x,y,dx, dy)
        context.clearRect(0,0,canvasJQ.width(), canvasJQ.height());
        //console.log(func);
        func.val('sin(x)');
        
        minX.val('0');
        maxX.val('6*pi');
    }
    
    function setup(div) {
        var wrapper=$("<div id=\"graph_wrapper\"></div>");
        var canvasJQ = $("<canvas id=\"graph_canvas\"></canvas>");
        var canvasDOM = canvasJQ[0];
        canvasDOM.height=400;
        canvasDOM.width=400;
        var ctx = canvasDOM.getContext('2d');
        ctx.fillStyle='black';
        ctx.font="20px Verdana";
        ctx.fillText("This is the graphing canvas", 10,20);
        wrapper.append(canvasJQ);

        var inputDiv = $("<div></div>");
        var inputHolder = $("<div>f(x):</div>");
        var minMaxHolder = $("<div>min x:</div>");
        
        var inputFunction=$("<input></input>",{id:"function_input",type:"text",size:60});
        inputHolder.append(inputFunction);
        var inputMin=$("<input></input>",{id:"minX_input",type:"text"});
        minMaxHolder.append(inputMin);
        minMaxHolder.append("max");
        var inputMax = $("<input></input>",{id:"maxX_input",type:"text"});
        minMaxHolder.append(inputMax);
        
        var buttonDiv=$("<div></div>");
        var plotButton=$("<button>Plot FunctionM</button>", {id:"plot_button"});
        var clearButton=$("<button>Clear Graph</button>", {id:"clear_button"});
        buttonDiv.append(plotButton);
        buttonDiv.append(clearButton);
        //
        plotButton.bind("click", function(){
            graph(canvasDOM, inputFunction.val(), inputMin.val(), inputMax.val());
            
        });
        clearButton.bind("click", function(){
            clear(canvasJQ, inputFunction, inputMin, inputMax);
        });
        inputDiv.append(inputHolder);
        inputDiv.append(minMaxHolder);
        inputDiv.append(buttonDiv);
        wrapper.append(inputDiv);
        $(div).append(wrapper);
    }
    exports.setup = setup;
   
    return exports;
}());
// setup all the graphcalc divs in the document
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this);  
    });
});