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
	 var html = ich.storeManagementPage_TMP(param);
	 $("body").html(html);
	 console.log("storeReportView renderStoreReport");
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

function getStoresTableParam(group_id) {
    if(!_.isEmpty(ReportData.company)) {
	var company = ReportData.company;
	var groups;
	
	if(_.isEmpty(group_id)){
	    groups = company.hierarchy.groups;
	} else {
	    groups = _.filter(company.hierarchy.groups, function(group){ return group.group_id==group_id;});
	} 
	
	var stores = _(groups)
	    .chain()
	    .map(function(group) {
		     return _.map(group.stores, function(store){
				      return _.extend(_.clone(store), {groupName:group.groupName});
				  }); 
		 }).flatten().value();
	
	return {list: _.map(stores, function(store) {
				var numberOfTerminals = _.size(store.terminals);
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:company.operationalname,
					groupName:store.groupName,
					store_id:store.store_id,
					storeName:store.storeName,
					storeNumber:store.number,
					numberOfTerminals:numberOfTerminals,
					sales:sales,
					startPage:"companyReport"};
			    })};
    } else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group;
	var stores = group.stores;
	return {list: _.map(stores, function(store) {
				var numberOfTerminals = _.size(store.terminals);
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:ReportData.companyName,
					groupName:group.groupName,
					store_id:store.store_id,
					storeName:store.storeName,
					storeNumber:store.number,
					numberOfTerminals:numberOfTerminals,
					sales:sales,
					startPage:"groupReport"};})};}};

function getTerminalsTableParam(store_id) {
    if(!_.isEmpty(ReportData.company)){
	var company = ReportData.company;
	var groups;
	var stores;
	groups = company.hierarchy.groups;
	if(_.isEmpty(store_id)){
	    stores = _(groups)
		.chain()
		.map(function(group) {
			 return _.map(group.stores, function(store){
					  return _.extend(_.clone(store), {groupName:group.groupName});
				      }); 
		     }).flatten().value();
	} else {
	    stores = _(groups)
		.chain()
		.map(function(group) {
			 return _.map(group.stores, function(store){
					  return _.extend(_.clone(store), {groupName:group.groupName});
				      }); 
		     }).flatten().filter(function(store){return store.store_id==store_id;}).value();
	}
	var terminals = _(stores).chain()
	    .map(function(store){
		     return _.map(store.terminals, function(terminal){
				      return _.extend(_.clone(terminal), 
						      {groupName:store.groupName, 
						       storeName:store.storeName, 
						       storeNumber:store.number 
						      });
				  });})
	    .flatten()
	    .value();
	return {list: _.map(terminals, function(terminal) {
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:company.operationalname,
					groupName:terminal.groupName,
					storeName:terminal.storeName,
					storeNumber:terminal.storeNumber,
					terminalName:terminal.terminal_label,
					sales:sales,
					startPage:"companyReport"};
			    })};
    } else if(!_.isEmpty(ReportData.group)) {
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
						       storeName:store.storeName, 
						       storeNumber:store.number});});})
	    .flatten()
	    .value();

	return {list: _.map(terminals, function(terminal) {
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:ReportData.companyName,
					groupName:terminal.groupName,
					storeName:terminal.storeName,
					storeNumber:terminal.storeNumber,
					terminalName:terminal.terminal_label,
					sales:sales,
					startPage:"groupReport"};
			    })};
    } else if(!_.isEmpty(ReportData.store)) {
	var store = ReportData.store;	
	
	var terminals = store.terminals;
	return {list: _.map(terminals, function(terminal) {
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:ReportData.companyName,
					groupName:ReportData.groupName,
					storeName:store.storeName,
					storeNumber:store.number,
					terminalName:terminal.terminal_label,
					sales:sales,
					startPage:"storeReport"};
			    })};
    }
};