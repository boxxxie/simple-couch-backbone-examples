var ReportData;
Date.prototype.toArray = function(){
    return [this.getFullYear(),
	    (this.getMonth()+1),
	    this.getDate(),
	    this.getHours(),
	    this.getMinutes(),
	    this.getSeconds()];
};
function doc_setup() {

    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db_install = 'install';
    var Company = couchDoc.extend({urlRoot:urlBase+db_install});
    
    var AppRouter = 
	new (Backbone.Router.extend(
		 {
		     routes: {
			 "companyReport/":"companyReport",
			 "companyReport/groups" :"companyReport_groupsTable",
			 "companyReport/group/:group_id/stores" :"companyReport_storesTable",
			 "companyReport/store/:store_id/terminals" :"companyReport_terminalsTable",
			 "companyReport/stores" :"companyReport_storesTable",
			 "companyReport/terminals" :"companyReport_terminalsTable",
			 
			 "groupReport/":"groupReport",
			 "groupReport/stores":"groupReport_storesTable",
			 "groupReport/store/:store_id/terminals" :"groupReport_terminalsTable",
			 "groupReport/terminals":"groupReport_terminalsTable",
			 
			 "storeReport/":"storeReport",
			 "storeReport/terminals":"storeReport_terminalsTable"		 
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
		     },
		     
		     
		     groupReport:function() {
	     		 console.log("groupReport ");
		     },
		     groupReport_storesTable:function(group_id) {
	     		 console.log("groupReport : storesTable ");
		     },
		     groupReport_terminalsTable:function(store_id) {
	     		 console.log("groupReport : terminalsTable ");
		     },
		     

		     storeReport:function() {
	     		 console.log("storeReport ");
		     },
		     storeReport_terminalsTable:function(store_id) {
	     		 console.log("storeReport : terminalsTable ");
		     }
		 }));

    var companyReportView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;

	     _.bindAll(view, 'renderCompanyReport' , 'renderGroupsTable', 'renderStoresTable', 'renderTerminalsTable');
	     AppRouter.bind('route:companyReport', function(){
				console.log("companyReportView, route:companyReport");
				view.model = ReportData.company; 
				view.renderCompanyReport();
			    });
	     AppRouter.bind('route:companyReport_groupsTable', function(){
				console.log("companyReportView, route:companyReport_groupsTable");
				view.renderGroupsTable();						
			    });
	     AppRouter.bind('route:companyReport_storesTable', function(group_id){
				console.log("companyReportView, route:companyReport_storesTable");
				view.renderStoresTable(group_id);						
			    });
	     AppRouter.bind('route:companyReport_terminalsTable', function(store_id){
				console.log("companyReportView, route:companyReport_terminalsTable");
				view.renderTerminalsTable(store_id);						
			    });
	 },
	 renderCompanyReport: function() {
	     var transactionsView = cdb.view('reporting','id_type_date');
	     var transaction_db = cdb.db('transactions');
	     var view = this;
	     var company = ReportData.company;
	     var groups = company.hierarchy.groups; 
	     var stores = _(groups).chain().map(function(group) {return group.stores;}).flatten().value();
	     
	     var numGroups = _.size(groups);
	     var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	     var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfGroups:numGroups,
			   numberOfStores:numStores,
			   numberOfTerminals:numTerminals,
			   company_id:company._id,
			   startPage:'companyReport',
			   breadCrumb:"company : " + company.operationalname
			  };
	     var today = _.first(Date.today().toArray(),3);
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
		 _.isFirstNotEmpty(salesData)? sales = _.first(salesData).value.sum : sales = 0;
		 _.isFirstNotEmpty(refundData)? refunds = _.first(refundData).value.sum : refunds = 0;
		 return sales - refunds;
	     }
	     
	     companySalesRangeQuery(yesterday,today)
	     (function(salesData){
		  companyRefundRangeQuery(yesterday,today)
		  (function(refundData){
		       param.sales.yesterdaysales = extractTotalSales(salesData,refundData);
		       companySalesRangeQuery(startOfMonth,today)
		       (function(salesData){
			    companyRefundRangeQuery(startOfMonth,today)
			    (function(refundData){
				 param.sales.mtdsales = extractTotalSales(salesData,refundData);
				 companySalesRangeQuery(startOfYear,today)
				 (function(salesData){
				      companyRefundRangeQuery(startOfYear,today)
				      (function(refundData){
					   param.sales.ytdsales = extractTotalSales(salesData,refundData);
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
	     var company = ReportData.company;
	     var groups = company.hierarchy.groups; 
	     
	     var param = {list: _.map(groups, function(group) {
					  var numberOfStores = _.size(group.stores);
					  var numberOfTerminals = _.reduce(group.stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);;
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:company.operationalname,
						  groupName:group.groupName,
						  group_id:group.group_id,
						  numberOfStores:numberOfStores,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales,
						  startPage:"companyReport"};
				      })};
	     _.extend(param, {breadCrumb:"Company : " + company.operationalname});
	     var html = ich.groupsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderGroupsTable");
	     return this;								
	 },
	 renderStoresTable: function(group_id) {
	     var view = this;
	     var company = ReportData.company;
	     var groups;
	     
	     if(_.isEmpty(group_id)){
		 groups = company.hierarchy.groups;
	     } else {
		 groups = _.filter(company.hierarchy.groups, function(group){ return group.group_id==group_id;});
	     } 
	     
	     var stores = _(groups).chain().map(function(group) {
						    return _.map(group.stores, function(store){
								     return _.extend(_.clone(store), {groupName:group.groupName, group_id:group.group_id});
								 }); 
						}).flatten().value();
	     
	     var param = {list: _.map(stores, function(store) {
					  var numberOfTerminals = _.size(store.terminals);
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:company.operationalname,
						  group_id:store.group_id,
						  groupName:store.groupName,
						  store_id:store.store_id,
						  storeName:store.storeName,
						  storeNumber:store.number,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales,
						  startPage:"companyReport"};
				      })};
	     _.extend(param, {breadCrumb:"Company : " + company.operationalname});
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderStoresTable");
	     return this;								
	     
	 },
	 renderTerminalsTable : function(store_id) {
	     var view = this;
	     var company = ReportData.company;
	     var groups;
	     var stores;
	     groups = company.hierarchy.groups;
	     if(_.isEmpty(store_id)){
		 stores = _(groups).chain().map(function(group) {
						    return _.map(group.stores, function(store){
								     return _.extend(_.clone(store), {groupName:group.groupName, group_id:group.group_id});
								 }); 
						}).flatten().value();
	     } else {
		 stores = _(groups).chain().map(function(group) {
						    return _.map(group.stores, function(store){
								     return _.extend(_.clone(store), {groupName:group.groupName, group_id:group.group_id});
								 }); 
						}).flatten().filter(function(store){return store.store_id==store_id;}).value();
	     }
	     var terminals = _(stores).chain()
		 .map(function(store){
			  return _.map(store.terminals, function(terminal){
					   return _.extend(_.clone(terminal), 
							   {groupName:store.groupName, 
							    group_id:store.group_id, 
							    storeName:store.storeName, 
							    storeNumber:store.number, 
							    store_id:store.store_id});
				       });})
		 .flatten()
		 .value();
	     var param = {list: _.map(terminals, function(terminal) {
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:company.operationalname,
						  group_id:terminal.group_id,
						  groupName:terminal.groupName,
						  store_id:terminal.store_id,
						  storeName:terminal.storeName,
						  storeNumber:terminal.storeNumber,
						  terminalName:terminal.terminal_label,
						  sales:sales,
						  startPage:"companyReport"};
				      })};
	     _.extend(param, {breadCrumb:"Company : " + company.operationalname});
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderTerminalsTable");
	     return this;
	 }
	});
    
    var groupReportView = Backbone.View.extend(
    	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderGroupReport', 'renderStoresTable', 'renderTerminalsTable');
	     AppRouter.bind('route:groupReport', function(){
				console.log("groupReportView, route:groupReport : company name : "+ ReportData.companyName);
				view.model = ReportData.group; 
				view.renderGroupReport();
			    });
	     AppRouter.bind('route:groupReport_storesTable', function(){
				console.log("groupReportView, route:groupReport_storesTable : company name : "+ ReportData.companyName);
				view.model = ReportData.group; 
				view.renderStoresTable();
			    });
	     AppRouter.bind('route:groupReport_terminalsTable', function(store_id) {
				console.log("groupReportView, route:groupReport_storesTable: company name : " +ReportData.companyName);
				view.model = ReportData.group; 
				view.renderTerminalsTable(store_id);
			    });
	 },
	 renderGroupReport: function() {
	     var view = this;
	     var group = ReportData.group; 
	     var stores = group.stores;
	     
	     var numStores = _.size(stores);
	     var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfStores:numStores,
			   numberOfTerminals:numTerminals,
			   startPage:"groupReport",
			   breadCrumb:"company : " + ReportData.companyName + " , group : " + group.groupName
			  };
	     var html = ich.groupManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderGroupReport");
	     return this;
	 },
	 renderStoresTable : function() {
	     var view = this;
	     var group = ReportData.group;
	     var stores = group.stores;
	     var param = {list: _.map(stores, function(store) {
					  var numberOfTerminals = _.size(store.terminals);
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:ReportData.companyName,
						  //group_id:store.group_id,
						  groupName:group.groupName,
						  store_id:store.store_id,
						  storeName:store.storeName,
						  storeNumber:store.number,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales,
						  startPage:"groupReport"};
				      })};
	     _.extend(param, {breadCrumb:"Company : " + ReportData.companyName});
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderStoresTable");
	     return this;
	 },
	 renderTerminalsTable:function(store_id) {
	     var view = this;
	     var group = ReportData.group;
	     var stores;
	     if(_.isEmpty(store_id)){
		 stores = group.stores;
	     } else {
		 stores = _.filter(group.stores, function(store){return store.store_id ==store_id;});
	     }
	     var terminals = _(stores).chain()
		 .map(function(store){
			  return _.map(store.terminals, function(terminal){
					   return _.extend(_.clone(terminal), 
							   {groupName:group.groupName, 
							    group_id:group.group_id, 
							    storeName:store.storeName, 
							    storeNumber:store.number, 
							    store_id:store.store_id});});})
		 .flatten()
		 .value();

	     var param = {list: _.map(terminals, function(terminal) {
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:ReportData.companyName,
						  group_id:terminal.group_id,
						  groupName:terminal.groupName,
						  store_id:terminal.store_id,
						  storeName:terminal.storeName,
						  storeNumber:terminal.storeNumber,
						  terminalName:terminal.terminal_label,
						  sales:sales,
						  startPage:"groupReport"};
				      })};
	     _.extend(param, {breadCrumb:"Company : " + ReportData.companyName});
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("groupReportView renderTerminalsTable");
	     return this;
	 }
	 
	});
    
    var storeReportView = Backbone.View.extend(
    	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderStoreReport', 'renderTerminalsTable');
	     AppRouter.bind('route:storeReport', function(){
				console.log("storeReportView, route:storeReport : companyname : " + ReportData.companyName + ", groupname : " + ReportData.groupName );
				view.model = ReportData.store;
				view.renderStoreReport();
			    });
	     AppRouter.bind('route:storeReport_terminalsTable', function(){
				console.log("storeReportView, route:storeReport_terminalsTable : companyname : " + ReportData.companyName + ", groupname : " + ReportData.groupName );
				view.model = ReportData.store;
				view.renderTerminalsTable();
			    });
	 },
	 renderStoreReport: function() {
	     var view = this;
	     
	     var store = ReportData.store;
	     var terminals = store.terminals;
	     var numTerminals = _.size(terminals);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfTerminals:numTerminals,
			   startPage:"storeReport",
			   breadCrumb:"company : " + ReportData.companyName + 
			   " , group : " + ReportData.groupName +
			   " , store : " + store.storeName
			  };
	     var html = ich.storeManagementPage_TMP(param);
	     $("body").html(html);
	     console.log("storeReportView renderStoreReport");
	     return this;
	 },
	 renderTerminalsTable: function() {
	     var view = this;
	     var store = ReportData.store;	
	     
	     var terminals = store.terminals;
	     var param = {list: _.map(terminals, function(terminal) {
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:ReportData.companyName,
						  groupName:ReportData.groupName,
						  store_id:store.store_id,
						  storeName:store.storeName,
						  storeNumber:store.number,
						  terminalName:terminal.terminal_label,
						  sales:sales,
						  startPage:"storeReport"};
				      })};
	     _.extend(param, {breadCrumb:"Company : " + ReportData.companyName});
	     var html = ich.terminalsTabel_TMP(param);
	     $("body").html(html);
	     console.log("storeReportView renderTerminalsTable");
	     return this;
	 }
	});
    
    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
    var GroupReportDisplay = new groupReportView();
    var StoreReportDisplay = new storeReportView();
    Backbone.history.start();

};


