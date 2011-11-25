var companyReportRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "companyReport/":"companyReport",
		  "companyReport/groups" :"companyReport_groupsTable",
		  "companyReport/group/:group_id/stores" :"companyReport_storesTable",
		  "companyReport/store/:store_id/terminals" :"companyReport_terminalsTable",
		  "companyReport/stores" :"companyReport_storesTable",
		  "companyReport/terminals" :"companyReport_terminalsTable"
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
	      }}));

var companyReportView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     
	     _.bindAll(view, 
		       'renderCompanyReport' , 
		       'renderGroupsTable', 
		       'renderStoresTable', 
		       'renderTerminalsTable');

	     companyReportRouter
		 .bind('route:companyReport', 
		       function(){
			   console.log("companyReportView, route:companyReport");
			   view.model = ReportData.company; 
			   view.renderCompanyReport();
		       });

	     companyReportRouter
		 .bind('route:companyReport_groupsTable', 
		       function(){
			   console.log("companyReportView, route:companyReport_groupsTable");
			   view.renderGroupsTable();						
		       });

	     companyReportRouter
		 .bind('route:companyReport_storesTable', 
		       function(group_id){
			   console.log("companyReportView, route:companyReport_storesTable");
			   view.renderStoresTable(group_id);						
		       });

	     companyReportRouter
		 .bind('route:companyReport_terminalsTable', 
		       function(store_id){
			   console.log("companyReportView, route:companyReport_terminalsTable");
			   view.renderTerminalsTable(store_id);						
		       });
	 },
	 renderCompanyReport: function() {
	     var view = this;
	     var param = getReportParam();
	     var today = _.first(Date.today().toArray(),3);
	     var tomorrow = _.first(Date.today().addDays(1).toArray(),3);
	     var yesterday = _.first(Date.today().addDays(-1).toArray(),3);
	     var tommorrow = _.first(Date.today().addDays(1).toArray(),3);

	     var startOfMonth = _.first(Date.today().moveToFirstDayOfMonth().toArray(),3);
	     var startOfYear = _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3);
	     
	     var companySalesBaseKey = [ReportData.company._id,'SALE'];
	     var companyRefundBaseKey = [ReportData.company._id,'REFUND'];
	     

	     var companySalesRangeQuery = typedTransactionRangeQuery(companySalesBaseKey);
	     var companyRefundRangeQuery = typedTransactionRangeQuery(companyRefundBaseKey);

	     companySalesRangeQuery(yesterday,today)
	     (function(salesData){
		  companyRefundRangeQuery(yesterday,today)
		  (function(refundData){
		       param.sales.yesterdaysales = extractTotalSales(salesData,refundData).toFixed(2);
		       companySalesRangeQuery(startOfMonth,tomorrow)
		       (function(salesData){
			    companyRefundRangeQuery(startOfMonth,tomorrow)
			    (function(refundData){
				 param.sales.mtdsales = extractTotalSales(salesData,refundData).toFixed(2);
				 companySalesRangeQuery(startOfYear,tomorrow)
				 (function(salesData){
				      companyRefundRangeQuery(startOfYear,tomorrow)
				      (function(refundData){
					   param.sales.ytdsales = extractTotalSales(salesData,refundData).toFixed(2);
					   var html = ich.companyManagementPage_TMP(param);
					   $("body").html(html);
					   console.log("companyReportView renderCompanyReport");
				       });
				  });
			     });
			});
		   });
	      });
	     return this;
	 },
	 renderGroupsTable: function() {
	     var view = this;
	     var param = getGroupsTableParam();
	     _.extend(param, {breadCrumb:"Company : " + ReportData.company.operationalname});
	     var html = ich.groupsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderGroupsTable");
	     return this;								
	 },
	 renderStoresTable: function(group_id) {
	     var view = this;
	     var param = getStoresTableParam(group_id);
	     _.extend(param, {breadCrumb:"Company : " + ReportData.company.operationalname});
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderStoresTable");
	     return this;								
	     
	 },
	 renderTerminalsTable : function(store_id) {
	     var view = this;
	     var param = getTerminalsTableParam(store_id);
	     _.extend(param, {breadCrumb:"Company : " + ReportData.company.operationalname});
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderTerminalsTable");
	     return this;
	 }
	});