function doc_setup() {
	//var html = ich.layerLogin_TMP();
	//$("body").html(html);
	var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 "company/:company":"companyReportManagementHome",
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     companyReportManagementHome:function(){
		 console.log("companyReportManagement");
	     }
	 }));
	 
	 var ReportView = Backbone.View.extend(
	 {initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderLoginPage');
	     AppRouter.bind('route:reportLogin', function(){
				console.log('reportLoginView:route:reportLogin');
				view.el= _.first($("ids_form"));
				view.renderLoginPage();});
	     /*AppRouter.bind('route:addmodifyInventory', function(upc){
				upc = _.unEscape(upc);
				//fetch model based on upc code
				view.model = new InventoryItem({_id:upc});
				view.model.bind('change',function(){view.renderModifyPage(upc);});
				view.model.bind('not_found',function(){view.renderAddPage(upc);});
				view.model.fetch({error:function(a,b,c){
						      console.log("couldn't load model");
						      view.model.trigger('not_found');
						  }});
				console.log('InventoryView:route:modifyInventory');});
		*/
	     
	 },
	 renderLoginPage:function(){
	     var view = this;
	     //if(view.model){
		 //$(this.el).html("");
	     //}
	     //$("#upc").focus();
	     console.log("reportview renderLoginPage");
	     return this;
	 }/*,
	 renderModifyPage:function(upc){
	     var view = this;
	     var html = ich.inventoryViewPage_TMP(_.extend({upc:upc},view.model.toJSON()));
	     $(html).find('input').attr('disabled',true);
	     $(this.el).html(html);
	     $("#dialog-hook").html(ich.inventoryInputDialog_TMP(_.extend({title:"Edit "+upc+" Information"},view.model.toJSON())));
	     InventoryItemModifyDialog("edit-thing",editItem(view.model));
	     console.log("InventoryView renderModifyPage " + upc);
	     $("#upc").focus();
	     return this;
	 },
	 renderAddPage:function(upc){
	     var view = this;
	     var html = ich.inventoryAddPage_TMP({createButtonLabel:"add (" + upc + ") to the Inventory",upc:upc });
	     $(this.el).html(html);
	     $("#dialog-hook").html(ich.inventoryInputDialog_TMP({title:"Add "+upc+" to the Inventory",_id:upc,location:{},apply_taxes:{},price:{}}));
	     InventoryItemCreateDialog("create-thing",addItem(view.model));
	     $("#upc").focus();
	     console.log("InventoryView renderAddPage " + upc);
	     return this;
	 }*/
	});

    var ReportDisplay = new ReportView();
    Backbone.history.start();

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
		     		     
}


function getUrlVars() {
    var vars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    hash = hashes[0].split('=');
    if(hash[0]=="company") {
    	_.extend(vars, {company:hash[1]});
    }
    if(!_.isEmpty(hashes[1])) {
    	hash = hashes[1].split('=');
    	_.extend(vars, {group:hash[1]});
    }
    if(!_.isEmpty(hashes[2])) {
    	hash = hashes[2].split('=');
    	_.extend(vars, {store:hash[1]});
    }
    console.log(vars);
    return vars;
}