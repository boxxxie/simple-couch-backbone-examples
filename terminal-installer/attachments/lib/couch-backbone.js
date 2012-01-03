var couchDoc = Backbone.Model.extend(
    {
	idAttribute: "_id",
	parse : function(resp, xhr) {
	    //xhr.statusText: "Created"
	    //resp -> "{"ok":true,"id":"80e3124756c1e5241a6665b683003c86","rev":"1-a013d28d19cf9ffc14b6a76f596fb7d4"}"
	    if(xhr.statusText == "Created"){ //this seems to take care of creating and editing docs, i'm not sure if this is the right solution, though
		return {_rev:resp.rev,_id:resp.id};
	    }
	    return resp;
	},
	save:function(attrs,options){
	    options || (options = {});
	    var model = this;
	    var success = options.success;   
	    options.success = function(resp, status, xhr){
		if (success){success(resp, status, xhr);}
	    };
	    var error = options.error;   
	    options.error = function(model, status, xhr){
		console.log("some error");
		if(_(status.responseText).trim() =='{"error":"not_found","reason":"no_db_file"}'){
		    //TODO: finish creating a DB if one doesn't exist when trying to do a new document (requires a rewrite, sounds like it could be a bad idea)
		    //need to create a new database to store the document
		    //$.couch.db("new/menus",{},true).create()
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


//-------------------- not part of couch-backbone yet------------------//
//this is an outbound parser//

//testing for persistfilter
/*
Backbone.Model.prototype.save = function() {
  var _save = Backbone.Model.prototype.save;
  
  return function(attrs, options) {
    attrs = _.clone(attrs);

    if (typeof this.persistFilter === "function") {
      attrs = this.persistFilter(attrs) || attrs;
    }

    _save.call(this, attrs, options);
  };
}();

var Test = Backbone.Model.extend({
  initialize: function() {
    this.set({ lol: "HI" });
  },

  persistFilter: function(attrs) {
    var newAttrs = {};

    _.each(attrs, function(val, key) {
      newAttrs["prefix::" + key] = val;
    });

    return newAttrs;
  }
});
*/
