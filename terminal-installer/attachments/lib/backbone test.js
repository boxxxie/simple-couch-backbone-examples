var install_db = db('install');

var Selection = new Backbone.Model.extend();

var Company = couchDoc.extend(	
    {defaults: function() {
	 return {
	     parent:null, //should me a backbone.model
	     name:"unknown",
	     children:null//shoudl be backbone.collection
	 };
     },
     addGroup: function(store){
	 
     },
     addStore: function(group,store){},
     addTerminal: function(group,store,terminal){}
    });


function multiselectClick(a,b,c,d,e){
    console.log("a : " + a.toString() + ", b : " + b.toString());
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
function addItem(model,collectionName){
        return function(){
	var input = window.prompt("Enter New "+collectionName+" Name","");
	if(!input || input == "" || !model.children.chain().pluck('name').contains(input).value())return;
	collection.create({name:input});
    };
};
function addCompany(collection){
    return function(){
	var input = window.prompt("Enter New Company Name","");
	if(!input || 
	   input == "" || 
	   collection.chain().pluck('name').contains(input).value())
	{return;}
	collection.create({name:input});
    };
};
function addGroup(collection){
    return function(){
	var input = window.prompt("Enter New Group Name","");
	if(!input || input == "" || !collection.chain().pluck('name').contains(input).value())return;
	collection.create({name:input});
    };
};
function doc_setup(){
    var Companies = new (couchCollection({db:'install'},{model:Company}));
    Companies.fetch();
    
    genericButtonSetup($("#btnAddCompany"), addCompany(Companies));
    genericButtonSetup($("#btnAddGroup"), addGroup(Companies));
//    genericButtonSetup($("#btnAddStore"));
//    genericButtonSetup($("#btnAddTerminal"));

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
	     console.log("companies view rendered");
	     return this;
	 }
	});

    var companiesViewTest = new companiesView(
	{
	    collection: Companies,
	    el:_.first($("#companies"))
	});
    
};