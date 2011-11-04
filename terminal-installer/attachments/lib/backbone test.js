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
    //the below would fire off events for backbone to take care of
    /*    click: multiselectRefresh,
     checkAll:multiselectRefresh,
     uncheckAll:multiselectRefresh,
     optgroupToggle:multiselectRefresh,
     refresh: multiselectRefresh,*/
    position: {
	my: 'left bottom',
	at: 'left top'
    },
    selectedText: function(numChecked, numTotal, checkedItems){
	if(numChecked == numTotal){
	    return "ALL";
	}
	return checkedItems
	    .reduce(function(sum,cur){
			if(sum == ""){
			    return cur.title;    
			}
			return sum + "," + cur.title;
		    },"");
    }
};
function genericButtonSetup($node,clickCallback){
    $node.click(clickCallback);		    
};
function addCompany(collection){
    var companyToAdd = new Company(window.prompt("Enter New Company Name",""));
    collection.add(companyToAdd);
}
function doc_setup(){
    var Companies = couchCollection({db:'install'},{model:Entity}).fetch(
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

    var countriesViewTest = new countriesView(
	{
	    collection: Companies,
	    el:_.first($("#companies"))
	});
    
};



