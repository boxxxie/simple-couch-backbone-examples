var testGroupTableHowAreWeToday = {
	breadCrumb:"Company : test Company",
	list:[{groupName:"test gr1",
			group_id:"test-group-id1",
			numberoftransactions:10,
			menu:100.00,
			scan:100.00,
			ecr:100.00,
			total:300.00,
			avgsale:3.00},
			{groupName:"test gr2",
			group_id:"test-group-id2",
			numberoftransactions:10,
			menu:100.00,
			scan:100.00,
			ecr:100.00,
			total:300.00,
			avgsale:3.00}],
	totalnumberoftransactions:20,
	totalmenu:200.00,
	totalscan:200.00,
	totalecr:200.00,
	totaltotal:600.00,
	totalavgsale:3.00
};

var testStoreTableHowAreWeToday = {
	breadCrumb:"Company : test Company, Group : test Group",
	list:[{storeName:"test store", storeNumber:1,
			store_id:"test-store-id1",
			numberoftransactions:10,
			menu:100.00,
			scan:100.00,
			ecr:100.00,
			total:300.00,
			avgsale:3.00},
			{storeName:"test store", storeNumber:2,
			store_id:"test-store-id1",
			numberoftransactions:10,
			menu:100.00,
			scan:100.00,
			ecr:100.00,
			total:300.00,
			avgsale:3.00}],
	totalnumberoftransactions:20,
	totalmenu:200.00,
	totalscan:200.00,
	totalecr:200.00,
	totaltotal:600.00,
	totalavgsale:3.00
};

var testTerminalTableHowAreWeToday = {
	breadCrumb:"Company : test Company, Group : test Group, Store : test Store",
	list:[{terminalName:"test terminal1",
			numberoftransactions:10,
			menu:100.00,
			scan:100.00,
			ecr:100.00,
			total:300.00,
			avgsale:3.00},
			{terminalName:"test terminal2",
			numberoftransactions:10,
			menu:100.00,
			scan:100.00,
			ecr:100.00,
			total:300.00,
			avgsale:3.00}],
	totalnumberoftransactions:20,
	totalmenu:200.00,
	totalscan:200.00,
	totalecr:200.00,
	totaltotal:600.00,
	totalavgsale:3.00,
	cancelledtransactions:10,
	refundtransactions:10
};

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