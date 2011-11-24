var ReportData;
Date.prototype.toArray = function(){
    return [this.getFullYear(),
	    (this.getMonth()+1),
	    this.getDate(),
	    this.getHours(),
	    this.getMinutes(),
	    this.getSeconds()];
};
Date.prototype.beginningOfMonth = function(){
    return Date.today().addDays(-Date.today().getDate()+1);
};
function doc_setup() {

    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db_install = 'install_yunbo';
    var Company = couchDoc.extend({urlRoot:urlBase+db_install});
    
    var AppRouter = new 

    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 
		 "companyReport/":"companyReport",
		 "companyReport/groups" :"companyReport_groupsTable",
		 "companyReport/group/:group_id/stores" :"companyReport_storesTable",
		 "companyReport/group/:group_id/store/:store_id/terminals" :"companyReport_terminalsTable",
		 
		 "companyReport/stores" :"companyReport_storesTable",
		 
		 "groupReport/":"groupReport",
		 
		 "storeReport/":"storeReport"
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     
	     
	     companyReport:function(){
		 console.log("companyReport  ");
	     },

	     companyReport_storesTable:function(group_id) {
	     	 console.log("companyReport : storesTable ");

	     },
	     companyReport_terminalsTable:function(group_id, store_id) {
	     	 console.log("companyReport : terminalsTable ");
	     },
	     
	     
	     groupReport:function() {
	     	 console.log("groupReport ");
	     },
	     
	     
	     storeReport:function() {
	     	 console.log("storeReport ");
	     }
	 }));

    
    var reportLoginView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderLoginPage');
	     AppRouter.bind('route:reportLogin', function(){
				console.log('reportLoginView:route:reportLogin');
				view.el= _.first($("ids_form"));
				view.renderLoginPage();});
	 },
	 renderLoginPage:function(){
	     var view = this;
	     console.log("reportview renderLoginPage");
	     return this;
	 }
	});


    var companyReportView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderCompanyReport' , 'renderGroupsTable', 'renderStoresTable');
	     AppRouter.bind('route:companyReport', function(){
				console.log("companyReportView, route:companyReport");
				view.model = ReportData; 
				view.renderCompanyReport();
			    });
	     AppRouter.bind('route:companyReport_groupsTable', function(){
				console.log("companyReportView, route:companyReport_groupsTable");
				view.renderGroupsTable();						
			    });
	     AppRouter.bind('route:companyReport_storesTable', function(){
				console.log("companyReportView, route:companyReport_storesTable");
				view.renderStoresTable();						
			    });
	 },
	 renderCompanyReport: function() {
	     var transaction_db = cdb.db('transactions');
	     var transactionsView = cdb.view('reporting','id_type_date');
	     var view = this;
	     var groups = ReportData.company.hierarchy.groups;
	     var stores = _(groups).chain()
		 .pluck('stores')
		 .flatten()
		 .value();
	     var numGroups = _.size(groups);
	     var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	     var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfGroups:numGroups,
			   numberOfStores:numStores,
			   numberOfTerminals:numTerminals,
			   company_id:ReportData.company._id
			  };
	     var today = _.first(Date.today().toArray(),3);
	     var yesterday = _.first(Date.today().addDays(-1).toArray(),3);

	     var startOfMonth = Date.today().moveToFirstDayOfMonth().toArray();
	     var startOfYear = Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray();
	     
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
	     var company = view.model.toJSON();
	     var groups = company.hierarchy.groups;
	     
	     var param = 
		 {list: _.map(groups, function(group) {
				  var operationalname = company.operationalname;
				  var groupName = group.groupName;
				  var numberOfStores = _.size(group.stores);
				  var numberOfTerminals = _.reduce(group.stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);;
				  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				  return {operationalname:operationalname,
					  groupName:groupName,
					  numberOfStores:numberOfStores,
					  numberOfTerminals:numberOfTerminals,
					  sales:sales};
			      })};
	     var html = ich.groupsTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderGroupsTable");
	     return this;								
	 },
	 renderStoresTable: function() {
	     var view = this;
	     var company = view.model.toJSON();
	     var groups = company.hierarchy.groups;
	     var stores = _(groups).chain()
		 .map(function(group) {return {stores:group.stores, groupName:group.groupName};})
		 .flatten()
		 .value();
	     var param = {list: _.map(stores, function(store) {
					  var operationalname = company.operationalname;
					  var groupName = store.groupName;
					  var storeName = store.storeName;
					  var storNumber = store.number;
					  var numberOfTerminals = _.size(store.terminals);
					  var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
					  return {operationalname:operationalname,
						  groupName:groupName,
						  storeName:storeName,
						  storeNumber:storeNumber,
						  numberOfTerminals:numberOfTerminals,
						  sales:sales};
				      })};
	     var html = ich.storesTabel_TMP(param);
	     $("body").html(html);
	     console.log("companyReportView renderStoresTable");
	     return this;								
	 }
	});
    var groupReportView = 
	Backbone.View.extend(
	    {initialize:function(){
		 var view = this;
		 _.bindAll(view, 'renderGroupReport');
		 AppRouter.bind('route:groupReport', function(company_id, group_id){
				    console.log("groupReportView, route:groupReport : company_id : " + company_id + ", group_id : " + group_id);
				    view.model = new Company({_id:company_id});
				    view.model.fetch({error:function(a,b,c){
							  console.log("couldn't load model");
							  //view.model.trigger('not_found');
						      },
						      success:function(a,b,c){
					  		  console.log("fetch model success");
					  		  view.renderGroupReport(group_id);
						      }});
				});
	     },
	     renderGroupReport: function(group_id) {
		 var view = this;
		 var company = view.model.toJSON();
		 var groups = company.hierarchy.groups; 
		 var group = _.find(groups, function(group){return group.group_id==group_id;});
		 var stores = group.stores;
		 
		 var numStores = _.size(stores);
		 var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
		 var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			       numberOfStores:numStores,
			       numberOfTerminals:numTerminals,
			       company_id:company._id,
			       group_id:group_id
			      };
		 var html = ich.groupManagementPage_TMP(param);
		 $("body").html(html);
		 console.log("groupReportView renderGroupReport");
		 return this;
	     }
	     
	    });
    
    var storeReportView = 
	Backbone.View.extend(
	    {initialize:function(){
		 var view = this;
		 _.bindAll(view, 'renderStoreReport');
		 AppRouter.bind('route:storeReport', function(company_id, group_id, store_id){
				    console.log("storeReportView, route:storeReport : company_id : " + company_id + ", group_id : " + group_id + ", store_id : " + store_id);
				    view.model = new Company({_id:company_id});
				    view.model.fetch({error:function(a,b,c){
							  console.log("couldn't load model");
						      },
						      success:function(a,b,c){
					  		  console.log("fetch model success");
					  		  view.renderStoreReport(group_id, store_id);
						      }});
				});
	     },
	     renderStoreReport: function(group_id, store_id) {
		 var view = this;
		 var company = view.model.toJSON();
		 var groups = company.hierarchy.groups; 
		 var group = _.find(groups, function(group){return group.group_id==group_id;});
		 var stores = group.stores;
		 var store = _.find(stores, function(store){return store.store_id==store_id;});
		 var terminals = store.terminals;
		 var numTerminals = _.size(terminals);
		 var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			       numberOfTerminals:numTerminals,
			       company_id:company._id,
			       group_id:group_id,
			       store_id:store_id
			      };
		 var html = ich.storeManagementPage_TMP(param);
		 $("body").html(html);
		 console.log("storeReportView renderStoreReport");
		 return this;
	     }
	     
	    });

    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
    var GroupReportDisplay = new groupReportView();
    var StoreReportDisplay = new storeReportView();
    Backbone.history.start();

};

