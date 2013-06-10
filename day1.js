/* Generates tokens and calls evaluate 
*/
function calculate(text)
{
    var pattern = /\d*\.?\d+|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    if(tokens===null){ tokens = []; }
    
    try{
        var answer = evaluate(tokens);
        if(tokens.length !== 0){ throw "Ill-formed expression"; }
        return String(answer);
    }
    catch(err){
        return err;
    }
}

/* arranges the calculator nicely on the page
*/
function setup_calc(div)
{
    var input = $('<input></input>',{type:"text", size: 50});
    var output  = $('<div></div>');
    var button = $('<button>Calculate</button>');
    button.bind("click", function(){
        output.text(String(calculate(input.val())));
    });
    
    $(div).append(input,button,output);
}

var isClosed = true;
/* takes an array of tokens and processes the first one. If it is a number, 
returns the number. If it is a parenthesis, deals with it appropriately */

/* check for -(a+b) etc? */
function read_operand(tokens)
{
    
    var first = tokens[0];
    var number = parseFloat(first,10);
    
    if (first=="("){
        tokens.shift();
        isClosed = false;
        number = evaluate(tokens);
    }
    else if (first == ")"){
        //isClosed = true;
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


/* for order of operations
*/
/*
function read_term(tokens)
{
    
}
*/

/* takes a list of tokens and evaluates the expression they represent */
function evaluate(tokens)
{
    var operands = ['+','-','*','/'];
    
    if (tokens.length === 0){
        throw "Missing operand";
        }
    else{
        var value = read_operand(tokens);
        
        while(tokens.length !== 0){
            if(tokens[0]==')'){
                isClosed=true;
                tokens.shift();
                return value; 
            }
            var op = tokens.shift();
            
            if(operands.indexOf(op)==-1){
                throw "Missing operand";
            }
            else{
                var value2 = read_operand(tokens);
                if(op=='+'){ value= value + value2; }
                else if(op=='-'){ value= value - value2; }
                else if(op=='*'){ value= value * value2; }
                else if(op=='/'){ value= value / value2; }
            }
        }
        if (!isClosed){ throw "Unbalancced parentheses"; }
        return value;
    }
}


$(document).ready(function(){
    $('.calculator').each(function(){
        // this refers to the <div> with class calculator
        setup_calc(this);
    })
})