var ReportData ={};

function doc_setup() {
    
    //var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    //var db = 'install_yunbo';
    //var Company = couchDoc.extend({urlRoot:urlBase+db});
    
    var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 
		 "companyReport/":"companyReport",
		 "companyReport/groups" :"companyReport_groupsTable",
		 "companyReport/group/:group_id/stores" :"companyReport_storesTable",
		 "companyReport/store/:store_id/terminals" :"companyReport_terminalsTable",
		 "companyReport/stores" :"companyReport_storesTable",
		 "companyReport/terminals" :"companyReport_terminalsTable",
		 
		 "groupReport/":"groupReport",
		 "groupReport/stores":"groupReport_storesTable",
		 "groupReport/store/:store_id/terminals" :"groupReport_terminalsTable",
		 "groupReport/terminals":"groupReport_terminalsTable",
		 
		 "storeReport/":"storeReport",
		 "storeReport/terminals":"storeReport_terminalsTable"		 
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     
	     
	     companyReport:function(){
		 console.log("companyReport  ");
	     },
	     companyReport_groupsTable:function() {
	     	 console.log("companyReport : groupsTable  ");
	     },
	     companyReport_storesTable:function(group_id) {
	     	 console.log("companyReport : storesTable ");
	     },
	     companyReport_terminalsTable:function(store_id) {
	     	 console.log("companyReport : terminalsTable ");
	     },
	     
	     groupReport:function() {
	     	 console.log("groupReport ");
	     },
	     groupReport_storesTable:function() {
	     	 console.log("groupReport : storesTable ");
	     },
	     groupReport_terminalsTable:function(store_id) {
	     	 console.log("groupReport : terminalsTable ");
	     },
	     
	     storeReport:function() {
	     	 console.log("storeReport ");
	     },
	     storeReport_terminalsTable:function() {
	     	 console.log("storeReport : terminalsTable ");
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


    var companyReportView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderCompanyReport' , 'renderGroupsTable', 'renderStoresTable', 'renderTerminalsTable');
	     AppRouter.bind('route:companyReport', function(){
				console.log("companyReportView, route:companyReport");
				view.model = ReportData.company; 
				view.renderCompanyReport();
			    });
	     AppRouter.bind('route:companyReport_groupsTable', function(){
				console.log("companyReportView, route:companyReport_groupsTable");
				view.renderGroupsTable();						
			    });
	     AppRouter.bind('route:companyReport_storesTable', function(group_id){
				console.log("companyReportView, route:companyReport_storesTable");
				view.renderStoresTable(group_id);						
			    });
	     AppRouter.bind('route:companyReport_terminalsTable', function(store_id){
				console.log("companyReportView, route:companyReport_terminalsTable");
				view.renderTerminalsTable(store_id);						
			    });
	 },
	 renderCompanyReport: function() {
	     var view = this;
	     var company = view.model;
	     var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
	     var stores = _(groups).chain().map(function(group) {return group.stores}).flatten().value();
	     
	     var numGroups = _.size(groups);
	     var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	     var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfGroups:numGroups,
			   numberOfStores:numStores,
			   numberOfTerminals:numTerminals,
			   company_id:company._id,
			   startPage:"companyReport"
			  };
	     var html = ich.companyManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderCompanyReport");
	     return this;
	 },
	 renderGroupsTable: function() {
	     var view = this;
	     var company = ReportData.company;
	     var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
	     
	     var param = {list: _.map(groups, function(group) {
					  var operationalname = company.operationalname;
					  var groupName = group.groupName;
					  var numberOfStores = _.size(group.stores);
					  var numberOfTerminals = _.reduce(group.stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);;
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  groupName:groupName,
						  group_id:group.group_id,
						  numberOfStores:numberOfStores,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales,
						  startPage:"companyReport"};
				      })};
	     var html = ich.groupsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderGroupsTable");
	     return this;								
	 },
	 renderStoresTable: function(group_id) {
	     var view = this;
	     var company = ReportData.company;
	     var groups;
	     
	     if(_.isEmpty(group_id)){
		 groups = company.hierarchy.groups;
	     } else {
		 groups = _.filter(company.hierarchy.groups, function(group){ return group.group_id==group_id});
	     } 
	     
	     var stores = _(groups).chain().map(function(group) {
						    return _.map(group.stores, function(store){
								     return _.extend(store, {groupName:group.groupName, group_id:group.group_id});
								 }); 
						}).flatten().value();
	     
	     var param = {list: _.map(stores, function(store) {
					  var operationalname = company.operationalname;
					  var groupName = store.groupName;
					  var storeName = store.storeName;
					  var storeNumber = store.number;
					  var numberOfTerminals = _.size(store.terminals);
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  group_id:store.group_id,
						  groupName:groupName,
						  store_id:store.store_id,
						  storeName:storeName,
						  storeNumber:storeNumber,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales,
						  startPage:"companyReport"};
				      })};
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderStoresTable");
	     return this;								
	 },
	 renderTerminalsTable : function(store_id) {
	     var view = this;
	     var company = ReportData.company;
	     var groups;
	     var stores;
	     groups = company.hierarchy.groups;
	     /*if(_.isEmpty(group_id)){
	      groups = company.hierarchy.groups;
	      } else{
	      groups = _.filter(company.hierarchy.groups, function(group){ return group.group_id==group_id});
	      }*/
	     if(_.isEmpty(store_id)){
		 stores = _(groups).chain().map(function(group) {
						    return _.map(group.stores, function(store){
								     return _.extend(store, {groupName:group.groupName, group_id:group.group_id});
								 }); 
						}).flatten().value();
	     } else {
		 stores = _(groups).chain().map(function(group) {
						    return _.map(group.stores, function(store){
								     return _.extend(store, {groupName:group.groupName, group_id:group.group_id});
								 }); 
						}).flatten().filter(function(store){return store.store_id==store_id}).value();
	     }
	     var terminals = _(stores).chain().map(function(store){
						       return _.map(store.terminals, function(terminal){
									return _.extend(terminal, {groupName:store.groupName, group_id:store.group_id, storeName:store.storeName, storeNumber:store.number, store_id:store.store_id})
								    });	
						   }).flatten().value();
	     var param = {list: _.map(terminals, function(terminal) {
					  var operationalname = company.operationalname;
					  var groupName = terminal.groupName;
					  var storeName = terminal.storeName;
					  var storeNumber = terminal.storeNumber;
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  group_id:terminal.group_id,
						  groupName:groupName,
						  store_id:terminal.store_id,
						  storeName:storeName,
						  storeNumber:storeNumber,
						  terminalName:terminal.terminal_label,
						  sales:sales,
						  startPage:"companyReport"};
				      })};
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderTerminalsTable");
	     return this;
	 }
	});
    
    var groupReportView = Backbone.View.extend(
    	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderGroupReport', 'renderStoresTable', 'renderTerminalsTable');
	     AppRouter.bind('route:groupReport', function(){
				console.log("groupReportView, route:groupReport : company name : "+ ReportData.companyName);
				view.model = ReportData.group; //new Company({_id:company_id});
				view.renderGroupReport();
			    });
	     AppRouter.bind('route:groupReport_storesTable', function(){
				console.log("groupReportView, route:groupReport_storesTable : company name : "+ ReportData.companyName);
				view.model = ReportData.group; //new Company({_id:company_id});
				view.renderStoresTable();
			    });
	     AppRouter.bind('route:groupReport_terminalsTable', function(store_id) {
				console.log("groupReportView, route:groupReport_storesTable: company name : " +ReportData.companyName);
				view.model = ReportData.group; //new Company({_id:company_id});
				view.renderTerminalsTable(store_id);
			    });
	 },
	 renderGroupReport: function() {
	     var view = this;
	     //var company = view.model;
	     //var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
	     var group = ReportData.group; //_.find(groups, function(group){return group.group_id==group_id})
	     var stores = group.stores;//_(groups).chain().map(function(group) {return group.stores}).flatten().value();
	     
	     var numStores = _.size(stores);//_.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	     var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfStores:numStores,
			   numberOfTerminals:numTerminals,
			   //company_id:company._id,
			   //group_id:group_id
			   startPage:"groupReport"
			  };
	     var html = ich.groupManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderGroupReport");
	     return this;
	 },
	 renderStoresTable : function() {
	     var view = this;
	     var group = ReportData.group;
	     var stores = group.stores;
	     var param = {list: _.map(stores, function(store) {
					  var operationalname = ReportData.companyName;
					  var groupName = group.groupName;
					  var storeName = store.storeName;
					  var storeNumber = store.number;
					  var numberOfTerminals = _.size(store.terminals);
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  //group_id:store.group_id,
						  groupName:groupName,
						  store_id:store.store_id,
						  storeName:storeName,
						  storeNumber:storeNumber,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales,
						  startPage:"groupReport"};
				      })};
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderStoresTable");
	     return this;
	 },
	 renderTerminalsTable:function(store_id) {
	     var view = this;
	     var group = ReportData.group;
	     var stores;
	     if(_.isEmpty(store_id)){
		 stores = group.stores;
	     } else {
		 stores = _.filter(group.stores, function(store){return store.store_id ==store_id});
	     }
	     var terminals = _(stores).chain().map(function(store){
						       return _.map(store.terminals, function(terminal){
									return _.extend(terminal, {groupName:group.groupName, group_id:group.group_id, storeName:store.storeName, storeNumber:store.number, store_id:store.store_id})
								    });	
						   }).flatten().value();
	     var param = {list: _.map(terminals, function(terminal) {
					  var operationalname = ReportData.companyName;
					  var groupName = terminal.groupName;
					  var storeName = terminal.storeName;
					  var storeNumber = terminal.storeNumber;
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  group_id:terminal.group_id,
						  groupName:groupName,
						  store_id:terminal.store_id,
						  storeName:storeName,
						  storeNumber:storeNumber,
						  terminalName:terminal.terminal_label,
						  sales:sales,
						  startPage:"groupReport"};
				      })};
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderTerminalsTable");
	     return this;
	 }
	 
	});
    
    var storeReportView = Backbone.View.extend(
    	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderStoreReport', 'renderTerminalsTable');
	     AppRouter.bind('route:storeReport', function(){
				console.log("storeReportView, route:storeReport : companyname : " + ReportData.companyName + ", groupname : " + ReportData.groupName );
				view.model = ReportData.store; //new Company({_id:company_id});
				view.renderStoreReport();
			    });
	     AppRouter.bind('route:storeReport_terminalsTable', function(){
				console.log("storeReportView, route:storeReport_terminalsTable : companyname : " + ReportData.companyName + ", groupname : " + ReportData.groupName );
				view.model = ReportData.store; //new Company({_id:company_id});
				view.renderTerminalsTable();
			    });
	 },
	 renderStoreReport: function() {
	     var view = this;
	     
	     var store = ReportData.store;
	     var terminals = store.terminals;
	     var numTerminals = _.size(terminals);//_.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfTerminals:numTerminals,
			   startPage:"storeReport"
			  };
	     var html = ich.storeManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("storeReportView renderStoreReport");
	     return this;
	 },
	 renderTerminalsTable: function() {
	     var view = this;
	     var store = ReportData.store;	
	     
	     var terminals = store.terminals;
	     var param = {list: _.map(terminals, function(terminal) {
					  var operationalname = ReportData.companyName;
					  var groupName = ReportData.groupName;
					  var storeName = store.storeName;
					  var storeNumber = store.number;
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  groupName:groupName,
						  store_id:store.store_id,
						  storeName:storeName,
						  storeNumber:storeNumber,
						  terminalName:terminal.terminal_label,
						  sales:sales,
						  startPage:"groupReport"};
				      })};
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("storeReportView renderTerminalsTable");
	     return this;
	 }
	 
	});

    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
    var GroupReportDisplay = new groupReportView();
    var StoreReportDisplay = new storeReportView();
    Backbone.history.start();

}

