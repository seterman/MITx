function heart() {
        var JQcanvas = $('.screen');
        var DOMcanvas = JQcanvas[0];
        DOMcanvas.width=JQcanvas.width();
        DOMcanvas.height=JQcanvas.height();
        var ctx = DOMcanvas.getContext('2d');
        
        var yMin = -3.5;
        var yMax = 1.5;
        var xMin = -4.5;
        var xMax = 4.5;
        var exprTop = calculator.parse("sqrt(1-((abs(x)-1)*(abs(x)-1)))");
        var exprBot = calculator.parse("acos(1-abs(x))-pi+0.2");
        
        /* prepare array of x values */
        var xStep = (xMax-xMin)/DOMcanvas.width;
        var temp = xMin;
        var xvals = [];
        while(temp < xMax) {
            xvals.push(temp + xStep);
            temp += xStep;
        }
        
        /* Prepare array of y values */
        var yvalsTop=[];
        var yvalsBot=[];
        for(var index = 0; index < xvals.length; index ++) {
            yvalsTop.push(calculator.evaluate(exprTop,{x:xvals[index],e:Math.E,pi:Math.PI}));
            yvalsBot.push(calculator.evaluate(exprBot,{x:xvals[index],e:Math.E,pi:Math.PI}));
        }
//        console.log("top:",yvalsTop,"bot:",yvalsBot);
        
        var yGraphTop = [];
        var yGraphBot = [];
        for(var i=0; i < yvalsTop.length; i ++){
            yGraphTop.push(toCanvasY(yvalsTop[i],yMin,yMax));
            yGraphBot.push(toCanvasY(yvalsBot[i],yMin,yMax));
        }
//        console.log("top graph:",yGraphTop,"bot graph:",yGraphBot);
        
        ctx.strokeStyle = 'pink';
        ctx.lineWidth=5;
        ctx.lineJoin='round';
        ctx.lineCap='round';
//        ctx.fillStyle='pink'
        ctx.beginPath();
        
        ctx.moveTo(toCanvasX(-2,xMin,xMax),toCanvasY(0,yMin,yMax));
        for (var i=0; i<yGraphTop.length; i++){
            if (!isNaN(yGraphTop[i])){
                ctx.lineTo(i,yGraphTop[i]);
            }
        }
        
        ctx.stroke();
//        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(toCanvasX(-2,xMin,xMax),toCanvasY(0,yMin,yMax));
        for (var i=0; i<yGraphBot.length; i++){
            if (!isNaN(yGraphBot[i])){
                ctx.lineTo(i,yGraphBot[i]);
            }
        }
        ctx.stroke();
//        ctx.fill();
        
        ctx.beginPath();
        ctx.font="14pt Lucida Grande";
        ctx.textAlign="center";
        ctx.textBaseline="alphabetic";
        ctx.fillStyle='crimson';
        ctx.fillText("Happy Father's Day!",DOMcanvas.width/2,DOMcanvas.height/2);
        
        
    }