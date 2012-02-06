var menuInventoryaddScanItemRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/addScanItem":"_setup"
	      },
	      _setup:function(){
		  console.log("add scan item page");
		  $("#main").html(ich.inventoryManagementHome_TMP(autoBreadCrumb()));
		  var invItem = new InventoryDoc();
		  var id = topLevelEntity(ReportData).id;
		  invItem.cid = id;
		  this.views = [ 
		      new upc_code_input_view({model:invItem}).setElement("#upc"),
		      new inv_display_view({model:invItem}).setElement("#item_display")
		  ];
	      }
	     }));


var upc_code_input_view = 
    Backbone.View.extend(
	{
	    events:{
		"change":"userChangedUpc"
	    },
	    userChangedUpc:function(){
		var upc = _.str.trim($(this.el).val());
		var view = this;
		var model = view.model;
		model
		    .set({_id:model.cid+"-"+upc},{silent:true})
		    .fetch(
			{
			    success:function(resp_model){
				model.trigger("item_already_in_company",resp_model);
			    },
			    error:function(){
				(new InventoryRT7Doc({_id:upc}))
				    .fetch({success:function(resp_model){
				     		model.clear({silent:true});
						model.set(_(resp_model.toJSON()).selectKeys('description'),{silent:true});
						model.trigger("loaded_from_rt7",model);
					    },
					    error:function(){
						model.clear({silent:true});
						model.trigger("add_item_to_company",model);
					    }});
			    }});
	    }
	}
    );

var inv_display_view = 
    Backbone.View.extend(
	{
	    initialize:function(){
		this.model.on('add_item_to_company',this.addItemTo_company_and_reviewDB,this);
		this.model.on('loaded_from_rt7',this.addItemTo_company,this);
		this.model.on("item_already_in_company",this.displayItem,this);
	    },
	    _renderItem:function(model,msg){
		if(msg){var tmpData = _.extend(model.toJSON(),{userMessage:msg});}
		else{var tmpData = model.toJSON();}
		this.$el.html(ich.inventoryForm_TMP(tmpData));
	    },
	    _disableSubmitButton:function(){
		this.$el.find("input,button").attr("disabled", true); 
	    },
	    _saveItemsAndLog:function(){
		return function(runAfter){
		    $("#addItemToCompany").button().click(
			function(){
			    var formObj = varFormGrabber($("#inv_form"));
			    var upc = $("#upc").val();
			    var attrs = _.extend(formObj,{upccode:upc});
			    var allStores = extractStores(ReportData);
			    var allGroups = extractGroups(ReportData);
			    var parents = _.values(getParentsInfo(ReportData));
			    var locationsToSaveTo = allStores.concat(parents,allGroups);
			    //create all of the models for the inv objects
			    async.parallel([inv_helpers.modelsFromIds(attrs,locationsToSaveTo),
					    inv_helpers.changesLogFromModels(attrs,locationsToSaveTo)],
					   //save all of the models
					   function(err,modelsToSave){
					       async.forEach(_.flatten(modelsToSave),
							     function(model,cb){
								 model.save({},{
										success:function(){cb();},
										error:function(){console.log("there was an error saving this model");
												 console.log(arguments);
												 cb();}
									    });
							     },
							     function(){runAfter(attrs);}
							    );
					   });
			});
		};
	    },
	    _submitButtonClick:function(fn){
		$("#addItemToCompany")
		    .button()
		    .click(fn);
	    },
	    addItemTo_company:function(model){
	    	this._renderItem(model,"you can add this item to your inventory, it has a suggested description");
		this._submitButtonClick(
		    this._saveItemsAndLog(model)
		    (function(attrs){alert(attrs.description + " has been added");})
		);
	    },
	    addItemTo_company_and_reviewDB:function(model){
	    	this._renderItem(model,"you can add this item to your inventory");
		this._submitButtonClick(
		    this._saveItemsAndLog(model)
		    (function(attrs){
			 (new InventoryReviewDoc(
			      {
				  _id:attrs.upccode, 
				  date:(new Date()).toString(), 
				  description:attrs.description
			      })).save();
			 alert(attrs.description + " has been added");
		     })
		);
	    },
	    displayItem:function(model){
		this._renderItem(model, model.get("description") + " is already in your inventory. It can not be added again.");
		this._disableSubmitButton();
	    }
	}
    );