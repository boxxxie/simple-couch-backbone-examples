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
	     view.el= $("main");
	     
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
				      function(a, totalSales){
					  _.extend(param,{sales:_.first(totalSales)});
					  var html = ich.groupManagementPage_TMP(param);
					  $(view.el).html(html);
					  console.log("groupReportView renderGroupReport");
				      });
	     return this;
	     //  generalReportRenderer(this,getReportParam(),'groupManagementPage_TMP','group_id')
	     //   (function(){
	     //	  $("dialog-quickView").html();
	     //  console.log("groupReportView renderGroupManagement");});
	 },
	 renderStoresTable : function() {
	     var view = this;
	     var param = getStoresTableParam();
	     
	     extractSalesDataFromIds(param.list,'store_id',function(transformedStores){
					 param.list = transformedStores;
					 //var sales = _.pluck(param.list,'sales');
					 _.extend(param, {breadCrumb:breadCrumb(ReportData.companyName,ReportData.group.groupName)},
					 	  {sales:{yesterdaysales:_(param.list).chain()
				 			  .pluck(['yesterdaysales'])
				 			  .reduce(function(init, amt){return init+Number(amt);},0)
				 			  .value().toFixed(2),
					 		  mtdsales:_(param.list).chain()
			 				  .pluck(['mtdsales'])
			 				  .reduce(function(init, amt){return init+Number(amt);},0)
			 				  .value().toFixed(2),
					 		  ytdsales:_(param.list).chain()
			 				  .pluck(['ytdsales'])
			 				  .reduce(function(init, amt){return init+Number(amt);},0)
			 				  .value().toFixed(2)}});
					 var html = ich.storesTabel_TMP(param);
					 $(view.el).html(html);
					 console.log("groupReportView renderStoresTable");
				     });
	 },
	 renderTerminalsTable:function(store_id) {
	     var view = this;
	     var param = getTerminalsTableParam(store_id);
	     
	     extractSalesDataFromIds(param.list,'terminal_id',function(transformedTerminals){
					 param.list = transformedTerminals;
					 //var sales = _.pluck(param.list,'sales');
					 _.extend(param, {breadCrumb:breadCrumb(ReportData.companyName,ReportData.group.groupName)},
					 	  {sales:{yesterdaysales:_(param.list).chain()
				 			  .pluck(['yesterdaysales'])
				 			  .reduce(function(init, amt){return init+Number(amt);},0)
				 			  .value().toFixed(2),
					 		  mtdsales:_(param.list).chain()
			 				  .pluck(['mtdsales'])
			 				  .reduce(function(init, amt){return init+Number(amt);},0)
			 				  .value().toFixed(2),
					 		  ytdsales:_(param.list).chain()
			 				  .pluck(['ytdsales'])
			 				  .reduce(function(init, amt){return init+Number(amt);},0)
			 				  .value().toFixed(2)}});
					 var html = ich.terminalsTabel_TMP(param);
					 $(view.el).html(html);
					 console.log("groupReportView renderTerminalsTable");
				     });
	 }
	 
	});
