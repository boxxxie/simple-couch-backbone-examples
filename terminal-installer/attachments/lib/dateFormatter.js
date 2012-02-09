var date = {
    toArray : { until : { day : function(date){return _.first(date.toArray(),3);}}}
  
};

var date_array = {
        inc_day :  function (dateArray){
        var dateToInc = new Date(dateArray.join("/"));
        dateToInc.addDays(1);
        return date.toArray.until.day(dateToInc);
    }  
};

function jodaDateParser(dateString){
    if(_.isDate(dateString)){return dateString;}
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
function timePartFormatter(date){
    return date.toString("HH:mm:ss");
}

function jodaDateFormatter(dateString){
    return dateFormatter(jodaDateParser(dateString));
}
function jodaDatePartFormatter(dateString){
    return datePartFormatter(jodaDateParser(dateString));
}
function jodaTimePartFormatter(dateString){
    return timePartFormatter(jodaDateParser(dateString));
}