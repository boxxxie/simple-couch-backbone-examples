var couchDoc = Backbone.Model.extend(
    {
	idAttribute: "_id",
	parse : function(resp, xhr) {
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
    couch.db || (couch.db = 'db');
    options || (options = {});
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port;// + "/";
    return Backbone.Collection.extend(
	_.extend(options,
		 {url:urlBase + "/_rewrite/api/",// + couch.db, //FIXME: this has got to change
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
