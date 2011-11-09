var install_db = db('install');

function guidGenerator() {
    var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     companyName:"unknown",
	     hierarchy:{groups:[{groupName:"none",
				 group_id:guidGenerator()}]}
	 };
     },
     addGroup: function(groupName){
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 groups || (groups = []);
	 var newGroups = groups.concat({name:groupName,group_id:guidGenerator()});
	 var newHierarchy = {groups : newGroups};
	 this.set({hierarchy:newHierarchy});
	 this.save();
	 this.trigger("add:group"); //triggers go last

     },
     addStore: function(groupID,storeToAdd){
	 // var oldHierarchy = this.get('hierarchy');
	 var groupToAddTo = getGroup(groupID);
	 var stores = groupToAddTo.stores;
	 stores || (stores = []);
	 //this is supposed to check if we are adding a dup store number to this group of stores
	 if(!_(stores).chain().pluck('number').contains(storeToAdd.number).value()) {
	     var newStores = stores.concat(_.extend(store,{store_id:guidGenerator()}));
	     groupToAddTo.stores = newStores;
	     // this.set({hierarchy:oldHierarchy}); //assuming that this was changed in place...
	     this.save();
	     this.trigger("add:store"); //triggers go last
	 } else {
	     alert("The store you tried to add had the same number as one already in this group, please choose a different store number");
	 }
     },
     addTerminal: function(groupID,storeID,terminalToAdd){
	 // var oldHierarchy = this.get('hierarchy');
	 var storeToAddTo = getStore(groupID,storeID);
	 var storeTerminals = storeToAddTo.terminals;
	 storeTerminals || (storeTerminals = []);
	 if(!_(storeTerminals).chain().pluck('terminal_id').contains(terminalToAdd.terminal_id).value()) {
	     var newTerminals = storeTerminals.concat(terminalToAdd);
	     storeToAddTo.terminals = newTerminals;
	     // this.set({hierarchy:oldHierarchy}); //assuming that this was changed in place...
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
	 return _.find(hierarchy.groups,function(group){ return group.group_id == groupID;});
     },
     getStores:function(groupID){
	 var hierarchy =  this.get('hierarchy');
	 var foundGroup = _.find(hierarchy.groups,function(group){ return group.group_id == groupID;});
	 return foundGroup.stores;
     },
     getStore:function(groupID,storeID){
     	 var stores = this.getStores(groupID);
	 return _.find(stores,function(store){return store.store_id == storeID;});
     },
     getTerminals:function(groupID,storeID){
	 var hierarchy =  this.get('hierarchy');
	 var foundGroup = _.find(hierarchy.groups,function(group){return group.group_id == groupID;});
	 var foundStore = _.find(foundGroup.stores,function(store){return store.store_id == storeID;});
	 return foundStore.terminals;
     },
     getTerminal:function(groupID,storeID,terminalID){
	 var terminals = this.getTerminals(groupID,storeID);
	 return _.find(terminals,function(terminal){return terminal.terminal_id == terminalID;});	 
     },
     companyStats:function(){
	 var groups = this.get('hierarchy').groups;
	 var stores = _(groups).chain().map(function(group){return group.stores;}).flatten().compact().value();
	// stores || (stores = []);
	 var terminals = _(stores).chain().map(function(store){return store.terminals;}).flatten().compact().value();
	// terminals || (terminals = []);
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
function addGroup(model){
    return {success: function(resp){
		model.addGroup(resp);
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

function doc_setup(){
    var Companies;
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
		 "company/:companyName/groups/:groupsName": "modifyGroup",
		 "company/:companyName/groups/:groupsName/stores": "storesManager" ,
		 "company/:companyName/groups/:groupsName/stores/:storeName": "modifyStore",
		 "company/:companyName/groups/:groupsName/stores/:storeName/terminals": "terminalsManager",
		 "company/:companyName/groups/:groupsName/stores/:storeName/terminals/:terminalID": "modifyterminal"	 
	     },
	     companyManagementHome:function(){
		 console.log("companyManagementHome");
		 $('body').html(ich.company_management_page_TMP());
		 newCompanyDialogSetup(addCompany(Companies));
	     },
	     modifyCompany:function(id){
		 console.log("modifyCompanies: " + id);
		 var model = Companies.getModelById(id);
		 var modelJSON = model.toJSON();
		 $('body').html(ich.modify_company_page_TMP({company:modelJSON}));
		 $("#modify-company")
		     .click(function(){
				var user = $("#user"),
				password = $("#password"),
				//_id = $("#company-name"),
				conpanyName = $("#company-name"),
				//contact = $("#contact"),
				firstName = $("#contact\\.firstname"),
				lastName = $("#contact\\.lastname"),
				website = $("#contact\\.website"),
				email = $("#contact\\.email"),
				phone = $("#contact\\.phone"),
				street0 = $("#address\\.street0"),
				street1 = $("#address\\.street1"),
				street2 = $("#address\\.street2"),
				city = $("#address\\.city"),
				province = $("#address\\.province"),
				country = $("#address\\.country"),
				postalcode = $("#address\\.postalcode"),
				operationalname = $("#operationalname");
				var modelChanges = {user:user.val(),
						    password:password.val(),
						    contact:{firstname : firstName.val(),
							     lastname : lastName.val(),
							     website : website.val(),
							     email : email.val(),
							     phone : phone.val()},
						    address:{street0:street0.val(),
							     street1:street1.val(),
							     street2:street2.val(),
							     city:city.val(),
							     country:country.val(),
							     province:province.val(),
							     postalcode:postalcode.val()},
						    operationalname:operationalname.val(),	
						    companyName:companyName.val(),				
						    _id:_id.val()};

				model.set(modelChanges);
				model.save({success:function(){alert("saved!");}}); //FIXME:allert isn't being invoked
			    }
			   );
	     },
	     groupsManager:function(companyID){
		 console.log("groupsManager: " + companyID);
		 var model = Companies.getModelByName(companyID);
		 var modelObj = model.toJSON();
		 var groups = model.getGroups();
		 var groups_w_ids = _.map(groups,function(group){return _.extend(group,{_id:modelObj._id});});
		 $('body').html(ich.group_management_page_TMP());
		 newStoreDialogSetup(addGroup(model));
	     },
	     storesManager:function(name){
		 console.log("storesManager: " + name);
		 var model = Companies.getModelByName(name);
		 var modelObj = model.toJSON();
		 var stores = model.getStores("none");
		 var stores_w_ids = _.map(stores,function(store){return _.extend(store,{_id:modelObj._id});});
		 $('body').html(ich.store_management_page_TMP({list:stores_w_ids}));
		 newStoreDialogSetup(addStore(model,'none'));
	     },
	     modifyStore:function(companyName, storeName){
		 console.log("modifyStore: " + companyName + " " + storeName);
		 var model = Companies.getModelByName(companyName);
		 var storeToEdit = model.getStore("none",storeName);
		 var originalStoreName = storeName;
		 $('body').html(ich.modify_store_page_TMP({store:storeToEdit}));
		 $("#modify-store")
		     .click(function(){
				var user = $("#user"),
				password = $("#password"),
				storeName = $("#store-name"),
				storeNum = $("#store-num"),
				firstName = $("#contact\\.firstname"),
				lastName = $("#contact\\.lastname"),
				website = $("#contact\\.website"),
				email = $("#contact\\.email"),
				phone = $("#contact\\.phone"),
				street0 = $("#address\\.street0"),
				street1 = $("#address\\.street1"),
				street2 = $("#address\\.street2"),
				city = $("#address\\.city"),
				province = $("#address\\.province"),
				country = $("#address\\.country"),
				postalcode = $("#address\\.postalcode");
				
				var storeChanges = {user:user.val(),
						    password:password.val(),
						    contact:{firstname : firstName.val(),
							     lastname : lastName.val(),
							     website : website.val(),
							     email : email.val(),
							     phone : phone.val()},
						    address:{street0:street0.val(),
							     street1:street1.val(),
							     street2:street2.val(),
							     city:city.val(),
							     country:country.val(),
							     province:province.val(),
							     postalcode:postalcode.val()},
						    name:storeName.val(),
						    number:storeNum.val()};
				storeToEdit = _.extend(storeToEdit,storeChanges);
				model.save({success:function(){alert("saved!");}});
			    }
			   );
	     },
	     terminalsManager:function(companyName,storeName){
		 console.log("terminalsManager: " + companyName + " " + storeName);
		 var model = Companies.getModelByName(companyName);
		 var modelObj = model.toJSON();
		 var store = model.getStore("none",storeName);
		 var terminals = store.terminals;
		 var terminals_w_ids = _.map(store,function(store){return _.extend(store,{_id:companyName,storeName:storeName});});
		 $('body').html(ich.terminal_management_page_TMP({lists:terminals_w_ids}));
		 newTerminalDialogSetup(addTerminal(model,'none',storeName));
	     },
	     modifyterminal:function(companyName,storeName,terminalName){
		 console.log("modifyterminal: " + companyName + " " + storeName + " " + terminalName);
		 var model = Companies.getModelByName(companyName);
		 var terminalToEdit = model.getTerminal("none",storeName,terminalName);
		 var originalTerminalName = terminalName;
		 $('body').html(ich.modify_terminal_page_TMP({terminal:terminalToEdit}));
		 $("#modify-terminal")
		     .click(function(){
				var id = $("#terminal-id"),
				mobilePayment = $("#mobile-payment"),
				debitPayment = $("#debit-payment"),
				creditPayment = $("#credit-payment"),
				bonusCodes = $("#bonus-codes"),
				convertPercentage = $("#convert-percentage");
				var userBonusCodes;
				(bonusCodes.val())?userBonusCodes = _.flatten(bonusCodes.val().split(',')):userBonusCodes = null;
				var terminalChanges = {id:id.val(),
						       mobilePayment:mobilePayment.is(":checked"),
						       debitPayment:debitPayment.is(":checked"),
						       creditPayment: creditPayment.is(":checked"),
						       mobQRedits : {bonusCodes:userBonusCodes,
								     convertPercentage:convertPercentage.val()}
						      };
				terminalToEdit = _.extend(terminalToEdit,terminalChanges);
				model.save({success:function(){alert("saved!");}});
			    });
	     }
	 }));

    companiesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     this.collection.bind('reset',view.render);
	     this.collection.bind('change',view.render);
	     this.collection.bind('add',view.render);
	     this.bind('change:model',function(){console.log('change:model:companies');view.render();});
	     AppRouter.bind('route:companyManagementHome', function(){
				console.log('companiesView:route:companyManagementHome');
				view.el =_.first($("#companies"));
				view.render();});
	     
	 },
	 render:function(){
	     var view = this;
	     var forTMP = this.collection.toJSON();
	     var forTMP_w_stats = {list:_.map(forTMP,function(model){return _.extend(model,view.collection.get(model._id).companyStats());})};
	     var html = ich.companiesTabel_TMP(forTMP_w_stats);
	     $(this.el).html(html);
	     console.log("companies view rendered");
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
	     _.bindAll(view, 'render'); 
	     AppRouter.bind('route:groupsManager',function(companyID){
				console.log('groupsView:route:groupsManager');
				view.model = Companies.getModelByName(companyID);
				view.model.bind('add:group',view.render(companyID));
				view.el =_.first($("#groups"));
				view.render(companyID)();});
	     
	 },
	 render:function(companyID){
	     var view = this;
	     return function(){
		 var forTMP = {list:_.map(view.model.getGroups(),
					  function(group){
					      var groupClone = _.clone(group);
					      return _.extend(groupClone,{_id:companyID});
					  })};
		 var html = ich.groupsTabel_TMP(forTMP);
		 $(view.el).html(html);
		 console.log("groups view rendered");
		 return view;
	     };
	 }
	});

    storesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     AppRouter.bind('route:storesManager',function(name){
				console.log('storesView:route:storesManager');
				view.model = Companies.getModelByName(name);
				view.model.bind('add:store',view.render(name));
				view.el =_.first($("#stores"));
				view.render(name)();});
	     
	 },
	 render:function(companyName){
	     var view = this;
	     return function(){
		 var forTMP = {list:_.map(view.model.getStores("none"),
					  function(store){return _.extend(store,{_id:companyName});})};
		 var html = ich.storesTabel_TMP(forTMP);
		 $(view.el).html(html);
		 console.log("stores view rendered");
		 return view;
	     };
	 }
	});



    terminalsView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     AppRouter.bind('route:terminalsManager',function(companyName,storeName){
				console.log('terminalsView:route:terminalsManager');
				view.model = Companies.getModelByName(companyName);
				view.model.bind('add:terminal',view.render(companyName,storeName));
				view.el =_.first($("#terminals"));
				view.render(companyName,storeName)();});
	     
	 },
	 render:function(companyName,storeName){
	     var view = this;
	     return function(){
		 var forTMP = {list:_.map(view.model.getTerminals("none",storeName),
					  function(terminal){
					      var clonedTerminal = _.clone(terminal);
					      return _.extend(clonedTerminal,{_id:companyName,storeName:storeName});})};
		 var html = ich.terminalsTabel_TMP(forTMP);
		 $(view.el).html(html);
		 console.log("terminals view rendered");
		 return view;
	     };
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
