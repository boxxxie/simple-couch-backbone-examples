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

function closeWindow() {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");
    alert("This will close the window");
    window.open('','_self');
    window.close();
}

function getDate() {
    var ts = $("#timespace");
    $(document).everyTime("1s", function(){
			      var date = new Date();
			      ts.empty();
			      ts.append(date.toDateString() + " / " + date.toLocaleTimeString());
			  }, 0);
    
}

function showMsg() {
    alert("Sorry, we're working on this menu");  
};

function logout() {
    $.couch.logout();  
};

function doc_setup() {
    $.couch.session({
            success:function(resp){
                var userCtx = resp.userCtx;
                if(userCtx.name!=null) {
                var ts = $("#timespace");
                $(document)
                    .everyTime("1s",
                           function() {
                           var date = new Date();
                           ts.empty();
                           ts.append(date.toDateString() + " / " + date.toLocaleTimeString());
                           }, 0);
                var html = ich.mainMenu_TMP();
                $("#main").html(html);
                getDate();
                } 
            }              
            });
};


$(document)
    .ready(function() {
	       //this is for IE7
	       if(_.isUndefined(window.console)){
		   console = {log:function(){/*do nothing*/}};
	       }
	       doc_setup();
	   });

