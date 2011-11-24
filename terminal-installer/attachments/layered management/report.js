var ReportData ={};

function doc_setup() {
    
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = 'install_yunbo';
    var Company = couchDoc.extend({urlRoot:urlBase+db});
    
    var AppRouter = new 

    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 
		 "companyReport/":"companyReport",
		 "companyReport/groups" :"companyReport_groupsTable",
		 "companyReport/group/:group_id/stores" :"companyReport_storesTable",
		 "companyReport/groups/stores" :"companyReport_storesTable",
		 
		 "groupReport/":"groupReport",
		 
		 "storeReport/":"storeReport"
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
	     companyReport_storesTable:function() {
	     	 console.log("companyReport : storesTable ");
	     },
	     
	     
	     groupReport:function() {
	     	 console.log("groupReport ");
	     },
	     
	     
	     storeReport:function() {
	     	 console.log("storeReport ");
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
	     _.bindAll(view, 'renderCompanyReport' , 'renderGroupsTable', 'renderStoresTable');
	     AppRouter.bind('route:companyReport', function(){
				console.log("companyReportView, route:companyReport");
				view.model = ReportData; 
				view.renderCompanyReport();
			    });
	     AppRouter.bind('route:companyReport_groupsTable', function(){
				console.log("companyReportView, route:companyReport_groupsTable");
				view.renderGroupsTable();						
			    });
	     AppRouter.bind('route:companyReport_storesTable', function(){
				console.log("companyReportView, route:companyReport_storesTable");
				view.renderStoresTable();						
			    });
	 },
	 renderCompanyReport: function() {
	     var view = this;
	     var company = ReportData;
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
	     
	     var param = 
		 {list: _.map(groups, function(group) {
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
	     var groups = company.hierarchy.groups;
	     var stores = _(groups).chain()
		 .map(function(group) {return {stores:group.stores, groupName:group.groupName};})
		 .flatten()
		 .value();
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
    var groupReportView = 
	Backbone.View.extend(
	    {initialize:function(){
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
		 var groups = company.hierarchy.groups; 
		 var group = _.find(groups, function(group){return group.group_id==group_id;});
		 var stores = group.stores;
		 
		 var numStores = _.size(stores);
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
    
    var storeReportView = 
	Backbone.View.extend(
	    {initialize:function(){
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
		 var groups = company.hierarchy.groups; 
		 var group = _.find(groups, function(group){return group.group_id==group_id;});
		 var stores = group.stores;
		 var store = _.find(stores, function(store){return store.store_id==store_id;});
		 var terminals = store.terminals;
		 var numTerminals = _.size(terminals);
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
    (function (view_resp){
	 console.log("view resp");
	 console.log(view_resp);
	 db_install.show(branch_show,
			 _.first(view_resp.rows).id,
			 {data : _.first(view_resp.rows).value,
			  success:function(data){
			      if(!_.isEmpty(data.operationalname)) {
				  window.location.href="#companyReport/";
			      } else if(!_.isEmpty(data.groupName)) {
			 	  window.location.href = "#groupReport/";
			      } else if(!_.isEmpty(data.storeName)) {
			 	  window.location.href = "#storeReport/";
			      }else{//login failed}
			      }});
			});
     
    }
