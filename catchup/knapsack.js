var knapsack = (function(){
    
/********************************
Model
*********************************/
    function Model(){
        var event_handler = EventHandler();
        var all_items = [];
        var total_value = 0;
        var total_weight = 0;
        var max_weight = 0;
        
        function initialize(maxweight,items){
            max_weight = maxweight;
            all_items = items;
        }
        
        // move an object into the knapsack
        function move(index){
            var item = all_items[index];
//            console.log("moving item ",item);
            if (item.location == "house"){
                item.location = "knapsack";
                total_value += item.value;
                total_weight += item.weight;
                
                event_handler.trigger("add",{item:item,
                                             value:total_value,
                                             weight:total_weight});
            } else{
                item.location = "house";
                total_value -= item.value;
                total_weight -= item.weight;
                
                event_handler.trigger("remove",{item:item,
                                             value:total_value,
                                             weight:total_weight});
            }
            
            console.log("total weight:",total_weight,"total value:",total_value);
        }
        
        return {initialize:initialize,
                move:move,
                on:event_handler.on,
                trigger:event_handler.trigger
               };
    }
    
/********************************
Controller
*********************************/
    function Controller(model){
        function click_handler(evt){
//            console.log("click! target:",$(evt.target).attr("data-index"));  
            model.move($(evt.target).attr("data-index"));
        }
        
        return {click_handler:click_handler};
    }
    
/********************************
View
*********************************/
    function View(div,items,max,model,controller){
        // set up the display
        function setup_display(div,items,max){
            var display = $("<div class='display'>Items:</br></div>");
            
            var house_div = $("<div class='location' id='house'>HOUSE</br></div>");
            var bag_div = $("<div class='location' id='bag'>KNAPSACK</br></div>");
            display.append(house_div,bag_div)
            display.append($("<div>Total weight: <span id='weight'>0</span>/<span id='max'></span></div>"));
            display.append($("<div>Total value: <span id='val'>$0</span>"));
            display.find("#max").text(max);
            
            div.append(display);
            
            for(var i=0; i < items.length; i += 1){
                current = items[i];
                var item_div = $("<div class='item'></div>");
                item_div.attr("data-index",i);
                item_div.append($("<img></img>",{src:current.pic,
                                                 height:"50px",
                                                 width:"50px"
                                                }));
                item_div.append("</br>Name: ",current.name,
                                 "; Weight: ",current.weight,"</br>",
                                 "Value: $",current.value,
                                 "; Location: <span>House</span>"
                                );
                
                item_div.on("click",controller.click_handler);
                
                house_div.append(item_div);
                item_div2 = item_div.clone(true);
                item_div2.find("span").text("Knapsack");
                bag_div.append(item_div2);
                
                current.house_div = item_div;
                current.bag_div = item_div2;
            }
        }
        
        function add(data){
            hdiv = data.item.house_div;
            bdiv = data.item.bag_div;
            
            hdiv.css("visibility","hidden");
            bdiv.css("visibility","visible");
            set_wt_val(data);
        }
        
        function remove(data){
            hdiv = data.item.house_div;
            bdiv = data.item.bag_div;
            
            bdiv.css("visibility","hidden");
            hdiv.css("visibility","visible");
            set_wt_val(data);
        }
        
        function set_wt_val(data){
            $('.display span#weight').text(data.weight);
            $('.display span#val').text("$"+data.value);
        }
        
        model.on("add",add);
        model.on("remove",remove);
        setup_display(div,items,max);
        return {};
    }
    
/**************************************
Event Handler
  on(event_string,callback)
  trigger(event_string,data) 
***************************************/
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
            if (cblist !== undefined){
                for (var i=0; i < cblist.length; i += 1){
                    cblist[i](data);
                }
            }
        } 
        return {on:on,trigger:trigger};
    }
    
/***********************************
Setup
    -gets raw data from parent div
    -creates a list of objects representing the items:
        {name,weight,value,pic,location}
************************************/
    function setup(div){
        
        var raw_items = div.children();
        var maxweight = div.attr("data-maxweight");
        div.empty();
        
        var items = [];
        for (var i=0; i < raw_items.length; i += 1){
            var current = raw_items.eq(i);
            items.push({name:current.attr("data-name"),
                        weight:parseInt(current.attr("data-weight")),
                        value:parseInt(current.attr("data-value")),
                        pic:current.attr("src"),
                        location:"house",
                        house_div:null,
                        bag_div:null
                       });
        }
        
//        console.log("items:",items);
        
        var model = Model();
        var controller = Controller(model);
        var view = View(div,items,maxweight,model,controller);
        
        model.initialize(maxweight,items);
    }
    
    // visible to outside users
    return {setup:setup};
}());

// Call setup function when ready
$(document).ready(function() {
    $('.knapsack').each(function(){
        knapsack.setup($(this));
    });
});