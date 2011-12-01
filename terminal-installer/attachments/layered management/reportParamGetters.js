
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
		breadCrumb:"company : " + company.operationalname,
		quickViewArgs:{id:ReportData.company._id, 
						title:"Company: " + company.operationalname 
								+ " , Groups #: " + numGroups
								+ " , Stores #: " + numStores
								+ " , Terminals #: " + numTerminals
								+ " , Date: " + (new Date()).toLocaleDateString()}
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
		 breadCrumb:"company : " + ReportData.companyName + " , group : " + group.groupName,
		 quickViewArgs:{id:ReportData.group.group_id, 
						title:"Company: " + ReportData.companyName 
								+ " , Group: " + group.groupName
								+ " , Stores #: " + numStores
								+ " , Terminals #: " + numTerminals
								+ " , Date: " + (new Date()).toLocaleDateString()}
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
		 " , store : " + store.storeName,
		 quickViewArgs:{id:ReportData.store.store_id, 
						title:"Company: " + ReportData.companyName 
								+ " , Group: " + ReportData.groupName
								+ " , Store: " + store.storeName
								+ " , Terminals #: " + numTerminals
								+ " , Date: " + (new Date()).toLocaleDateString()}
		};
    }	
};



function getGroupsTableParam() {
    var company = ReportData.company;
    var groups = company.hierarchy.groups; 
	return _.extend({list: _.map(groups, function(group) {
    	var numberOfStores = _.size(group.stores);
	    var numberOfTerminals = _.reduce(group.stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);;
	    var sales={yesterdaysales:"$ 0.00",mtdsales:"$ 0.00",ytdsales:"$ -0.00"};
    
		    return {operationalname:company.operationalname,
			    groupName:group.groupName,
			    group_id:group.group_id,
			    numberOfStores:numberOfStores,
			    numberOfTerminals:numberOfTerminals,
			    sales:sales,
			    quickViewArgs:{id:group.group_id, 
								title:"Company: " + company.operationalname 
								+ " , Group: " + group.groupName
								+ " , Stores #: " + numberOfStores
								+ " , Terminals #: " + numberOfTerminals
								+ " , Date: " + (new Date()).toLocaleDateString()}
			    };
		})}, {startPage:"companyReport"});
};


function getStoresTableParam(group_id) {
    if(!_.isEmpty(ReportData.company)) {
	var company = ReportData.company;
	var groups;
	
	if(_.isEmpty(group_id)){
	    groups = company.hierarchy.groups;
	} else {
	    groups = _.filter(company.hierarchy.groups, function(group){ return group.group_id==group_id;});
	} 
	
	var stores = _(groups).chain().map(function(group) {
					       return _.map(group.stores, function(store){
								return _.extend(_.clone(store), {groupName:group.groupName});
							    }); 
					   }).flatten().value();
	
	return _.extend({list: _.map(stores, function(store) {
				var numberOfTerminals = _.size(store.terminals);
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:company.companyName,
					groupName:store.groupName,
					store_id:store.store_id,
					storeName:store.storeName,
					storeNumber:store.number,
					numberOfTerminals:numberOfTerminals,
					sales:sales,
					quickViewArgs:{id:store.store_id, 
									title:"Company: " + company.operationalname 
									+ " , Group: " + store.groupName
									+ " , Store: " + store.storeName
									+ " , Terminals #: " + numberOfTerminals
									+ " , Date: " + (new Date()).toLocaleDateString()}
					};
			    })}, {startPage:"companyReport"});
    } else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group;
	var stores = group.stores;
	return _.extend({list: _.map(stores, function(store) {
				var numberOfTerminals = _.size(store.terminals);
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:ReportData.companyName,
					groupName:group.groupName,
					store_id:store.store_id,
					storeName:store.storeName,
					storeNumber:store.number,
					numberOfTerminals:numberOfTerminals,
					sales:sales,
					quickViewArgs:{id:store.store_id, 
									title:"Company: " + company.operationalname 
									+ " , Group: " + store.groupName
									+ " , Store: " + store.storeName
									+ " , Terminals #: " + numberOfTerminals
									+ " , Date: " + (new Date()).toLocaleDateString()}
					};
			    })},{startPage:"groupReport"});
    }
};


function getTerminalsTableParam(store_id) {
    if(!_.isEmpty(ReportData.company)){
	var company = ReportData.company;
	var groups;
	var stores;
	groups = company.hierarchy.groups;
	if(_.isEmpty(store_id)){
	    stores = _(groups).chain().map(function(group) {
					       return _.map(group.stores, function(store){
								return _.extend(_.clone(store), {groupName:group.groupName});
							    }); 
					   }).flatten().value();
	} else {
	    stores = _(groups).chain().map(function(group) {
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
	return _.extend({list: _.map(terminals, function(terminal) {
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:company.operationalname,
					groupName:terminal.groupName,
					storeName:terminal.storeName,
					storeNumber:terminal.storeNumber,
					terminalName:terminal.terminal_label,
					terminal_id:terminal.terminal_id,
					sales:sales,
					quickViewArgs:{id:terminal.terminal_id, 
									title:"Company: " + company.operationalname 
									+ " , Group: " + terminal.groupName
									+ " , Store: " + terminal.storeName
									+ " , Terminal: " + terminal.terminalName
									+ " , Date: " + (new Date()).toLocaleDateString()}
					};
			    })},{startPage:"companyReport"});
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

	return _.extend({list: _.map(terminals, function(terminal) {
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:ReportData.companyName,
					groupName:terminal.groupName,
					storeName:terminal.storeName,
					storeNumber:terminal.storeNumber,
					terminalName:terminal.terminal_label,
					terminal_id:terminal.terminal_id,
					sales:sales,
					quickViewArgs:{id:terminal.terminal_id, 
									title:"Company: " + company.operationalname 
									+ " , Group: " + terminal.groupName
									+ " , Store: " + terminal.storeName
									+ " , Terminal: " + terminal.terminalName
									+ " , Date: " + (new Date()).toLocaleDateString()}
					};
			    })},{startPage:"groupReport"});
    } else if(!_.isEmpty(ReportData.store)) {
	var store = ReportData.store;	
	
	var terminals = store.terminals;
	return _.extend({list: _.map(terminals, function(terminal) {
				var sales={yesterdaysales:"100",mtdsales:"100",ytdsales:"100"};
				return {operationalname:ReportData.companyName,
					groupName:ReportData.groupName,
					storeName:store.storeName,
					storeNumber:store.number,
					terminalName:terminal.terminal_label,
					terminal_id:terminal.terminal_id,
					sales:sales,
					quickViewArgs:{id:terminal.terminal_id, 
									title:"Company: " + company.operationalname 
									+ " , Group: " + terminal.groupName
									+ " , Store: " + terminal.storeName
									+ " , Terminal: " + terminal.terminalName
									+ " , Date: " + (new Date()).toLocaleDateString()}
					};
			    })},{startPage:"storeReport"});
    }
};

//general
function extractSalesDataFromIds(items,idField,callback){
    transactionsSalesFetcher(_(items).pluck(idField),
			     function(err,totalSalesArr){
				 var transformedList =
				     _(items).chain()
				     .zip(totalSalesArr)
				     .map(function(item){
					      var groupItem = _.first(item);
					      var salesData = _.second(item);
					      var group_w_salesReport = _.extend(_.clone(groupItem),salesData);
					      return group_w_salesReport;
					  })
				     .value();
				 callback(transformedList);
			     });
};