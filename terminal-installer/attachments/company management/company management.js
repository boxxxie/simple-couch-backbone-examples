var Companies;
var rewardsModel;

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
    if ( !( regexp.test(str) ) ) {
	return false;
    } else {
	return true;
    }
};
function validateCompany(newCompany_w_options, previous) {
    function userExists(user){
	return Companies.find(function(company){return company.get('user')==user;});
    };
    function companyNameExists(companyName){
	return Companies.find(function(company){return company.get('companyName').toLowerCase()==companyName.toLowerCase();});
    };
    function companyOpNameExists(companyName){
	return Companies.find(function(company){return company.get('operationalname').toLowerCase()==companyName.toLowerCase();});
    };
    function validateUserName(user,companyWithSameUserID,previous){
	var results = [];
	if(_.isEmpty(user)){
	    results = results.concat({fieldname:"user", isInvalid:true});
	}
	else if(!checkRegexp(user,/^\w{1,8}$/)){
	    results = results.concat({fieldname:"user", isInvalid:true, errMsg:"The Master User ID length should be 1~8 characters"});
	}
	return results;
    };
    function validatePassword(password){
	var results = [];
	if(_.isEmpty(password)){
	    results = results.concat({fieldname:"password", isInvalid:true});
	}
	if(!checkRegexp(password,/^\w{1,8}$/)){
	    results = results.concat({fieldname:"password", isInvalid:true, errMsg:"The Master User Password length should be 1~8 characters"});
	}
	return results;
    };
    function validateCompanyName(companyName,companyWithSameName,addingNewCompany,previous,fieldName){
	var results = [];
	if(_.isEmpty(companyName)){
	    results = results.concat({fieldname:fieldName, isInvalid:true});
	}
	if((companyWithSameName && addingNewCompany) ||
	    (companyWithSameName && !previous) ||
	   companyWithSameName && companyWithSameName.get('_id') != previous._id) {
	    results = results.concat({fieldname:fieldName, isInvalid:true, errMsg:"A Company with the same name already exists"});
	}
	return results;
    };
    var results = [];
    var user = newCompany_w_options.user;
    var password = newCompany_w_options.password;
    var companyName = newCompany_w_options.companyName;
    var operationalname = newCompany_w_options.operationalname;
    var addingNewCompany = newCompany_w_options.isCreate;
    var companyWithSameName = companyNameExists(companyName);
    var companyWithSameOpName = companyOpNameExists(operationalname);
    var companyWithSameUserID = userExists(user);

    //verify user ID
    results = results.concat(validateUserName(user,companyWithSameUserID,previous));

    //verify password
    results = results.concat(validatePassword(password));

    //verify company operational name
    results = results.concat(validateCompanyName(operationalname,companyWithSameOpName,addingNewCompany,previous,'operationalname'));

    //verify company name
    results = results.concat(validateCompanyName(companyName,companyWithSameName,addingNewCompany,previous,'company-name'));

    return results;
};

function addCompany(collection){
    return {success: function(resp){
		collection.create(resp);},
	    validator : function(resp) {
		return validateCompany(resp,null);}
	   };};
function editCompany(company){
    return {success:function(resp){
		company.save(resp);},
	    validator : function(resp) {
		return validateCompany(resp,company.toJSON());}
	   };};

function deleteCompany(companyID) {
    var company = Companies.getModelById(companyID);
    var groups = company.get('hierarchy').groups;;
    if(_.isEmpty(groups)) {
	company.destroy(); 
    } else {
	alert("can't delete. this company has group(s).");
    }};
function addGroup(companyID){
    var company = Companies.getModelById(companyID);
    return {success: function(resp){
		company.addGroup(resp);
	    },
	    validator : function(resp) {
		return company.validateGroup(resp,null);
	    }
	   };};   
function editGroup(companyID, groupID){
    var company = Companies.getModelById(companyID);
    var previousGroup = company.getGroup(groupID);
    return {success:function(resp){
		company.editGroup(resp,groupID);},
	    validator : function(resp) {
		return company.validateGroup(resp,previousGroup);
	    }};};
