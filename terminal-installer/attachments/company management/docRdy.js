function jodaDateParser(dateString){
    if(_.isDate(dateString)){return dateString;}
    //var dateMatch =  /([\d-])+([\d:])+/g;
    var dateMatch = /(\d{2,4})/g;
    var match = (dateString).match(dateMatch);
    var year = match[0];
    var month = Number(match[1])-1;
    var day = match[2];
    var hour = match[3];
    var minute = match[4];
    var second = match[5];
    return new Date(year,month,day,hour,minute,second);
}
function dateFormatter(date){
    return date.toString("yyyy-MM-dd HH:mm:ss");
}
function datePartFormatter(date){
    return date.toString("yyyy-MM-dd");
}
function jodaDateFormatter(dateString){
    return dateFormatter(jodaDateParser(dateString));
}
function jodaDatePartFormatter(dateString){
    return datePartFormatter(jodaDateParser(dateString));
}

function getBrowserName() {
var browserName = "";

var ua = navigator.userAgent.toLowerCase();
if ( ua.indexOf( "opera" ) != -1 ) {
browserName = "opera";
} else if ( ua.indexOf( "msie" ) != -1 ) {
browserName = "msie";
} else if ( ua.indexOf( "safari" ) != -1 ) {
browserName = "safari";
} else if ( ua.indexOf( "mozilla" ) != -1 ) {
if ( ua.indexOf( "firefox" ) != -1 ) {
browserName = "firefox";
} else {
browserName = "mozilla";
}
}

return browserName;
}; 

$(document)
    .ready(function() {
	       //this is for IE7
	       if(_.isUndefined(window.console)){
		   console = {log:function(){/*do nothing*/}};
	       }
	       doc_setup();
	   });