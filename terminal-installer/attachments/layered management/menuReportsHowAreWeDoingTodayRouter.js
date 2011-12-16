
/*************************************** company level : How Are We Doing Today ******************************/
var menuReportsHowAreWeDoingTodayCompanyRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportHowAreWe" :"HowAreWeCompany_groupsTable",
		  "menuReports/companyReportHowAreWe/group/:group_id/stores" :"HowAreWeCompany_storesTable",
		  "menuReports/companyReportHowAreWe/store/:store_id/terminals" :"HowAreWeCompany_terminalsTable",
		  "menuReports/companyReportHowAreWe/stores" :"HowAreWeCompany_storesTable",
		  "menuReports/companyReportHowAreWe/terminals" :"HowAreWeCompany_terminalsTable"
	      },

	      HowAreWeCompany_groupsTable:function() {
	     	  console.log("HowAreWeCompany_groupsTable");
	      },
	      HowAreWeCompany_storesTable:function(group_id) {
	     	  console.log("HowAreWeCompany_storesTable");
	      },
	      HowAreWeCompany_terminalsTable:function(store_id) {
	     	  console.log("HowAreWeCompany_terminalsTable");
	      }}));


var companyReportHowAreWeTodayView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderGroupsTable_HowAreWeToday', 
		       'renderStoresTable_HowAreWeToday', 
		       'renderTerminalsTable_HowAreWeToday');

	     menuReportsHowAreWeDoingTodayCompanyRouter
		 .bind('route:HowAreWeCompany_groupsTable', 
		       function(){
			   console.log("HowAreWeCompany_groupsTable");
			   view.renderGroupsTable_HowAreWeToday();						
		       });

	     menuReportsHowAreWeDoingTodayCompanyRouter
		 .bind('route:HowAreWeCompany_storesTable', 
		       function(group_id){
			   console.log("HowAreWeCompany_storesTable");
			   view.renderStoresTable_HowAreWeToday(group_id);						
		       });

	     menuReportsHowAreWeDoingTodayCompanyRouter
		 .bind('route:HowAreWeCompany_terminalsTable', 
		       function(store_id){
			   console.log("HowAreWeCompany_storesTable");
			   view.renderTerminalsTable_HowAreWeToday(store_id);						
		       });
	 },
	 renderGroupsTable_HowAreWeToday: function() {
	     renderHowAreWeGroupsTable(this, "companyReport");
	 },
	 renderStoresTable_HowAreWeToday: function(id) {
	     renderHowAreWeStoresTable(this, "companyReport", id);	     
	 },
	 renderTerminalsTable_HowAreWeToday : function(id) {
	     renderHowAreWeTerminalsTable(this,"companyReport",id);
	 }
	});



/*************************************** group level : How Are We Doing Today ******************************/
var menuReportsHowAreWeDoingTodayGroupRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/groupReportHowAreWe":"HowAreWeGroup_storesTable",
		  "menuReports/groupReportHowAreWe/store/:store_id/terminals" :"HowAreWeGroup_terminalsTable",
		  "menuReports/groupReportHowAreWe/terminals":"HowAreWeGroup_terminalsTable"
	      },
	      HowAreWeGroup_storesTable:function(group_id) {
	     	  console.log("HowAreWeGroup_storesTable");
	      },
	      HowAreWeGroup_terminalsTable:function(store_id) {
	     	  console.log("HowAreWeGroup_terminalsTable");
	      }}));

var groupReportHowAreWeTodayView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderStoresTable_HowAreWeToday', 
		       'renderTerminalsTable_HowAreWeToday');

	     menuReportsHowAreWeDoingTodayGroupRouter
		 .bind('route:HowAreWeGroup_storesTable', 
		       function(group_id){
			   console.log("HowAreWeCompany_storesTable");
			   view.renderStoresTable_HowAreWeToday(group_id);						
		       });

	     menuReportsHowAreWeDoingTodayGroupRouter
		 .bind('route:HowAreWeGroup_terminalsTable', 
		       function(store_id){
			   console.log("HowAreWeCompany_storesTable");
			   view.renderTerminalsTable_HowAreWeToday(store_id);						
		       });
	 },
	 renderStoresTable_HowAreWeToday: function(id) {
	     renderHowAreWeStoresTable(this, "groupReport", id);	     
	 },
	 renderTerminalsTable_HowAreWeToday : function(id) {
	     renderHowAreWeTerminalsTable(this,"groupReport",id);
	 }
	});


/*************************************** store level : How Are We Doing Today ******************************/
var menuReportsHowAreWeDoingTodayStoreRouter = 
    new (Backbone.Router.extend(
	     {
		 routes: {
		     "menuReports/storeReportHowAreWe":"HowAreWeStore_terminalsTable"		 
		 },
		 HowAreWeStore_terminalsTable:function(store_id) {
	     	     console.log("HowAreWeStore_terminalsTable");
		 }
	     }));

