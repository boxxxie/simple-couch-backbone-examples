//obj is supposed to be from ReportData global
function extractStores(obj){
    var stores = [];
    _.walk_pre(obj,function(o){
		 if(o.stores){
		     stores = stores.concat(o.stores);
		 }
		 return o;
	     });
    return stores.map(function(store){
			  return {type:'store',
				  id:store.store_id,
				  name:store.storeName,
				  number:store.number};
		      });
};