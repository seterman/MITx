var graphcalc = (function () {
    var exports = {};
    
/* sets up the calculator */
    function setup_interface(div) {
        
        var button_layout = [[{text:"C",class:"clear"},
                              {text:"&#120013;",class:"num",char:"x"},
                              {text:"&pi;",class:"op",char:"pi"},
                              {text:"e",class:"op",char:"e"}],
                             
                             [{text:"sin(",class:"op",char:"sin("},
                              {text:"cos(",class:"op",char:"cos("},
                              {text:"exp(",class:"op",char:"exp("},
                              {text:"log(",class:"op",char:"log("}],
                             
                             [{text:"(",class:"op",char:"("},
                              {text:")",class:"op",char:")"},
                              {text:"&divide;",class:"op",char:"/"},
                              {text:"&times;",class:"op",char:"*"}],
                          
                             [{text:"7",class:"num",char:"7"},
                              {text:"8",class:"num",char:"8"},
                              {text:"9",class:"num",char:"9"},
                              {text:"&minus;",class:"op",char:"-"}],
                          
                             [{text:"4",class:"num",char:"4"},
                              {text:"5",class:"num",char:"5"},
                              {text:"6",class:"num",char:"6"},
                              {text:"+",class:"op",char:"+"}],
                        
                             [{text:"1",class:"num",char:"1"},
                              {text:"2",class:"num",char:"2"},
                              {text:"3",class:"num",char:"3"}],
                          
                             [{text:"0",class:"num",char:"0"},
                              {text:".",class:"num",char:"."},
                              {text:"Plot",class:"plot"},
                              {text:"=",class:"equals"}]];
        
        var background = $("<div class=background></div>");
        
        background.append($('<div class="errorMsg">ERROR:</div>'),$("<canvas class='screen'></canvas>"));
        
        //background.append($("<button class='special'>Click Me!</button>"));
        
//        console.log(button_layout.length);
        for (var rowNum=0; rowNum < button_layout.length; rowNum ++) {
//            console.log("rownum:",rowNum);
            var rowDiv = $("<div></div>", {"class":'row'+String(rowNum)});
            background.append(rowDiv);
            
            for (var index=0; index < button_layout[rowNum].length; index++){
                var el = button_layout[rowNum][index];
                var button = $("<button>"+el.text+"</button>");
                button.addClass(el.class);
                button.attr("data-char",el.char);
                rowDiv.append($(button));
            }
        }
        
        background.append($("<div class='rangeInputHolder'></div>"));
        
        div.append(background);
        
        $('.rangeInputHolder').append("Min:   <input class=inputMin></input></br>"
                                      +"Max: <input class=inputMax></input>")
        
        /* sets default min and max values */
        $('.inputMin').val("0");
        $('.inputMax').val("10");
        
        bind_buttons();
        
        /* minimize */
        var minimize = $("<button class='minimize'>Minimize</button>");
        var maximize = $("<button class='maximize'>Maximize</button>");
        minimize.on("click", function(){
            background.toggle(1000);
            maximize.show();
            minimize.hide();
        maximize.on("click",function(){
            background.toggle(1000);
            minimize.show();
            maximize.hide();
        })
//            background.css("display","none");
        })
        div.append(minimize,maximize);
    }
    
    function minimize() {
        $('.background')
    }
    
    var input_string  = ""
    var display_string = ""
    var isError = false;
    
/* assigns appropriate handlers to all buttons */
    function bind_buttons() {
        
        /* number and operator buttons */
        $('.num,.op').on("click", function () {
            isError=false;
            var input = $(this).attr("data-char");
            input_string += input;
            display_string += $(this).text();
//            console.log("input:",input,"string:",input_string);
            
            display_text(display_string);
            
            /* removes mousefollow */
            $('.screen').off("mousemove",mousefollow);
        });
        
        /* equals button */
        $('.equals').on("click", function () {
            
            try{
                isError=false;
                var expr_tree = calculator.parse(input_string);
                var answer = String(calculator.evaluate(expr_tree));
            }
            catch(err){
                isError=true;
                answer = err
            }
            clear();
            display_text(answer);
            if(!isError) {
                input_string = answer;
                display_string = answer;
            }
            
            /* removes mousefollow */
            $('.screen').off("mousemove",mousefollow);
            
        });
        
        /* clear button */
        $('.clear').on("click",function(){
            clear();
            isError=false;
            /* sets default min and max values */
            $('.inputMin').val("1");
            $('.inputMax').val("10");
            
            /* removes mousefollow */
            $('.screen').off("mousemove",mousefollow);
        });
        
        /* plot button */
        $('.plot').on("click",plot);
        
        /* all buttons: error message display */
        $('button').on("click", function () {
            if (isError) {
                $('.errorMsg').css("visibility","visible");
            } else {
                $('.errorMsg').css("visibility","hidden");
            }
        });
        
        /* special */
        //$('.special').on("click",heart);
        
    }
    
/* clear function */
/* clears canvas, input and display strings */
    function clear() {
        JQcanvas = $(".screen");
        DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
        input_string = "";
        display_string = "";
    }
    
/* displays text on the screen */    
    function display_text(output) {
        JQcanvas = $(".screen");
        DOMcanvas = JQcanvas[0];
        DOMcanvas.height = JQcanvas.height();
        DOMcanvas.width = JQcanvas.width();
        var ctx = DOMcanvas.getContext('2d');
        
        ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20pt Lucida Grande";
        if (isError) { ctx.font = "12pt Lucida Grande"; } 
        ctx.fillStyle = "black"; 
        ctx.beginPath();
        
        ctx.fillText(output,JQcanvas.width()/2,JQcanvas.height()/2);        
    }
    
/* gets min and max values and plots the curve */
    function plot() {
        var xMin = $(".inputMin").val();
        var xMax = $(".inputMax").val();
        plotGraph(input_string,xMin,xMax);
    }
    
/* functions to convert from x and y values to canvas coords */
    function toCanvasX(x,xMin,xMax){
//        console.log("x:",x,"x-xMin:",x-xMin,"xmax:",xMax,"xmax-xmin:",xMax-xMin);
        DOMcanvas = $('.screen')[0];
        return ((x-xMin)/(xMax-xMin))*DOMcanvas.width;
    }
    
    function toCanvasY(y,yMin,yMax){
        DOMcanvas = $('.screen')[0];
        var scaleFactor = (DOMcanvas.height-40)/(yMax-yMin);
        if(yMin==yMax){
            return DOMcanvas.height/2;
        } else {
            return (DOMcanvas.height-20)-((y-yMin)*scaleFactor);
        }
//        console.log("y:",y,"ymin:",yMin,"yMax",yMax,"scale factor:",scaleFactor);
//        return (DOMcanvas.height-20)-((y-yMin)*scaleFactor);
    }
    
    var offscreen_DOMcanvas = $("<canvas></canvas>")[0];
    
/* draws the curve and gridlines on the background canvas */
    function plotGraph(expression,x1,x2) {
        var JQcanvas = $('.screen');
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        offscreen_DOMcanvas.width = JQcanvas.width();
        offscreen_DOMcanvas.height = JQcanvas.height();
        var bctx = offscreen_DOMcanvas.getContext('2d');
        
        var expr_tree = null;
        var xMin;
        var xMax;
        
        /* Parse expresssions */
        try {
            expr_tree = calculator.parse(expression);
            xMin = calculator.evaluate(calculator.parse(x1));
            xMax = calculator.evaluate(calculator.parse(x2));
        }
        catch(err){
            /* display error on canvas as text */
            isError=true;
            display_text(err);
            return;
        }
//        console.log("xmax:",xMax);
        
        clear();
        
        /* prepare array of x values */
        var xStep = (xMax-xMin)/DOMcanvas.width;
        var temp = xMin;
        var xvals = [];
        while(temp < xMax) {
            xvals.push(temp + xStep);
            temp += xStep;
        }
        
        
        /* Prepare array of y values */
        var yvals=[];
        for(var index = 0; index < xvals.length; index += 1) {
            yvals.push(calculator.evaluate(expr_tree,{x:xvals[index],
            e:Math.E,pi:Math.PI}));
        }
        
        /* Find min and max Y */
        var yMin = Number.POSITIVE_INFINITY;
        var yMax = Number.NEGATIVE_INFINITY;
        for(var index = 0; index < yvals.length; index+=1){
            if(yvals[index]<yMin){
                yMin=yvals[index];
            }
            if(yvals[index]>yMax){
                yMax=yvals[index];
            }
        }
        
        /* default to -10, 10 if no min or max y */
        if (yMin == Number.POSITIVE_INFINITY) { yMin = -10; }
        if (yMax == Number.NEGATIVE_INFINITY) { yMax = 10; }
        
        /* prepare transformed array of y values to graph */
        /*
        var yGraph = [];
        var scaleFactor = (DOMcanvas.height-40)/(yMax-yMin);
//        if ((yMax-yMin)===0) { 
//            scaleFactor = 1;
//        }
        for(index=0; index < yvals.length; index +=1){
            if((yMax-yMin)===0){
                yGraph.push(DOMcanvas.height/2);
            } else {
                yGraph.push((DOMcanvas.height-20)-((yvals[index]-yMin)*scaleFactor));
            }
        } */
        var yGraph = [];
        for (var i=0; i<yvals.length; i++){
            yGraph.push(toCanvasY(yvals[i],yMin,yMax));
        }

        /* gridlines: find the range to get, say, 10 gridlines.
        convert to scientific notation
        use .toPrecision to snap the mantissa to a nice number, "nice"
        you will want gridlines every "nice" units */
        
        /* find gridline intervals */
        var xMessyInterval = (xMax-xMin)/5;
        var xLogInterval = Math.log(xMessyInterval)/Math.LN10;
        var xOrder = Math.floor(xLogInterval);
        var xRem = Math.pow(10,(xLogInterval-xOrder));
        var xInterval;
        if (xRem>5){
            xInterval = 5;
        } else if (xRem>2){
            xInterval=2;
        } else {
            xInterval=1;
        }
        
        xInterval *= (Math.pow(10,xOrder));
        
        var xGridStart = (Math.ceil(xMin/xInterval))*xInterval;
//        console.log("x interval:",xInterval,"start:",xGridStart)
        
        /* graph vertical gridlines */
        bctx.lineWidth = 2;
        bctx.strokeStyle = 'lightgray';
        bctx.lineCap = 'square';
        
        var temp2 = xGridStart;
        while(temp2 < xMax){
            var cx = toCanvasX(temp2,xMin,xMax);
            bctx.beginPath();
            bctx.moveTo(cx,0);
            bctx.lineTo(cx,offscreen_DOMcanvas.height);
            bctx.stroke();
            
            bctx.fillStyle = 'darkgray';
            bctx.textAlign = 'left';
            bctx.textBaseline = 'top';
            bctx.fontSize = '8pt';
            bctx.fillText(temp2,cx+2,0);
            
            temp2 += xInterval;
        }
        
        /* setup to graph the line */
        bctx.lineWidth = 3;
        bctx.strokeStyle='#336699';
        bctx.lineCap='round';
        bctx.lineJoin='round';
        bctx.beginPath();
        bctx.moveTo(0, yGraph[0]);
        
        /* travel to each point in turn */
        for(var i = 0; i < yvals.length; i++) {
            bctx.lineTo(i, yGraph[i]);
        }
        bctx.stroke();
        ctx.drawImage(offscreen_DOMcanvas,0,0);
        
        JQcanvas.on("mousemove",null,{yGraph:yGraph,yvals:yvals,xvals:xvals},mousefollow);
    }
    
/* draw a vertical line that follows the mouse */
    function mousefollow(evt) {
//        console.log("data:",evt.data,"ygraph:",evt.data.yGraph);
        var JQcanvas = $('.screen');
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        var yGraph = evt.data.yGraph;
        var xvals = evt.data.xvals;
        var yvals = evt.data.yvals;
        
        var mx = evt.pageX;
        var my = evt.pageY;
        
        var offset = JQcanvas.offset(); // gives {left: ..., top: ...}
		mx = Math.round(mx - offset.left);
		my = Math.round(my - offset.top);
        
        ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
        
        /* vertical line */
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle='darkgray';
        ctx.lineCap='square';
        ctx.moveTo(mx,0);
        ctx.lineTo(mx,JQcanvas.height());
        ctx.stroke();
        
        /* background image */
        ctx.drawImage(offscreen_DOMcanvas,0,0);
        
        /* circle on intersect */
        ctx.strokeStyle='black';
        ctx.lineCap='round';
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.arc(mx,yGraph[mx],5,Math.PI,3*Math.PI);
        ctx.stroke();
        
        /* labels */
        ctx.font='8pt Lucida Grande';
        ctx.fillStyle='#1F1F1F';
        ctx.textAlign='left';
        ctx.textBaseline='bottom';
//        ctx.moveTo(mx,JQcanvas.height()-2);
        ctx.beginPath();
        ctx.fillText("x: "+(xvals[mx]).toFixed(3),mx+2,JQcanvas.height()-12);
        ctx.beginPath();
        ctx.fillText("y: "+(yvals[mx]).toFixed(3),mx+2,JQcanvas.height()-2);
    }
    
    exports.setup_interface = setup_interface;
    return exports;
}());


//setup
$(document).ready(function () {
    $('.graphcalc').each(function () {
        graphcalc.setup_interface($(this));
    });
});