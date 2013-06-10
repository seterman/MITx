function calculate(text)
{
    var pattern = /\d*\.?\d+|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    console.log(tokens);
    if(tokens===null){ tokens = []; }
    
    try
    {
        var answer = evaluate(tokens);
        if(tokens.length !== 0){ throw "Ill-formed expression"; }
        return String(answer);
    }
    catch(err)
    {
        return err;
    }
}

function setup_calc(div)
{
    var input = $('<input></input>',{type:"text", size: 50});
    var output  = $('<div></div>');
    var button = $('<button>Calculate</button>');
    button.bind("click", function()
    {
        output.text(String(calculate(input.val())));
    });
    
    $(div).append(input,button,output);
}

function read_operand(tokens)
{
    console.log(tokens);
    var first = tokens[0];
    var number = parseFloat(first,10);
    
    if (first=="("){
        tokens.shift();
        console.log(tokens);
        number = evaluate(tokens);
    }
    else if (first == ")"){
        return ")";
    }
    else if(first== "-"){
        tokens.shift();
        number = parseFloat(tokens[0],10);
        tokens.shift();
        return -1*number;
    }
    else if (isNaN(number)){
       throw "Number expected"; 
    }
    else{
        tokens.shift();
    }
    return number;
    
}

/*
function read_term(tokens)
{
    if (tokens.length ===0){
        throw "Missing operand";
    }
}
*/

function evaluate(tokens)
{
    var operands = ['+','-','*','/'];
    
    if (tokens.length === 0){
        throw "Missing operand";
        }
    else{
        var value = read_operand(tokens);
        console.log(tokens);
        
        while(tokens.length !== 0){
            if(tokens[0]==')'){
                tokens.shift();
                console.log(tokens);
                return value; 
            }
            var op = tokens.shift();
            console.log(tokens);
            if(operands.indexOf(op)==-1){
                throw "Missing operand";
            }
            else{
                var value2 = read_operand(tokens);
                console.log(tokens);
                if(op=='+'){ value= value + value2; }
                else if(op=='-'){ value= value - value2; }
                else if(op=='*'){ value= value * value2; }
                else if(op=='/'){ value= value / value2; }
            }
        }
        return value;
    }
}


$(document).ready(function(){
    $('.calculator').each(function(){
        // this refers to the <div> with class calculator
        setup_calc(this);
    })
})