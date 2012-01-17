function fetch_company_rewards(companyID){
    

    var terminal_rewards = new Rewards({_id:companyID});
    
    return function(callback){
	terminal_rewards.fetch(
	    {success:function(model){
		 callback(false, model);
	     },
	     error:function(model){
		 //return and save an empty Rewards profile to the rewards db
		 model.set_default_rewards(companyID);
		 model.save();
		 callback(true, model);
	     }});
    };
};