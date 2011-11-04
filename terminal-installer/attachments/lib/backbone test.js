var campaignList;
var regionSelectorSettings = {
    minWidth:700,
    selectedList: 6,
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
var testData = {
    _id: "AllCanadaAllTerminal",
    _rev: "3-ed84300839289e02a0084409f1f6df06",
    name: "AllCanadaAllTerminal",
    time: {
	end: "2011-12-31T00:00:00.000-05:00",
	start: "2011-10-07T00:00:00.000-04:00"
    },
    description: "test description",
    advertiser: "test advertiser",
    salesperson: "test sales person",
    presentation_type: "captive",
    all_times: false,
    all_days: false,
    locations : [
	{country: 'Canada'} 
    ],
    days_and_hours: [
	{
            time: {
		end: "2011-10-07T17:02:00.000-04:00",
		start: "2011-10-07T16:10:00.000-04:00"
            },
            day: "FRI"
	},
	{
            time: {
		end: "2011-10-07T17:02:00.000-04:00",
		start: "2011-10-07T16:10:00.000-04:00"
            },
            day: "THU"
	},
	{
            time: {
		end: "2011-10-07T13:03:00.000-04:00",
		start: "2011-10-07T16:10:00.000-04:00"
            },
            day: "THU"
	}
    ],
    for_terminals_created_before: new Date(),

    images: [
	{
            file: "C:\\Users\\4\\Documents\\01\\CANADA.jpg"
	},
	{
            file: "C:\\Users\\4\\Documents\\02\\CANADA.jpg"
	}
    ],
    _attachments: {
	"C:\\Users\\4\\Documents\\02\\CANADA.jpg": {
            content_type: "image/jpeg",
            revpos: 3,
            digest: "md5-MesMX0p/a4Qa8Ltv7Dya7Q==",
            length: 105361,
            stub: true
	},
	"C:\\Users\\4\\Documents\\01\\CANADA.jpg": {
            content_type: "image/jpeg",
            revpos: 2,
            digest: "md5-UiP6U6RJISdaRc4N5Sfh1Q==",
            length: 125957,
            stub: true
	}
    }
};
function transform_campaign_for_form(camp){
    function create_for_terminals_field(camp){
	if(camp.for_terminals_created_before){
	    camp._for_terminals = "current";
	}
	else{camp._for_terminals = "future";}
	return camp;
    }
    function move_all_terminals_field(camp){
	if(!camp.locations){return camp;}
	var locations = camp.locations;
	function detectAllTerminalsObj(obj){return (!_.isUndefined(obj.all_terminals));}
	var all_terminals = _.detect(locations,detectAllTerminalsObj);
	if(all_terminals){
	    camp._all_terminals = all_terminals.all_terminals;
	    camp.locations = _.reject(locations,detectAllTerminalsObj);
	}
	return camp;
    }
    function transform_days_and_hours(camp){
	//holy shit compress duplicate times and concat the days into an array
	var grouped = _(camp.days_and_hours).chain()
	    .groupBy(function(obj){return new Date(obj.time.start).getTime() +
				   ":" +
				   new Date(obj.time.end).getTime();})
	    .value();
	var dateRanges = _.keys(grouped);
	camp.days_and_hours =  _(grouped).chain()
	    .keys()
	    .map(function(dateRange){return _.pluck(grouped[dateRange],'day');})
	    .zip(dateRanges)
	    .map(function(days_time_pair){
		     var days = _.first(days_time_pair);
		     var times = _.last(days_time_pair).split(":").map(Number);
		     var start = new Date(_.first(times));
		     var end = new Date(_.last(times));
		     return {day : days, time: {start :start ,end : end}};
		 })
	    .value();
	return camp;
    }

    function transform_countries(camp){
	camp.countries = _(camp.locations).chain().pluck('country').unique().value();
	return camp;
    }
    var transformations = _.compose(create_for_terminals_field, 
				    move_all_terminals_field,
				    transform_days_and_hours,
				    transform_countries);
    return transformations(camp);
}
function addButtonSetup(){
    $('#btnAdd')
	.click(function () {
		   var data = {index : $('#days_and_hours_list').children().length};

		   var html = ich.daySelection_TMP(data);
		   $(html).find(".startTime").first()
		       .timepicker({
				       timeOnly: true,
				       showButtonPanel: false
				   });
		   $(html).find(".endTime").first()
		       .timepicker({
				       timeOnly: true,
				       showButtonPanel: false
				   });
		   $(html).find('select').first()
		       .multiselect({
					height:210,
					minWidth:250,
					selectedList: 6, // 0-based index,
					selectedText: function(numChecked, numTotal, checkedItems){
					    if(numChecked == numTotal){
						return "Every Day";
					    }
					    return checkedItems
						.reduce(function(sum,cur){
							    if(sum == ""){
								return cur.title;    
							    }
							    return sum + "," + cur.title;
							},"");
					}
				    });
		   $(html).find('.checkAlltimes').first()
		       .click(function(){
				  if($(this).prop('checked')){
				      var times = $(this).parents('li').find('.startTime, .endTime');
				      times.filter('.startTime').val('00:01');
				      times.filter('.endTime').val('23:59');
				      times.parent().hide();
				  }
				  else{
				      $(this).parents('li').find('.startTime, .endTime')
					  .each(function(){
						    $(this).parent().show();
						});
				  }
			      });

		   // append it to the list, tada! 
		   //Now go do something more useful with this.
		   $('#days_and_hours_list').append(html);

		   // enable the "remove" button
		   $('#btnDel:first').attr('disabled',false);
	       });		    
};
function deleteButtonSetup(){
    $('#btnDel')
	.click(function() {
		   $('#days_and_hours_list').children().last().remove();
		   
		   // if only one element remains, disable the "remove" button
		   if ($('#days_and_hours_list').children().length == 0)
		       $('#btnDel').attr('disabled',true);
	       });
    $('#btnDel').attr('disabled',true);
};
function finalSetup(){
    var transformedData = transform_campaign_for_form(testData);
    console.log(transformedData);

    function transformer(obj,$node){
	if(!obj){return obj;}
	var varType = $node.attr('var_type');
	if(varType){
	    switch (varType){
	    case "date":{return new Date(obj);}
	    case "time":{
		var d = new Date(obj);
		var hours = d.getHours();
		var minutes = d.getMinutes();
		if(minutes < 10){minutes = "0" + minutes;}
		return hours + ":" + minutes;}
	    }
	}
	return obj;
    };

    addButtonSetup();
    deleteButtonSetup();

    //add days_and_hours selectors so data can be entered into them from the fetched doc
    _(transformedData.days_and_hours.length).chain().range().each(function(){ $('#btnAdd').trigger('click');});
    
    //$("#for_terminals_created_before").val(new Date()); //for creating new compaigns
    var $formElements = $("#campaignForm").find('[name]');
    console.log($formElements);
    populateForm($formElements,transformedData,'name',transformer);
    console.log("done processing final setup");
    return transformedData;
};
function doc_setup(){
    //FIXME: this doesn't prevent the user from entering a start date that is after the end date (which should not break the campaigns program)
    var stores_db = db('stores_rt7');
    var reigion_v = appView('country_prov_city_postal_code');

    //put a date picker on the start and end date inputs
    $("#startDate, #endDate").datepicker(
	{changeMonth: true,
	 changeYear: true,
	 numberOfMonths: 3});

    var Campaign = couchDoc.extend();
    var Campaigns = couchCollection({db:'campaigns'},{model:Campaign});
    campaignList = new Campaigns();
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

  // var countries = new countryList;
/*
    var ontario = new province({name:"ontario"});
    provinces.add(ontario);
    var canada = new country({name:"canada",children:provinces});
    countries.add(canada);
*/