function login() {
    var $form = $("#ids_form");
    var formEntries = varFormGrabber($form);
    console.log("form entries");
    console.log(formEntries);
    var login_key = _(formEntries).chain()
	.kv()
	.reject(_.isLastEmpty)
	.toObject()
	.value();
    console.log("login_key");
    console.log(login_key);
    
    var db_install = db("install_yunbo");
    var user_passwordView = appView("user_pass");
    var branch_show = appShow("branch");

    keyQuery(login_key, user_passwordView, db_install)
    (function (resp){
	 console.log(resp);
	 var accountMatches = resp.rows;
	 if(_.isNotEmpty(accountMatches)) {
	     var account = {company_id:_.first(resp.rows).id,loginTo:_.first(resp.rows).value};
	     db_install.show(branch_show,
			     account.company_id,
			     {data : account.loginTo,
			      success:function(data){
				  if(_.isNotEmpty(account.loginTo.store)) {
				      ReportData = {store:data, companyName:login_key.company, groupName:login_key.group};
				      window.location.href = "#storeReport/";
				  }
				  else if(_.isNotEmpty(account.loginTo.group)) {
				      ReportData = {group:data, companyName:login_key.company};
				      window.location.href = "#groupReport/";
				  } 
				  else if(_.isNotEmpty(account.loginTo.company)) {
				      ReportData = {company:data};
				      window.location.href = "#companyReport/";
				  } 
				  
			      }});
	 } else {
	     alert("wrong login info.");
	 }
     });
}
