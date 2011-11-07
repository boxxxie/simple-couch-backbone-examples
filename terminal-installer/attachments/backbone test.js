var install_db = db('install');

var Selection = new (Backbone
		     .Model
		     .extend({setCompany:function(name){
				  console.log("company was selected");
				  this.set({company:name, group:null,store:null});
			      },
			      setGroup:function(name){
				  console.log("group was selected");
				  this.set({group:name,store:null});
			      },
			      setStore:function(name){
				  console.log("store was selected");
				  this.set({store:name});
			      }
			     }));

var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     name:"unknown",
	     hierarchy:{groups:[{name:"none"}]}
	 };
     },
     addGroup: function(groupToAdd){
	 var oldHierarchy = this.get('hierarchy');
	 var groups = oldHierarchy.groups;
	 groups || (groups = []);
	 if(!_(groups).chain().contains(groupToAdd).value()){
	     var newGroups = groups.concat({name:groupToAdd});
	     var newHierarchy = {groups : newGroups};
	     this.set({hierarchy:newHierarchy});
	     this.save();
	     this.trigger("add:group"); //triggers go last
	 }
     },
     addStore: function(group,store){
	 
     },
     addTerminal: function(group,store,terminal){},
     getGroups:function(){
	 return this.get('hierarchy').groups;
     }
    });

var Companies;
var companiesView;
var companiesViewTest;
var groupsView;
var groupsViewTest;
var storesView;
var storesViewTest;

//may not need this
function multiselectClick(caller,checkbox){
    // $(caller).target().id()
    var callerID = caller.target.id;
    var checkboxName = checkbox.value;
    switch(callerID){
    case "companies": 
	Selection.setCompany(checkboxName);
	break;
    case "groups": 
	Selection.setGroup(checkboxName);
	break;
    case "stores": 
	Selection.setStore(checkboxName);
	break;
    }
    console.log("click");
}

var regionSelectorSettings = {
    minWidth:700,
    selectedList: 6,
    multiple: false,
    //the below would fire off events for backbone to take care of
    click: multiselectClick,
    /* checkAll:multiselectRefresh,
     uncheckAll:multiselectRefresh,
     optgroupToggle:multiselectRefresh,
     refresh: multiselectRefresh,*/
    position: {
	my: 'left bottom',
	at: 'left top'
    }
};
function genericButtonSetup($node,clickCallback){
    $node.click(clickCallback);		    
};
function addCompany(collection){
    return function(){
	var input = window.prompt("Enter New Company Name","");
	if(!input || 
	   input == "" || 
	   _(collection.pluck('name')).contains(input))
	{return;}
	collection.create({name:input});
    };
};
function addGroup(model){
	//get the model that is represented in the select box
	var input = window.prompt("Enter New Group Name","");
	if(!input || input == "")return;
	model.addGroup(input);
};
function addStore(model,group){
	//get the model that is represented in the select box
	var input = window.prompt("Enter New Store Name","");
	if(!input || input == "")return;
	model.addStore(group,input);
};


function doc_setup(){
    Companies = 
	new (couchCollection({db:'install'},
			     {model:Company,
			      getModelByName : function(modelName){
				  return this.find(function(model){return model.get('name') == modelName;});
			      },
			      getSelectedModel : function(){
				  return this.find(function(model){return model.selected == true;});
			      }
			     }));
    Companies.fetch();
    
    genericButtonSetup($("#btnAddCompany"), addCompany(Companies));
    genericButtonSetup($("#btnAddGroup"), function(){
			   return  function(collection){
			       var modelName = Selection.get('company');
			       var model = collection.getModelByName(modelName);
			       if(model){addGroup(model);}
			   }(Companies);
		       });
    genericButtonSetup($("#btnAddStore"), function(){
			   return  function(collection){
			       var modelName = Selection.get('company');
			       var selectedGroup = Selection.get('group');
			       var model = collection.getModelByName(modelName);
			       if(model && selectedGroup){addStore(model,group);}
			   }(Companies);
		       });
    //    genericButtonSetup($("#btnAddTerminal"));


    function applySelection(selector,list,getName){
	var selectionName = selector.get(getName);
	if(!selectionName) return list;
	var add_selected = _.find(list,function(item){return item.name == selectionName;});
	add_selected.selected = true;
	return list;
    };
    companiesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     this.collection.bind('reset',view.render);
	     this.collection.bind('change',view.render);
	     this.collection.bind('add',view.render);
	     $(this.el).multiselect(_.extend(regionSelectorSettings,{noneSelectedText:"Companies"}));
	     this.bind('change:model',function(){console.log('change:model:companies');view.render();});
	     Selection.bind('change:company',function(){console.log('change:company');view.updateModel();});
	 },
	 render:function(){
	     var forTMP = {list:applySelection(Selection,this.collection.toJSON(),'company')};
	     var html = ich.options_TMP1(forTMP);
	     $(this.el).html(html);
	     $(this.el).multiselect("refresh");
	     console.log("companies view rendered");
	     return this;
	 },
	 updateModel:function(){
	     this.model = this.collection.getModelByName(Selection.get('company'));
	     this.trigger("change:model");
	 }
	});

    companiesViewTest = new companiesView(
	{
	    collection: Companies,
	    el:_.first($("#companies"))
	});


    groupsView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     //    this.collection.bind('change',view.render);
	     companiesViewTest.bind('change:model',function(){console.log('change:model:group');view.updateModel();});
	     this.bind('change:model',view.render);
	     Selection.bind('change:group',function(){console.log('change:group');view.render();});
	     $(this.el).multiselect(_.extend(regionSelectorSettings,{ noneSelectedText:"Groups"}));
	 },
	 render:function(){
	     var model = this.model;
	     if(!model) return this;
	     var groups = model.getGroups();
	     var forTMP = {list:applySelection(Selection,groups,'groups')};
	     var html = ich.options_TMP1(forTMP);
	     $(this.el).html(html);
	     $(this.el).multiselect("refresh");
	     console.log("groups view rendered");
	     return this;
	 },
	 updateModel:function(){
	     var view = this;
	     this.model = this.collection.getModelByName(Selection.get('company'));
	     this.model.bind('add:group',function(){console.log('add:group');view.render();});
	     this.trigger("change:model");
	 }
	});

    groupsViewTest = new groupsView(
	{
	    collection: Companies,
	    el:_.first($("#groups"))
	});

    storesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     //    this.collection.bind('change',view.render);
	     companiesViewTest.bind('change:model',function(){console.log('change:model:group');view.updateModel();});
	     this.bind('change:model',view.render);
	     Selection.bind('change:store',function(){console.log('change:store');view.render();});
	     $(this.el).multiselect(_.extend(regionSelectorSettings,{ noneSelectedText:"Stores"}));
	 },
	 render:function(){
	     var model = this.model;
	     if(!model) return this;
	     var stores = model.getStores();
	     var forTMP = {list:applySelection(Selection,stores,'stores')};
	     var html = ich.options_TMP1(forTMP);
	     $(this.el).html(html);
	     $(this.el).multiselect("refresh");
	     console.log("stores view rendered");
	     return this;
	 },
	 updateModel:function(){
	     var view = this;
	     this.model = this.collection.getModelByName(Selection.get('company'));
	     this.model.bind('add:store',function(){console.log('add:store');view.render();});
	     this.trigger("change:model");
	 }
	});

    storesViewTest = new storesView(
	{
	    collection: Companies,
	    el:_.first($("#stores"))
	});
    
};
