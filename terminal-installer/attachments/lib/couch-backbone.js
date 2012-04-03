//todo make a user couchdoc that makes editing/changing passwords easy

var couchDoc = Backbone.Model.extend(
    {
        idAttribute: "_id",
        urlRoot:function(){
	    if(_.isEmpty(this.db)){
                return window.location.href+"api/";  //this almost may not work with a router
	    }
	    else{
		//return window.location.href+"api/"+this.db+"/"; //this doesn't work with a router
		return window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/" + this.db;
	    }
	},
	//urlRoot:window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/" + dbName;
	//urlRoot:window.location.href+"api/",
	parse:function(resp, xhr) {
	    //xhr.statusText: "Created"
	    //resp -> "{"ok":true,"id":"80e3124756c1e5241a6665b683003c86","rev":"1-a013d28d19cf9ffc14b6a76f596fb7d4"}"
	    if(xhr && xhr.statusText == "Created"){ //this seems to take care of creating and editing docs, i'm not sure if this is the right solution, though
		return {_rev:resp.rev,_id:resp.id};
	    }
	    return resp;
	},
	save:function(attrs,options){
	    options || (options = {});
	    var model = this;
	    var success = options.success;
	    if(_.isUndefined(this.id)){
		//get uuid from couchdb and set the model's id to it, this may not work properly with many requests in a short time span
		var id = $.couch.newUUID(); //fixme: test this more on firefox
		var idObj = {};
		idObj[this.idAttribute] = id;
		this.set(idObj,{silent:true});
	    }
	    options.success = function(resp, status, xhr){
		if (success){success(resp, status, xhr);}
	    };
	    var error = options.error;
	    options.error = function(model, status, xhr){
		if(status.responseText == '{"error":"not_found","reason":"no_db_file"}'){
		}
		if (error){error(model, status, xhr);}
	    };
	    Backbone.Model.prototype.save.call(this, attrs, options);
	},
	destroy:function(options){
	    options || (options = {});
	    var model = this;
	    _.extend(options,{url: model.url()+"?rev="+model.get('_rev')});
	    Backbone.Model.prototype.destroy.call(this, options);
	}
    });

/*
 couch = {db:dbname} they are names referring to the names of the database and ddoc
 options =  what you would normally use in .extend()... if you overwrite url,parse, or other things that couchCollection use it will probably not work right
 */
var couchCollection = function(couch,options){
    couch || (couch = {});
    //couch.db || (couch.db = 'db');
    options || (options = {});
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port;// + "/";
    return Backbone.Collection.extend(
	_.extend(options,
		 {
		  url: (couch.db)? urlBase+ "/_rewrite/"+couch.db+"/" : urlBase + "/_rewrite/api/",// + couch.db, //FIXME: this has got to change
		  parse: function(response) {
		      return _(response.rows)
			  .chain()
			  .reject(function(item){return item.id.search('_design') == 0;}) //reject design docs
			  .pluck('doc')
			  .value();
		  },
		  fetch:function(options){
		      options || (options = {});
		      var fetch_options = _.extend(options,{url:this.url +"_all_docs", data:{include_docs:true}});
		      Backbone.Collection.prototype.fetch.call(this,fetch_options);
		  }
		 }));
};

function async_method(model,method,callback){
    var options = {
	success : function(resp, status, xhr){
	    callback(null,resp)
	},
	error : function(){
	    callback(arguments)
	}
    }
    model[method](options)
}

function async_session(callback){
    $.couch.session(
	{
	    success:function(resp){
		callback(null,resp)
	    },
	    error:function(code,type,message){
		callback({code:code,type:type,message:message})
	    }
	})
}

var UserDoc = couchDoc.extend(
    {
	db:"_users/",//TODO: use $.couch.authdbsomething to set this
	initialize:function(atts){
	    if(atts && atts.name){
		this.set({"_id":atts.name});
	    }
	},
	login:function(callback){
	    var user = this;
	    $.couch.login(
		{
		    name:user.get('name'),
		    password:user.get('password'),
		    success:function(user_login_info){
			async.parallel({
					   user_doc:async.apply(async_method,user,'fetch'),
					   session_info:async.apply(async_session)
				       },
				       function(err,response){
					   callback(err,response.user_doc,response.session_info);
				       });
		    },
		    error:function(code,type,message){
			callback({code:code,type:type,message:message})
		    }
		});
	},
	signup:function(options){
	    /* should be in the form of:
	     * $.couch.signup({name:"user name", roles:["pos_sales"]},
	     "password",
	     {success:function(){
	     console.log(arguments);}})*/
	    var user = this.toJSON();
	    var password = user.password;
	    $.couch.signup(_.removeKeys(user,'_id','password'),
			   password,
			   options
			  );
	},
	url:function(){ //i don't think this is used (looking at how the init method workds)
	    return this.urlRoot() + "org.couchdb.user:" + this.id;
	}
    });

//var RT7UserDoc = UserDoc.extend(
/*
   $.couch.login({name: id_for_user+login_key.user,password:login_key.password,
			    success:function(user){

				ReportData = user;
			    },
			    error:function(){
				alert("wrong login info.");
			    }});
	 }
({_id:"org.couchdb.user:"+user.name}))
	.fetch(
	    //if we find a user, then this is actually an error and we need to overwrite the user data or alert the actual user as to what to do
	    {success:function(userModel){
		 //overwrite the user (but we can't overwrite the password)
		 if(options.overwrite){
		     userModel.save(user,options);
		 }
		 else{
		     options.error(1000,"user already exists","there was already a user in this entity(company/group/store) and we are not allowed to overwrite their details");
		 }
	     },
	     //if we don't find a user, then we make a new one (indented action)
	     error:function(){
		 $.couch.signup(user,password,options);
	     }
	    });

function saveNewUser(user,password,options){
    (new (couchDoc.extend({db:"_users"}))
     ({_id:"org.couchdb.user:"+user.name}))
	.fetch(
	    //if we find a user, then this is actually an error and we need to overwrite the user data or alert the actual user as to what to do
	    {success:function(userModel){
		 //overwrite the user (but we can't overwrite the password)
		 if(options.overwrite){
		     userModel.save(user,options);
		 }
		 else{
		     options.error(1000,"user already exists","there was already a user in this entity(company/group/store) and we are not allowed to overwrite their details");
		 }
	     },
	     //if we don't find a user, then we make a new one (indented action)
	     error:function(){
		 $.couch.signup(user,password,options);
	     }
	    });
}
*/