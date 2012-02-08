//obj is supposed to be from ReportData global
function extractStores(obj){
    var stores = extractItems(obj,"stores");
    return _.map(stores,function(store){
		     return {type:'store',
			     id:store.store_id,
			     name:store.storeName,
			     number:store.number,
			     label : store.number + " : " + store.storeName};
		 });
};
//obj is supposed to be from ReportData global
function extractGroups(obj){
    var groups = extractItems(obj,"groups");
    return _.map(groups,function(group){
		     return {type:'group',
			     id:group.group_id,
			     name:group.groupName,
			     label:group.groupName};
		 });
};

function extractItems(obj,field){
    var items = [];
    _.walk_pre(obj,function(o){
		   if(o[field]){
		       items.push(o[field]);
		   }
		   return o;
	       });
    
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
	    type : group
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
	    number:reportData.store.storeName,
	    type:"store"
	};
    }

    return _.removeEmptyKeys({company:company,group:group,store:store});
};

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
	    .walk_pre(function(o){
			  if (o.hierarchy){
			      var groups = o.hierarchy.groups;
			      var o_without_field = _.removeKeys(o,'hierarchy');
			      var expandedCombinedFields = _.mapCombine(groups,o_without_field);
			      return _.combine(o_without_field,{groups : expandedCombinedFields});
			  }
			  return o;
		      })
	    .walk_pre(combineWithSubpart('terminals'))
	    .walk_pre(combineWithSubpart('stores'))
	    .walk_pre(combineWithSubpart('groups'))
	    .walk_pre(combineWithSubpart('company'))
	    .value();

    },
    function(reportData){
	return topLevelEntity(reportData).id;
    }
);


function groupFromStoreID(reportData,storeID){
   var foundGroup =  _(reportDataToArray(reportData)).chain()
	.find(function(item){
		  return item.store_id === storeID;
	      })
	.value();

    return foundGroup.group_id;
}