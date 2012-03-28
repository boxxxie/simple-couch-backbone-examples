function we_are_fixing_this_page(message){
    alert(message);
    window.history.go(-1);
}
//obj is supposed to be from ReportData global
var extractStores =  _.memoize(
    function extractStores(obj){
	var stores = extractItems(obj,"stores");
	return _.map(stores,function(store){
		    return {type:'store',
		       id:store.store_id,
		       name:store.storeName,
		       number:store.number,
		       label : store.number + " : " + store.storeName};
		});
    },
    reportDataHash
);
//obj is supposed to be from ReportData global
var extractGroups = _.memoize(
    function extractGroups(obj){
	var groups = extractItems(obj,"groups");
	return _.map(groups,function(group){
		    return {type:'group',
		       id:group.group_id,
		       name:group.groupName,
		       label:group.groupName};
		});
    },
    reportDataHash
);

function extractItems(obj,field){
    var items = [];
    _.prewalk(function(o){
		  if(o && _.has(o,field)){
		      items.push(o[field]);
		  }
		  return o;
	      },obj);

    if(_.isEmpty(items) && obj[field]) {
	items = [obj[field]];
    }
    return _.flatten(items);
}

function topLevelEntity(reportData){
    if(ReportData.company && ReportData.company._id){return {id:ReportData.company._id,type:"company"};}
    else if(ReportData.group && ReportData.group.group_id){return {id:ReportData.group.group_id,type:"group"};}
    else if(ReportData.store && ReportData.store.store_id){return {id:ReportData.store.store_id,type:"store"};}
    else {return {id:undefined,type:undefined};}
};

function topLevelEntityInfo(reportData){
    if(reportData.company) {
	return {
	    company_id:reportData.company._id,
	    companyName:reportData.company.companyName
	};
    } else if(reportData.group) {
	return {
	    company_id:reportData.company_id,
	    companyName:reportData.companyName,
	    group_id:reportData.group.group_id,
	    groupName:reportData.group.groupName
	};
    } else if(reportData.store) {
	return {
	    company_id:reportData.company_id,
	    companyName:reportData.companyName,
	    group_id:reportData.group_id,
	    groupName:reportData.groupName,
	    store_id:reportData.store.store_id,
	    storeName:reportData.store.storeName,
	    storeNumber:reportData.store.number
	};
    }
};

var getParentsInfo = _.memoize(
    function getParentsInfo(reportData){
	//makes an object that looks like {company:,group:}
	if(reportData.company){
	    var company = {
		id:reportData.company._id,
		label:reportData.company.companyName,
		type : "company"
	    };
	}
	else if(reportData.company_id){
	    var company = {
		id:reportData.company_id,
		label:reportData.companyName,
		type : "company"
	    };
	}
	if(reportData.group){
	    var group = {
		id:reportData.group.group_id,
		label:reportData.group.groupName,
		type : "group"
	    };
	}
	else if(reportData.group_id){
	    var group = {
		id:reportData.group_id,
		label:reportData.groupName,
		type : "group"
	    };
	}

	if(reportData.store){
	    var store = {
		id:reportData.store.store_id,
		label:reportData.store.number+":"+reportData.store.storeName,
		number:reportData.store.number,
		type:"store"
	    };
	}
	return _.removeEmptyKeys({company:company,group:group,store:store});
    },
    reportDataHash
);


//woo memoize, hash function is crap by whatever
var reportDataToArray = _.memoize(
    function reportDataToArray(reportData){
	//todo: this may be the expand function that i wrote tests for in underscore_extended
	function combineWithSubpart(field){
	    return function(o){
		if (o[field]){
		    if(_.isObj(o[field])){
			var fields = o[field];
		    }
		    else{
			var fields = _.flatten(o[field]);
		    }
		    var o_without_field = _.removeKeys(o,field);
		    var expandedCombinedFields = _.mapCombine(fields,o_without_field);
		    return expandedCombinedFields;
		}
		return o;
	    };
	}
	return _(reportData).chain()
	    .prewalk_r(function(o){
                          if (o && o.hierarchy){
                              var groups = o.hierarchy.groups;
                              var o_without_field = _.removeKeys(o,'hierarchy');
                              var expandedCombinedFields = _.mapCombine(groups,o_without_field);
                              return _.combine(o_without_field,{groups : expandedCombinedFields});
                          }
                          return o;
                      })
            .prewalk_r(combineWithSubpart('terminals'))
	    .prewalk_r(combineWithSubpart('stores'))
	    .prewalk_r(combineWithSubpart('groups'))
	    .prewalk_r(combineWithSubpart('company'))
            .value();

    },
    reportDataHash
);

