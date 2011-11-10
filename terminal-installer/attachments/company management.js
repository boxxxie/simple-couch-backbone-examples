var install_db = db('install');

function guidGenerator() {
    var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var Companies;

var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     companyName:"unknown",
	     hierarchy:{groups:[{groupName:"ungrouped",
				 group_id:guidGenerator()}]}
	 };
     },
     addGroup: function(group){
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 groups || (groups = []);
	 var newGroups = groups.concat(_.extend(group,{group_id:guidGenerator()}));
	 var newHierarchy = {groups : newGroups};
	 this.set({hierarchy:newHierarchy});
	 this.save();
	 this.trigger("add:group"); //triggers go last

     },
     editGroup:function(group){
	 var groupToMod = this.getGroup(group.group_id);
	 _.extend(groupToMod,group);
	 this.save();
     },
     editStore:function(store){
	 var storeToMod = this.getStore(store.store_id);
	 _.extend(storeToMod,store);
	 this.save();
     },
     editTerminal:function(terminal){
	 var terminalToMod = this.getTerminal(terminal.terminal_id);
	 _.extend(terminalToMod,terminal);
	 this.save();
     },
     addStore: function(groupID,storeToAdd){
	 var groupToAddTo = this.getGroup(groupID);
	 var stores = groupToAddTo.stores;
	 stores || (stores = []);
	 //this is supposed to check if we are adding a dup store number to this group of stores
	 if(!_(stores).chain().pluck('number').contains(storeToAdd.number).value()) {
	     var newStores = stores.concat(_.extend(storeToAdd,{store_id:guidGenerator()}));
	     groupToAddTo.stores = newStores;
	     this.save();
	     this.trigger("add:store"); //triggers go last
	 } else {
	     alert("The store you tried to add had the same number as one already in this group, please choose a different store number");
	 }
     },
     addTerminal: function(groupID,storeID,terminalToAdd){
	 var storeToAddTo = this.getStore(groupID,storeID);
	 var storeTerminals = storeToAddTo.terminals;
	 storeTerminals || (storeTerminals = []);
	 if(!_(storeTerminals).chain().pluck('terminal_id').contains(terminalToAdd.terminal_id).value()) {
	     var newTerminals = storeTerminals.concat(terminalToAdd);
	     storeToAddTo.terminals = newTerminals;
	     this.save();
	     this.trigger("add:terminal"); //triggers go last
	 } else {
	     alert("The terminal you tried to add had the same ID as one already in this store, please choose a different ID");
	 }
     },
     getGroups:function(){
	 return this.get('hierarchy').groups;
     },
     getGroup:function(groupID){
	 return _.find(this.getGroups(),function(group){ return group.group_id == groupID;});
     },
     getStores:function(groupID){
	 var foundGroup = this.getGroup(groupID); //_.filter(groups,function(group){ return group.group_id == groupID;});
	 return foundGroup.stores;
     },
     getStore:function(groupID,storeID){
     	 var stores = this.getStores(groupID);
	 return _.find(stores,function(store){return store.store_id == storeID;});
     },
     getTerminals:function(groupID,storeID){
	 var foundStore = this.getStore(groupID,storeID);
	 return foundStore.terminals;
     },
     getTerminal:function(groupID,storeID,terminalID){
	 var terminals = this.getTerminals(groupID,storeID);
	 return _.find(terminals,function(terminal){return terminal.terminal_id == terminalID;});	 
     },
     companyStats:function(groupID,storeID){
	 var groups = this.get('hierarchy').groups;
	 if(groupID){
	     groups = _.filter(groups,function(group){return group.group_id == groupID;}); //using filter instead of find because i only want to deal with arrays
	 }
	 var stores = _(groups).chain().map(function(group){return group.stores;}).flatten().compact().value();
	 if(storeID){
	     stores = _.filter(stores,function(store){return store.store_id == storeID;}); //using filter instead of find because i only want to deal with arrays
	 }
	 var terminals = _(stores).chain().map(function(store){return store.terminals;}).flatten().compact().value();
	 return {group_num:_.size(groups),
		 store_num:_.size(stores),
		 terminal_num:_.size(terminals)
		};	 
     }

    });


function addCompany(collection){
    return {success: function(resp){
		collection.create(resp);
	    }
	   };
};
function editCompany(company){
    return {success:function(resp){
		company.save(resp);
	    }
	   };
};
function addGroup(model){
    return {success: function(resp){
		model.addGroup(resp);
	    }
	   };
};   
function editGroup(model, groupID){
    return {success:function(resp){
		model.editGroup(_.extend(resp,{group_id:groupID})); 
	    }
	   };
};
function editStore(model,storeID){
    return {success:function(resp){
		model.editStore(_.extend(resp,{store_id:storeID}));
	    }
	   };
};
function editTerminal(model,terminalID){
    return {success:function(resp){
		model.editTerminal(_.extend(resp,{terminal_id:terminalID}));
	    }
	   };
};

