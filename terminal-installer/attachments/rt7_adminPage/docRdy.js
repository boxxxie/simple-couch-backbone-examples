$(document)
    .ready(function() {
           //this is for IE7
           if(_.isUndefined(window.console)){
           console = {log:function(){/*do nothing*/}};
           }
           doc_setup();
       });


function doc_setup() {
    updateDate();

    Backbone.history.start();
};

function updateDate() {
      var ts = $("#timespace");
      $(document).everyTime("1s", function(){
      var date = new Date();
      ts.empty();
      ts.append(date.toDateString() + " / " + date.toLocaleTimeString());
      }, 0);
};
