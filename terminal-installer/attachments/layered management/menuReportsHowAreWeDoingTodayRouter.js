
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
	     var html = ich.groupsTabel_HowAreWeToday_TMP(_.extend(testGroupTableHowAreWeToday,{startPage:"companyReport"}));
	     $(this.el).html(html);
	     //generalReportRenderer(this,getGroupsTableParam(),'groupsTabel_TMP','group_id')(log("companyReportView renderGroupsTable"));
	 },
	 renderStoresTable_HowAreWeToday: function(id) {
	     var html = ich.storesTabel_HowAreWeToday_TMP(_.extend(testStoreTableHowAreWeToday,{startPage:"companyReport"}));
	     $(this.el).html(html);	     
	     //generalReportRenderer(this,getStoresTableParam(id),'storesTabel_TMP','store_id')(log("companyReportView renderStoresTable"));
	 },
	 renderTerminalsTable_HowAreWeToday : function(id) {
	     var html = ich.terminalsTabel_HowAreWeToday_TMP(_.extend(testTerminalTableHowAreWeToday,{startPage:"companyReport"}));
	     $(this.el).html(html);
	     //generalReportRenderer(this,getTerminalsTableParam(id),'terminalsTabel_TMP','terminal_id')(log("companyReportView renderTerminalsTable"));
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
	     var html = ich.storesTabel_HowAreWeToday_TMP(_.extend(testStoreTableHowAreWeToday,{startPage:"groupReport"}));
	     $(this.el).html(html);	     
	     //generalReportRenderer(this,getStoresTableParam(id),'storesTabel_TMP','store_id')(log("companyReportView renderStoresTable"));
	 },
	 renderTerminalsTable_HowAreWeToday : function(id) {
	     var html = ich.terminalsTabel_HowAreWeToday_TMP(_.extend(testTerminalTableHowAreWeToday,{startPage:"groupReport"}));
	     $(this.el).html(html);
	     //generalReportRenderer(this,getTerminalsTableParam(id),'terminalsTabel_TMP','terminal_id')(log("companyReportView renderTerminalsTable"));
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
	     var html = ich.terminalsTabel_HowAreWeToday_TMP(_.extend(testTerminalTableHowAreWeToday,{startPage:"storeReport"}));
	     $(this.el).html(html);
	     //generalReportRenderer(this,getTerminalsTableParam(id),'terminalsTabel_TMP','terminal_id')(log("companyReportView renderTerminalsTable"));
	 }
	});
	



	
// need a template to render into?
// 
//appendGroupInfo(template) {
//	ich[template].html(data);
//}

function appendGroupsInfo() {
	var groups = ReportData.hierarchy.gruops;
	var newGroups = _(_.clone(groups)).map(function(group){ return {id:group_id, name:groupName}});
	var parent_id = {id:ReportData.company._id, name:ReportData.company.operationalname};
	var result = _.first(getstuff(newGroups,ReportData.company._id));
	result.breadCrumb = "Company : " + ReportData.company.operationalname;
	
	return result;
};

function appendStoresInfo(group_id) {
	var stores;
	var parent_id;
	var breadCrumb;
	
	if(_.isEmpty(group_id)) {
		parent_id = {id:ReportData.group.group_id, name:ReportData.group.groupName};
		stores = ReportData.group.stores;
		breadCrumb = "Company : " + ReportData.companyName + " , Group : "+ ReportData.group.groupName;
	} else {
		var group = _.find(ReportData.company.hierarchy.groups, function(group){return group.group_id==group_id});
		parent_id = {id:group.group_id, name:group.groupName};
		stores = group.stores;
		breadCrumb = "Company : " + ReportData.companyName + " , Group : "+ group.groupName; 
	}
	
	var newStores = _(_.clone(stores)).map(function(store){ return {id:store_id, name:storeName}});
	var result = _.first(getstuff(newStores,parent_id));
	result.breadCrumb = breadCrumb;
	
	return result;
};

function appendTerminalsInfo(store_id) {
	var terminals;
	var parent_id;
	var breadCrumb;
	
	if(_.isEmpty(store_id)) {
		parent_id = {id:ReportData.store.store_id, name:ReportData.store.storeName};
		terminals = ReportData.store.terminals;
		breadCrumb = "Company : " + ReportData.companyName 
				+ " , Group : " + ReportData.groupName
				+ " , Store : " + ReportData.store.storeName;
	} else {
		if(!_.isEmpty(ReportData.company)) {
			var groups = ReportData.company.hierarchy.groups;
			var group = _.find(groups, function(group){ 
				return !_.isEmpty(_.find(group.stores, function(store){
					return store.store_id==store_id;
				}))});
			
			var stores = group.stores;
			var store = _.find(stores, function(store){return store.store_id==store_id});
			parent_id = {id:store.store_id, name:store.storeName};
			terminals = store.terminals;
			breadCrumb = "Company : " + ReportData.company.operationalname 
						+ " , Group : " + group.groupName
						+ " , Store : " + store.storeName;
		} else if(!_.isEmpty(ReportData.group)) {
			var stores = ReportData.group.stores;
			var store = _.find(stores, function(store){return store.store_id==store_id});
			parent_id = {id:store.store_id, name:store.storeName};
			terminals = store.terminals;
			breadCrumb = "Company : " + ReportData.companyName 
						+ " , Group : " + ReportData.group.groupName
						+ " , Store : " + store.storeName;
		}
	}
	
	var newTerminals = _(_.clone(terminals)).map(function(terminal){ return {id:terminal_id, name:terminalName}});
	var result = _.first(getstuff(newTerminals,parent_id));
	result.breadCrumb = breadCrumb;
	
	return result;
};
