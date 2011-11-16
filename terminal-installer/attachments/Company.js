function randInt_maker(length){
    return function(){
	return parseInt(Math.random()*Math.pow(10,length))+"";
    };
}

var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     companyName:"unknown",
	     hierarchy:{groups:[]}
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
     editGroup:function(group,groupID){
	 var groupToMod = this.getGroup(groupID);
	 _.extend(groupToMod,group);
	 this.save();
     },
     validateGroup : function (newGroup_w_options,groupID) {
	 var results = [];
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 var foundGroups = _.filter(groups, function(group){ return group.groupName==newGroup_w_options.groupName; });
	 
	 //validate user
	 if(_.isEmpty(newGroup_w_options.user)) {results = results.concat({fieldname:"user", isInvalid:true, errMsg:"Master User ID  length should be 1~8"});}
	 else{if(!checkLength(newGroup_w_options.user,1,8)){results= results.concat({fieldname:"user", isInvalid:true, errMsg:"Master User ID  length should be 1~8"});}}
	 
	 //validate pass
	 if(_.isEmpty(newGroup_w_options.password)) { results = results.concat({fieldname:"password", isInvalid:true, errMsg:"Master User Password  length should be 1~8"});}
	 else{if(!checkLength(newGroup_w_options.password,1,8)){results = results.concat({fieldname:"password", isInvalid:true, errMsg:"Master User Password  length should be 1~8"});}}
	 
	 //validate name
	 if(_.isEmpty(newGroup_w_options.groupName)) {results = results.concat({fieldname:"group-name", isInvalid:true, errMsg:"The Group Name should be filled in"});}
	 if((!newGroup_w_options.isCreate)) {
	     if((foundGroups.length>0) && !_.contains(_.pluck(foundGroups, "group_id"),newGroup_w_options.groupID)) {
		 results = results.concat({fieldname:"group-name", isInvalid:true, errMsg:"A Group with this name already exists in this Company"});
	     }
	 } else {
	     if(foundGroups.length>0) {results = results.concat({fieldname:"group-name", isInvalid:true, errMsg:"A Group with this name already exists in this Company"});}
	 }

	 return results;
     },
     deleteGroup:function(groupID) {
     	 var groupToDel = this.getGroup(groupID);
     	 var stores = this.getStores(groupID);
     	 if((typeof stores === "undefined") || stores.length==0) {
     	     var oldHierarchy = this.get('hierarchy');
	     var groups = oldHierarchy.groups;
	     var newGroups = _.reject(groups, function(group) {return group.group_id==groupID;});
	     var newHierarchy = {groups : newGroups};
	     this.set({hierarchy:newHierarchy});
	     this.save();
	     this.trigger("delete:group"); //triggers go last
	     console.log("delete completed");
     	 } else {
     	     alert("Can't delete group, group has store(s)");
     	 }
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
     editStore:function(groupID,storeID,store){
	 var storeToMod = this.getStore(groupID,storeID);
	 _.extend(storeToMod,store);
	 this.save();
     },
     validateStore : function (newStore_w_options) {
	 var results = [];
	 var stores = this.getStores(newStore_w_options.groupID);
	 var foundStores = _.filter(stores, function(store){ return store.number==newStore_w_options.number; });

	 if(_.isEmpty(newStore_w_options.user)) {results = results.concat({fieldname:"user", isInvalid:true, errMsg:"EMPTY"});}
	 else{if(!checkLength(newStore_w_options.user,1,8)){results= results.concat({fieldname:"user", isInvalid:true, errMsg:"Master User ID  length should be 1~8"});}}
	 if(_.isEmpty(newStore_w_options.password)) { results = results.concat({fieldname:"password", isInvalid:true, errMsg:"EMPTY"});}
	 else{if(!checkLength(newStore_w_options.password,1,8)){results = results.concat({fieldname:"password", isInvalid:true, errMsg:"Master User Password  length should be 1~8"});}}
	 if(_.isEmpty(newStore_w_options.number)) { results = results.concat({fieldname:"store-num", isInvalid:true, errMsg:"EMPTY"});}
	 else{if(!checkRegexp(newStore_w_options.number, /^([0-9])+$/i )){results = results.concat({fieldname:"store-num", isInvalid:true, errMsg:"Store Number should be number"});}}
	 if(_.isEmpty(newStore_w_options.storeName)) {results = results.concat({fieldname:"store-name", isInvalid:true, errMsg:"EMPTY"});}

	 
	 
	 if((!newStore_w_options.isCreate)) {
	     if((foundStores.length>0) && !_.contains(_.pluck(foundStores, "store_id"),newStore_w_options.storeID)) {
		 results = results.concat({fieldname:"store-number", isInvalid:true, errMsg:"There's a same Store Number in this Group"});
	     }
	 } else {
	     if(foundStores.length>0) {results = results.concat({fieldname:"store-number", isInvalid:true, errMsg:"There's a same Store Number in this Group"});}
	 }

	 return results;
     },
     deleteStore:function(groupID,storeID) {
     	 var terminals = this.getTerminals(groupID,storeID);
     	 if((typeof terminals === "undefined") || terminals.length==0) {
     	     var groupToDelTo = this.getGroup(groupID);
	     //var stores = this.getStores(groupID);
	     var newStores = _.reject(groupToDelTo.stores, function(store) {return store.store_id==storeID;});
	     groupToDelTo.stores = newStores;
	     this.save();
	     this.trigger("delete:store"); //triggers go last
	     console.log("delete completed");
     	 } else {
     	     alert("Can't delete store, store has terminal(s)");
     	 }
     },
     
     addTerminal: function(groupID,storeID,terminalToAdd){
	 var recipt_id_maker = randInt_maker(10);
	 var storeToAddTo = this.getStore(groupID,storeID);
	 var storeTerminals = storeToAddTo.terminals;
	 storeTerminals || (storeTerminals = []);
	 
	 //verify if terminal has the same label as another
	 if(_(storeTerminals).chain().pluck('terminal_label').contains(terminalToAdd.terminal_label).value()) {
	     alert("The terminal you tried to add had the same ID as one already in this store, please choose a different ID");
	     return;
	 }

	 var newTerminals = storeTerminals.concat(_.extend(terminalToAdd,{terminal_id:guidGenerator(),recipt_id:recipt_id_maker()}));
	 storeToAddTo.terminals = newTerminals;
	 this.save();
	 this.trigger("add:terminal"); //triggers go last
     },
     editTerminal:function(groupID,storeID,terminalID,terminal){
	 var terminalToMod = this.getTerminal(groupID,storeID,terminalID);
	 _.extend(terminalToMod,terminal);
	 this.save();
     },
     validateTerminal : function (newTerminal_w_options) {
	 var results = [];
	 var terminals = this.getTerminals(newTerminal_w_options.groupID, newTerminal_w_options.storeID);
	 var foundTerminals = _.filter(terminals, function(terminal){ return terminal.terminal_label==newTerminal_w_options.terminal_label; });

	 if(_.isEmpty(newTerminal_w_options.terminal_label)) {results = results.concat({fieldname:"terminal-id", isInvalid:true, errMsg:"EMPTY"});}
	 
	 if((!newTerminal_w_options.isCreate)) {
	     if((foundTerminals.length>0) && !_.contains(_.pluck(foundTerminals, "terminal_id"),newTerminal_w_options.terminalID)) {
		 results = results.concat({fieldname:"terminal-id", isInvalid:true, errMsg:"There's a same Terminal in this Store"});
	     }
	 } else {
	     if(foundTerminals.length>0) {results = results.concat({fieldname:"terminal-id", isInvalid:true, errMsg:"There's a same Terminal in this Store"});}
	 }

	 return results;
     },
     deleteTerminal:function(groupID,storeID,terminalID){
     	 var terminals = this.getTerminals(groupID,storeID);
     	 if((typeof terminals === "undefined") || terminals.length==0) {
	     var stores = this.getStores(gorupID);
	     var newStores = _.reject(stores, function(store) {return store.store_id==storeID;});
	     stores = newStores;
	     this.save();
	     console.log("delete completed");
     	 } else {
     	     alert("Can't delete store, store has terminal(s)");
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