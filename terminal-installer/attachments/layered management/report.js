function doc_setup() {
	
	var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = 'install_yunbo';
    var Company = couchDoc.extend({urlRoot:urlBase+db});
    
	var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 "companyReport/:_id":"companyReport",
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     companyReport:function(id){
		 console.log("companyReport");
	     }
	 }));
	 
	 var reportLoginView = Backbone.View.extend(
	 {initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderLoginPage');
	     AppRouter.bind('route:reportLogin', function(){
				console.log('reportLoginView:route:reportLogin');
				view.el= _.first($("ids_form"));
				view.renderLoginPage();});
	     
	 },
	 renderLoginPage:function(){
	     var view = this;
	     console.log("reportview renderLoginPage");
	     return this;
	    }
	});


//TODO
	var companyReportView = Backbone.View.extend(
	{initialize:function(){
		var view = this;
		_.bindAll(view, 'renderCompanyReport');
		AppRouter.bind('route:companyReport', function(id){
			console.log("companyReportView, route:companyReport");
			//view.el= _.first($("main"));
			view.model = new Company({_id:id});
			//view.model.bind('change',function(){view.renderModifyPage(upc);});
			//view.model.bind('not_found',function(){view.renderAddPage(upc);});
			console.log("new company");
			view.model.fetch({error:function(a,b,c){
					      console.log("couldn't load model");
					      //view.model.trigger('not_found');
					  }});
			console.log("fetch");
			view.renderCompanyReport();			
		});
	},
	renderCompanyReport: function() {
		var view = this;
		var company = view.model.toJSON();
		var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
		var stores = _(groups).chain().map(function(group) {return group.stores}).flatten().value();
		
		var numGroups = _.size(groups);
		var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
		var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
		var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
							 numberOfGroups:numGroups,
							 numberOfStores:numStores,
							 numberOfTerminals:numTerminals
							};
		console.log("param");
		var html = ich.companyManagementPage_TMP(param);
		console.log("html");
	     $("body").html(html);
	     console.log("companyReportView renderCompanyReport");
	     return this;
	}
	
	});
	var groupManagementView = Backbone.View.extend();
	var storeManagementView = Backbone.View.extend();

    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
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
			     													/*var tmp = resp.rows[0].value;
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
			     													//				,"json");*/
			     													//TODO: after login
			     													window.location.href='#companyReport/'+resp.rows[0].value.company;
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