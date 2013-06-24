var counter = (function (){
    
    // increment(): add one to counter
    // value = get_value(): get the value of the counter
    // reset(): initializes state
    // on(event_string, callback): register event handler
    //  "update": trigger callbacks, passing new counter value
    function Model(){
        var counter = 0;
        var event_handler = EventHandler();
        
        function reset(){
            counter=0;
            event_handler.trigger('update',counter);
        }
        
        function increment(){
            counter += 1;
            event_handler.trigger('update',counter);
        }
        
        function get_value(){
            return counter;
        }
        
        
        return {increment: increment, 
                get_value:get_value, 
                reset:reset,
                on: event_handler.on
               };
    }
    
    //EventHandler
    //  on(event_stringn,callback)
    //  trigger(event_string,data)
    function EventHandler(){
        var handlers = {}; // event_string --> callback list
        
        function on(event_string,callback){
            var cblist = handlers[event_string];
            if(cblist === undefined){
                cblist = [];
                handlers[event_string] = cblist;
            }
            handlers[event_string].push(callback);
        }
        
        function trigger(event_string,data){
            var cblist = handlers[event_string];
            for (var i=0; i < cblist.length; i += 1){
                cblist[i](data);
            }
        } 
        return {on:on,trigger:trigger};
    }
    
    // click(): called when button is clicked
    function Controller(model){
        function click(){
//            console.log("click!");
//            console.log("value:",model.get_value());
            model.increment();
        }
        return {click:click}
    }
    
    
    // view
    function View(div,bgcolor,model,controller){
        var cvalue; //the text showing the value of the counter
        
        function create_display(div){
            var display = $('<div class="view">The current value of the counter is <span>0</span>.</div>');
            
            display.css("background-color",bgcolor===undefined?'white':bgcolor);
            
            cvalue=display.find('span');
            div.append(display);
        }
        
        
        function update_counter(newcount){
            cvalue.text(newcount);
        }
        
        
        model.on('update',update_counter);
        create_display(div);
        return {};
    }
    
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var view = View(div,"white",model,controller);
        var view2 = View(div,"#F0F0FF",model,controller);
        
        var button = $('<button>Increment</button>');
        div.append(button);
        button.on("click",controller.click);
        
        model.reset();
    }
    
    // items accessible to outsiders
    return {setup: setup};
}());

$(document).ready(function() {
    $('.counter').each(function(){
        counter.setup($(this));
    });
});