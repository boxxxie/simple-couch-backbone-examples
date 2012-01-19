var couchapp = require('couchapp'), 
path = require('path');

ddoc = { _id:'_design/app'};

ddoc.rewrites = [
    {from: "downloads", to: "posdownload\/downloads.html"},
    {from: "admin", to: "login.html"},
    {from: "admin2", to: "backoffice admin/login.html"},
    {from: "login", to: "layered management/report.html"},
    {from: "new/*", to: "../../../*", method : "PUT"},
    {from: "terminals_rt7/*", to: "../../../terminals_rt7/*"},
    {from: "terminals_corp/*", to: "../../../terminals_corp/*"},
    {from: "cashouts/*", to: "../../../cashouts/*"},
    {from: "transactions/*", to: "../../../transactions/*"},
    {from: "cashedout_transactions/*", to: "../../../cashedout_transactions/*"},
    {from: "inventory_rt7/*", to: "../../../inventory_rt7/*"},
    {from: "inventory/*", to: "../../../inventory/*"},
    {from: "menus_corp/*", to: "../../../menus_corp/*"},
    {from: "menu_buttons/*", to: "../../../menu_buttons/*"},
    {from: "rewards_rt7/*", to: "../../../rewards_rt7/*"},
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
	var user = doc.user.toLowerCase();
	var pass = doc.password;
	var compID = doc._id;

	var company_emit_value = {company:compID, companyName:doc.companyName};
	var company_emit_key = {company:opName, user:user, password:pass};
	emit(company_emit_key,company_emit_value);
	
	doc.hierarchy.groups
	    .forEach(function(group){
			 var gpName = group.groupName.toLowerCase();
			 var user = group.user.toLowerCase();
			 var gpID = group.group_id;
			 var group_emit_value = _.extend({group:gpID, groupName:gpName}, company_emit_value);
			 var group_emit_key = {company:opName, group:gpName, user:user, password:group.password};
			 emit(group_emit_key, group_emit_value);
			 
			 group.stores
			     .forEach(function(store){
					  var sName = store.number.toLowerCase();
					  var user = store.user.toLowerCase();
					  var store_emit_value = _.extend({store:store.store_id, storeName:store.storeName, storeNumber:store.number},group_emit_value);
					  var store_emit_key = {company:opName, group:gpName, store:sName, user:user, password:store.password}; 
					  var store_emit_key2 = {company:opName, store:sName, user:user, password:store.password};
					  emit(store_emit_key,store_emit_value);
					  emit(store_emit_key2,store_emit_value);
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
