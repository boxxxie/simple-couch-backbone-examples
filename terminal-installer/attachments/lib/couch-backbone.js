var campaignList;

//FIXME: not working right... also should be assigning an ID if one doesn't exist
/*The POST operation can be used to create a new document with a server generated DocID. To do so, the URL must point to the database's location. To create a named document, use the PUT method instead. 
 * */
var couchDoc = Backbone.Model.extend(
    {
	idAttribute: "_id",
	save:function(attrs,options){
	    function updateRev(model,resp,status){
		model.set({_rev:status.rev},{silent: true});
	    };
	    options || (options = {});
	    var model = this;
	    var success = options.success;   
	    options.success = function(resp, status, xhr){
		if (success){success(model, resp, status);}
		updateRev(model,resp,status);
	    };
	    Backbone.Model.prototype.save.call(this, attrs, options);
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
    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    return Backbone.Collection.extend(
	_.extend(options,
		 {url:urlBase + couch.db,
		  parse: function(response) {
		      return _(response.rows)
			  .chain()
			  .reject(function(item){return item.id.search('_design') == 0;}) //reject design docs
			  .pluck('doc')
			  .value();
		  },
		  fetch:function(options){
		      options || (options = {});
		      var fetch_options = _.extend(options,{url:this.url+"/_all_docs", data:{include_docs:true}});
		      Backbone.Collection.prototype.fetch.call(this,fetch_options);
		  }
		 }));
};


//testing for persistfilter
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
