function breadCrumb(companyName,groupName,storeName,terminalName){
    return {companyName:companyName,groupName:groupName,storeName:storeName,terminalName:terminalName};
};

function dialogTitle(companyName, groupName, numGroups, storeName, numStores, terminalName, numTerminals){
    var title = "Company: " + companyName;
    if(groupName) title = title.concat(" , Group: " + groupName);
    if(numGroups) title = title.concat(" , Groups #: " + numGroups);
    if(storeName) title = title.concat(" , Store: " + storeName);
    if(numStores) title = title.concat(" , Stores #: " + numStores);
    if(terminalName) title = title.concat(" , Terminal: " + terminalName);
    if(numTerminals) title = title.concat(" , Terminals #: " + numTerminals);
    title = title.concat(", Date: " + (new Date()).toString("yyyy/MM/dd"));
    
    return title;
};

function getReportParam() {
    if(!_.isEmpty(ReportData.company)){
	var company = ReportData.company;
	var groups = company.hierarchy.groups; 
	var stores = _(groups).chain().map(function(group) {return group.stores;}).flatten().value();
	
	var numGroups = _.size(groups);
	var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	var for_TMP = {
	    numberOfGroups:numGroups,
	    numberOfStores:numStores,
	    numberOfTerminals:numTerminals,
	    startPage:'companyReport',
	    breadCrumb:breadCrumb(company.companyName),
	    //instead of using this as a title, we could put it at the top of the dialogHTML and have a generic title
	    quickViewArgs:{id:company._id, 
			   title:dialogTitle(company.companyName,null,numGroups,null,numStores,null,numTerminals)
			  },
	    list:[{company_id:company._id}]};
	return for_TMP;
    } 
    else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group; 
	var stores = group.stores;
	
	var numStores = _.size(stores);
	var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	return  {
	    numberOfStores:numStores,
	    numberOfTerminals:numTerminals,
	    startPage:"groupReport",
	    breadCrumb:breadCrumb(ReportData.companyName,group.groupName),
	    quickViewArgs:{id:ReportData.group.group_id, 
			   title:dialogTitle(ReportData.companyName,group.groupName,null,null,numStores,null,numTerminals)
			  },
	    list:[{group_id:ReportData.group.group_id}]};
    } else if(!_.isEmpty(ReportData.store)) {
	var store = ReportData.store;
	var terminals = store.terminals;
	var numTerminals = _.size(terminals);
	return  {
	    numberOfTerminals:numTerminals,
	    startPage:"storeReport",
	    breadCrumb:breadCrumb(ReportData.companyName,ReportData.groupName,store.storeName),
	    quickViewArgs:{id:ReportData.store.store_id, 
			   title:dialogTitle(ReportData.companyName,ReportData.groupName,null,store.storeName,null,null,numTerminals)
			  },
	    list:[{store_id:ReportData.store.store_id}]};
    }	
};



function getGroupsTableParam() {
    var company = ReportData.company;
    var groups = company.hierarchy.groups; 
    return _.extend({list: _.map(groups, function(group) {
    				     var numberOfStores = _.size(group.stores);
				     var numberOfTerminals = _.reduce(group.stores, 
								      function(sum, store)
								      { return sum + _.size(store.terminals); }, 
								      0);
				     
				     return {
					 companyName:company.companyName,
					 groupName:group.groupName,
					 group_id:group.group_id,
					 numberOfStores:numberOfStores,
					 numberOfTerminals:numberOfTerminals,
					 quickViewArgs:{id:group.group_id, 
							title:dialogTitle(company.companyName,group.groupName,null,null,numberOfStores,null,numberOfTerminals)
						       }
				     };
				 })}, {startPage:"companyReport",
				       breadCrumb:breadCrumb(company.companyName)});
};


