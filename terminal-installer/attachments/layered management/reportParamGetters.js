function breadCrumb(companyName,groupName,storeName,terminalName){
    return {companyName:companyName,groupName:groupName,storeName:storeName,terminalName:terminalName};
};

function dialogTitle(companyName, groupName, numGroups, storeName, numStores, terminalName, numTerminals){
	//return {companyName:companyName, groupName:groupName, numGroups:numGroups, storeName:storeName, numStores:numStores, numTerminals:numTerminals, today:(new Date()).toLocaleDateString};
	var title = "Company: " + companyName;
	if(groupName) title = title.concat(" , Group: " + groupName);
	if(numGroups) title = title.concat(" , Groups #: " + numGroups);
	if(storeName) title = title.concat(" , Store: " + storeName);
	if(numStores) title = title.concat(" , Stores #: " + numStores);
	if(terminalName) title = title.concat(" , Terminal: " + terminalName);
	if(numTerminals) title = title.concat(" , Terminals #: " + numTerminals);
	title = title.concat(", Date: " + (new Date()).toDateString());
	
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
	return {
	    numberOfGroups:numGroups,
	    numberOfStores:numStores,
	    numberOfTerminals:numTerminals,
	    startPage:'companyReport',
	    breadCrumb:breadCrumb(company.operationalname),
	    //instead of using this as a title, we could put it at the top of the dialogHTML and have a generic title
	    quickViewArgs:{id:ReportData.company._id, 
			   title:dialogTitle(company.operationalname,null,numGroups,null,numStores,null,numTerminals)
			   },
	    list:[{company_id:company._id}]};
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
			   }
	};
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
			   }
	};
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
					 operationalname:company.operationalname,
					 groupName:group.groupName,
					 group_id:group.group_id,
					 numberOfStores:numberOfStores,
					 numberOfTerminals:numberOfTerminals,
					 quickViewArgs:{id:group.group_id, 
							title:dialogTitle(company.operationalname,group.groupName,null,null,numberOfStores,null,numberOfTerminals)
							}
				     };
				 })}, {startPage:"companyReport",
				       breadCrumb:breadCrumb(company.operationalname)});
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
					 return {operationalname:company.operationalname,
						 groupName:store.groupName,
						 store_id:store.store_id,
						 storeName:store.storeName,
						 storeNumber:store.number,
						 numberOfTerminals:numberOfTerminals,
						 quickViewArgs:{id:store.store_id, 
								title:dialogTitle(company.operationalname,store.groupName,null,store.storeName,null,null,numberOfTerminals)
								}
						};
				     })}, {startPage:"companyReport",
					   breadCrumb:breadCrumb(company.operationalname,groupName)});
    } 
    else if(!_.isEmpty(ReportData.group)) {
	var group = ReportData.group;
	var stores = group.stores;
	return _.extend({list: _.map(stores, function(store) {
					 var numberOfTerminals = _.size(store.terminals);
					 return {operationalname:ReportData.companyName,
						 groupName:group.groupName,
						 store_id:store.store_id,
						 storeName:store.storeName,
						 storeNumber:store.number,
						 numberOfTerminals:numberOfTerminals,
						 quickViewArgs:{id:store.store_id, 
								title:dialogTitle(ReportData.companyNamee,store.groupName,null,store.storeName,null,null,numberOfTerminals)
								}
						};
				     })},{startPage:"groupReport",
					  breadCrumb:breadCrumb(ReportData.companyName,group.groupName)});
    }
};


