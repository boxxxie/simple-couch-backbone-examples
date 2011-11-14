var install_db = db('install');

function guidGenerator() {
    var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


function checkLength( str, min, max) {
    if ( str.length > max || str.length < min ) {
	return false;
    } else {
	return true;
    }
};

function checkRegexp(str, regexp) {
    if(_.isEmpty(str)) return true; //accept empty strings
    if ( !( regexp.test(str) ) ) {
	return false;
    } else {
	return true;
    }
};

var Companies;

function validateCompany(newCompany_w_options) {
    var results = [];
    //TODO:checkvalidate
    if(_.isEmpty(newCompany_w_options.user)) {results = results.concat({fieldname:"user", isInvalid:true, errMsg:"EMPTY"});}
    else{if(!checkLength(newCompany_w_options.user,1,8)){results= results.concat({fieldname:"user", isInvalid:true, errMsg:"Master User ID  length should be 1~8"});}}
    if(_.isEmpty(newCompany_w_options.password)) { results = results.concat({fieldname:"password", isInvalid:true, errMsg:"EMPTY"});}
    else{if(!checkLength(newCompany_w_options.password,1,8)){results = results.concat({fieldname:"password", isInvalid:true, errMsg:"Master User Password  length should be 1~8"});}}
    if(_.isEmpty(newCompany_w_options.companyName)) {results = results.concat({fieldname:"company-name", isInvalid:true, errMsg:"EMPTY"});}
    if(_.isEmpty(newCompany_w_options.operationalname)) {results = results.concat({fieldname:"operationalname", isInvalid:true, errMsg:"EMPTY"});}
    
    var foundCompany = _.find(Companies.toJSON(), function(company){ return company.companyName==newCompany_w_options.companyName; });
    if(foundCompany) {
	if(newCompany_w_options.isCreate) {
	    results = results.concat({fieldname:"company-name", isInvalid:true, errMsg:"There's a same company name"});
	} else {
	    if(foundCompany._id!=newCompany_w_options.oldCompany.id) {
		results = results.concat({fieldname:"company-name", isInvalid:true, errMsg:"There's a same company name"});
	    }
	}
    }
    return results;
};

function addCompany(collection){
    return {success: function(resp){
		collection.create(resp);},
	    validator : function(resp) {	// resp has newCompanyData and isCreate
		return validateCompany(resp);
	    }};};

function editCompany(company){
    return {success:function(resp){
		company.save(resp);},
	    validator : function(resp) {	// resp has newCompanyData and isCreate
		_.extend(resp, {oldCompany:company});
		return validateCompany(resp);
	    }};};

function deleteCompany(collection, companyID) {
    var model = collection.getModelById(companyID);
    var groups = model.get('hierarchy').groups;;
    if(groups.length==0) {
	//TODO : doesn't work, needs to be checked : conflict error
	collection.remove(model);
	model.destory();
    } else {
	console.log("can't delete. this company has group(s).");
    }
}

function addGroup(model){
    return {success: function(resp){
		model.addGroup(resp);
	    },
	    validator : function(resp) {	// resp has newGroupData and isCreate
		return model.validateGroup(resp);
	    }
	   };};   
function editGroup(model, groupID){
    return {success:function(resp){
		model.editGroup(resp,groupID);},
	    validator : function(resp) {	// resp has newGroupData and isCreate and groupID
		_.extend(resp, {groupID:groupID});
		return model.validateGroup(resp);
	    }};};
function deleteGroup(model, groupID) {
    return model.deleteGroup(groupID);
}


function addStore(model,groupID){
    return {
	success: function(resp){
	    model.addStore(groupID,resp);},
	validator : function(resp) {
	    _.extend(resp, {groupID:groupID});
	    return model.validateStore(resp);
	}
    };};

function editStore(model,groupID,storeID){
    return {success:function(resp){
		model.editStore(groupID,storeID,resp);},
	    validator : function(resp) {
		_.extend(resp, {groupID:groupID, storeID:storeID});
		return model.validateStore(resp);
	    }
	   };};
function deleteStore(model, groupID, storeID) {
    return model.deleteStore(groupID,storeID);
}

function addTerminal(model,groupID,storeID){
    return {validator : function(resp) {
		_.extend(resp, {groupID:groupID, storeID:storeID});
		return model.validateTerminal(resp);
	    },
	    success: function(resp){
		model.addTerminal(groupID,storeID,resp);}};};

function editTerminal(companyID,groupID,storeID,terminalID){
    return {validator : function(resp) {
		_.extend(resp, {groupID:groupID, storeID:storeID, terminalID:terminalID});
		var model = Companies.getModelById(companyID);
		return model.validateTerminal(resp);
	    },
	    success:function(resp){
		var company = Companies.getModelById(companyID);
		company.editTerminal(groupID,storeID,terminalID,resp);}};};

// delete company or group or store
function deleteThing(companyID,groupID,storeID) {
    var model = Companies.getModelById(companyID);
    if(!_.isEmpty(storeID)) {
	deleteStore(model,groupID, storeID);
	console.log("deleteThing : " + companyID + ", " + groupID + ", " + storeID);
    } else if(!_.isEmpty(groupID)) {
	deleteGroup(model,groupID);
	console.log("deleteThing : " + companyID + ", " + groupID);
    } else if(!_.isEmpty(companyID)) {
	console.log("deleteThing : " + companyID);
	deleteCompany(Companies, companyID);		
    }
}

function quickView(template,companyID,groupID,storeID,terminalID){
    var company = Companies.getModelById(companyID);
    var companyJSON = company.toJSON();
    var for_TMP;
    if(!_.isEmpty(terminalID)){
	var terminal = company.getTerminal(groupID,storeID,terminalID);
	for_TMP = {terminal:terminal};
    } else if(!_.isEmpty(storeID)){
	var store = company.getStore(groupID,storeID);
	for_TMP = {store:store};
    } else if(!_.isEmpty(groupID)){
	var group = company.getGroup(groupID);
	for_TMP = {group:group};
    } else{
	for_TMP = {company:companyJSON};
    }
    quickViewDialog(ich[template](for_TMP));
}

function installTerminal(companyID,groupID,storeID,terminalID){
    //all of the IDs have to exist for the terminal to be installed. we'll trust that they are correct for now
    if(_.isEmpty(companyID)||_.isEmpty(groupID)||_.isEmpty(storeID)||_.isEmpty(terminalID)){
	alert("could not install the terminal");
	return;
    }
    var company = Companies.getModelById(companyID);
    var group = company.getGroup(groupID);
    var store = company.getStore(groupID,storeID);
    var terminal = company.getTerminal(groupID,storeID,terminalID);
    //last check to make sure we have all of the data we need.
    if(!company || !group || !store || !terminal){
	alert("The terminal could not be installed");
	return;
    }
    var installInfo = {terminal_id:terminal.terminal_id,
		       terminal_label:terminal.terminal_label,
		       store_id:store.store_id,
		       store_label:store.storeName,
		       group_id:group.group_id,
		       group_label:group.groupName,
		       company_id:company.get('_id'),
		       company_label:company.get('operationalname'),
		       location:_.selectKeys(terminal,["postalCode","areaCode","storeCode","companyCode","cityCode","countryCode"]),
		       creationDate:terminal.creationdate};

    if(terminal.installed){
	alert("The terminal has been installed already");
	return;	
    }

    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = "terminals_rt7";
    var Terminal = couchDoc.extend({urlRoot:urlBase + db});
    var terminalToInstall = new Terminal(installInfo);
    terminalToInstall.save({},{success:function(){alert("The terminal has been installed successfully");}});
    terminal.installed = true;
    company.save();
    
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

    function breadCrumb(companyID,groupID,storeID,terminalID){
	var companyName,groupName,storeName,terminalName;
	var model;
	if(companyID){
	    model = Companies.getModelById(companyID);
	    companyName =  model.get('operationalname');
	}
	if(groupID){
	    groupName = model.getGroup(groupID).groupName;
	}
	if(storeID){
	    storeName = model.getStore(groupID,storeID).storeName;
	}
	if(terminalID){
	    terminalName = model.getTerminal(groupID,storeID,terminalID).id;
	}
	return {companyName:companyName,groupName:groupName,storeName:storeName,terminalName:terminalName};
    }

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
		 var html = ich.company_management_page_TMP({createButtonLabel:"New Company"});
		 $('body').html(html);
		 $("#create-dialog")
		     .html(ich.companyInputDialog_TMP(
			       {title:"Make a new Company",
				company:{address:{},contact:{}}}));
		 CompanyCreateDialog("create-thing",addCompany(Companies));
	     },
	     modifyCompany:function(id){
		 console.log("modifyCompanies: " + id);
	     },
	     groupsManager:function(companyID){
		 console.log("groupsManager: " + companyID);
		 var model = Companies.getModelByName(companyID);
		 model.unbind('change');
		 var company = model.toJSON();
		 var html = ich.group_management_page_TMP(_.extend({createButtonLabel:"New Group",
								    company:company},
								   breadCrumb(companyID)));
		 $('body').html(html);
		 $("#create-dialog")
		     .html(ich.groupInputDialog_TMP(
			       {title:"Make a new Group",
				group:{address:{},contact:{}}}));
		 GroupCreateDialog("create-thing", _.extend(addGroup(model),{company:model} ));
	     },
	     modifyGroup:function(companyID, groupID){
		 console.log("modifyGroup: " + companyID + " " + groupID);
	     },
	     storesManager:function(companyID, groupID){
		 console.log("storesManager: " + companyID + " , " + groupID);
		 var model = Companies.getModelById(companyID);
		 model.unbind('change');
		 var company = model.toJSON();
		 var stores = model.getStores(groupID);
		 var stores_w_ids = _.map(stores,function(store){return _.extend(store,{company_id:company._id});});
		 var html = ich.store_management_page_TMP(_.extend({createButtonLabel:"New Store",
								    company:company.operationalname,
								    company_id:model.get('_id'),
								    groupName:model.getGroup(groupID).groupName},
								   breadCrumb(companyID,groupID)));
		 $('body').html(html);
		 $("#create-dialog")
		     .html(ich.storeInputDialog_TMP(
			       {title:"Make a new Store",
				store:{address:{}, contact:{}}}));
		 StoreCreateDialog("create-thing", _.extend(addStore(model,groupID),{company:model, groupID:groupID} ));
	     },
	     modifyStore:function(companyID, groupID, storeID){
		 console.log("modifyStore: " + companyID + " " + groupID + " " + storeID);

	     },
	     terminalsManager:function(companyID, groupID, storeID){
		 console.log("terminalsManager: " + companyID + " " + groupID + " " + storeID);
		 var model = Companies.getModelById(companyID);
		 model.unbind('change');
		 var company = model.toJSON();
		 var store = model.getStore(groupID,storeID);
		 var terminals = store.terminals;
		 var html = ich.terminal_management_page_TMP(
		     _.extend({createButtonLabel:"New Terminal",
			       operationalname:model.get('operationalname'),
			       company_id:model.get('_id'),
			       groupName:model.getGroup(groupID).groupName,
			       storeName:store.storeName},
			      breadCrumb(companyID,groupID,storeID)));
		 $('body').html(html);
		 $("#create-dialog")
		     .html(ich.terminalInputDialog_TMP(
			       {title:"Make a new Terminal",terminal:{}}));
		 TerminalCreateDialog("create-thing",addTerminal(model,groupID,storeID));
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
				view.el =_.first($("#list-things"));
				view.renderManagementPage();});
	     AppRouter.bind('route:modifyCompany', function(id){
				var model = Companies.getModelById(id);
				model.bind('change',function(){view.renderModifyPage(id);});
				console.log('companiesView:route:modifyCompany');
				view.renderModifyPage(id);});
	     
	 },
	 renderManagementPage:function(){
	     var view = this;
	     var companies = this.collection.toJSON();
	     var forTMP_w_stats = 
		 {list:_.map(companies,
			     function(company)
			     { var companyClone = _.clone(company);
			       var date = new Date(companyClone.creationdate);
			       _.extend(companyClone,{creationdate:date.toDateString()});
			       var companyStats = view.collection.get(company._id).companyStats();
			       var quickViewArgs = {template:"modify_company_page_TMP",
						    company_id:company._id};
			       return _.extend(companyClone,companyStats,quickViewArgs);})};
	     var html = ich.companiesTabel_TMP(forTMP_w_stats);
	     $(this.el).html(html);
	     console.log("companiesView renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(id){
	     var view = this;
	     var model = Companies.getModelById(id);
	     var modelJSON = model.toJSON();
	     $('body').html(ich.modify_company_page_TMP(_.extend({company:modelJSON,
								  company_id:id},
								 breadCrumb(id))));
	     $('fieldset').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.companyInputDialog_TMP({title:"Edit the Company",
								company:modelJSON}));
	     CompanyModifyDialog("edit-thing",editCompany(model));
	     console.log("companiesView renderModifyPage " + id);
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
	     _.bindAll(view,'renderManagementPage','renderModifyPage'); 
	     AppRouter.bind('route:groupsManager', function(companyID){
				console.log('groupsView:route:groupsManager');
				view.model = Companies.getModelById(companyID);
				view.model.bind('add:group',function(){view.renderManagementPage(companyID);});
				view.el =_.first($("#list-things"));
				view.renderManagementPage(companyID);});
	     AppRouter.bind('route:modifyGroup', function(companyID,groupID){
				var model = Companies.getModelById(companyID);
				view.model = model;
				model.bind('change',function(){view.renderModifyPage(companyID,groupID);});
				console.log('groupsView:route:modifyGroup' + " " + companyID + " " + groupID);
				view.renderModifyPage(companyID,groupID);});
	 },
	 renderManagementPage:function(companyID){
	     var view = this;
	     var groups = view.model.getGroups();
	     var forTMP = 
		 {list:_.map(groups,
			     function(group)
			     { var groupClone = _.clone(group);
			       var date = new Date(groupClone.creationdate);
			       _.extend(groupClone,{creationdate:date.toDateString()});
			       var companyStats = view.model.companyStats(group.group_id);
			       var quickViewArgs = {template:"modify_group_page_TMP",
						    company_id:companyID,
						    group_id:group.group_id};
			       return _.extend(groupClone,companyStats,quickViewArgs);})};
	     var html = ich.groupsTabel_TMP(forTMP);
	     $(this.el).html(html);
	     console.log("renderManagementPage groupsView");
	     return this;
	 },
	 renderModifyPage:function(companyID, groupID){
	     var view = this;
	     var model = Companies.getModelById(companyID);
	     var selectedgroup = view.model.getGroup(groupID);
	     $('body').html(ich.modify_group_page_TMP(_.extend({company_id:model.get("_id"), 
								group_id:selectedgroup.group_id, 
								groupName:selectedgroup.groupName, 
								operationalname:model.get("operationalname"),
								group:selectedgroup},
							       breadCrumb(companyID,groupID))));
             $('fieldset').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.groupInputDialog_TMP({title:"Edit the Group",group:selectedgroup}));
	     GroupModifyDialog("edit-thing",_.extend(editGroup(model,groupID), {company:model, groupName:selectedgroup.groupName}));
	     console.log("renderModifyPage groupsView");
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
				console.log('storeView:route:storesManager : ' + companyID + " " + groupID);
				view.model = Companies.getModelById(companyID);
				view.model.bind('add:store',function(){view.renderManagementPage(companyID, groupID);});
				view.el =_.first($("#list-things"));
				view.renderManagementPage(companyID, groupID);});
	     AppRouter.bind('route:modifyStore', function(companyID,groupID,storeID){
				var model = Companies.getModelById(companyID);
				view.model = model;
				model.bind('change',function(){view.renderModifyPage(companyID,groupID,storeID);});
				console.log('storeView:route:modifyStore' + " " + companyID + " " + groupID + " " + storeID);
				view.renderModifyPage(companyID,groupID,storeID);});
	 },
	 renderManagementPage:function(companyID,groupID){
	     var view = this;
	     var stores = view.model.getStores(groupID);
	     var forTMP = 
		 {list:_.map(stores,
			     function(store){
				 var storeClone = _.clone(store);
				 var date = new Date(storeClone.creationdate);
				 _.extend(storeClone,{creationdate:date.toDateString()});
				 var companyStats = view.model.companyStats(groupID,store.store_id);
				 var quickViewArgs = {template:"modify_store_page_TMP",
						      company_id:companyID, 
						      group_id:groupID,
						      store_id:store.store_id};
				 //fixme: i  don't know what the middle args are for
				 return _.extend(storeClone,companyStats,quickViewArgs);
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
	     var html = ich.modify_store_page_TMP(_.extend({operationalname: model.get('operationalname'),
							    company_id: model.get("_id") ,
							    group_id:group.group_id,
							    groupName:group.groupName,
							    storeName: storeToEdit.storeName,
							    store_id:storeToEdit.store_id,
							    store: storeToEdit},
							   breadCrumb(companyID,groupID,storeID)));
	     $('body').html(html);
	     $('fieldset').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.storeInputDialog_TMP({title:"Edit the store",store:storeToEdit}));
	     StoreModifyDialog("edit-thing",_.extend(editStore(model,groupID,storeID),{company:model, groupID:groupID, storeNum:storeToEdit.number }));
	     console.log("renderModifyPage stores view rendered " + companyID+""+groupID+" "+storeID);
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
				view.model.bind('add:terminal',function(){view.renderManagementPage(companyID,groupID,storeID);});
				view.el =_.first($("#list-things"));
				view.renderManagementPage(companyID,groupID,storeID);});
	     AppRouter.bind('route:modifyTerminal', function(companyID,groupID,storeID,terminalID){
				var model = Companies.getModelById(companyID);
				view.model = model;
				model.bind('change',function(){view.renderModifyPage(companyID,groupID,storeID,terminalID);});
				console.log('terminalsView:route:modifyTerminals' + " " + companyID + " " + groupID);
				view.renderModifyPage(companyID,groupID,storeID,terminalID);});
	     
	     
	 },
	 renderManagementPage:function(companyID,groupID,storeID){
	     var view = this;
	     var forTMP = {list:_.map(view.model.getTerminals(groupID,storeID),
				      function(terminal){
					  var clonedTerminal = _.clone(terminal);
					  var date = new Date(clonedTerminal.creationdate);
					  _.extend(clonedTerminal,{creationdate:date.toDateString()});
					  var quickViewArgs = {template:"modify_terminal_page_TMP",
							       company_id:companyID, 
							       group_id:groupID, 
							       store_id:storeID,
							       terminal_id:terminal.terminal_id};
					  return _.extend(clonedTerminal,quickViewArgs);})};
	     var html = ich.terminalsTabel_TMP(forTMP);
	     $(view.el).html(html);
	     console.log("renderManagementPage terminals view rendered");
	     return view;
	 },
	 renderModifyPage:function(companyID,groupID,storeID,terminalID){
	     var view = this;
	     var company = Companies.getModelById(companyID);
	     var terminalToEdit = company.getTerminal(groupID,storeID,terminalID);
	     var html = ich.modify_terminal_page_TMP(
		 _.extend({terminal:terminalToEdit},
			  breadCrumb(companyID,groupID,storeID,terminalID),
			  {terminal_id:terminalID,
			   store_id:storeID,
			   group_id:groupID,
			   company_id:companyID}));
	     $('body').html(html);
	     $("#dialog-hook").html(ich.terminalInputDialog_TMP({title:"Edit the Terminal",terminal:terminalToEdit}));
	     TerminalModifyDialog("edit-thing",editTerminal(companyID,groupID,storeID,terminalID));
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
