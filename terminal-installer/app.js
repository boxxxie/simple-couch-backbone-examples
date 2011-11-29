var couchapp = require('couchapp'), 
path = require('path');

ddoc = { _id:'_design/app'};

ddoc.views = {};

ddoc.views.user_pass = {
    map:function(doc){
	var _ = require("views/lib/underscore");
	require("views/lib/underscore_extended");
	emit({company:doc.operationalname,user:doc.user,password:doc.password,company:doc.operationalname},{company:doc._id});
	_.each(doc.hierarchy.groups,function(group){
		   emit({company:doc.operationalname,group:group.groupName,user:group.user,password:group.password},{company:doc._id,group:group.group_id});
		   _.each(group.stores,function(store){
			      emit({company:doc.operationalname,group:group.groupName,store:store.storeName,user:store.user,password:store.password},{company:doc._id,group:group.group_id,store:store.store_id});
			  });
	       });
    }
};

ddoc.views.receipt_id = {
    map:function(doc){

	var _ = require("views/lib/underscore");
	const walk = require("views/lib/walk").walk;
	function emit_receipt_id(item){
	    if(!_.isEmpty(item.receipt_id)){
		emit(item.receipt_id,1);
	    }
	}
	walk(doc,function(item){
		 emit_receipt_id(item);
		 return item;
	     });
    }
};

ddoc.views.shows = {
    branch:function(doc,req){
	const args = req.query;
	var _ = require("views/lib/underscore");
	function getGroups(){return doc.hierarchy.groups;};
	function getGroup(groupID){return _.find(getGroups(),function(group){ return group.group_id == groupID;});};
	function getStores(groupID){return getGroup(groupID).stores;};
	function getStore(groupID,storeID){return _.find(getStores(groupID),function(store){return store.store_id == storeID;});};

	if(_.isEmpty(args.group)&&_.isEmpty(args.store)){return JSON.stringify(doc);}
	
	const groupID = args.group;
	if(_.isEmpty(groupID)){throw (['error', 'no_group_id', "The group ID wasn't given"]);}

	const group = getGroup(groupID);
	if(_.isEmpty(group)){throw (['error', 'no_group', "The group wasn't found in this company"]);}

	const storeID = args.store;
	if(_.isEmpty(storeID)){	return JSON.stringify(group);}
	
	const store = getStore(groupID,storeID);
	if(_.isEmpty(store)){throw (['error', 'no_store', "The store wasn't found in this company/group"]);}

	
	return JSON.stringify(store);
    }
};

ddoc.views.lib = couchapp.loadFiles('./common');
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
