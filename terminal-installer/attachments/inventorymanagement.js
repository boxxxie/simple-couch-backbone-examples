var Inventories;

function inventory_doc_setup() {
	Inventories = 
	new (couchCollection(
		 {db:'inventory'},
		 {model:Inventory,
		  getModelByUpc : function(upccode){
		      return this.find(function(inventory){return inventory.get('upccode') == upccode;});
		  }
		  //,
		  //getSelectedModel : function(){
		  //    return this.find(function(model){return model.selected == true;});
		  //}
		 }));
    Inventories.fetch();
    console.log("fetch is done");
}
