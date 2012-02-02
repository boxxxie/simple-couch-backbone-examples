function getTopLevelId(reportData){
    if(ReportData.company && ReportData.company._id){return ReportData.company._id;}
    else if(ReportData.group && ReportData.group.group_id){return ReportData.group.group_id;}
    else if(ReportData.store && ReportData.store.store_id){return ReportData.store.store_id;}
    else {return undefined;}
};
function getParentsInfo(reportData){
    var parentInfo={};
    if(reportData.company) { _.extend(parentInfo,{company:{id:reportData.company._id, label:reportData.company.companyName, type:"company"}});}
    else {
	_.extend(parentInfo,{company:{id:reportData.company_id, label:reportData.companyName, type:"company"}});
	if(reportData.group) {
	    _.extend(parentInfo,{group:{id:reportData.group.group_id, label:reportData.group.groupName, type:"group"}});
	} else {
	    _.extend(parentInfo,{group:{id:reportData.group_id, label:reportData.groupName, type:"group"}}
	                       ,{store:{id:reportData.store.store_id, label:(reportData.store.number+":"+reportData.store.storeName),type:"store"}});
	}
    }
    return parentInfo;
};
var menuInventoryaddScanItemRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  //login#menuInventory/companyReportaddScanItem
		  "menuInventory/companyReportaddScanItem":"menuInventoryCompanyaddScanItem",
		  "menuInventory/groupReportaddScanItem":"menuInventoryGroupaddScanItem",
		  "menuInventory/storeReportaddScanItem":"menuInventoryStoreaddScanItem"
	      },
	      _setup:function(startPage){
		  $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:startPage},autoBreadCrumb())));
		  var invItem = new InventoryDoc();
		  var id = getTopLevelId(ReportData);
		  invItem.cid = id;
		  this.views = [ 
		      new upc_code_input_view({model:invItem}).setElement("#upc"),
		      new inv_display_view({model:invItem}).setElement("#item_display")
		  ];
	      },
	      menuInventoryCompanyaddScanItem:function() {
		  console.log("menuInventoryCompanyaddScanItem");
		  this._setup("companyReport");
	      },
	      menuInventoryGroupaddScanItem:function() {
		  console.log("menuInventoryGroupaddiItem");
		  this._setup("groupReport");
	      },
	      menuInventoryStoreaddScanItem:function() {
		  console.log("menuInventoryStoreaddScanItem");
		  this._setup("storeReport");
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
			    success:function(){
				var item  = _.first(response.rows).value;
				model.set(_.removeKeys(item,"_id","_rev"),{silent:true});
				model.trigger("item_already_in_company",model);
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
		this.model.on('add_item_to_company',this.addItem,this);
		this.model.on('loaded_from_rt7',this.addItem,this);
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
	    //todo, need to be able to add to the review DB if the item isn't in rt7 DB
	    addItem:function(model){
		this._renderItem(model,"you can add this item to your inventory");
		$("#addItemToCompany").button().click(
		    function(){
			var formObj = varFormGrabber($("#inv_form"));
			var inv = _.extend(formObj,{upccode:$("#upc").val()});
			var allStores = extractStores(ReportData);
			var modelsToSave = inv_helpers.modelsFromIds(inv,allStores);
			//inv_helpers.saveNewInvItems([inv], _.values(getParentsInfo(ReportData)))
			//(function(){alert("finished saving item to company/stores");});
			
		    });
	    },
	    displayItem:function(model){
		this._renderItem(model,"you can not add this item to your inventory, it already exists in it");
		this._disableSubmitButton();
	    }
	}
    );