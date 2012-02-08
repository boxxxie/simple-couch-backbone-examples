function doc_setup() {

    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db = 'inventory_rt7';
    var InventoryItem = couchDoc.extend({urlRoot:urlBase+db});

    function addItem(viewItem){
	return {success: function(resp){
		    _.extend(resp,{creationdate:new Date()});
		    viewItem.save(resp);}};};

    function editItem(viewItem){
	return {success: function(resp){
		    viewItem.save(resp);}};};

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
		 var html = ich.inventoryManagementHome_TMP({});
		 $("body").html(html);
		 $("#upc").focus();
		 $("#upc")
		     .change(function(){
				 var upc = $(this).val();
				 window.location.href ='#upc/'+_.escape(upc);
				 $(this).focus();
				 $(this).val('');
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
				upc = _.unEscape(upc);
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
	     $("#upc").focus();
	     console.log("InventoryView renderManagementPage");
	     return this;
	 },
	 renderModifyPage:function(upc){
	     var view = this;
	     var html = ich.inventoryViewPage_TMP(_.extend({upc:upc},view.model.toJSON()));
	     $(html).find('input').attr('disabled',true);
	     $(this.el).html(html);
	     $("#dialog-hook").html(ich.inventoryInputDialog_TMP(_.extend({title:"Edit "+upc+" Information"},view.model.toJSON())));
	     InventoryItemModifyDialog("edit-thing",editItem(view.model));
	     console.log("InventoryView renderModifyPage " + upc);
	     $("#upc").focus();
	     return this;
	 },
	 renderAddPage:function(upc){
	     var view = this;
	     var html = ich.inventoryAddPage_TMP({createButtonLabel:"add (" + upc + ") to the Inventory",upc:upc });
	     $(this.el).html(html);
	     $("#dialog-hook").html(ich.inventoryInputDialog_TMP({title:"Add "+upc+" to the Inventory",_id:upc,location:{},apply_taxes:{},price:{}}));
	     InventoryItemCreateDialog("create-thing",addItem(view.model));
	     $("#upc").focus();
	     console.log("InventoryView renderAddPage " + upc);
	     return this;
	 }
	});

    var InvItemDisplay = new InventoryView();
    Backbone.history.start();

}
