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
				      _.extend(param,totalSales);
				      var html = ich.storeManagementPage_TMP(param);
				      $("body").html(html);
				      console.log("storeReportView renderStoreReport");
				  });
	 return this;
     },
     renderTerminalsTable: function() {
	 var view = this;
	 var param = getTerminalsTableParam();
	 
	 extractSalesDataFromIds(param.list,'terminal_id',function(transformedTerminals){
				     param.list = transformedTerminals;
				     var sales = _.pluck(param.list,'sales');
				     _.extend(param, {breadCrumb:"company : " + ReportData.companyName + 
						      " , group : " + ReportData.groupName +
						      " , store : " + ReportData.store.storeName},
					 	{sales:{yesterdaysales:_(sales).chain()
				 										.pluck(['yesterdaysales'])
				 										.reduce(function(init, amt){return init+Number(amt)},0)
				 										.value(),
					 			mtdsales:_(sales).chain()
			 										.pluck(['mtdsales'])
			 										.reduce(function(init, amt){return init+Number(amt)},0)
			 										.value(),
					 			ytdsales:_(sales).chain()
			 										.pluck(['ytdsales'])
			 										.reduce(function(init, amt){return init+Number(amt)},0)
			 										.value()}});
				     var html = ich.terminalsTabel_TMP(param);
				     $("body").html(html);
				     console.log("storeReportView renderTerminalsTable");
				 });
     }
    });