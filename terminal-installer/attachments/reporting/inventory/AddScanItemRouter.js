var menuInventoryaddScanItemRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/addScanItem":"_setup"
	      },
	      _setup:function(){
		  console.log("add scan item page");
		  $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:ReportData.startPage},autoBreadCrumb())));
		  var invItem = new InventoryDoc();
		  var id = topLevelEntity(ReportData).id;
		  invItem.cid = id;
		  this.views = [ 
		      new upc_code_input_view({model:invItem}).setElement("#upc_search",true),
		      new inv_display_view({model:invItem}).setElement("#item_display")
		  ];
	      }
	     }));


var upc_code_input_view = 
    Backbone.View.extend(
	{
	    events:{
		"change input":"userChangedUpc",
		"click button":"userChangedUpc"
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
	    _saveItemsAndLog:function(callback){
		var view = this;
		return function(){
		    //extract model values from form/textbox
		    var formObj = varFormGrabber($("#inv_form"));
		    var upc = $("#upc").val();
		    var invObj = _.extend(formObj,{upccode:upc,
						   date:new Date()});

		    var allStores = extractStores(ReportData);
		    var allGroups = extractGroups(ReportData);
		    var parents = _.values(getParentsInfo(ReportData));
		    var locationsToSaveTo = allStores.concat(parents,allGroups);
		    //create all of the models for the inv objects (all stores and groups and the company)

		    inv_helpers.saveOneInvItem(invObj,locationsToSaveTo)
		    (function(err,invItem){
			 if(err){
			     alert("There was an error saving the item: " + err.reason);
			 }
			 else{
			     view._submitButtonClick(
				 function(){
				     alert("you can not add the item again");
				 });
			 }
			 callback.apply(null,_(arguments).toArray());
		     });
		};
	    },
	    _submitButtonClick:function(fn){
		$("#addItemToCompany")
		    .button()
		    .click(
			function(){
			    fn();
			});
	    },
	    addItemTo_company:function(model){
	    	this._renderItem(model,"you can add this item to your inventory, it has a suggested description");
		this._submitButtonClick(
		    this._saveItemsAndLog
		    (function(err,savedInv){
			 if(err === undefined){
			     alert(savedInv.description + " has been added");
			 }
		     })
		);
	    },
	    addItemTo_company_and_reviewDB:function(model){
		var view = this;
	    	this._renderItem(model,"you can add this item to your inventory");
		this._submitButtonClick(
		    this._saveItemsAndLog
		    (function(err,savedInv){
		     var parents = getParentsInfo(ReportData);
		     var pInfo = [parents.company, parents.group, parents.store];
		     var ids = _(pInfo).chain()
                          .compact()
                          .mapRenameKeys("id","location_id")
                          .map(function(item){
                            return _(item).selectKeys('location_id','label','type');
                          })
                          .value();

            var inv = _.chain(savedInv)
                     .selectKeys('date','upccode','description','price')
                     .value();
		     
			 if(err === undefined){
			     alert(savedInv.description + " has been added");
			 }
			 //save the review doc anyway, even if there are errors saving the original document
			 var invItemForReview = new InventoryReviewDoc({ids:ids, inventory:inv});
             invItemForReview.save(); //this will conflict sometimes, it's ok
		     })
		);
	    },
	    displayItem:function(model){
		this._renderItem(model, 
				 model.get("description") + 
				 " is already in your inventory. It can not be added again.");
		this._disableSubmitButton();
	    }
	}
    );