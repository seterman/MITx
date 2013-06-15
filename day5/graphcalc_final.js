var graphcalc = (function () {
    var exports = {};
    
/* sets up the calculator */
    function setup_interface(div) {
        
        var button_layout = [[{text:"C",class:"clear"},
                              {text:"&#120013;",class:"num",char:"x"},
                              {text:"&pi;",class:"op",char:"pi"},
                              {text:"e",class:"op",char:"e"}],
                             
                             [{text:"sin",class:"op",char:"sin"},
                              {text:"cos",class:"op",char:"cos"},
                              {text:"exp",class:"op",char:"exp"},
                              {text:"log",class:"op",char:"log"}],
                             
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
        
//        background.append("<button></button>",{class:item.class,text:item.text})
        
        /*
        var calc_interface = ''
        + '<div class="background">'
        + '    <div class="errorMsg">ERROR:</div>'
        + '    <canvas class="screen"></canvas>'
//        + '    <div class="row">'
//        + '        <button>MC</button>'
//        + '        <button>M+</button>'
//        + '        <button>M-</button>'
//        + '        <button>MRC</button>'
//        + '    </div>'
        + '    <div class="rangeInputHolder"></div>'
        + '    <div class="row">'
        + '        <button class="clear">C</button>'
        + '        <button class="op" data-char="/">÷</button>'
        + '        <button class="op" data-char="*">x</button>'
        + '    </div>'
        + '    <div class="row">'
        + '        <button class="num" data-char="7">7</button>'
        + '        <button class="num" data-char="8">8</button>'
        + '        <button class="num" data-char="9">9</button>'
        + '        <button class="op" data-char="-">-</button>'
        + '    </div>'
        + '    <div class="row">'
        + '        <button class="num" data-char="4">4</button>'
        + '        <button class="num" data-char="5">5</button>'
        + '        <button class="num" data-char="6">6</button>'
        + '        <button class= "op" data-char="+">+</button>'
        + '    </div>'
        + '    <div class="row">'
        + '        <button class="num" data-char="1">1</button>'
        + '        <button class="num" data-char="2">2</button>'
        + '        <button class="num" data-char="3">3</button>'
        + '        <button class="num" data-char="x">&#120013;</button>'
        + '    </div>'
        + '    <div class="row">'
        + '        <button class="num" data-char="0">0</button>'
        + '        <button class="num" data-char=".">.</button>'
        + '        <button class="equals">=</button>'
        + '        <button class="plot">Plot</button>'
        + '    </div>'
        + '</div>'     
//        div.append(calc_interface);
        */
        
        $('.rangeInputHolder').append("Min:<input class=inputMin></input>"
                                      +"Max:<input class=inputMax></input>")
        
        
        /* sets default min and max values */
        $('.inputMin').val("1");
        $('.inputMax').val("10");
        
        bind_buttons();
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
            console.log("input:",input,"string:",input_string);
            
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
        xMin = $(".inputMin").val();
        xMax = $(".inputMax").val();
        plotGraph(input_string,xMin,xMax);
    }
    
    
    var offscreen_DOMcanvas = $("<canvas></canvas>")[0];
    
/* draws the curve on the background canvas */
    function plotGraph(expression,x1,x2) {
        var JQcanvas = $('.screen');
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        offscreen_DOMcanvas.width = JQcanvas.width();
        offscreen_DOMcanvas.height = JQcanvas.height();
        var bctx = offscreen_DOMcanvas.getContext('2d');
        
        var expr_tree = null;
        var xMin=0;
        var xMax=0;
        
        /* Parse expresssions */
        try {
            expr_tree = calculator.parse(expression);
            xMin = calculator.evaluate(calculator.parse(x1));
            xMax = calculator.evaluate(calculator.parse(x2));
            console.log("Expression:",expression,"tree:",expr_tree);
        }
        catch(err){
            /* display error on canvas as text */
            isError=true;
            display_text(err);
            return;
        }
        
        clear();
        
        /* prepare array of x values */
        var xStep = (xMax-xMin)/DOMcanvas.width;
        var xGridInterval = Math.round(DOMcanvas.width/7);
        var temp = xMin;
        var counter = 0;
        var xvals = [];
        var xGridVals = []
        while(counter <= DOMcanvas.width) {
            xvals.push(temp);
            if (counter%xGridInterval === 0){
                xGridVals.push(temp.toFixed(2));
            }
            temp += xStep;
            counter ++;
        }
        console.log("x grid values:",xGridVals);
        
        /* gridlines: find the range to get, say, 10 gridlines.
        convert to scientific notation
        use .toPrecision to snap the mantissa to a nice number, "nice"
        you will want gridlines every "nice" units*/
//        var messyRange = (xMax-xMin)/10;
        
        /* Prepare array of y values */
        var yvals=[];
        for(var index = 0; index < xvals.length; index += 1) {
            yvals.push(calculator.evaluate(expr_tree,{x:xvals[index],
            e:Math.E,pi:Math.PI}));
        }
//        console.log("y values:",yvals);
        
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
//        console.log("ymin:",yMin,"ymax:",yMax);
        
        /* prepare transformed array of y values to graph */
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
        }
//        console.log("yMin:",yMin,"ygraph:",yGraph);

        /* graph vertical gridlines */
        bctx.lineWidth = 2;
        bctx.strokeStyle='lightgray';
        bctx.lineCap = 'square';
        for(var i=0; i < 7; i++){
            bctx.beginPath();
            bctx.moveTo(xGridInterval*i,0);
            bctx.lineTo(xGridInterval*i,JQcanvas.height());
            bctx.stroke();
            
            bctx.fillStyle='darkgray';
            bctx.font="8pt Lucida Grande";
            bctx.textAlign='left';
            bctx.textBaseline='top';
            bctx.beginPath();
            bctx.fillText(xGridVals[i],xGridInterval*i,0);
            
        }
        
        /* setup to graph the line */
        bctx.lineWidth = 3;
        bctx.strokeStyle='#336699';
        bctx.lineCap='round';
        bctx.lineJoin='round';
        bctx.beginPath();
        bctx.moveTo(0, yGraph[0]);
        
        /* travel to each point in turn */
        for(var i = 0; i < yGraph.length; i++) {
            bctx.lineTo(i, yGraph[i]);
        }
        bctx.stroke();
        ctx.drawImage(offscreen_DOMcanvas,0,0);
        
        JQcanvas.on("mousemove",mousefollow);
    }
    
    function test_mouse(event){
        console.log("mx:",event.pageX,"my:",event.pageY);
    }
    
    function mousefollow(evt) {
        var JQcanvas = $('.screen');
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        var mx = evt.pageX;
        var my = evt.pageY;
        
//        console.log("mx:",mx,"my",my);
        
        var offset = JQcanvas.offset(); // gives {left: ..., top: ...}
		mx = Math.round(mx - offset.left);
		my = Math.round(my - offset.top);
        
        ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
        
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle='lightgray';
        ctx.lineCap='square';
        ctx.moveTo(mx,0);
        ctx.lineTo(mx,JQcanvas.height());
        ctx.stroke();
        ctx.drawImage(offscreen_DOMcanvas,0,0);
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