function deleteGroup(companyID, groupID) {
    var company = Companies.getModelById(companyID);
    return company.deleteGroup(groupID);
}
function addStore(companyID,groupID){
    var company = Companies.getModelById(companyID);
    var comparisonStores = company.getStores(groupID);
    return {
	success: function(resp){
	    company.addStore(groupID,resp);},
	validator : function(resp) {
	    return company.validateStore(resp,null,comparisonStores);
	}};};
function editStore(companyID,groupID,storeID){
    var company = Companies.getModelById(companyID);
    var previousStore = company.getStore(groupID,storeID);
    var comparisonStores = company.getStores(groupID);
    return {success:function(resp){
		company.editStore(groupID,storeID,resp);},
	    validator : function(resp) {
		return company.validateStore(resp,previousStore,comparisonStores);
	    }};};
function deleteStore(companyID, groupID, storeID) {
    var company = Companies.getModelById(companyID);
    return company.deleteStore(groupID,storeID);
}
function addTerminal(companyID,groupID,storeID){
    var company = Companies.getModelById(companyID);
    var comparisonTerminals = company.getTerminals(groupID,storeID);
    return {validator : function(resp) {
		return company.validateTerminal(resp,null,comparisonTerminals);
	    },
	    success: function(resp){
		company.addTerminal(groupID,storeID,resp);}};};
function editTerminal(companyID,groupID,storeID,terminalID){
    var company = Companies.getModelById(companyID);
    var previousTerminal = company.getTerminal(groupID,storeID,terminalID);
    var comparisonTerminals = company.getTerminals(groupID,storeID);
    return {
    	validator : function(resp) {
	    return company.validateTerminal(resp,previousTerminal,comparisonTerminals);
	},
	success:function(resp){
	    company.editTerminal(groupID,storeID,terminalID,resp);}
    };};