function addStore(model,group){
    return {success: function(resp){
		model.addStore(group,resp);
	    }
	   };
};
function addTerminal(model,group,storeName){
    return {success: function(resp){
		model.addTerminal(group,storeName,resp);
	    }
	   };
};

function quickView(template,companyID,groupID,storeID,terminalID){
    var company = Companies.getModelById(companyID);
    var companyJSON = company.toJSON();
    var for_TMP;
    if(groupID){
	var group = company.getGroup(groupID);
	for_TMP = {groupName:group.groupName};
    } 
    /*else if(storeID) {
    	var group = company.getGroup(groupID);
    	var store = company.getStore(groupID, storeID);
    	for_TMP = {groupName:group.groupName, storeName:store.storeName};
    }*/ 
    else {
	for_TMP = {company:companyJSON};
    }
    console.log(ich[template](for_TMP));
    quickViewDialog(ich[template](for_TMP));
}

function doc_setup(){
 
    var companiesView;
    var companiesViewTest;
    var groupsView;
    var groupsViewTest;
    var storesView;
    var storesViewTest;
    var terminalsView;
    var terminalsViewTest;

    Companies = 
	new (couchCollection(
		 {db:'install'},
		 {model:Company,
		  getModelByName : function(modelName){
		      return this.find(function(model){return model.get('_id') == modelName;});
		  },
		  getModelById : function(modelId){
		      return this.find(function(model){return model.get('_id') == modelId;});
		  },
		  getSelectedModel : function(){
		      return this.find(function(model){return model.selected == true;});
		  }
		 }));
    Companies.fetch();

    var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"companyManagementHome",
		 "company/:_id": "modifyCompany", 
		 "company/:_id/groups": "groupsManager" ,
		 "company/:_id/groups/:group_id": "modifyGroup",
		 "company/:_id/groups/:group_id/stores": "storesManager" ,
		 "company/:_id/groups/:group_id/stores/:storeName": "modifyStore",
		 "company/:_id/groups/:group_id/stores/:storeName/terminals": "terminalsManager",
		 "company/:_id/groups/:group_id/stores/:storeName/terminals/:terminalID": "modifyTerminal"	 
	     },
	     companyManagementHome:function(){
		 console.log("companyManagementHome");
		 $('body').html(ich.company_management_page_TMP());
		 $("#companyCreateDialog").html(ich.companyInputDialog_TMP({title:"Make a new Company",company:{address:{},contact:{}}}));
		 CompanyInputDialog("create-company",addCompany(Companies));

	     },
	     modifyCompany:function(id){
		 console.log("modifyCompanies: " + id);
	     },
	     groupsManager:function(companyID){
		 console.log("groupsManager: " + companyID);
		 var model = Companies.getModelByName(companyID);
		 model.unbind('change');
		 var modelObj = model.toJSON();
		 var groups = model.getGroups();
		 var groups_w_ids = _.map(groups,function(group){return _.extend(group,{_id:modelObj._id});});
		 $('body').html(ich.group_management_page_TMP({company:modelObj}));
		 $("#groupCreateDialog").html(ich.groupInputDialog_TMP({title:"Make a new Group",group:{}}));
		 GroupInputDialog("create-group", addGroup(model));
	     },
	     modifyGroup:function(companyID, groupID){
		 console.log("modifyGroup: " + companyID + " " + groupID);
	     },
	     storesManager:function(companyID, groupID){
		 console.log("storesManager: " + companyID + " , " + groupID);
		 var model = Companies.getModelById(companyID);
		 model.unbind('change');
		 var modelObj = model.toJSON();
		 var stores = model.getStores(groupID);
		 var stores_w_ids = _.map(stores,function(store){return _.extend(store,{_id:modelObj._id});});
		 $('body').html(ich.store_management_page_TMP({operationalname:model.get('operationalname'),
							       _id:model.get('_id'),
							       groupName:model.getGroup(groupID).groupName}));
         $("#storeCreateDialog").html(ich.storeInputDialog_TMP({title:"Make a new Store",store:{address:{}, contact:{}}}));
		 StoreInputDialog("create-store",addStore(model,groupID));
	     },
	     
	     modifyStore:function(companyID, groupID, storeID){
		 console.log("modifyStore: " + companyID + " " + groupID + " " + storeID);

	     },
	     terminalsManager:function(companyID, groupID, storeID){
		 console.log("terminalsManager: " + companyID + " " + groupID + " " + storeID);
		 var model = Companies.getModelById(companyID);
		 model.unbind('change');
		 var modelObj = model.toJSON();
		 var store = model.getStore(groupID,storeID);
		 var terminals = store.terminals;
		 $('body').html(ich.terminal_management_page_TMP({operationalname:model.get('operationalname'),
							       _id:model.get('_id'),
							       groupName:model.getGroup(groupID).groupName,
							       storeName:store.storeName}));
		 $("#terminalCreateDialog").html(ich.terminalInputDialog_TMP({title:"Make a new Terminal",terminal:{}}));
		 TerminalInputDialog("create-terminal",addTerminal(model,groupID,storeID));
	     },
	     modifyTerminal:function(companyID, groupID, storeID,terminalID){
		 console.log("modifyterminal: " + companyID + " " + groupID + " " + storeID + " " + terminalID);
	     }
	 }));

    companiesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage'); 
	     this.collection.bind('reset',view.renderManagementPage);
	     this.collection.bind('add',view.renderManagementPage);
	     AppRouter.bind('route:companyManagementHome', function(){
				console.log('companiesView:route:companyManagementHome');
				view.el =_.first($("#companies"));
				view.renderManagementPage();});
	     AppRouter.bind('route:modifyCompany', function(id){
				var model = Companies.getModelById(id);
				model.bind('change',function(){view.renderModifyPage(id);});
				console.log('companiesView:route:modifyCompany');
				view.el =_.first($("#companies"));
				view.renderModifyPage(id);});
	     
	 },
	 renderManagementPage:function(){
	     var view = this;
	     var forTMP = this.collection.toJSON();
	     var forTMP_w_stats = {list:_.map(forTMP,function(model){return _.extend(model,view.collection.get(model._id).companyStats());})};
	     var html = ich.companiesTabel_TMP(forTMP_w_stats);
	     $(this.el).html(html);
	     console.log("renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(id){
	     var view = this;
	     var model = Companies.getModelById(id);
	     var modelJSON = model.toJSON();
	     $('body').html(ich.modify_company_page_TMP({company:modelJSON}));
	     $("#dialog-hook").html(ich.companyInputDialog_TMP({title:"Edit the Company",company:modelJSON}));
	     CompanyInputDialog("modify-company",editCompany(model));
	     console.log("renderModifyPage " + id);
	     return this;
	 },
	 updateModel:function(){
	     this.model = this.collection.getModelByName(Selection.get('company'));
	     this.trigger("change:model");
	 }
	});
    groupsView = Backbone.View.extend(
	{initialize:function(){
		 var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage'); 

	     AppRouter.bind('route:groupsManager', function(companyID){
				console.log('groupsView:route:groupsManager');
				view.model = Companies.getModelById(companyID);
				view.model.bind('add:group',function(){view.renderManagementPage(companyID);});
				view.el =_.first($("#groups"));
				view.renderManagementPage(companyID);});
	     AppRouter.bind('route:modifyGroup', function(companyID,groupID){
				var model = Companies.getModelById(companyID);
				view.model = model;
				model.bind('change',function(){view.renderModifyPage(companyID,groupID);});
				console.log('groupsView:route:modifyGroup' + " " + companyID + " " + groupID);
				view.el =_.first($("#groups"));
				view.renderModifyPage(companyID,groupID);});
	 },
	 renderManagementPage:function(companyID){
	     var view = this;
	     var forTMP = view.model.getGroups();
	     var forTMP_w_stats = {list:_.map(forTMP,function(group){return _.extend(group,{_id:companyID},view.model.companyStats(group.group_id));})};
	     var html = ich.groupsTabel_TMP(forTMP_w_stats);
	     $(this.el).html(html);
	     console.log("renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(companyID, groupID){
	     var view = this;
	     var model = Companies.getModelById(companyID);
	     var selectedgroup = view.model.getGroup(groupID);
	     $('body').html(ich.modify_group_page_TMP({_id:model.get("_id"), group_id:selectedgroup.group_id, groupName:selectedgroup.groupName, operationalname:model.get("operationalname")}));
	     $("#dialog-hook").html(ich.groupInputDialog_TMP({title:"Edit the Group",group:selectedgroup}));
	     GroupInputDialog("modify-group",editGroup(model,groupID));
	     console.log("renderModifyPage " + companyID + " " + groupID);
	     return this;
	 },
	 updateModel:function(){
	     this.model = this.collection.getModelByName(Selection.get('company'));
	     this.trigger("change:model");
	 }
	 
	});

    storesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage'); 

	     AppRouter.bind('route:storesManager', function(companyID, groupID){
				console.log('groupsView:route:groupsManager : ' + companyID + " " + groupID);
				view.model = Companies.getModelById(companyID);
				view.model.bind('add:store',function(){view.renderManagementPage(companyID, groupID);});
				view.el =_.first($("#stores"));
				view.renderManagementPage(companyID, groupID);});
	     AppRouter.bind('route:modifyStore', function(companyID,groupID,storeID){
				var model = Companies.getModelById(companyID);
				view.model = model;
				model.bind('change',function(){view.renderModifyPage(companyID,groupID,storeID);});
				console.log('groupsView:route:modifyGroup' + " " + companyID + " " + groupID + " " + storeID);
				view.el =_.first($("#stores"));
				view.renderModifyPage(companyID,groupID,storeID);});
	 },
	 renderManagementPage:function(companyID,groupID){
	     var view = this;
		 var forTMP = {list:_.map(view.model.getStores(groupID),
					  function(store){
					      var storeClone = _.clone(store);
					      return _.extend(storeClone,{_id:companyID, group_id:groupID },view.model.companyStats(groupID,store.store_id));
					  })};
		 var html = ich.storesTabel_TMP(forTMP);
		 $(view.el).html(html);
		 console.log("renderManagementPage store rendered");
		 return view;
	 },
	 renderModifyPage:function(companyID,groupID,storeID){
	     		 var model = Companies.getModelById(companyID);
		 var group = model.getGroup(groupID);
		 var storeToEdit = model.getStore(groupID,storeID);
		 $('body').html(ich.modify_store_page_TMP({operationalname: model.get('operationalname'),
							   _id: model.get("id") ,
							   group_id:group.group_id,
							   groupName:group.groupName,
							   storeName: storeToEdit.storeName,
							   store_id:storeToEdit.store_id,
							   store: storeToEdit}));
	     $("#dialog-hook").html(ich.storeInputDialog_TMP({title:"Edit the store",terminal:storeToEdit}));
	     TerminalInputDialog("modify-store",editTerminal(model,storeID));
	     console.log("renderModifyPage stores view rendered");
	     return view;
	 }
	});



    terminalsView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage'); 
	     AppRouter.bind('route:terminalsManager',function(companyID,groupID,storeID){
				console.log('terminalsView:route:terminalsManager');
				view.model = Companies.getModelByName(companyID);
				view.model.bind('add:terminal',view.renderManagementPage(companyID,groupID,storeID));
				view.el =_.first($("#terminals"));
				view.renderManagementPage(companyID,groupID,storeID);});
	     AppRouter.bind('route:modifyTerminal', function(companyID,groupID,storeID,terminalID){
				var model = Companies.getModelById(companyID);
				view.model = model;
				model.bind('change',function(){view.renderModifyPage(companyID,groupID,storeID,terminalID);});
				console.log('terminalsView:route:modifyTerminals' + " " + companyID + " " + groupID);
				view.el =_.first($("#terminals"));
				view.renderModifyPage(companyID,groupID,storeID,terminalID);});
		 
	     
	 },
	 renderManagementPage:function(companyID,groupID,storeID){
	     var view = this;
		 var forTMP = {list:_.map(view.model.getTerminals(groupID,storeID),
					  function(terminal){
					      var clonedTerminal = _.clone(terminal);
					      return _.extend(clonedTerminal,{_id:companyID, group_id:groupID, store_id:storeID});})};
		 var html = ich.terminalsTabel_TMP(forTMP);
		 $(view.el).html(html);
		 console.log("renderManagementPage terminals view rendered");
		 return view;
	 },
	 renderModifyPage:function(companyID,groupID,storeID,terminalID){
	     var view = this;
		 var model = Companies.getModelById(companyID);
		 var terminalToEdit = model.getTerminal(groupID,storeID,terminalID);
		 var group = model.getGroup(groupID);
		 var store = model.getStore(groupID,storeID);
		 $('body').html(ich.modify_terminal_page_TMP(
				    {operationalname: model.get('operationalname'),
				     _id: model.get("id") ,
				     group_id:group.group_id,
				     groupName:group.groupName,
				     storeName: store.storeName,
				     store_id:store.store_id,
				     terminal_id:terminalToEdit.terminal_id,
				     terminal:terminalToEdit}));
		 $("#dialog-hook").html(ich.terminalInputDialog_TMP({title:"Edit the Terminal",terminal:terminalToEdit}));
		 TerminalInputDialog("modify-terminal",editTerminal(model,terminalID));
		 console.log("renderModifyPage terminals view rendered");
		 return view;	     
	 }
	});
    companiesViewTest = new companiesView(
	{
	    collection: Companies,
	    el:_.first($("#companies"))
	});
    groupsViewTest = new groupsView(
	{
	    el:_.first($("#groups"))
	});
    storesViewTest = new storesView(
	{
	    el:_.first($("#stores"))
	});
    terminalsViewTest = new terminalsView(
	{
	    el:_.first($("#terminals"))
	});

    Backbone.history.start();

};