//function getTerminalsTableParam() {
//    function extendFromParentToChild(keyRemappings){
//	return function(parent){
//	    var example ={
//		company_id:'_id',
//		companyName:'operationalname'
//	    };
//	    if(_.isEmpty(keyRemappings)){
//		return function(child){
//		    return _.extend(child,parent);
//		};
//	    }
//	    else{
//		return function(child){
//		    var remappedSelectedParentKeys = 
//			_(parent).
//			chain().
//			selectKeys(_.keys(keyRemappings)).
//			renameKeys(keyRemappings).
//			value();
//		    return _.extend(child,remappedSelectedParentKeys);
//		};
//	    }
//	};
//    };
//    var traverse = require('traverse');
//
//    //this wont work for multiple groups/stores
//    var leaves = traverse(ReportData).
//	reduce(function (acc, x) {
//		   if (this.isLeaf){
//		       acc[this.key]= x;
//		   }
//		   return acc;
//	       }, {});
//
//    function removeHeirachy(tree){
//	return	traverse(tree).
//	    //remove the hierarchy stupid thing	
//	    map(function (o){
//		    if(this.key == 'hierarchy'){this.remove();};
//		    if(this.key == 'company'){
//			this.update(_.extend(o,{groups:o.hierarchy.groups}));
//		    }});
//    }
//    function mergeStoreStatsWithTerminals(tree){
//	return	traverse(tree).
//	    map(function (node){
//		    if(node.terminals){
//			var mergedWithTerminals = _(node.terminals).
//			    map(extendFromParentToChild({number:'storeNumber', storeName:'storeName'})(node));
//			//console.log(mergedWithTerminals);
//			this.update(_.extend(node,{terminals:mergedWithTerminals}));
//		    }
//		    //if(this.key == 'stores'){this.update(_.flatten(node));};
//		});
//    }
//    
//    function shiftUpTerminals(tree){
//
//		var transedFormat=traverse(tree).
//	    map(function (node){
//		    if(this.parent && this.parent.parent && this.parent.parent.key == 'stores' && this.key!='terminals'){
//			this.remove();
//		    }});
//
//		_(transedFormat.company.groups).each(function(group){
//			var terminals =[];
//		    terminals = 
//		    _.reduce(group.stores, function(init, store){
//		        return _.union(init,store.terminals)
//		    },terminals)
//		    group.terminals = terminals;
//		});
//		
//		return transedFormat;
//    }
//    /*    
//     function mergeGroupStatsWithTerminals(tree){
//     return	traverse(tree).
//     map(function (node){
//     if(node.stores){
//     var mergedWithTerminals = _(node.terminals).
//     map(extendFromParentToChild({groupName:'groupName'})(node));
//     //console.log(mergedWithTerminals);
//     this.update(mergedWithTerminals,true);
//     }
//     if(this.key == 'groups'){this.update(_.flatten(node));};
//     });
//     }
//     */
//
//    var terminalData = _.compose(
//	//	mergeGroupStatsWithTerminals,
//	shiftUpTerminals,
//	mergeStoreStatsWithTerminals,
//	removeHeirachy)
//    (ReportData);
//    console.log(terminalData);
//    
//    console.log("terminal data");
//    console.log(terminalData);
//    return {list:[terminalData]}; //should be an array, just for testing
//};


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
					 return {operationalname:company.operationalname,
						 groupName:terminal.groupName,
						 storeName:terminal.storeName,
						 storeNumber:terminal.storeNumber,
						 terminalName:terminal.terminal_label,
						 terminal_id:terminal.terminal_id,
						 quickViewArgs:{id:terminal.terminal_id,
								title:dialogTitle(company.operationalname,terminal.groupName,null,terminal.storeName,null,terminal.terminal_label,null)
								}
						};
				     })},{startPage:"companyReport",
				     	  breadCrumb:breadCrumb(ReportData.company.operationalname)});
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
					 return {operationalname:ReportData.companyName,
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
				     	  breadCrumb:breadCrumb(ReportData.companyName,ReportData.group.groupName)});
    } else if(!_.isEmpty(ReportData.store)) {
	var store = ReportData.store;

	var terminals = store.terminals;
	return _.extend({list: _.map(terminals, function(terminal) {
					 return {operationalname:ReportData.companyName,
						 groupName:ReportData.groupName,
						 storeName:store.storeName,
						 storeNumber:store.number,
						 terminalName:terminal.terminal_label,
						 terminal_id:terminal.terminal_id,
						 quickViewArgs:{id:terminal.terminal_id,
								title:dialogTitle(ReportData.companyName,terminal.groupName,null,terminal.storeName,null,terminal.terminal_label,null)
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
					      var groupItem = _.first(item);
					      var salesData = _.second(item);
					      var group_w_salesReport = _.extend(_.clone(groupItem),salesData);
					      return group_w_salesReport;
					  })
				     .value();
				 callback(transformedList);
			     });
};