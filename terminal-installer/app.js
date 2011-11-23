var couchapp = require('couchapp'), 
path = require('path');

ddoc = { _id:'_design/app'};

ddoc.views = {};

ddoc.views.user_pass = {
    map:function(doc){
	var _ = require("views/lib/underscore");
	require("views/lib/underscore_extended");
	emit({user:doc.user,password:doc.password,company:doc.operationalname},{company:doc._id});
	_.each(doc.hierarchy.groups,function(group){
		   emit({user:group.user,password:group.password,company:doc.operationalname,group:group.groupName},{company:doc._id,group:group.group_id});
		   _.each(group.stores,function(store){
			      emit({user:store.user,password:store.password,company:doc.operationalname,group:group.groupName,store:store.storeName},{company:doc._id,group:group.group_id,store:store.store_id});
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

ddoc.views.lib = couchapp.loadFiles('./common');
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
