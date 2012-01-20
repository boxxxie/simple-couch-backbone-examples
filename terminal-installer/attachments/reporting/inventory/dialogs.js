function menuInventoryApplyStoresViewDialog (dialog_html,options) {
    var stores = options.stores;
    var form = $(dialog_html).find("#formInventoryApplystores");
    var d = $("#dialog-quickView");    	
    d.html(dialog_html);
    d.find("#applyToAll").change(
	function(){
	    if($(this).is(":checked")){
		$(form).find("input").attr('disabled',true);
	    }
	    else{
		$(form).find("input").removeAttr('disabled');
	    }
	});
    
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 450,
	 width: 424,
	 modal: true,
	 buttons: {
	     "Apply" : function() {
		 var checkedStores = form.find("input:checked").toArray();
		 var applyToAllStores =  d.find("#applyToAll").is(":checked");
		 if(_.isEmpty(checkedStores) && !applyToAllStores){
		     //user clicked apply and there was nothing selected... do nothing
		 }
		 else if (checkedStores.length == stores.length  || applyToAllStores){
		     console.log("The price change will be applied to all stores in this company");
		     options.makeButtons(_.pluck(stores,'id'));
		 }
		 else if(checkedStores.length != stores.length) {
		     var store_ids_to_update = _(checkedStores)
			 .map(function(item){
				  return item.id;
			      });
		     console.log("The price change will be applied to selected stores");
		     console.log(store_ids_to_update);
		     options.makeButtons(store_ids_to_update);
		 }
		 d.dialog('close');
	     },
	     "Cancel" : function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};