var storeReportHowAreWeTodayView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderTerminalsTable_HowAreWeToday');

	     menuReportsHowAreWeDoingTodayStoreRouter
		 .bind('route:HowAreWeStore_terminalsTable', 
		       function(store_id){
			   console.log("HowAreWeCompany_storesTable");
			   view.renderTerminalsTable_HowAreWeToday(store_id);						
		       });
	 },
	 renderTerminalsTable_HowAreWeToday : function(id) {
	     renderHowAreWeTerminalsTable(this,"storeReport",id);
	 }
	});
	

/********************************************* helper functions *******************************************/
	
function renderHowAreWeGroupsTable(view, startPage) {
	var groups = ReportData.company.hierarchy.groups;
    var newGroups = _(_.clone(groups)).map(function(group){ return {id:group.group_id, name:group.groupName}});
    var parent_id = {id:ReportData.company._id, name:ReportData.company.companyName};
    howAreWeDoingTodayReportFetcher(newGroups,parent_id,function(for_TMP){
					for_TMP = _.applyToValues(for_TMP,toFixed(2),true);
					var param = _.extend(for_TMP, {
								 startPage:startPage,
								 breadCrumb : breadCrumb(ReportData.company.companyName)
							     });
					_.map(param.items, function(item) {
						  return _.extend(item,{linkaddress:"#menuReports/".concat(startPage)
									.concat("HowAreWe/group/")
									.concat(item.id)
									.concat("/stores")
								       });
					      });
					var html = ich.generalTabel_HowAreWeToday_TMP(_.extend(param,{namefield:"Group"}));
					$(view.el).html(html);
				    });
};

function renderHowAreWeStoresTable(view, startPage, group_id) {
    var stores;
    var parent_id;
    var breadcrumb;
    
    if(_.isEmpty(group_id)) {
	parent_id = {id:ReportData.group.group_id, name:ReportData.group.groupName};
	stores = ReportData.group.stores;
	breadcrumb = breadCrumb(ReportData.companyName,ReportData.group.groupName); 
    } else {
	var group = _.find(ReportData.company.hierarchy.groups, function(group){return group.group_id==group_id});
	parent_id = {id:group.group_id, name:group.groupName};
	stores = group.stores;
	breadcrumb = breadCrumb(ReportData.company.companyName,group.groupName); 
    }
    
    var newStores = _(_.clone(stores)).map(function(store){ return {id:store.store_id, name:store.storeName+ "(" + store.number +")"};});
    
    
    howAreWeDoingTodayReportFetcher(newStores,parent_id,function(for_TMP){
					for_TMP = _.applyToValues(for_TMP,toFixed(2),true);
					var param = _.extend(for_TMP, {
								 startPage:startPage,
								 breadCrumb : breadcrumb
							     });
					
					_.map(param.items, function(item) {
						  return _.extend(item,{linkaddress:"#menuReports/".concat(startPage)
									.concat("HowAreWe/store/")
									.concat(item.id)
									.concat("/terminals")
								       });
					      });
					
					var html = ich.generalTabel_HowAreWeToday_TMP(_.extend(param,{namefield:"Store"}));
					$(view.el).html(html);
				    });
};

function renderHowAreWeTerminalsTable(view, startPage, store_id) {
    var terminals;
    var parent_id;
    var breadcrumb;
    
    if(_.isEmpty(store_id)) {
	parent_id = {id:ReportData.store.store_id, name:ReportData.store.storeName};
	terminals = ReportData.store.terminals;
	breadcrumb = breadCrumb(ReportData.companyName,ReportData.groupName,ReportData.store.storeName); 
    } else {
	if(!_.isEmpty(ReportData.company)) {
	    var groups = ReportData.company.hierarchy.groups;
	    var group = _.find(groups, function(group){ 
				   return !_.isEmpty(_.find(group.stores, function(store){
								return store.store_id==store_id;
							    }));});
	    
	    var stores = group.stores;
	    var store = _.find(stores, function(store){return store.store_id==store_id;});
	    parent_id = {id:store.store_id, name:store.storeName};
	    terminals = store.terminals;
	    breadcrumb = breadCrumb(ReportData.company.companyName,group.groupName,store.storeName); 
	} else if(!_.isEmpty(ReportData.group)) {
	    var stores = ReportData.group.stores;
	    var store = _.find(stores, function(store){return store.store_id==store_id});
	    parent_id = {id:store.store_id, name:store.storeName};
	    terminals = store.terminals;
	    breadcrumb = breadCrumb(ReportData.companyName,ReportData.group.groupName,store.storeName); 
	}
    }
    
    var newTerminals = _(_.clone(terminals)).map(function(terminal){ return {id:terminal.terminal_id, name:terminal.terminal_label};});
    
    howAreWeDoingTodayTerminalReportFetcher(newTerminals,parent_id,function(for_TMP){
						for_TMP = _.applyToValues(for_TMP,toFixed(2),true);
						var param = _.extend(for_TMP, {
									 startPage:startPage,
									 breadCrumb : breadcrumb
								     });
						param.cancelledtransactions = param.cancelledtransactions.toString();
						var html = ich.generalTabel_HowAreWeToday_TMP(_.extend(param,{namefield:"Terminal"}));
						$(view.el).html(html);
					    });
};