function reportDataHash(reportData){
    return topLevelEntity(reportData).id;
}

function groupFromStoreID(reportData,storeID){
    var foundGroup =  _(reportDataToArray(reportData)).chain()
	.find(function(item){
		  return item.store_id === storeID;
	      })
	.value();

    if(foundGroup){
	return foundGroup.group_id;
    }
    return undefined;
}

//this function will return a group obj if the stores list includes all of the stores that belong to the group
function groupsFromStoreSets(stores,groups,reportData){
    function groupID_stores_count_string(stores,groupID){
	return groupID+"?"+_.size(stores);
    }
    var groups_and_matched_store_size =
	_.chain(stores)
	.pluck('id')
	.matchTo(reportDataToArray(reportData),'store_id')
	.groupBy('group_id')
	.map(groupID_stores_count_string)
	.value();

    var groups_and_store_size =
	_.chain(reportDataToArray(reportData))
	.unique(false,function(item){return item.store_id;})
	.groupBy('group_id')
	.map(groupID_stores_count_string)
	.value();

    var groupsToSave =
	_.chain(groups_and_store_size)
	.intersection(groups_and_matched_store_size)
	.map(function(group_size_str){
		 return group_size_str.split("?")[0];
	     })
	.matchTo(groups,'id')
	.value();

    return groupsToSave;
}


// report page store drop downbox helper funtion
function updateStoreDropdown(isNotShowAll) {
    var groups = ReportData.company.hierarchy.groups;
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    $('option', dropdownStore).remove();

    if(!isNotShowAll) { dropdownStore.append('<option value="ALL">ALL</option>'); }

    if(dropdownGroup.val()=="ALL") {
	var stores = _(groups).chain().map(function(group) {
					     return group.stores;
					 }).flatten().value();

	_.each(stores, function(store) {
		   dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
                                        + "(" + store.number + ")" + '</option>');
               });
    } else {
	var group = _.filter(groups, function(group){ return group.group_id==dropdownGroup.val();});
	var stores = group[0].stores;
	_.each(stores, function(store) {
		   dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
                                        + "(" + store.number + ")" + '</option>');
               });
    }
};

// report page terminal drop downbox helper funtion
function updateTerminalDropdown(isNotShowAll) {
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");

    $('option', dropdownTerminal).remove();
    if(!isNotShowAll) {
	dropdownTerminal.append('<option value="ALL">ALL</option>');
    }

    if(dropdownStore.val()=="ALL") {
	var ids =
	    _($('option', dropdownStore))
	    .chain()
            .pluck('value')//map(function(option){return option.value})
            .reject(function(item){return item=="ALL";})
            .value();
    } else {
	var ids = [dropdownStore.val()];
    }

    if(!_.isEmpty(ReportData.company)) {
	var groups = ReportData.company.hierarchy.groups;
	var allStores =
	    _(groups)
	    .chain()
	    .pluck('stores')//.map(function(group) { return group.stores; })
	    .flatten()
	    .value();

    } else if(!_.isEmpty(ReportData.group)) {
	var allStores = ReportData.group.stores;
    } else if(!_.isEmpty(ReportData.store)) {
	var allStores = [ReportData.store];
    }

    var stores =
	_(ids)
	.chain()
	.map(function(id){
		 return _.filter(allStores, function(store){ return store.store_id==id;}); //this looks like a groupBy...
             })
	.flatten()
	.value();
    var terminals =
	_(stores)
	.chain()
	.pluck('terminals')//.map(function(store) {	 return store.terminals?store.terminals:[]; /*this looks like a pluck...*/     })
	.compact()
	.flatten()
	.value();

    if(_.size(terminals)) {
	_.each(terminals, function(terminal) {
		   dropdownTerminal.append('<option name='+terminal.terminal_label+' value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
               });
    } else {
	$('option', dropdownTerminal).remove();
        dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
    }
};