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