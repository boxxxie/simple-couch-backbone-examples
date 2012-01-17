var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
var db_rewards = "rewards_rt7";

var Rewards = couchDoc.extend(
    {
	urlRoot:urlBase + db_rewards,
	set_default_rewards:function(id) {
	    this.set({MobQredits :{mobqredits_conversion: 0, 
				   use_mobqredits:false,
				   qriket_conversion: 0,
				   use_qriket:false}});
	    return this;
	},
	set_rewards: function(rewards) {
	    this.set({MobQredits:rewards});
	    return this;
	}
    });