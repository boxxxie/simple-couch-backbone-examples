function breadCrumb(companyName,groupName,storeName,terminalName){
    return {companyName:companyName,groupName:groupName,storeName:storeName,terminalName:terminalName};
}

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
	    breadcrumb:breadCrumb(company.operationalname),
	    //instead of using this as a title, we could put it at the top of the dialogHTML and have a generic title
	    quickViewArgs:{id:ReportData.company._id, 
			   title:"Company: " + company.operationalname 
			   + " , Groups #: " + numGroups
			   + " , Stores #: " + numStores
			   + " , Terminals #: " + numTerminals
			   + " , Date: " + (new Date()).toLocaleDateString()},
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
	    breadCrumb:"company : " + ReportData.companyName + " , group : " + group.groupName,
	    breadcrumb:breadCrumb(ReportData.companyName,group.groupName),
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
	return  {
	    numberOfTerminals:numTerminals,
	    startPage:"storeReport",
	    breadCrumb:"company : " + ReportData.companyName + 
		" , group : " + ReportData.groupName +
		" , store : " + store.storeName,
	    breadcrumb:breadCrumb(ReportData.companyName,group.groupName,store.storeName),
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
							title:"Company: " + company.operationalname 
							+ " , Group: " + group.groupName
							+ " , Stores #: " + numberOfStores
							+ " , Terminals #: " + numberOfTerminals
							+ " , Date: " + (new Date()).toLocaleDateString()}
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
								title:"Company: " + company.operationalname 
								+ " , Group: " + store.groupName
								+ " , Store: " + store.storeName
								+ " , Terminals #: " + numberOfTerminals
								+ " , Date: " + (new Date()).toLocaleDateString()}
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
						 quickViewArgs:{id:group.store_id, 
								title:"Company: " + ReportData.companyName 
								+ " , Group: " + store.groupName
								+ " , Store: " + store.storeName
								+ " , Terminals #: " + numberOfTerminals
								+ " , Date: " + (new Date()).toLocaleDateString()}
						};
				     })},{startPage:"groupReport",
					  breadCrumb:breadCrumb(ReportData.companyName,group.groupName)});
    }
};

