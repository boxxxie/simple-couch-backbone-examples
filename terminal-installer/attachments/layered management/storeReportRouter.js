var storeReportRouter = 
    new (Backbone.Router.extend(
	     {
		 routes: {
		     "storeReport/":"storeReport",
		     "storeReport/terminals":"storeReport_terminalsTable"		 
		 },

		 storeReport:function() {
	     	     console.log("storeReport ");
		 },
		 storeReport_terminalsTable:function(store_id) {
	     	     console.log("storeReport : terminalsTable ");
		 }
	     }));

var storeReportView = Backbone.View.extend(
    {initialize:function(){
	 var view = this;
	 _.bindAll(view, 
		   'renderStoreReport', 
		   'renderTerminalsTable');
	 storeReportRouter
	     .bind('route:storeReport', 
		   function(){
			    console.log("storeReportView, route:storeReport : companyname : " + 
					ReportData.companyName + 
					", groupname : " + 
					ReportData.groupName );
			    view.model = ReportData.store;
			    view.renderStoreReport();
			});
	 storeReportRouter
	     .bind('route:storeReport_terminalsTable', 
		   function(){
			    console.log("storeReportView, route:storeReport_terminalsTable : companyname : " + 
					ReportData.companyName + 
					", groupname : " +
					ReportData.groupName );
			    view.model = ReportData.store;
			    view.renderTerminalsTable();
			});
     },
     renderStoreReport: function() {
	 var view = this;
	     
	     var param = getReportParam();
	     
	     
	     var today = _.first(Date.today().toArray(),3);
	     var tomorrow = _.first(Date.today().addDays(1).toArray(),3);
	     var yesterday = _.first(Date.today().addDays(-1).toArray(),3);
	     var tommorrow = _.first(Date.today().addDays(1).toArray(),3);

	     var startOfMonth = _.first(Date.today().moveToFirstDayOfMonth().toArray(),3);
	     var startOfYear = _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3);
	     
	     var storeSalesBaseKey = [ReportData.store.store_id,'SALE'];
	     var storeRefundBaseKey = [ReportData.store.store_id,'REFUND'];
	     
	     var storeSalesRangeQuery = typedTransactionRangeQuery(storeSalesBaseKey);
	     var storeRefundRangeQuery = typedTransactionRangeQuery(storeRefundBaseKey);

	     
	     storeSalesRangeQuery(yesterday,today)
	     (function(salesData){
		  storeRefundRangeQuery(yesterday,today)
		  (function(refundData){
		       param.sales.yesterdaysales = extractTotalSales(salesData,refundData).toFixed(2);
		       storeSalesRangeQuery(startOfMonth,tomorrow)
		       (function(salesData){
			    storeRefundRangeQuery(startOfMonth,tomorrow)
			    (function(refundData){
				 param.sales.mtdsales = extractTotalSales(salesData,refundData).toFixed(2);
				 storeSalesRangeQuery(startOfYear,tomorrow)
				 (function(salesData){
				      storeRefundRangeQuery(startOfYear,tomorrow)
				      (function(refundData){
					   param.sales.ytdsales = extractTotalSales(salesData,refundData).toFixed(2);
					   var html = ich.storeManagementPage_TMP(param);
				     $("body").html(html);
				     console.log("storeReportView renderStoreReport");
				       });
				  });
			     });
			});
		   });
	      });
	     
	     
	     return this;
     },
     renderTerminalsTable: function() {
	 var view = this;
	 var param = getTerminalsTableParam();
	 _.extend(param, {breadCrumb:"Company : " + ReportData.companyName});
	 var html = ich.terminalsTabel_TMP(param);
	 $("body").html(html);
	 console.log("storeReportView renderTerminalsTable");
	 return this;
     }
    });