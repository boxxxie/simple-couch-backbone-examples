function addInventory(){
    var d = $("#dialog-form");
    var company = d.find("#location\\.company"),
    group = d.find("#location\\.group"),
    store = d.find("#location\\.store"),
    tax1 = d.find("#apply_taxes\\.tax1"),
    tax2 = d.find("#apply_taxes\\.tax2"),
    tax3 = d.find("#apply_taxes\\.tax3"),
    exemption = d.find("#apply_taxes\\.exemption"),
    selling_price = d.find("#price\\.selling_price"),
    standard_price = d.find("#price\\.standard_price"),
    upc= d.find("#upc");
        
    var inventoryInfo = {_id:upc.val(),upccode:upc.val(),
    					 location : {company:company.val(), group:group.val(), store:store.val()},
    					 apply_taxes : {tax1:tax1.is(':checked'), tax2:tax2.is(':checked'), tax3:tax3.is(':checked'), exemption:exemption.is(':checked')},
    					 price : {selling_price:selling_price.val(), standard_price:standard_price.val()}    					 
    					};

	//console.log("item : " + item);
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var dbName = "inventory";
    var db_inventory = couchDoc.extend({urlRoot:urlBase + dbName});
    var inventoryToAdd = new db_inventory(inventoryInfo);

    //on the success of the install of the first terminal, install the second terminal.
    //this way we only have one success message.
    //it may be possible to do this with triggers, TameJS, or monads, in a more elegant way.
    inventoryToAdd.save({},
			       {success:function(){
			       	alert("saved successfully");
				    },
				    error:function(){
				    	console.log("fail");
				    	//inventoryToAdd.update({success:function(){alert("update successfully")}});
				    }});

    //terminal.installed = true;
    //company.save();
    
}



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
				console.log('inventoryView:route:inventoryManagementHome');
				view.el= _.first($("inv_item"));
				view.renderManagementPage();});
	     AppRouter.bind('route:addmodifyInventory', function(upc){
				//fetch model based on upc code
				view.model = new InventoryItem({_id:upc, upc:upc});
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
