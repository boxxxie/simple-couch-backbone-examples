var install_db = db('install');

var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     _id:"unknown",
	     hierarchy:{groups:[{name:"none"}]}
	 };
     },
     addGroup: function(groupToAdd){
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 groups || (groups = []);
	 //the below code may not work (in the if statement)
	 if(!_(groups).chain().pluck('name').contains(groupToAdd).value()){
	     var newGroups = groups.concat({name:groupToAdd});
	     var newHierarchy = {groups : newGroups};
	     this.set({hierarchy:newHierarchy});
	     this.save();
	     this.trigger("add:group"); //triggers go last
	 }
     },
     addStore: function(groupName,store){
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 if(!groups) return;
	 if(!_(groups).chain().pluck('name').contains(groupName)){}
	 var groupToAddTo = _.find(groups, function(group){return group.name == groupName;});
	 var stores = groupToAddTo.stores;
	 stores || (stores = []);
	 var newStores = stores.concat(store);
	 groupToAddTo.stores = newStores;
	 this.set({hierarchy:oldHierarchy}); //assuming that this was changed in place...
	 this.save();
	 this.trigger("add:store"); //triggers go last
     },
     addTerminal: function(groupName,storeName,terminal){
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 if(!groups) return;
	 if(!_(groups).chain().pluck('name').contains(groupName)){}
	 var groupToAddTo = _.find(groups, function(group){return group.name == groupName;});
	 var stores = groupToAddTo.stores;
	 stores || (stores = []);
	 var storeToAddTo = _.find(stores, function(store){return store.name == storeName;});
	 var terminals = storeToAddTo.terminals;
	 terminals || (terminals = []);
	 storeToAddTo.terminals = terminals.concat(terminal);
	 this.set({hierarchy:oldHierarchy}); //assuming that this was changed in place...
	 this.save();
	 this.trigger("add:terminal"); //triggers go last
     },
     getGroups:function(){
	 return this.get('hierarchy').groups;
     },
     getStores:function(groupName){
	 var hierarchy =  this.get('hierarchy');
	 var foundGroup = _.find(hierarchy.groups,function(group){ return group.name == groupName;});
	 return foundGroup.stores;
     },
     getTerminals:function(groupName,storeName){
	 var hierarchy =  this.get('hierarchy');
	 var foundGroup = _.find(hierarchy.groups,function(group){return group.name == groupName;});
	 var foundStore = _.find(foundGroup.stores,function(store){return store.name == storeName;});
	 return foundStore.terminals;
     },
     getTerminal:function(groupName,storeName,terminalID){
	 var terminals = this.getTerminals(groupName,storeName);
	 return _.find(terminals,function(terminal){return terminal.id == terminalID;});	 
     },
     getStore:function(groupName,storeName){
     	 var stores = this.getStores(groupName);
	 return _.find(stores,function(store){return store.name == storeName;});
     }
    });


function addCompany(collection){
    return {success: function(resp){
		collection.create(resp);
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
		 "company/:name": "modifyCompany", 
		 "company/:name/stores": "storesManager" ,
		 "company/:companyName/stores/:storeName": "modifyStore",
		 "company/:companyName/stores/:storeName/terminals": "terminalsManager",
		 "company/:companyName/stores/:storeName/terminals/:terminalID": "modifyterminal"/*,
		 "*actions": "defaultRoute" // Backbone will try match the route above first   	doesn't work the way i expected it to */	 
	     },
	     companyManagementHome:function(){
		 console.log("companyManagementHome");
		 $('body').html(ich.company_management_page_TMP());
		 newCompanyDialogSetup(addCompany(Companies));
	     },
	     modifyCompany:function(name){
		 console.log("modifyCompanies: " + name);
		 var model = Companies.getModelByName(name);
		 var modelJSON = model.toJSON();
		 $('body').html(ich.modify_company_page_TMP({company:modelJSON}));
		 $("#modify-company")
		     .click(function(){
				var user = $("#user"),
				password = $("#password"),
				_id = $("#company-name"),
				contact = $("#contact"),
				street = $("#address\\.street"),
				city = $("#address\\.city"),
				province = $("#address\\.province"),
				country = $("#address\\.country"),
				centrallyControlledMenus = $("#centrally-controlled-menus");
				var modelChanges = {user:user.val(),
						    password:password.val(),
						    contact:contact.val(),
						    address:{street:street.val(),
							     city:city.val(),
							     country:country.val(),
							     province:province.val()},
						    centrallyControlledMenus:centrallyControlledMenus.is(":checked"),
						    _id:_id.val()};
				model.set(modelChanges);
				model.save({success:function(){alert("saved!");}}); //FIXME:allert isn't being invoked
			    }
			   );
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
				contact = $("#contact"),
				street = $("#address\\.street"),
				city = $("#address\\.city"),
				province = $("#address\\.province"),
				country = $("#address\\.country"),
				mobQRedits = $("#mobQRedits"),
				autoPayment = $("#automated-payment");
				var storeChanges = {user:user.val(),
						    password:password.val(),
						    contact:contact.val(),
						    address : {street:street.val(),
							       city:city.val(),
							       country:country.val(),
							       province:province.val()},
						    mobQRedits:mobQRedits.is(":checked"),
						    autoPayment:autoPayment.is(":checked"),
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
	     }/*,
	     defaultRoute:function(){
		 console.log("defaultRoute");
		 this.companyManagementHome();
	     }*/
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
	     var forTMP = {list:this.collection.toJSON()};
	     var html = ich.companiesTabel_TMP(forTMP);
	     $(this.el).html(html);
	     console.log("companies view rendered");
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
					  function(terminal){return _.extend(terminal,{_id:companyName,storeName:storeName});})};
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
