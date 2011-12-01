var menuReportsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/company":"menuReportsCompany",
		  "menuReports/group":"menuReportsGroup",
		  "menuReports/store":"menuReportsStore"
	      },
	      menuReportsCompany:function(){
		  console.log("menuCompanyReport  ");
	      },

	      menuReportsGroup:function() {
	     	  console.log("menuGroupReport  ");
	      },
	      menuReportsStore:function(group_id) {
	     	  console.log("menuStoreReport ");
	      }}));
	      

var menuReportsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     
	     _.bindAll(view, 
		       'renderMenuCompanyReport' , 
		       'renderMenuGroupsTable', 
		       'renderMenuStoresTable');

	     companyReportRouter
		 .bind('route:menuCompanyReport', 
		       function(){
			   console.log("menuReportsView, route:menuCompanyReport");
			   view.model = ReportData.company; 
			   view.renderCompanyReport();
		       });

	     companyReportRouter
		 .bind('route:menuGroupReport', 
		       function(){
			   console.log("menuReportsView, route:menuGroupReport");
			   view.renderGroupsTable();						
		       });

	     companyReportRouter
		 .bind('route:menuStoreReport', 
		       function(group_id){
			   console.log("menuReportsView, route:menuStoreReport");
			   view.renderStoresTable(group_id);						
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
				 			  .reduce(function(init, amt){return init+Number(amt);},0)
				 			  .value().toFixed(2),
					 		  mtdsales:_(sales).chain()
			 				  .pluck(['mtdsales'])
			 				  .reduce(function(init, amt){return init+Number(amt);},0)
			 				  .value().toFixed(2),
					 		  ytdsales:_(sales).chain()
			 				  .pluck(['ytdsales'])
			 				  .reduce(function(init, amt){return init+Number(amt);},0)
			 				  .value().toFixed(2)}});
					 var html = ich.groupsTabel_TMP(param);
					 $("body").html(html);
					 console.log("companyReportView renderGroupsTable");
				     });
	 }});