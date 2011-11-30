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
	     
	     transactionsSalesFetcher(ReportData.company._id,
				      function(totalSales){
					  _.extend(param,totalSales);
					  var html = ich.companyManagementPage_TMP(param);
					  $("body").html(html);
					  $("dialog-quickView").html();
					  console.log("companyReportView renderCompanyReport");
				      });
	 },
	 renderGroupsTable: function() {
	     var view = this;
	     var param = getGroupsTableParam();
	     
	     extractSalesDataFromIds(param.list,'group_id',function(transformedGroups){
					 param.list = transformedGroups;
					 var sales = _.pluck(param.list,'sales');
					 _.extend(param, 
					 	  {breadCrumb:"Company : " + ReportData.company.operationalname},
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
					 var html = ich.groupsTabel_TMP(param);
					 $("body").html(html);
					 console.log("companyReportView renderGroupsTable");
				     });
	 },
	 renderStoresTable: function(group_id) {
	     var view = this;
	     var param = getStoresTableParam(group_id);
	     
	     extractSalesDataFromIds(param.list,'store_id',function(transformedStores){
					 param.list = transformedStores;
					 var sales = _.pluck(param.list,'sales');
					 _.extend(param, {breadCrumb:"Company : " + ReportData.company.operationalname},
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
					 var html = ich.storesTabel_TMP(param);
					 $("body").html(html);
					 console.log("companyReportView renderStoresTable");
				     });
	 },
	 renderTerminalsTable : function(store_id) {
	     var view = this;
	     var param = getTerminalsTableParam(store_id);
	     
	     extractSalesDataFromIds(param.list,'terminal_id',function(transformedTerminals){
					 param.list = transformedTerminals;
					 var sales = _.pluck(param.list,'sales');
					 _.extend(param, {breadCrumb:"Company : " + ReportData.company.operationalname},
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
					 console.log("companyReportView renderTerminalsTable");
				     });
	 }
	});
