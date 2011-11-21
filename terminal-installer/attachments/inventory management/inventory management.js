function doc_setup() {
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = 'inventory';
    var InventoryItem = couchDoc.extend({urlRoot:urlBase+db});

    function addItem(){
	return {success: function(resp){
		    var itemToAdd = new InventoryItem(resp);
		    itemToAdd.save({success:function(){
					window.location.href ='#upc/'+resp._id;
				    }});
		}
	       };
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

    var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"inventoryManagementHome",
		 "upc/":"inventoryManagementHome",
		 "upc/:upc": "addmodifyInventory"  
	     },
	     inventoryManagementHome:function(){
		 console.log("inventoryManagementHome");
		 var html = ich.inventoryManagementHome_TMP();
		 $("body").html(html);
		 $("#upc")
		     .change(function(){
				 var upc = $(this).val();
				 window.location.href ='#upc/'+upc;		
			     });
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
				console.log('inventoryView:route:inventoryManagementHome');
				view.el= _.first($("main"));
				view.renderManagementPage();});
	     AppRouter.bind('route:addmodifyInventory', function(upc){
				//fetch model based on upc code
				view.model = new InventoryItem({_id:upc});
				view.model.bind('change',function(){view.renderModifyPage(upc);});
				view.model.bind('not_found',function(){view.renderAddPage(upc);});
				view.model.fetch({error:function(a,b,c){
						      console.log("couldn't load model");
						      view.model.trigger('not_found');
						  }});
				console.log('InventoryView:route:modifyInventory');});
	     
	 },
	 renderManagementPage:function(){
	     var view = this;
	     if(view.model){
		 $(this.el).html("");
	     }
	     console.log("InventoryView renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(upc){
	     var view = this;
	     var html = ich.inventoryForm_TMP(view.model.toJSON());
	     $(html).find('input').attr('disabled',true);
	     $(this.el).html(html);
	     console.log("InventoryView renderModifyPage " + upc);
	     return this;
	 },
	 renderAddPage:function(upc){
	     var view = this;
	     var html = ich.inventoryAddPage_TMP({createButtonLabel:"create new inventory item",_id:upc});
	     $(this.el).html(html);
	     $("#dialog-hook").html(ich.inventoryInputDialog_TMP({title:"Add "+upc+" to the Inventory",location:{},applyTaxes:{},price:{}}));
	     InventoryItemCreateDialog("create-thing",addItem());
	     console.log("InventoryView renderAddPage " + upc);
	     return this;
	 }
	});

    var InvItemDisplay = new InventoryView();
    Backbone.history.start();

}
