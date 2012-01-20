var BD = require("/bigdecimal");
//bigdecimal.RoundingMode
//"jl"


$(document)
    .ready(function() {
	       //this is for IE7
	       if(_.isUndefined(window.console)){
		   console = {log:function(){/*do nothing*/}};
	       }
	       doc_setup();
	   });
