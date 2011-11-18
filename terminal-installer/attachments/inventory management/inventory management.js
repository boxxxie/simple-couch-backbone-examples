function doc_setup() {
    var InventoryItem;
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = 'inventory';
    InventoryItem = new (couchDoc({urlRoot:urlBase+db}));
     
    var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"inventoryManagementHome",
		 "inventory/:upc": "addmodifyInventory"  
	     },
	     inventoryManagementHome:function(){
		 console.log("inventoryManagementHome");
		 var html = ich.inventory_management_page_TMP({createButtonLabel:"New Inventory"});
		 $('body').html(html);
		 $("#create-dialog")
		     .html(ich.inventoryInputDialog_TMP(
			       {title:"Make a new Inventory",
				inventory:{address:{},contact:{}}}));
		 InventoryCreateDialog("create-thing",addInventory(Companies));
	     },
	     addmodifyInventory:function(upc){
		 console.log("addmodifyInventory: " + upc);
	     }
	 }));

    var InventoryView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage'); 
	     this.collection.bind('reset',view.renderManagementPage);
	     this.collection.bind('add',view.renderManagementPage);
	     this.collection.bind('remove', view.renderManagementPage);
	     AppRouter.bind('route:inventoryManagementHome', function(){
				console.log('companiesView:route:inventoryManagementHome');
				view.el =_.first($("#list-things"));
				view.renderManagementPage();});
	     AppRouter.bind('route:modifyInventory', function(id){
				var inventory = Companies.getModelById(id);
				inventory.bind('change',function(){view.renderModifyPage(id);});
				console.log('companiesView:route:modifyInventory');
				view.renderModifyPage(id);});
	     
	 },
	 renderManagementPage:function(){
	     var view = this;
	     var companies = this.collection.toJSON();
	     var forTMP_w_stats = 
		 {list:_.map(companies,
			     function(inventory)
			     { var inventoryClone = _.clone(inventory);
			       var date = new Date(inventoryClone.creationdate);
			       _.extend(inventoryClone,{creationdate:date.toDateString()});
			       var inventoryStats = view.collection.get(inventory._id).inventoryStats();
			       var quickViewArgs = {template:"modify_inventory_page_TMP",
						    inventory_id:inventory._id};
			       return _.extend(inventoryClone,inventoryStats,quickViewArgs);})};
	     var html = ich.companiesTabel_TMP(forTMP_w_stats);
	     $(this.el).html(html);
	     console.log("companiesView renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(id){
	     var view = this;
	     var inventory = Companies.getModelById(id);
	     var inventoryJSON = inventory.toJSON();
	     $('body').html(ich.modify_inventory_page_TMP(_.extend({inventory:inventoryJSON,
								    inventory_id:id},
								   breadCrumb(id))));
	     $('fieldset').find('input').attr("disabled",true);
	     $("#dialog-hook").html(ich.inventoryInputDialog_TMP({title:"Edit the Inventory",
								  inventory:inventoryJSON}));
	     InventoryModifyDialog("edit-thing",editInventory(inventory));
	     console.log("companiesView renderModifyPage " + id);
	     return this;
	 },
	 updateModel:function(){
	     this.inventory = this.collection.getModelById(Selection.get('inventory'));
	     this.trigger("change:model");
	 }
	});

    var InvItemDisplay = new InventoryView(
	{
	    model: InventoryItem,
	    el:_.first($("inv_item"))
	});

    Backbone.history.start();

}
