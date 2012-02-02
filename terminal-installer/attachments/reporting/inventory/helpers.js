var inv_helpers = 
    {renderChangesLog : function(view,id,startPageStr,mainTMP,tableTMP,fetcher){
	 var html = ich[mainTMP](_.extend({startPage:startPageStr},autoBreadCrumb()));
	 $(view.el).html(html);
	 fetcher(id)
	 (function(err,resp_raw){
	      var resp = _.map(resp_raw, function(aitem){
				   var item = _.clone(aitem);
		  		   item.date = dateFormatter(new Date(item.date));
  				   if(_.isDefined(item.price)) {
		  		       item.price.selling_price = currency_format(Number(item.price.selling_price));
		  		   }
				   item.locations = _.filter(item.locations,_.has_F('label'));
		  		   return item;
		  	       });
	      
	      var html =  ich[tableTMP]({list:resp});
	      $(view.el).find("#changeLogTable").html(html);
	      //set the buttons to open a dialog list of the stores that apply to each price change
	      _.each(resp,function(item){
			 $("#"+item._id).button().click(
			     function(){
				 item.locations =_(item.locations).chain()
				     .filter(function(item){
						 return (item.label.indexOf(":")!=-1);
					     })
				     .map(function(item){
			     		      var tmp = item.label.split(":");
			     		      return _.extend({},item,{storeName:tmp[1], storeNumber:tmp[0]});
			     		  })
			     	     .value();
				 detailsDialog(ich.simpleList_TMP({items:item.locations}),
					       {title:"changes applied to these locations"});
			     });
		     });
	  });
     },
     renderTaxChangesLog : function(view,id,startPageStr){
	 this.renderChangesLog(view,id,startPageStr,
			       "menuInventoryScanTaxLog_TMP",
			       (startPageStr.indexOf("store")<0)?"menuInventoryScanTaxLogtable_TMP":"menuInventoryScanTaxLogtable_store_TMP",
			       inventoryTaxChangeLog);
     },
     renderPriceChangesLog : function(view,id,startPageStr){
	 this.renderChangesLog(view,id,startPageStr,
			       "menuInventoryScanPriceLog_TMP",
			       (startPageStr.indexOf("store")<0)?"menuInventoryScanPriceLogtable_TMP":"menuInventoryScanPriceLogtable_store_TMP",
			       inventoryPriceChangeLog);
     },

     //TODO newItemList should be a backbone collection
     //inv_doc should be a backbone model.
     //remove allStore_ids
     saveNewInvItems:function(newItemList,origins){
	 function pushItemForIDs(runAfter){
	     return function(idsToSave){
		 return function(inv_doc){
		     // idsToSave ; {type:"..", location_id:"..", name:"..", number:"..", label:".."}
		     // origins ; {type:"..", label:"..", location_id:".."}
		     var generalInvItemData = _.extend({},inv_doc,{date: (new Date()).toString()});
		     
		     var itemModelsToSave = _.chain(idsToSave)
                         .concat(origins)
			 .unique(false,function(item){return either(item.id,item.location_id);})
                         .mapRenameKeys("id","location_id")
			 .map(function(item){
				  var invData = _.extend({},generalInvItemData,{locid:item.location_id});
				  return new InventoryDoc(invData);
			      })
                         .value();

		     var newInvChange = new InventoryChangesDoc({inventory : generalInvItemData,
								 ids : itemsToSave});

		     var allModels = invModelsToSave.concat(newInvChange);

		     async.forEach(allModels,
				   function(model,callback){
				       model.save({},{success:function(){callback();}});
				   },
				   runAfter);
		 };
	     };
	 }
	 return function(runAfter){
	     return function(ids){ //this list of ids probably isn't needed if we are sending models to the fn
		 if(_.isNotEmpty(ids)){
		     _.each(newItemList,pushItemForIDs(runAfter)(ids));
		 }
	     };
	 };
     },
     modelsFromIds:function(attrs,idsToSaveTo){
	 //idsToSaveTo is a list of group/company/store with .id where the item is going to be changed
	 //attrs are the changes made to the inv doc
	 return function(callback){
	     
	     var upc = attrs.upccode;
	     var generalInvItemData = _.extend({},attrs,{date: (new Date()).toString()});
	     var models = async.map(idsToSaveTo,function(id,fetchced){
					(new InventoryDoc({_id: id+"-"+upc}))
					    .fetch(
						{
						    success:function(model){
							fetched(null,model.set(_.extend({},generalInvItemData,{locid:item.id}),{silent:true}));
						    },
						    error:returnQuery(fetched)
						});
				    },callback);
     };
    };