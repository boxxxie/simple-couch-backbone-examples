var companyList;
var regionSelectorSettings = {
    minWidth:700,
    selectedList: 6,
    //the below would fire off events for backbone to take care of
    /*    click: multiselectRefresh,
     checkAll:multiselectRefresh,
     uncheckAll:multiselectRefresh,
     optgroupToggle:multiselectRefresh,
     refresh: multiselectRefresh,*/
    position: {
	my: 'left bottom',
	at: 'left top'
    },
    selectedText: function(numChecked, numTotal, checkedItems){
	if(numChecked == numTotal){
	    return "ALL";
	}
	return checkedItems
	    .reduce(function(sum,cur){
			if(sum == ""){
			    return cur.title;    
			}
			return sum + "," + cur.title;
		    },"");
    }
};

function genericButtonSetup($node,clickCallback){
    $node.click(clickCallback);		    
};

function finalSetup(){
    //fixme, add callbacks to these functions
    genericButtonSetup($("#btnAddCompany"));
    genericButtonSetup($("#btnAddGroup"));
    genericButtonSetup($("#btnAddStore"));
    genericButtonSetup($("#btnAddTerminal"));
};
function doc_setup(){
    var install_db = db('install');

    var Campaign = couchDoc.extend();
    var Campaigns = couchCollection({db:'campaigns'},{model:Campaign});
    companyList = new Campaigns();
    campaignList.fetch(
	{
	    success:function(model,resp){
		console.log("all campaigns loaded");
	    }});

    var Locations = Backbone.Collection.extend(
	{
	    selected:function(){
		return this.filter(function(location){
				       return location.get("selected");
				   });},
	    unselected:function(){
		return this.reject(function(location){
				       return location.get("selected");
				   });}     	  
	});

    var Location = Backbone.Model.extend(
	{defaults: function() {
	     return {
		 parent:null, //should me a model object
		 name:"unknown",
		 selected:false,
		 children:new Locations //Locations
	     };
	 },
	 select: function(bool) {
	     //need to change children when this happens
	     this.set({selected:bool});
	     //this.children.trigger('parent:change:select');
	 },
	 parents: function(){
	     if(this.parent == null){
		 return [];
	     }
	     var list = [this.parent];
	     return list.concact(this.parents());
	 }
	});



/*
    var postalCode = Location.extend();
    var postalCodeList = Locations.extend({model:postalCode});
    var postalCodes = new postalCodeList;

    var city = Location.extend();
    var cityList = Locations.extend({model:city});
    var cities = new cityList;
*/
    var country = Location.extend();

    var countryList = Locations.extend(
	{model:country,
	 initialize:function(selectedCountries){
	     var that = this;
	     var stores_db = db('stores_rt7');
	     var reigion_v = appView('country_prov_city_postal_code');
	     that.bind("change:selected",function(){console.log("change:selected event from model");});
	     groupQuery(reigion_v,stores_db,1)
	     (function(data){
		  function extractkey(row){return _.first(row.key);};
		  function setNames(item){return {name:item};};
		  var colData = _.map(data.rows,_.compose(setNames,extractkey));
		  console.log("done setting up countryList");
		  console.log(colData);
		  that.reset(colData);
		  that.filter(function(model){return _.contains(selectedCountries,model.get('name'));})
		      .forEach(function(model){model.select(true);});
	      });
	 }});

    var formData = finalSetup();

    var countries = new countryList(formData.countries);
 
   /* var provinceList = Locations.extend(
	{model:province,
	 initialize:function(){
	     var that = this;
	     var stores_db = db('stores_rt7');
	     var reigion_v = appView('country_prov_city_postal_code');
	     groupQuery(reigion_v,stores_db,2)
	     (function(data){
		  var colData = _.map(extractKeysArr(data),function(item){return {name:item};});
		  console.log("done setting up provinceList");
		  that.reset(colData);
	      });
	 }});*/

    var countriesView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'render'); 
	     this.collection.bind('reset',view.render);
	     this.collection.bind('change',view.render);
	     $(this.el).multiselect(_.extend(regionSelectorSettings,{ noneSelectedText:"Countries"}));
	 },
	 render:function(){
	     var html = ich.options_TMP1({list:this.collection.toJSON()});
	     $(this.el).html(html);
	     $(this.el).multiselect("refresh");
	     console.log("view rendered");
	     return this;
	 }
	});

    var countriesViewTest = new countriesView(
	{
	    collection: countries,
	    el:document.getElementById("countries")
	});

};



