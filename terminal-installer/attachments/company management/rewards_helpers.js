function fetch_company_rewards(companyID){
    
    //var terminal_menu = new Menu({_id:companyID});
    var terminal_rewards = new Rewards({_id:companyID}); //new Menu({_id:companyID});
    
    return function(callback){
	terminal_rewards.fetch(
	    {success:function(model){
		 //return use the menu set up by the company.		     
		 //callback(_.selectKeys(model.toJSON(),['menuButtons','menuButtonHeaders']));
		 callback(false, model);
	     },
	     error:function(model){
		 //return an empty menu
		 model.set_default_rewards(companyID);
		 callback(true, model);
	     }});
    };
};