function login() {
    var $form = $("#ids_form");
    var formEntries = varFormGrabber($form);
    console.log("form entries");
    console.log(formEntries);
    var login_key = _(formEntries).chain()
	.kv()
	.reject(_.isLastEmpty)
	.toObject()
	.value();
    console.log("login_key");
    console.log(login_key);
    
    var db_install = db("install_yunbo");
    var user_passwordView = appView("user_pass");
    var branch_show = appShow("branch");

    keyQuery(login_key, user_passwordView, db_install)
    (function (resp){
	 console.log("view resp");
	 console.log(resp);
	 //todo: include {data:{:group,:store}} in the arg where the success function is
	 if(!_.isEmpty(resp.rows)) {
	     db_install.show(branch_show,
			     _.first(resp.rows).id,
			     {data : _.first(resp.rows).value,
			      success:function(data){
				  var startpge ="";
				  if(!_.isEmpty(data.operationalname)) {
				      startpge = "#companyReport/";
				      ReportData = {company:data};
				      console.log("data"); console.log(ReportData);
				  } else if(!_.isEmpty(data.groupName)) {
				      startpge = "#groupReport/";
				      ReportData = {group:data, companyName:login_key.company};
				      console.log("data"); console.log(ReportData);
				  } else if(!_.isEmpty(data.storeName)) {
				      startpge = "#storeReport/";
				      ReportData = {store:data, companyName:login_key.company, groupName:login_key.group};
				      console.log("data"); console.log(ReportData);
				  }
				  window.location.href=startpge;
			      }});
	 } else {
	     alert("wrong login info.");
	 }
     });
    
}
