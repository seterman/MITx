var graphcalc = (function () {
    var exports = {};
    
    function setup_interface(div) {
        var calc_interface = ''
        + '<div class="background">'
        + '    <canvas class="screen"></canvas>'
//        + '    <div class="row">'
//        + '        <button>MC</button>'
//        + '        <button>M+</button>'
//        + '        <button>M-</button>'
//        + '        <button>MRC</button>'
//        + '    </div>'
        + '    <div class="row">'
        + '        <button>C</button>'
        + '        <button>±</button>'
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
        + '    </div>'
        + '    <div class="row">'
        + '        <button class="num" data-char="0">0</button>'
        + '        <button class="num" data-char=".">.</button>'
        + '        <button class="equals">=</button>'
        + '        <button class="plot">Plot</button>'
        + '    </div>'
        + '</div>'     
        div.append(calc_interface);
        
        bind_buttons();
    }
    
    var input_string  = ""
    function bind_buttons() {
        $('.num,.op').on("click", function () {
            var input = $(this).attr("data-char");
            input_string += input;
            console.log("input:",input,"string:",input_string);
        });
        
        $('.equals').on("click", function () {
            var expr_tree = calculator.parse(input_string);
            console.log(expr_tree);
            var answer = calculator.evaluate(expr_tree);
            console.log("answer:",answer)
            display_text(String(answer));
            input_string = "";
            
        });
    }
    
    function display_text(output) {
        JQcanvas = $(".screen");
        console.log("jqcanvas:",JQcanvas);
        DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
        
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "20pt Georgia";
        ctx.fillText(output,JQcanvas.width()/2,JQcanvas.height()/2);
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