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
	     var transactionsView = cdb.view('reporting','id_type_date');
	     var transaction_db = cdb.db('transactions');
	     var view = this;
	     var param = getReportParam();
	     var today = _.first(Date.today().toArray(),3);
	     var tomorrow = _.first(Date.today().addDays(1).toArray(),3);
	     var yesterday = _.first(Date.today().addDays(-1).toArray(),3);

	     var startOfMonth = _.first(Date.today().moveToFirstDayOfMonth().toArray(),3);
	     var startOfYear = _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3);
	     
	     var companySalesBaseKey = [ReportData.company._id,'SALE'];
	     var companyRefundBaseKey = [ReportData.company._id,'REFUND'];
	     
	     var transactionQuery = queryF(transactionsView,transaction_db);
	     
	     function typedTransactionRangeQuery(base){
		 return function(startDate,endDate){
		     var startKey = base.concat(startDate);
		     var endKey = base.concat(endDate);
		     var options = {
			 group_level:_.size(endKey),
			 startkey:startKey,
			 endkey:endKey
		     };
		     return transactionQuery(options);
		 };
	     }

	     var companySalesRangeQuery = typedTransactionRangeQuery(companySalesBaseKey);
	     var companyRefundRangeQuery = typedTransactionRangeQuery(companyRefundBaseKey);

	     function extractTotalSales(salesData,refundData){
		 var sales,refunds;
		 _.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows).value.sum : sales = 0;
		 _.isFirstNotEmpty(refundData.rows)? refunds = _.first(refundData.rows).value.sum : refunds = 0;
		 return sales - refunds;
	     }
	     async
		 .waterfall(
		     [function(callback){
			  companySalesRangeQuery(yesterday,today)
			  (function(salesData){
			       callback(null, salesData);
			   });
		      },
		      function(salesData, callback){
			  companyRefundRangeQuery(yesterday,today)
			  (function(refundData){
			       param.sales.yesterdaysales = extractTotalSales(salesData,refundData).toFixed(2);
			       callback(null);
			   });
		      },
		      function(callback){
			  companySalesRangeQuery(startOfMonth,tomorrow)
			  (function(salesData){
			       callback(null, salesData);
			   });
		      },
		      function(salesData, callback){
			  companyRefundRangeQuery(startOfMonth,tomorrow)
			  (function(refundData){
			       param.sales.mtdsales = extractTotalSales(salesData,refundData).toFixed(2);
			       callback(null);
			   });
		      },
		      function(callback){
			  companySalesRangeQuery(startOfYear,tomorrow)
			  (function(salesData){
			       callback(null, salesData);
			   });
		      },
		      function(salesData, callback){
			  companyRefundRangeQuery(startOfYear,tomorrow)
			  (function(refundData){
			       param.sales.ytdsales = extractTotalSales(salesData,refundData).toFixed(2);
			       callback(null);
			   });
		      },
		      function(callback){
			  var html = ich.companyManagementPage_TMP(param);
			  $("body").html(html);
			  console.log("companyReportView renderCompanyReport");
			  callback(null, 'done');	  
		      }
		     ]);
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

function getReportParam() {
    if(!_.isEmpty(ReportData.company)){
	var company = ReportData.company;
	var groups = company.hierarchy.groups; 
	var stores = _(groups).chain().map(function(group) {return group.stores;}).flatten().value();	
	var numGroups = _.size(groups);
	var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	return {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
		numberOfGroups:numGroups,
		numberOfStores:numStores,
		numberOfTerminals:numTerminals,
		company_id:company._id,
		startPage:'companyReport',
		breadCrumb:"company : " + company.operationalname
	       };
    } else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group; 
	var stores = group.stores;
	var numStores = _.size(stores);
	var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	return  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
		 numberOfStores:numStores,
		 numberOfTerminals:numTerminals,
		 startPage:"groupReport",
		 breadCrumb:"company : " + ReportData.companyName + " , group : " + group.groupName
		};
    } else if(!_.isEmpty(ReportData.store)) {
	var store = ReportData.store;
	var terminals = store.terminals;
	var numTerminals = _.size(terminals);
	return  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
		 numberOfTerminals:numTerminals,
		 startPage:"storeReport",
		 breadCrumb:"company : " + ReportData.companyName + 
		 " , group : " + ReportData.groupName +
		 " , store : " + store.storeName
		};
    }	
};