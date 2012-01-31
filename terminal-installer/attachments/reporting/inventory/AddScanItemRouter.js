var menuInventoryaddScanItemRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportaddScanItem":"menuInventoryCompanyaddScanItem",
		  "menuInventory/groupReportaddScanItem":"menuInventoryGroupaddScanItem",
		  "menuInventory/storeReportaddScanItem":"menuInventoryStoreaddScanItem"
	      },
	      menuInventoryCompanyaddScanItem:function() {
		  console.log("menuInventoryCompanyaddScanItem");
		  $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:"companyReport"},autoBreadCrumb())));
		  var invItem = new InventoryDoc();
		  this.views = [ 
		      new upc_code_input_view({el:"#upc",model:invItem,id:ReportData.company._id}),
		      new inv_display_view({el:"#item_display",model:invItem,id:ReportData.company._id})
		  ];
		  
	      },
	      menuInventoryGroupaddScanItem:function() {
		  console.log("menuInventoryGroupaddiItem");
		  $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:"groupReport"},autoBreadCrumb())));
		  var invItem = new InventoryDoc();
		  this.views = [ 
		      new upc_code_input_view({el:"#upc",model:invItem,id:ReportData.group.group_id}),
		      new inv_display_view({el:"#item_display",model:invItem,id:ReportData.group.group_id})
		  ];
	      },
	      menuInventoryStoreaddScanItem:function() {
		  console.log("menuInventoryStoreaddScanItem");
		  $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:"storeReport"},autoBreadCrumb())));
		  var invItem = new InventoryDoc();
		  this.views = [ 
		      new upc_code_input_view({el:"#upc",model:invItem,id:ReportData.store.store_id}),
		      new inv_display_view({el:"#item_display",model:invItem,id:ReportData.store.store_id})
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
		query({key:[this.id,upc]}, cdb.view("app","id_upc_latestDate"), cdb.db("inventory"))
		(function(response){
		     if(_.isNotEmpty(response.rows)){
			 //the inventory item already exists, so you can not add it again
			 var item  = _.first(response.rows).value;
			 view.model.meta = {inCompany:true};
			 view.model.set(_.removeKeys(item,"_id","_rev")); //update the model anyway, so we can show the user what they were trying to add
		     }
		     else{
			 //we need to check if this upc is in the main inv to set a default description on it
			 (new InventoryRT7Doc({_id:upc}))
			     .fetch({success:function(model){
				     	 view.model.clear({silent:true});
					 view.model.meta = {inCompany:false};
					 view.model.set(_(model.toJSON()).selectKeys('description'));
				     },
				     error:function(){
					 view.model.meta = {inCompany:false};
					 view.model.clear();
				     }});
		     }
		 });
	    }
	}
    );

var inv_display_view = 
    Backbone.View.extend(
	{
	    initialize:function(){
		_.bindAll(this, 'render');
		this.model.bind('change',this.render);
	    },

	    render:function(){
		$(this.el).html(ich.inventoryForm_TMP(this.model.toJSON()));
		if(this.model.meta && this.model.meta.inCompany){ //the item is in the company already, so we only display (no submit button or editing)
		    $(this.el).find("input,button").attr("disabled", true); 
		}
		else{
		    $("#addItemToCompany").button().click(
			function(){
			    function getParentsInfo(ReportData) {
				//if(ReportData.company) { return _.extend({},{id:ReportData.company._id, label:ReportData.company.companyName, type:"company"});}
				//else if(ReportData.group) { return _.extend(temp,{id:ReportData.company_id, label:ReportData.companyName});}
				var parentInfo={};
				if(ReportData.company) { _.extend(parentInfo,{company:{id:ReportData.company._id, label:ReportData.company.companyName, type:"company"}});}
				else {
				    _.extend(parentInfo,{company:{id:ReportData.company_id, label:ReportData.companyName, type:"company"}});
				    if(ReportData.group) {
					_.extend(parentInfo,{group:{id:ReportData.group.group_id, label:ReportData.group.groupName, type:"group"}});
				    } else {
					_.extend(parentInfo,{group:{id:ReportData.group_id, label:ReportData.groupName, type:"group"}});
				    }
				}
				return parentInfo;
			    };
			    
			    var inv = _.extend(varFormGrabber($("#inv_form")),{upccode:$("#upc").val()});
			    var allStores = extractStores(ReportData);
			    inv_helpers.saveNewInvItems([inv],_(getParentsInfo(ReportData)).values(),allStores)
			    (function(){alert("finished saving items");})(allStores);
			    
			});
		}
	    }
	}
    );