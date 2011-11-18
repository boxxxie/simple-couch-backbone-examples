function doc_setup() {
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = 'inventory';
    var InventoryItem = couchDoc.extend({urlRoot:urlBase+db});

    var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"inventoryManagementHome",
		 "inventory/:upc": "addmodifyInventory"  
	     },
	     inventoryManagementHome:function(){
		 console.log("inventoryManagementHome");
		 var mainHTML = ich.inventoryManagementHome_TMP();
		 $("body").html(mainHTML);
		 var upcInputHTML = ich.upcInput_TMP();
		 $("upc").html(upcInputHTML);
		 $("upc").find("input").change(function(a){
						   window.location.href ='#/inventory/'+$(this).val();
						   console.log( $(this).val());
						   console.log(a);});
	     },
	     addmodifyInventory:function(upc){
		 console.log("addmodifyInventory: " + upc);
	     }
	 }));

    var InventoryView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderManagementPage','renderModifyPage');
	     AppRouter.bind('route:inventoryManagementHome', function(){
				console.log('companiesView:route:inventoryManagementHome');
				view.el= _.first($("inv_item"));
				view.renderManagementPage();});
	     AppRouter.bind('route:addmodifyInventory', function(upc){
				//fetch model based on upc code
				view.model = new InventoryItem({_id:upc});
				view.model.fetch();
				view.model.bind('change',function(){view.renderModifyPage(upc);});
				console.log('companiesView:route:modifyInventory');
				view.renderModifyPage(upc);});
	     
	 },
	 renderManagementPage:function(){
	     var view = this;
	     if(view.model){
		 var html = ich.inventoryForm_TMP({item:view.model.toJSON()});
		 $(this.el).html(html);
	     }
	     console.log("InventoryView renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(upc){
	     var view = this;
	     if(view.model){
		 var html = ich.inventoryForm_TMP({item:view.model.toJSON()});
		 $(this.el).html(html);
	     }
	     console.log("InventoryView renderModifyPage " + upc);
	     return this;
	 }
	});

    var InvItemDisplay = new InventoryView(
//	{
//	    el:_.first($("inv_item"))
//	});
);
    Backbone.history.start();

}
