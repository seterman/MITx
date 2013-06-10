function calculate(text)
{
    var pattern = /\d+|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    
    try
    {
        var answer = evaluate(tokens);
        if(tokens.length !== 0){ throw "Ill-formed exception"; }
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
    var first = tokens[0];
    tokens.shift();
    var number = parseInt(first,10);
    
    if (first=="(")
    {
        tokens.shift();
        number = evaluate(tokens);
    }
    if (first==")")
    { 
        tokens.shift();
        return first; 
    }
    if (isNaN(number))   
    {
       throw "Number expected";
    }
    else
    {
        return number;
    }
    
}

function evaluate(tokens)
{
    var operands = ['+','-','*','/'];
    
    if (tokens.length === 0)
    {
        throw "Missing operand";
    }
    else
    {
        var value = read_operand(tokens);
        
        while(tokens.length !== 0)
        {
            if(value==')')
            {
                tokens.shift();
                return value;
            }
            var op = tokens.shift();
            if(operands.indexOf(op)==-1)
            {
                throw "Missing operand";
            }
            else
            {
                var value2 = read_operand(tokens);
                if(op=='+'){ value= value + value2; }
                if(op=='-'){ value= value - value2; }
                if(op=='*'){ value= value * value2; }
                if(op=='/'){ value= value / value2; }
            }
        }
        return value;
    }
}


$(document).ready(function()
{
    $('.calculator').each(function()
    {
        // this refers to the <div> with class calculator
        setup_calc(this);
    })
})