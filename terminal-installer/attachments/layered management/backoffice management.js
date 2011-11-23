function doc_setup() {
    console.log("doc setup invoked");
    var html = ich.layerLogin_TMP();
    $("body").html(html);
}

function jsPather(pathStr){
    //converts js obj notation into a path array
    return pathStr
	.replace(/\[/g,'.')
	.replace(/\]/g,'')
	.split(".");
};

function assignFromPath(obj,travel,assignVal){
    var prop = _.first(travel);
    //walks a path defined by an array of fields, assigns a value to the last field walked
    //creates a path if one does not exist
    if(_.isEmpty(travel)){
	obj = assignVal;
	return obj;
    }
    else if(obj && !obj[prop]){
	obj[prop] = {};
    }
    if(!obj){return null;}
    obj[prop] = assignFromPath(obj[prop],_.rest(travel),assignVal);
    return obj; 
};

function login() {
    var d = $("#ids_form");
    var allFields = d.find('[var]');
    var ids = {};
    _(allFields).chain()
<<<<<<< HEAD
	.map(function(el) {
		 var $el = $(el);
		 if($el.is(':checkbox')){
		     return [jsPather($el.attr('var')),$el.is(':checked')];
		 }
		 return [jsPather($el.attr('var')),$el.val()];
	     })
	.each(function(keyVal){
		  ids = assignFromPath(ids,_.first(keyVal),_.last(keyVal));
	      });
    var key = _(ids).chain()
	.kv()
	.reject(function(t){
		    return _.isEmpty(_.last(t));
		})
	.toObject()
	.value();
    
    var db_install = db("install");
    var user_passwordView = appView("user_pass");
    keyQuery(key, user_passwordView, db_install)(function(data){
						     if(_.isEmpty(data.rows)){
							 alert("you entered an invalid username or password");
						     }
						     else{
							 console.log(_.first(data.rows));
						     }
						 });
    
=======
			.map(function(el) {
			 var $el = $(el);
			 if($el.is(':checkbox')){
			     return [jsPather($el.attr('var')),$el.is(':checked')];
			 }
			 return [jsPather($el.attr('var')),$el.val()];
		     })
		    .each(function(keyVal){
			 ids = assignFromPath(ids,_.first(keyVal),_.last(keyVal));
		     });
		     console.log(ids);
		     var key = _(ids).chain().kv().reject(function(t){return _.isEmpty(_.last(t))}).toObject().value();
		     console.log(key);
		     
		     var db_install = db("install_yunbo");
		     var user_passwordView = appView("user_pass");
		     //var value =
		     keyQuery(key, user_passwordView, db_install)(function (resp){/*return resp;*//*value=resp;*/ 
			     												if(resp.rows.length>0) {
			     													var tmp = resp.rows[0].value;
			     													console.log(tmp);
			     													var temp = "";
			     													if(!_.isEmpty(tmp.company)) {
			     														temp = temp.concat("company="+tmp.company);
			     													}
			     													if(!_.isEmpty(tmp.group)) {
			     														temp = temp.concat("&group="+tmp.group);
			     													}
			     													if(!_.isEmpty(tmp.store)) {
			     														temp = temp.concat("&store="+tmp.store);
			     													}
			     													var par = $.param(tmp);
			     													window.location.href='../layered management/report.html?'+par;
			     													//$.post("../layered management/report.html", 
			     													//				tmp, 
			     													//				function(){console.log("aaa");}
			     													//				,"json");
			     												}
		     												});
		     
//TODO: delay??		     
		     //if(value.rows.length>0) {
		     //	console.log(value.rows[0].value);	
		     //}
		     		     
>>>>>>> ff1402166a51b6c4796c670021376950288a0c3a
}
