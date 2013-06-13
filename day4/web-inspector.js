/**
 * A simple web inspector.
 *
 * Intended to be a singleton: this only exists once per page, so it
 * attaches itself to the BODY element.
 */
var Inspector = function($) {
    exports = {};

    // The root element of the inspector.
    var root = null;
    
    var selection = null;
    var html = null;

    var template = ""
        + "<div class='tray'>"
        + "  <textarea class='text-editor'></textarea>"
        + "  <div class='property-editor'>"
        + "    <div class='node-lookup'>"
        + "      <input class='selector' /><input class='nth' />"
        + "      <button>Search</button>"
        + "    </div>"
        + "    <div class='property-list'>"
        + "    </div>" 
        + "  </div>" 
        + "</div>" 
        + "<div class='handle'></div>";

    /* Construct the UI */
    
    var toggle = function() { 
        if (root.css("top") == "0px") {
            root.animate({"top": "-300px"},500);
        }else{
            root.animate({"top":"0px"},500); 
        }
    };
    
    var searchBySelector = function() {
        var selectorBox = root.find(".selector");
        var selectorStr = selectorBox.val();
        selection = $(selectorStr);
        html = selection.html();
        var textEditor=root.find(".text-editor");
        var propertyList = root.find(".property-list");
        textEditor.val(html);
        
        propertyList.append("<span>Number of children:"+selection.children().length+"</span>", {class:"make-black"});
        propertyList.append("<br/>");
        propertyList.append("<span>Offset left:"+selection.offset().left+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Offset top:"+selection.offset().top+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Height:"+selection.height()+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Width:"+selection.width()+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Margin:"+selection.css("margin")+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Padding:"+selection.css("Padding")+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Margin:"+selection.css("margin")+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Background:"+selection.css("background")+"</span>");
        propertyList.append("<br/>");
        propertyList.append("<span>Tag:"+selection.prop("tagname")+"</span>");
        propertyList.append("<br/>");
        

        console.log(selection);
    };
    
    var changeHtml = function(evt) {
    
//        var str = ""+
//            "Keypress:"+
//            "Key:"+evt.which()+
//            "target:"+evt.target();
//        
//        alert(str);
//        console.log("&#"+evt.which+";");
//        selection.html("&#"+evt.which+";")
        
        var textEditor=root.find(".text-editor");
        selection.html(textEditor.val());
    };
    
    exports.initialize = function() {
        root = $("<div class='inspector'></div>").appendTo($('body'));
      
        root.append(template); 
        root.find(".handle").on("click",toggle);
        root.find(".text-editor").on("keypress",changeHtml);
        root.find(".node-lookup button").on("click",searchBySelector);
    };
    
    exports.toggle = toggle;
    
    return exports;
};

/*****************************************************************************
 * Boot up the web inspector!
 *
 * This will enable you to COPY AND PASTE this entire file into any web page
 * to inspect it.
 *
 * XXX TODO!
 *  Change the CSS link below to point to the full URL of your CSS file!
 *
 *  You shouldn't need to touch anything else below.
 *
 *****************************************************************************/
(function() {
    var createInspector = function() {
      window.inspector = Inspector(jQuery);
      window.inspector.initialize();
    }

    // Add the CSS file to the HEAD
    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', 'web-inspector.css'); // XXX TODO CHANGEME!!
    document.head.appendChild(css);

    if ('jQuery' in window) {
      createInspector(window.jQuery);
    } else {
      // Add jQuery to the HEAD and then start polling to see when it is there
      var scr = document.createElement('script');
      scr.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
      document.head.appendChild(scr);
      var t = setInterval(function() {
        if ('jQuery' in window) {
          clearInterval(t); // Stop polling 
          createInspector();
        }
      }, 50);
    }
})();
