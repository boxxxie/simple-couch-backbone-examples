var install_db = db('install');

var Entity = couchDoc.extend(	
    {defaults: function() {
	 return {
	     parent:null, //should me a backbone.model
	     name:"unknown",
	     selected:false,
	     children:null//shoudl be backbone.collection
	 };
     },
     toggle: function() {
	 this.set({selected: !this.get("selected")});
     }
    });



var regionSelectorSettings = {
    minWidth:700,
    selectedList: 6,
    multiple: false,
    //the below would fire off events for backbone to take care of
    /*    click: multiselectRefresh,
     checkAll:multiselectRefresh,
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
	if(!input || input == "")return;
	collection.create({name:input});
    };
}
function doc_setup(){
    var Companies = new (couchCollection({db:'install'},{model:Entity}));
    Companies.fetch(
	    {success:function(model,resp){
		 console.log("all campaigns loaded");
	     }});

    genericButtonSetup($("#btnAddCompany"),addCompany(Companies));
    genericButtonSetup($("#btnAddGroup"));
    genericButtonSetup($("#btnAddStore"));
    genericButtonSetup($("#btnAddTerminal"));

    var companiesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     this.collection.bind('reset',view.render);
	     this.collection.bind('change',view.render);
	     this.collection.bind('add',view.render);
	     $(this.el).multiselect(_.extend(regionSelectorSettings,{ noneSelectedText:"Companies"}));
	 },
	 render:function(){
	     var html = ich.options_TMP1({list:this.collection.toJSON()});
	     $(this.el).html(html);
	     $(this.el).multiselect("refresh");
	     console.log("view rendered");
	     return this;
	 }
	});

    var companiesViewTest = new companiesView(
	{
	    collection: Companies,
	    el:_.first($("#companies"))
	});
    
};