// delete company or group or store
function deleteThing(companyID,groupID,storeID) {
    if(!_.isEmpty(storeID)) {
	deleteStore(companyID,groupID, storeID);
    } else if(!_.isEmpty(groupID)) {
	deleteGroup(companyID,groupID);
    } else if(!_.isEmpty(companyID)) {
	deleteCompany(companyID);		
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
    var html = ich[template](for_TMP)
    quickViewDialog(html);
}

function doc_setup(){
    var ts = $("#timespace");
    $(document).everyTime("1s", function(){
			      var date = new Date();
			      ts.empty();
			      ts.append(date.toDateString() + " / " + date.toLocaleTimeString());
			  }, 0);
    
    var companiesView;
    var companiesViewTest;
    var groupsView;
    var groupsViewTest;
    var storesView;
    var storesViewTest;
    var terminalsView;
    var terminalsViewTest;

    function breadCrumb(companyID,groupID,storeID,terminalID){
	var companyName,groupName,storeName,storeNumber,terminalName;
	var company;
	if(companyID){
	    company = Companies.getModelById(companyID);
	    companyName =  company.get('companyName');
	}
	if(groupID){
	    groupName = company.getGroup(groupID).groupName;
	}
	if(storeID){
	    storeName = company.getStore(groupID,storeID).storeName;
	    storeNumber = company.getStore(groupID,storeID).number;
	}
	if(terminalID){
	    terminalName = company.getTerminal(groupID,storeID,terminalID).id;
	}
	return {companyName:companyName,groupName:groupName,storeName:storeName,storeNumber:storeNumber,terminalName:terminalName};
    }

    function smartBreadCrumb(ReportData){
	if(ReportData.store){
	    return {breadCrumb:breadCrumb(ReportData.companyName, 
	     				  ReportData.groupName,
	     				  ReportData.store.storeName,
	     				  ReportData.store.number)};
	}
	else if(ReportData.group){
	    return {breadCrumb:breadCrumb(ReportData.companyName, 
					  ReportData.group.groupName)};
	}
	else if(ReportData.company){
	    return {breadCrumb:breadCrumb(ReportData.company.companyName)};
	}
	else{
	    return {};
	}

    }

    function autoBreadCrumb(){
	return smartBreadCrumb(ReportData);
    }

    Companies = 
	new (couchCollection(
		 {db:'install'},
		 {model:Company,
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
		 //TODO this should be refactored out to a render function
		 $('#main').html(html);
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
		 var company = Companies.getModelById(companyID);
		 company.unbind('change');
		 var companyJSON = company.toJSON();
		 var html = ich.group_management_page_TMP(_.extend({createButtonLabel:"New Group",
								    company:companyJSON},
								   breadCrumb(companyID)));
		 $("#main").html(html);
		 $("#create-dialog")
		     .html(ich.groupInputDialog_TMP(
			       {title:"Make a new Group",
				group:{address:companyJSON.address,contact:companyJSON.contact}}));
		 GroupCreateDialog("create-thing",addGroup(companyID));
	     },
	     modifyGroup:function(companyID, groupID){
		 console.log("modifyGroup: " + companyID + " " + groupID);
	     },
	     storesManager:function(companyID, groupID){
		 console.log("storesManager: " + companyID + " , " + groupID);
		 var company = Companies.getModelById(companyID);
		 company.unbind('change');
		 var companyJSON = company.toJSON();
		 var stores = company.getStores(groupID);
		 var stores_w_ids = _.map(stores,function(store){return _.extend(store,{company_id:companyJSON._id});});
		 var html = ich.store_management_page_TMP(_.extend({createButtonLabel:"New Store",
								    company:companyJSON.operationalname,
								    company_id:company.get('_id'),
								    groupName:company.getGroup(groupID).groupName},
								   breadCrumb(companyID,groupID)));
		 $("#main").html(html);
		 $("#create-dialog")
		     .html(ich.storeInputDialog_TMP(
			       {title:"Make a new Store",
				store:{address:{}, contact:{}}}));
		 StoreCreateDialog("create-thing", _.extend(addStore(companyID,groupID),{company:company, groupID:groupID} ));
	     },
	     modifyStore:function(companyID, groupID, storeID){
		 console.log("modifyStore: " + companyID + " " + groupID + " " + storeID);

	     },
	     terminalsManager:function(companyID, groupID, storeID){
		 console.log("terminalsManager: " + companyID + " " + groupID + " " + storeID);
		 var company = Companies.getModelById(companyID);
		 company.unbind('change');
		 var companyJSON = company.toJSON();
		 var store = company.getStore(groupID,storeID);
		 var terminals = store.terminals;
		 var html = ich.terminal_management_page_TMP(
		     _.extend({createButtonLabel:"New Terminal",
			       operationalname:company.get('operationalname'),
			       company_id:company.get('_id'),
			       groupName:company.getGroup(groupID).groupName,
			       storeName:store.storeName},
			      breadCrumb(companyID,groupID,storeID)));
		 $("#main").html(html);
		 $("#create-dialog")
		     .html(ich.terminalInputDialog_TMP(
			       {title:"Make a new Terminal",terminal:{}}));
		 TerminalCreateDialog("create-thing",addTerminal(companyID,groupID,storeID));
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
	     this.collection.bind('remove', view.renderManagementPage);
	     AppRouter.bind('route:companyManagementHome', function(){
				console.log('companiesView:route:companyManagementHome');
				view.el =_.first($("#list-things"));
				view.renderManagementPage();});
	     AppRouter.bind('route:modifyCompany', function(id){
				var company = Companies.getModelById(id);
				company.bind('change',function(){view.renderModifyPage(id);});
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
			       var date = companyClone.creationdate;
			       _.extend(companyClone,{creationdate:jodaDatePartFormatter(date)});
			       var companyStats = view.collection.get(company._id).companyStats();
			       var quickViewArgs = {template:"companyForm_TMP",
						    company_id:company._id};
			       return _.extend(companyClone,companyStats,quickViewArgs);})};
	     var html = ich.companiesTabel_TMP(forTMP_w_stats);
	     $(view.el).html(html);
	     console.log("companiesView renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(id){
	     var view = this;
	     var company = Companies.getModelById(id);
	     var companyJSON = company.toJSON();
	     var html = ich.modify_company_page_TMP(_.extend({company:companyJSON,
							      company_id:id},
							     breadCrumb(id)));
	     $("#main").html(html);
	     $('#form').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.companyInputDialog_TMP({title:"Edit the Company",
								company:companyJSON}));
	     
	     $("#btnModifyRewards").click(function(){
					      console.log("rewards!!");
					      function saveRewardsProgram() {
						  return function(mobqreditsconversion, qriketconversion) {
						      var rewardsJson = rewardsModel.toJSON();
						      var rewardsdown = $("#rewardsdown");
						      var opt = rewardsdown.val();
						      
						      if(opt=="none") {
							  rewardsJson.use_mobqredits = false;
							  rewardsJson.use_qriket = false;
						      } else if(opt=="mobqredits") {
							  rewardsJson.use_mobqredits = true;
							  rewardsJson.use_qriket = false;
						      } else {
							  rewardsJson.use_mobqredits = false;
							  rewardsJson.use_qriket = true;
						      }
						      
						      rewardsModel.save({use_mobqredits:rewardsJson.use_mobqredits,
									 mobqredits_conversion:mobqreditsconversion,
									 use_qriket:rewardsJson.use_qriket,
									 qriket_conversion:qriketconversion});
						  }	
					      };
					      
					      fetch_company_rewards(companyJSON._id)
					      (function(err,rewards){
	    					   console.log(rewards);
	    					   rewardsModel = rewards;
	    					   var rewardsJson = rewardsModel.toJSON();
	    					   
	    					   var html = ich.companyModifyRewardsDialog_TMP({MobQredits:rewardsJson});
	    					   
						   companyModifyRewardsViewDialog(html,{title:"Modify Rewards Program",
											saveRewardsProgram:saveRewardsProgram(),
											MobQredits:rewardsJson});
					       });
					  });
	     
	     CompanyModifyDialog("edit-thing",editCompany(company));
	     console.log("companiesView renderModifyPage " + id);
	     return this;
	 },
	 updateModel:function(){
	     this.company = this.collection.getModelById(Selection.get('company'));
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
				view.model.bind('delete:group',function(){view.renderManagementPage(companyID);});
				view.el =_.first($("#list-things"));
				view.renderManagementPage(companyID);});
	     AppRouter.bind('route:modifyGroup', function(companyID,groupID){
				var company = Companies.getModelById(companyID);
				view.model = company;
				company.bind('change',function(){view.renderModifyPage(companyID,groupID);});
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
			       var date = groupClone.creationdate;
			       _.extend(groupClone,{creationdate:jodaDatePartFormatter(date)});
			       var companyStats = view.model.companyStats(group.group_id);
			       var quickViewArgs = {template:"groupForm_TMP",
						    company_id:companyID,
						    group_id:group.group_id};
			       return _.extend(groupClone,companyStats,quickViewArgs);})};
	     var html = ich.groupsTabel_TMP(forTMP);
	     $(view.el).html(html);
	     console.log("renderManagementPage groupsView");
	     return this;
	 },
	 renderModifyPage:function(companyID, groupID){
	     var view = this;
	     var company = Companies.getModelById(companyID);
	     var selectedgroup = view.model.getGroup(groupID);
	     $("#main").html(ich.modify_group_page_TMP(_.extend({company_id:company.get("_id"), 
								 group_id:selectedgroup.group_id, 
								 groupName:selectedgroup.groupName, 
								 operationalname:company.get("operationalname"),
								 group:selectedgroup},
								breadCrumb(companyID,groupID))));
             $('#form').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.groupInputDialog_TMP({title:"Edit the Group",group:selectedgroup}));
	     GroupModifyDialog("edit-thing",_.extend(editGroup(companyID,groupID), {company:company, groupName:selectedgroup.groupName}));
	     console.log("renderModifyPage groupsView");
	     return this;
	 },
	 updateModel:function(){
	     this.company = this.collection.getModelById(Selection.get('company'));
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
				view.model.bind('delete:store',function(){view.renderManagementPage(companyID, groupID);});
				view.el =_.first($("#list-things"));
				view.renderManagementPage(companyID, groupID);});
	     AppRouter.bind('route:modifyStore', function(companyID,groupID,storeID){
				var company = Companies.getModelById(companyID);
				view.model = company;
				company.bind('change',function(){view.renderModifyPage(companyID,groupID,storeID);});
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
				 var date = storeClone.creationdate;
				 _.extend(storeClone,{creationdate:jodaDatePartFormatter(date)});
				 var companyStats = view.model.companyStats(groupID,store.store_id);
				 var quickViewArgs = {template:"storeForm_TMP",
						      company_id:companyID, 
						      group_id:groupID,
						      store_id:store.store_id};
				 //fixme: i  don't know what the middle args are for
				 return _.extend(storeClone,companyStats,quickViewArgs);
			     })};
	     var html = ich.storesTabel_TMP(forTMP);
	     $(view.el).html(html);
	     console.log("renderManagementPage store rendered");
	 },
	 renderModifyPage:function(companyID,groupID,storeID){
	     //var view = this;
	     var company = Companies.getModelById(companyID);
	     var group = company.getGroup(groupID);
	     var storeToEdit = company.getStore(groupID,storeID);
	     var html = ich.modify_store_page_TMP(_.extend({operationalname: company.get('operationalname'),
							    company_id: company.get("_id") ,
							    group_id:group.group_id,
							    groupName:group.groupName,
							    storeName: storeToEdit.storeName,
							    store_id:storeToEdit.store_id,
							    store: storeToEdit},
							   breadCrumb(companyID,groupID,storeID)));
	     $("#main").html(html);
	     $('#form').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.storeInputDialog_TMP({title:"Edit the store",store:storeToEdit}));
	     StoreModifyDialog("edit-thing",_.extend(editStore(companyID,groupID,storeID),{company:company, groupID:groupID, storeNum:storeToEdit.number }));
	     console.log("renderModifyPage stores view rendered " + companyID+""+groupID+" "+storeID);
	 }
	});



    terminalsView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage'); 
	     AppRouter.bind('route:terminalsManager',function(companyID,groupID,storeID){
				console.log('terminalsView:route:terminalsManager');
				view.model = Companies.getModelById(companyID);
				view.model.bind('add:terminal',function(){view.renderManagementPage(companyID,groupID,storeID);});
				view.el =_.first($("#list-things"));
				view.renderManagementPage(companyID,groupID,storeID);});
	     AppRouter.bind('route:modifyTerminal', function(companyID,groupID,storeID,terminalID){
				var company = Companies.getModelById(companyID);
				view.model = company;
				company.bind('change',function(){view.renderModifyPage(companyID,groupID,storeID,terminalID);});
				console.log('terminalsView:route:modifyTerminals' + " " + companyID + " " + groupID);
				view.renderModifyPage(companyID,groupID,storeID,terminalID);});
	     
	     
	 },
	 renderManagementPage:function(companyID,groupID,storeID){
	     var view = this;
	     var forTMP = {list:_.map(view.model.getTerminals(groupID,storeID),
				      function(terminal){
					  var clonedTerminal = _.clone(terminal);
					  var date = clonedTerminal.creationdate;
					  _.extend(clonedTerminal,{creationdate:jodaDatePartFormatter(date)});
					  var quickViewArgs = {template:"terminalForm_TMP",
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
	     $("#main").html(html);
	     $('#form').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.terminalInputDialog_TMP({title:"Edit the Terminal",terminal:terminalToEdit}));
	     TerminalModifyDialog("edit-thing",editTerminal(companyID,groupID,storeID,terminalID));
	     console.log("renderModifyPage terminals view rendered");
	     return view;	     
	 }
	});
    companiesViewTest = new companiesView(
	{
	    collection: Companies
	    //el:_.first($("#companies"))
	});
    groupsViewTest = new groupsView(
	{
	    //el:_.first($("#groups"))
	});
    storesViewTest = new storesView(
	{
	    //el:_.first($("#stores"))
	});
    terminalsViewTest = new terminalsView(
	{
	    //el:_.first($("#terminals"))
	});

    Backbone.history.start();

    $("#layeredloginpassword")
	.keyup(function(event){
  		   if(event.keyCode == 13){
		       login();
		   }
	       });

};
