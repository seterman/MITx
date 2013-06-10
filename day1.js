function calculate()
{
    var input = $('#text1:first'); // get input field from DOM
    var val = input.val();
    var output = $('#text1_out:first');
    output.text(val);
}