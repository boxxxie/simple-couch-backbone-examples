var groupReportRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "groupReport/":"groupReport",
		  "groupReport/stores":"groupReport_storesTable",
		  "groupReport/store/:store_id/terminals" :"groupReport_terminalsTable",
		  "groupReport/terminals":"groupReport_terminalsTable"
	      },
	      groupReport:function() {
	     	  console.log("groupReport ");
	      },
	      groupReport_storesTable:function(group_id) {
	     	  console.log("groupReport : storesTable ");
	      },
	      groupReport_terminalsTable:function(store_id) {
	     	  console.log("groupReport : terminalsTable ");
	      }}));

var groupReportView = 
    Backbone.View.extend(
    	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 
		       'renderGroupReport', 
		       'renderStoresTable', 
		       'renderTerminalsTable');
	     groupReportRouter
		 .bind('route:groupReport', 
		       function(){
			   console.log("groupReportView, route:groupReport : company name : "+ 
				       ReportData.companyName);
			   view.model = ReportData.group; 
			   view.renderGroupReport();
		       });
	     groupReportRouter
		 .bind('route:groupReport_storesTable', 
		       function(){
			   console.log("groupReportView, route:groupReport_storesTable : company name : "+
				       ReportData.companyName);
			   view.model = ReportData.group; 
			   view.renderStoresTable();
		       });
	     groupReportRouter
		 .bind('route:groupReport_terminalsTable', 
		       function(store_id) {
			   console.log("groupReportView, route:groupReport_storesTable: company name : "+
				       ReportData.companyName);
			   view.model = ReportData.group; 
			   view.renderTerminalsTable(store_id);
		       });
	 },
	 renderGroupReport: function() {
	     var view = this;
	     var param = getReportParam();
	     
	     var today = _.first(Date.today().toArray(),3);
	     var tomorrow = _.first(Date.today().addDays(1).toArray(),3);
	     var yesterday = _.first(Date.today().addDays(-1).toArray(),3);
	     var tommorrow = _.first(Date.today().addDays(1).toArray(),3);

	     var startOfMonth = _.first(Date.today().moveToFirstDayOfMonth().toArray(),3);
	     var startOfYear = _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3);
	     
	     var groupSalesBaseKey = [ReportData.group.group_id,'SALE'];
	     var groupRefundBaseKey = [ReportData.group.group_id,'REFUND'];
	     
	     var groupSalesRangeQuery = typedTransactionRangeQuery(groupSalesBaseKey);
	     var groupRefundRangeQuery = typedTransactionRangeQuery(groupRefundBaseKey);

	     groupSalesRangeQuery(yesterday,today)
	     (function(salesData){
		  groupRefundRangeQuery(yesterday,today)
		  (function(refundData){
		       param.sales.yesterdaysales = extractTotalSales(salesData,refundData).toFixed(2);
		       groupSalesRangeQuery(startOfMonth,tomorrow)
		       (function(salesData){
			    groupRefundRangeQuery(startOfMonth,tomorrow)
			    (function(refundData){
				 param.sales.mtdsales = extractTotalSales(salesData,refundData).toFixed(2);
				 groupSalesRangeQuery(startOfYear,tomorrow)
				 (function(salesData){
				      groupRefundRangeQuery(startOfYear,tomorrow)
				      (function(refundData){
					   param.sales.ytdsales = extractTotalSales(salesData,refundData).toFixed(2);
					   var html = ich.groupManagementPage_TMP(param);
					     $("body").html(html);
					     console.log("groupReportView renderGroupReport");
				       });
				  });
			     });
			});
		   });
	      });
	     
	     return this;
	 },
	 renderStoresTable : function() {
	     var view = this;
	     var param = getStoresTableParam();
	     _.extend(param, {breadCrumb:"Company : " + ReportData.companyName});
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderStoresTable");
	     return this;
	 },
	 renderTerminalsTable:function(store_id) {
	     var view = this;
	     var param = getTerminalsTableParam(store_id);
	     _.extend(param, {breadCrumb:"Company : " + ReportData.companyName});
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderTerminalsTable");
	     return this;
	 }
	 
	});
