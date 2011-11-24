
var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     companyName:"unknown",
	     hierarchy:{groups:[]}
	 };
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
    
    
var Group = couchDoc.extend(	
    {defaults: function() {
	 return {
	     companyName:"unknown",
	     hierarchy:{groups:[]}
	 };
     },
     
     /*getGroups:function(){
	 return this.get('hierarchy').groups;
     },
     getGroup:function(groupID){
	 return _.find(this.getGroups(),function(group){ return group.group_id == groupID;});
     },*/
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
    /* companyStats:function(groupID,storeID){
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
     }*/
    });

var Store = couchDoc.extend(	
    {defaults: function() {
	 return {
	     companyName:"unknown",
	     hierarchy:{groups:[]}
	 };
     },
     getTerminals:function(groupID,storeID){
	 var foundStore = this.getStore(groupID,storeID);
	 return foundStore.terminals;
     },
     getTerminal:function(groupID,storeID,terminalID){
	 var terminals = this.getTerminals(groupID,storeID);
	 return _.find(terminals,function(terminal){return terminal.terminal_id == terminalID;});	 
     },

    });