function getStoresTableParam(group_id) {
    if(!_.isEmpty(ReportData.company)) {
	var company = ReportData.company;
	var groups;
	
	//check to see if we are dealing with one or more groups
	if(_.isEmpty(group_id)){
	    groups = company.hierarchy.groups;
	} else {
	    groups = _.filter(company.hierarchy.groups, function(group){ return group.group_id==group_id;});
	    var groupName = _.first(groups).groupName;
	} 
	
	var stores = _(groups)
	    .chain()
	    .map(function(group) {
		     return _.map(group.stores, 
				  function(store){
				      return _.extend(_.clone(store), {groupName:group.groupName});
				  }); 
		 }).flatten()
	    .value();
	
	return _.extend({list: _.map(stores, function(store) {
					 var numberOfTerminals = _.size(store.terminals);
					 return {companyName:company.companyName,
						 groupName:store.groupName,
						 store_id:store.store_id,
						 storeName:store.storeName,
						 storeNumber:store.number,
						 numberOfTerminals:numberOfTerminals,
						 quickViewArgs:{id:store.store_id, 
								title:dialogTitle(company.companyName,store.groupName,null,store.storeName,null,null,numberOfTerminals)
							       }
						};
				     })}, {startPage:"companyReport",
					   breadCrumb:breadCrumb(company.companyName,groupName)});
    } 
    else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group;
	var stores = group.stores;
	return _.extend({list: _.map(stores, function(store) {
					 var numberOfTerminals = _.size(store.terminals);
					 return {companyName:ReportData.companyName,
						 groupName:group.groupName,
						 store_id:store.store_id,
						 storeName:store.storeName,
						 storeNumber:store.number,
						 numberOfTerminals:numberOfTerminals,
						 quickViewArgs:{id:store.store_id, 
								title:dialogTitle(ReportData.companyName,store.groupName,null,store.storeName,null,null,numberOfTerminals)
							       }
						};
				     })},{startPage:"groupReport",
					  breadCrumb:breadCrumb(ReportData.companyName,group.groupName)});
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
		var groupName = _.first(stores).groupName;
		var storeName = _.first(stores).storeName;
		var storeNumber = _.first(stores).number;
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
					 return {companyName:company.companyName,
						 groupName:terminal.groupName,
						 storeName:terminal.storeName,
						 storeNumber:terminal.storeNumber,
						 terminalName:terminal.terminal_label,
						 terminal_id:terminal.terminal_id,
						 quickViewArgs:{id:terminal.terminal_id,
								title:dialogTitle(company.companyName,terminal.groupName,null,terminal.storeName,null,terminal.terminal_label,null)
							       }
						};
				     })},{startPage:"companyReport",
				     	  breadCrumb:breadCrumb(ReportData.company.companyName, groupName,storeName)});
    } else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group;
	var stores;
	if(_.isEmpty(store_id)){
	    stores = group.stores;
	} else {
	    stores = _.filter(group.stores, function(store){return store.store_id ==store_id;});
	    var groupName = group.groupName;
		var storeName = _.first(stores).storeName;
		var storeNumber = _.first(stores).number;
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
					 return {companyName:ReportData.companyName,
						 groupName:terminal.groupName,
						 storeName:terminal.storeName,
						 storeNumber:terminal.storeNumber,
						 terminalName:terminal.terminal_label,
						 terminal_id:terminal.terminal_id,
						 quickViewArgs:{id:terminal.terminal_id,
								title:dialogTitle(ReportData.companyName,terminal.groupName,null,terminal.storeName,null,terminal.terminal_label,null)
							       }
						};
				     })},{startPage:"groupReport",
				     	  breadCrumb:breadCrumb(ReportData.companyName,ReportData.group.groupName, storeName)});
    } else if(!_.isEmpty(ReportData.store)) {
	var store = ReportData.store;

	var terminals = store.terminals;
	return _.extend({list: _.map(terminals, function(terminal) {
					 return {companyName:ReportData.companyName,
						 groupName:ReportData.groupName,
						 storeName:store.storeName,
						 storeNumber:store.number,
						 terminalName:terminal.terminal_label,
						 terminal_id:terminal.terminal_id,
						 quickViewArgs:{id:terminal.terminal_id,
								title:dialogTitle(ReportData.companyName,ReportData.groupName,null,store.storeName,null,terminal.terminal_label,null)
							       }
						};
				     })},{startPage:"storeReport",
				     	  breadCrumb:breadCrumb(ReportData.companyName,ReportData.groupName,ReportData.store.storeName)});
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
					      var Item = _.first(item);
					      var salesData = _.second(item);
					      var Item_w_salesReport = _.extend(_.clone(Item),salesData);
					      return Item_w_salesReport;
					  })
				     .value();
				 callback(transformedList);
			     });
};