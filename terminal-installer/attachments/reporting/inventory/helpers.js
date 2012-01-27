var inv_helpers = 
    {renderChangesLog : function(view,id,startPageStr,mainTMP,tableTMP,fetcher){
	 var html = ich[mainTMP](_.extend({startPage:startPageStr},autoBreadCrumb()));
	 $(view.el).html(html);
	 fetcher(id)
	 (function(err,resp_raw){
	      var resp = _.map(resp_raw, function(aitem){
				   var item = _.clone(aitem);
		  		   item.date = dateFormatter(new Date(item.date));
		  		   item.price.selling_price = currency_format(item.price.selling_price);
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
											return item.label.indexOf(":")>0;
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
     //saveNewInvItems:function(newItemList,company_id,allStore_ids){
     	saveNewInvItems:function(newItemList,origin,allStore_ids){
	 function pushItemForIDs(runAfter){
	     return function(ids){
		 return function(inv_doc){
		     var generalInvItemData = _.extend(_.removeKeys(inv_doc,['_id','_rev']),
						       {date: (new Date()).toString()}); 
		     if(!_.isArray(ids)){
			 var wholeCompanyUpdate = true;
			 var idsToSave = allStore_ids;
		     }
		     else{
			 var idsToSave = ids;
		     }
		     async.forEach(idsToSave,
				   function(id,callback){
				       var invData = _.extend({},generalInvItemData,{locid:id.id});
				       var newInv = new InventoryDoc(invData);
				       newInv.save({},{success:function(){callback();}});},
				   
				   function(){
				       //check to see if the company is in the list of ids (meaning that this price change is going to effect the whole company)
				       //in this case the ids array is probably going to be a length of 1, but we'll be safe and use a search function
				       var changeIds = _.chain(idsToSave)
					   .map(function(id){return {location_id:id.id, type:"store", label : id.number + " : " + id.name};})
					   //.concat({location_id:company_id})
					   .concat({location_id:origin.id, type:origin.type, label:origin.label})
					   .value();
				       if(wholeCompanyUpdate){
					   var invData = _.extend({},generalInvItemData,{locid:origin.id}); //if we are dealing witha  company wide change, then we make our company's inv item here 
					   var newInv = new InventoryDoc(invData);
					   var newInvChange = new InventoryChangesDoc({inventory : generalInvItemData,
										       ids : changeIds});
					   async.forEach([newInv,newInvChange],
							 function(model,callback){
							     model.save({},{success:callback});
							 },
							 runAfter);
				       }
				       else{
					   var newInvChange = new InventoryChangesDoc({inventory : generalInvItemData,
										       ids : changeIds});

					   newInvChange.save({},{success:runAfter,
								 error:runAfter}
							    );
				       }
				   });
		 };
	     };
	 }
	 return function(runAfter){
	     return function(ids){
		 if(_.isEmpty(ids)){}
		 else if(ids.length == allStore_ids.length){
		     _.each(newItemList,pushItemForIDs(runAfter)(origin.id));
		 }
		 else{
		     _.each(newItemList,pushItemForIDs(runAfter)(ids));
		 }
	     };
	 };
     }
    };