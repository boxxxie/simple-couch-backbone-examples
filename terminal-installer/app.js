var couchapp = require('couchapp'), 
path = require('path');

ddoc = { _id:'_design/app'};

ddoc.rewrites = [
    {from: "downloads", to: "posdownload\/downloads.html"},
    {from: "admin", to: "login.html"},
    {from: "login", to: "layered management/report.html"},
    {from: "new/*", to: "../../../*", method : "PUT"},
    {from: "terminals_rt7", to: "../../../terminals_rt7"},
    {from: "terminals_corp", to: "../../../terminals_corp"},
    {from: "cashouts/*", to: "../../../cashouts/*"},
    {from: "transactions/*", to: "../../../transactions/*"},
    {from: "cashedout_transactions/*", to: "../../../cashedout_transactions/*"},
    {from: "inventory_rt7/*", to: "../../../inventory_rt7/*"},
    {from: "menus_corp/*", to: "../../../menus_corp/*"},
    {from: "menu_buttons/*", to: "../../../menu_buttons/*"},
    {from: "/", to:'index.html'},
    {from: "/api", to:'../../'},
    {from: "/api/*", to:'../../*'},
    {from: "/*", to:'*'}

];




ddoc.views = {};

ddoc.views.user_pass = {
    map:function(doc){
	var _ = require("views/lib/underscore");
	require("views/lib/underscore_extended");
	
	var opName = doc.companyName.toLowerCase();
	var user = doc.user;
	var pass = doc.password;
	var compID = doc._id;

	emit({company:opName,user:user,password:pass},{company:compID});
	
	doc.hierarchy.groups
	    .forEach(function(group){
			 var gpName = group.groupName.toLowerCase();
			 var gpID = group.group_id;
			 emit({company:opName,group:gpName,user:group.user,password:group.password},{company:compID,group:gpID});
			 
			 group.stores
			     .forEach(function(store){
					  var sName = store.number.toLowerCase();
					  emit({company:opName,group:gpName,store:sName,user:store.user,password:store.password},{company:compID,group:gpID,store:store.store_id});
				      });
		     });
    }
};


ddoc.views.receipt_id = {
    map:function(doc){

	var _ = require("views/lib/underscore");
	var walk = require("views/lib/walk").walk;
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

ddoc.shows = {
    branch:function(doc,req){
	var args = req.query;
	var _ = require("views/lib/underscore");
	function getGroups(){return doc.hierarchy.groups;};
	function getGroup(groupID){return _.find(getGroups(),function(group){ return group.group_id == groupID;});};
	function getStores(groupID){return getGroup(groupID).stores;};
	function getStore(groupID,storeID){return _.find(getStores(groupID),function(store){return store.store_id == storeID;});};

	if(_.isEmpty(args.group)&&_.isEmpty(args.store)){return JSON.stringify(doc);}
	
	var groupID = args.group;
	if(_.isEmpty(groupID)){throw (['error', 'no_group_id', "The group ID wasn't given"]);}

	var group = getGroup(groupID);
	if(_.isEmpty(group)){throw (['error', 'no_group', "The group wasn't found in this company"]);}

	var storeID = args.store;
	if(_.isEmpty(storeID)){	return JSON.stringify(group);}
	
	var store = getStore(groupID,storeID);
	if(_.isEmpty(store)){throw (['error', 'no_store', "The store wasn't found in this company/group"]);}

	
	return JSON.stringify(store);
    }
};

ddoc.views.lib = couchapp.loadFiles('./common');
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