function getTerminalsTableParam() {
    function extendFromParentToChild(keyRemappings){
	return function(parent){
	    var example ={
		company_id:'_id',
		companyName:'operationalname'
	    };
	    if(_.isEmpty(keyRemappings)){
		return function(child){
		    return _.extend(child,parent);
		};
	    }
	    else{
		return function(child){
		    var remappedSelectedParentKeys = 
			_(parent).
			chain().
			selectKeys(_.keys(keyRemappings)).
			renameKeys(keyRemappings).
			value();
		    return _.extend(child,remappedSelectedParentKeys);
		};
	    }
	};
    };
    var traverse = require('traverse');

    //this wont work for multiple groups/stores
    var leaves = traverse(ReportData).
	reduce(function (acc, x) {
		   if (this.isLeaf){
		       acc[this.key]= x;
		   }
		   return acc;
	       }, {});

    function removeHeirachy(tree){
	return	traverse(tree).
	    //remove the hierarchy stupid thing	
	    map(function (o){
		    if(this.key == 'hierarchy'){this.remove();};
		    if(this.key == 'company'){
			this.update(_.extend(o,{groups:o.hierarchy.groups}));
		    }});
    }
    function mergeStoreStatsWithTerminals(tree){
	return	traverse(tree).
	    map(function (node){
		    if(node.terminals){
			var mergedWithTerminals = _(node.terminals).
			    map(extendFromParentToChild({number:'storeNumber', storeName:'storeName'})(node));
			//console.log(mergedWithTerminals);
			this.update(_.extend(node,{terminals:mergedWithTerminals}));
		    }
		    //if(this.key == 'stores'){this.update(_.flatten(node));};
		});
    }
    
    function shiftUpTerminals(tree){
	return traverse(tree).
	    map(function (node){
		    if(this.parent && this.parent.parent && this.parent.parent.key == 'stores' && !node.terminals){
			this.remove();
		    }});
    }
    /*    
     function mergeGroupStatsWithTerminals(tree){
     return	traverse(tree).
     map(function (node){
     if(node.stores){
     var mergedWithTerminals = _(node.terminals).
     map(extendFromParentToChild({groupName:'groupName'})(node));
     //console.log(mergedWithTerminals);
     this.update(mergedWithTerminals,true);
     }
     if(this.key == 'groups'){this.update(_.flatten(node));};
     });
     }
     */

    var terminalData = _.compose(
	//	mergeGroupStatsWithTerminals,
	shiftUpTerminals,
	mergeStoreStatsWithTerminals,
	removeHeirachy)
    (ReportData);
    console.log(terminalData);
    
    console.log("terminal data");
    console.log(terminalData);
    return {list:[terminalData]}; //should be an array, just for testing
};
/*
 function getTerminalsTableParam(store_id) {
 var misc = ReportData;
 function getTerminals(){
 function extendFromParentToChild(keyRemappings){
 return function(parent){
 var example ={
 company_id:'_id',
 companyName:'operationalname'
 };
 if(_.isEmpty(keyRemappings)){
 return function(child){
 return _.extend(child,parent);
 };
 }
 else{
 return function(child){
 var remappedSelectedParentKeys = 
 _(parent).
 chain().
 selectKeys(_.keys(keyRemappings)).
 renameKeys(keyRemappings).
 value();
 return _.extend(child,remappedSelectedParentKeys);
 };
 }
 };
 };

 function merge(fieldName,transform){
 return function(o){
 if(o[fieldName]){
 return _(o[fieldName])
 .chain()
 .flatten()
 .map(transform(o))
 .value();
 }   
 else{return o;}
 };
 }

 function hierarchyToGroups(o){
 if(o.groups){
 return o.groups;
 } 
 else{return o;}
 }

 return _.compose(_.flatten,
 /* walkF(merge('groups',extendFromParentToChild(
 {_id:'company_id',
 operationalname:'companyName'}))),
 walkF(merge('stores',extendFromParentToChild(
 {group_id:'group_id',
 groupName:'groupName'}))),
 walkF(merge('terminals',extendFromParentToChild(
 {store_id:'store_id',
 storeName:'storeName',
 number:'storeNumber'}))),
 function(obj){return _.renameKeys(obj,{hierarchy:'groups'});},
 walkF(hierarchyToGroups)
 )
 (misc);
 }

 var terminals = _.map(getTerminals(),function(terminal){
 return _.extend(terminal,{id:terminal.terminal_id});});
 title:"Company: " + company.operationalname 
 + " , Group: " + terminal.groupName
 + " , Store: " + terminal.storeName
 + " , Terminal: " + terminal.terminalName
 + " , Date: " + (new Date()).toLocaleDateString()}});});
 var traverse = require('traverse');

 var leaves = traverse(misc).reduce(function (acc, x) {
 if (this.isLeaf){
 var ret = {};
 ret[this.key] = x;
 acc(ret);
 }
 return acc;
 }, {});

 console.dir(leaves);
 return terminals;
 /*					
 //dealing with one or many stores? need same with group.... fixme:
 if(!_.isEmpty(store_id)){
 var storeName = _.first(terminals).storeName;
 var groupName = _.first(terminals).groupName;
 } 

 <<<<<<< HEAD
 if(!_.isEmpty(company)){
 return _.extend({list: _.map(terminals, 
 function(terminal) {
 return {operationalname:company.operationalname,
 groupName:terminal.groupName,
 storeName:terminal.storeName,
 storeNumber:terminal.storeNumber,
 terminalName:terminal.terminal_label,
 terminal_id:terminal.terminal_id,
 quickViewArgs:{id:terminal.terminal_id, 
 title:"Company: " + company.operationalname 
 + " , Group: " + terminal.groupName
 + " , Store: " + terminal.storeName
 + " , Terminal: " + terminal.terminalName
 + " , Date: " + (new Date()).toLocaleDateString()}
 };
 })},{startPage:"companyReport",
 breadcrumb:breadCrumb(company.operationalname,groupName,storeName)});
 } else if(!_.isEmpty(group)) {
 return _.extend({list: _.map(terminals, function(terminal) {
 return {operationalname:ReportData.operationalname,
 groupName:terminal.groupName,
 storeName:terminal.storeName,
 storeNumber:terminal.storeNumber,
 terminalName:terminal.terminal_label,
 terminal_id:terminal.terminal_id,
 quickViewArgs:{id:terminal.terminal_id, 
 title:"Company: " + company.operationalname 
 + " , Group: " + terminal.groupName
 + " , Store: " + terminal.storeName
 + " , Terminal: " + terminal.terminalName
 + " , Date: " + (new Date()).toLocaleDateString()}
 };
 })},{startPage:"groupReport"});

 };
 */

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