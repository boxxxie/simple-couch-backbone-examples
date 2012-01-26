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
		     //user clicked apply button and there was nothing selected... do nothing
		     console.log("The price change will not be applied to any stores in this company");
		 }
		 else if (applyToAllStores){
		     console.log("The price change will be applied to all stores in this company");
		     options.makeButtons(stores);
		 }
		 else{
		     var stores_to_update = _.chain(checkedStores).pluck('id').matchTo(stores,'id').value();
		     console.log("The price change will be applied to selected stores");
		     console.log(stores_to_update);
		     options.makeButtons(stores_to_update);
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