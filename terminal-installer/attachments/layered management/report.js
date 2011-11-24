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
		 "companyReport/:_id/groups" :"companyReport_groupsTable",
		 "companyReport/:_id/:group_id/stores" :"companyReport_storesTable",
		 
		 "groupReport/:_id/:group_id":"groupReport",
		 
		 "storeReport/:_id/:group_id/:store_id":"storeReport"
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     
	     
	     companyReport:function(id){
		 console.log("companyReport : " + id);
	     },
	     companyReport_groupsTable:function(id) {
	     	console.log("companyReport : groupsTable : " + id);
	     },
	     companyReport_storesTable:function(id) {
	     	console.log("companyReport : storesTable : " + id);
	     },
	     
	     
	     groupReport:function(company_id, group_id) {
	     	console.log("groupReport : company_id : " + company_id + ", group_id : " + group_id);
	     },
	     
	     
	     storeReport:function(company_id, group_id, store_id) {
	     	console.log("storeReport : company_id : " + company_id + ", group_id : " + group_id + ", store_id : " + store_id);
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
		_.bindAll(view, 'renderCompanyReport' , 'renderGroupsTable', 'renderStoresTable');
		AppRouter.bind('route:companyReport', function(id){
			console.log("companyReportView, route:companyReport");
			view.model = new Company({_id:id});
			view.model.fetch({error:function(a,b,c){
					      console.log("couldn't load model");
					  },
					  success:function(a,b,c){
					  	console.log("fetch model success");
					  	view.renderCompanyReport();
					  }});
		});
		AppRouter.bind('route:companyReport_groupsTable', function(id){
			console.log("companyReportView, route:companyReport_groupsTable");
			view.renderGroupsTable();						
		});
		AppRouter.bind('route:companyReport_storesTable', function(id){
			console.log("companyReportView, route:companyReport_storesTable");
			view.renderStoresTable();						
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
							 numberOfTerminals:numTerminals,
							 company_id:company._id
							};
		var html = ich.companyManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderCompanyReport");
	     return this;
	},
	renderGroupsTable: function() {
		var view = this;
		var company = view.model.toJSON();
		var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
		
		var param = {list: _.map(groups, function(group) {
															var operationalname = company.operationalname;
															var groupName = group.groupName;
															var numberOfStores = _.size(group.stores);
															var numberOfTerminals = _.reduce(group.stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);;
															var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
															return {operationalname:operationalname,
																groupName:groupName,
																numberOfStores:numberOfStores,
																numberOfTerminals:numberOfTerminals,
																sales:sales};
														})};
		var html = ich.groupsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderGroupsTable");
	     return this;								
	},
	renderStoresTable: function() {
		var view = this;
		var company = view.model.toJSON();
		var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
		var stores = _(groups).chain().map(function(group) {return {stores:group.stores, groupName:group.groupName}}).flatten().value();
		
		var param = {list: _.map(stores, function(store) {
															var operationalname = company.operationalname;
															var groupName = store.groupName;
															var storeName = store.storeName;
															var storNumber = store.number;
															var numberOfTerminals = _.size(store.terminals);
															var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
															return {operationalname:operationalname,
																groupName:groupName,
																storeName:storeName,
																storeNumber:storeNumber,
																numberOfTerminals:numberOfTerminals,
																sales:sales};
														})};
		var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderStoresTable");
	     return this;								
	}
	});
	var groupReportView = Backbone.View.extend({initialize:function(){
		var view = this;
		_.bindAll(view, 'renderGroupReport');
		AppRouter.bind('route:groupReport', function(company_id, group_id){
			console.log("groupReportView, route:groupReport : company_id : " + company_id + ", group_id : " + group_id);
			//view.el= _.first($("main"));
			view.model = new Company({_id:company_id});
			//view.model.bind('change',function(){view.renderModifyPage(upc);});
			//view.model.bind('not_found',function(){view.renderAddPage(upc);});
			view.model.fetch({error:function(a,b,c){
					      console.log("couldn't load model");
					      //view.model.trigger('not_found');
					  },
					  success:function(a,b,c){
					  	console.log("fetch model success");
					  	view.renderGroupReport(group_id);
					  }});
		});
	},
	renderGroupReport: function(group_id) {
		var view = this;
		var company = view.model.toJSON();
		var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
		var group = _.find(groups, function(group){return group.group_id==group_id})
		var stores = group.stores;//_(groups).chain().map(function(group) {return group.stores}).flatten().value();
		
		var numStores = _.size(stores);//_.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
		var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
		var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
							 numberOfStores:numStores,
							 numberOfTerminals:numTerminals,
							 company_id:company._id,
							 group_id:group_id
							};
		var html = ich.groupManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderGroupReport");
	     return this;
	}
	
	});
	
	var storeReportView = Backbone.View.extend({initialize:function(){
		var view = this;
		_.bindAll(view, 'renderStoreReport');
		AppRouter.bind('route:storeReport', function(company_id, group_id, store_id){
			console.log("storeReportView, route:storeReport : company_id : " + company_id + ", group_id : " + group_id + ", store_id : " + store_id);
			view.model = new Company({_id:company_id});
			view.model.fetch({error:function(a,b,c){
					      console.log("couldn't load model");
					  },
					  success:function(a,b,c){
					  	console.log("fetch model success");
					  	view.renderStoreReport(group_id, store_id);
					  }});
		});
	},
	renderStoreReport: function(group_id, store_id) {
		var view = this;
		var company = view.model.toJSON();
		var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
		var group = _.find(groups, function(group){return group.group_id==group_id})
		var stores = group.stores;//_(groups).chain().map(function(group) {return group.stores}).flatten().value();
		var store = _.find(stores, function(store){return store.store_id==store_id});
		var terminals = store.terminals;
		var numTerminals = _.size(terminals);//_.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
		var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
							 numberOfTerminals:numTerminals,
							 company_id:company._id,
							 group_id:group_id,
							 store_id:store_id
							};
		var html = ich.storeManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("storeReportView renderStoreReport");
	     return this;
	}
	
	});

    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
    var GroupReportDisplay = new groupReportView();
    var StoreReportDisplay = new storeReportView();
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
			     												if(!_.isEmpty(resp.rows)) {
			     													var tmp = resp.rows[0].value;
			     													console.log(tmp);
			     													var temp = "";
			     													var r ="";
			     													if(!_.isEmpty(tmp.company)) {
			     														temp = temp.concat(tmp.company);
			     														r = "#companyReport/";
			     													}
			     													if(!_.isEmpty(tmp.group)) {
			     														temp = temp.concat("/"+tmp.group);
			     														r = "#groupReport/";
			     													}
			     													if(!_.isEmpty(tmp.store)) {
			     														temp = temp.concat("/"+tmp.store);
			     														r= "#storeReport/"
			     													}
			     													console.log(r+temp);
			     													//var par = $.param(tmp);
			     													//window.location.href='../layered management/report.html?'+par;
			     													//$.post("../layered management/report.html", 
			     													//				tmp, 
			     													//				function(){console.log("aaa");}
			     													//				,"json");*/
			     													//TODO: after login
			     													window.location.href=r+temp;
			     												} else {
			     													alert("wrong login info. tyr again");
			     												}
		     												});
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