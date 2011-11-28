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
	 transactionsSalesFetcher(ReportData.store.store_id,
				      function(totalSales){
					  _.extend(param.sales,totalSales);
					  var html = ich.storeManagementPage_TMP(param);
					  $("body").html(html);
					  console.log("storeReportView renderStoreReport");
				      });
	 //var html = ich.storeManagementPage_TMP(param);
	 //$("body").html(html);
	 //console.log("storeReportView renderStoreReport");
	 return this;
     },
     renderTerminalsTable: function() {
	 var view = this;
	 var params = getTerminalsTableParam();
	 _.extend(params, {breadCrumb:"Company : " + ReportData.companyName});
	 fetchTerminalsTableSales(params);
	 //var html = ich.terminalsTabel_TMP(param);
	 //$("body").html(html);
	 console.log("storeReportView renderTerminalsTable");
	 return this;
     }
    });