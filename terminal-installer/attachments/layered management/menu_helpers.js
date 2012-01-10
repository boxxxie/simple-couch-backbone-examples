//FIXME: the callback should use a backbone model, instead of data.
function fetch_company_menu(companyID){
    var terminal_menu = new Menu({_id:companyID});
    return function(callback){
	terminal_menu.fetch(
	    {success:function(model){
		 //return use the menu set up by the company.		     
		 //callback(_.selectKeys(model.toJSON(),['menuButtons','menuButtonHeaders']));
		 callback(false, model);
	     },
	     error:function(model){
		 //return an empty menu
		 model.set_empty_menu();
		 callback(true, model);
	     }});
    };
};