var couchapp = require('couchapp'), 
path = require('path');

ddoc = { _id:'_design/app'};

ddoc.views = {};

ddoc.views.user_pass = {
    map:function(doc){
	var _ = require("views/lib/underscore");
	require("views/lib/underscore_extended");
	const walk = require("views/lib/walk").walk;
	function emitUserPass(item){
	    function id_finder(item){
		//returns a value in the form of [key,val] or null
		return _.find(_.kv(item),function(kv){
			   //find fields with ID
			   if(/_id$/.test(_.first(kv))){
			       return true;
			   }    
			   return false;
		       });
	    };
	    const location = id_finder(item);
	    if(!_.isEmpty(item.user) && !_.isEmpty(item.password) && location){
		emit({user:item.user,password:item.password},_.extend(location,{company_id:doc._id}));
	    }
	}
	//extending emitUserPass to work with the walk function
	walk(doc,_.wrap(emitUserPass,function(fn){
			    var value = arguments[1];  //args[0] is null
			    fn(value);
			    return value;
	     }));
    }
};

ddoc.views.lib = couchapp.loadFiles('./common');
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;