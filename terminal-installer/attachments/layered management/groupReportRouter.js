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
	     
	     transactionsSalesFetcher(ReportData.group.group_id,
				      function(totalSales){
					  _.extend(param.sales,totalSales);
					  var html = ich.groupManagementPage_TMP(param);
					  $("body").html(html);
					  console.log("groupReportView renderGroupReport");
				      });
	     return this;
	 },
	 renderStoresTable : function() {
	     var view = this;
	     var params = getStoresTableParam();
	     _.extend(params, {breadCrumb:"Company : " + ReportData.companyName});
		fetchStoresTableSales(params);
	     //var html = ich.storesTabel_TMP(param);
	     //$("body").html(html);
	     console.log("groupReportView renderStoresTable");
	     return this;
	 },
	 renderTerminalsTable:function(store_id) {
	     var view = this;
	     var params = getTerminalsTableParam(store_id);
	     _.extend(params, {breadCrumb:"Company : " + ReportData.companyName});
	     fetchTerminalsTableSales(params);
	     //var html = ich.terminalsTabel_TMP(param);
	     //$("body").html(html);
	     console.log("groupReportView renderTerminalsTable");
	     return this;
	 }
	 
	});
