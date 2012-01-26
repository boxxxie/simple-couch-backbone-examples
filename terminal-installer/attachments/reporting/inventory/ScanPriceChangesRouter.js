var menuInventoryscanPriceChangeRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportscanPriceChange":"menuInventoryCompanyscanPriceChange",
		  "menuInventory/groupReportscanPriceChange":"menuInventoryGroupscanPriceChange",
		  "menuInventory/storeReportscanPriceChange":"menuInventoryStorescanPriceChange"
	      },
	      menuInventoryCompanyscanPriceChange:function() {
		  console.log("menuInventoryCompanyscanPriceChange");
	      },
	      menuInventoryGroupscanPriceChange:function() {
		  console.log("menuInventoryGroupscanPriceChange");
	      },
	      menuInventoryStorescanPriceChange:function() {
		  console.log("menuInventoryStorescanPriceChange");
	      }
	     }));


var menuInventoryscanPriceChangeView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanyscanPriceChange',
		       'renderMenuInventoryGroupscanPriceChange',
		       'renderMenuInventoryStorescanPriceChange');
	     menuInventoryscanPriceChangeRouter
		 .bind('route:menuInventoryCompanyscanPriceChange', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryCompanyscanPriceChange");
			   view.renderMenuInventoryCompanyscanPriceChange();
		       });
	     menuInventoryscanPriceChangeRouter
		 .bind('route:menuInventoryGroupscanPriceChange', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryGroupscanPriceChange");
			   view.renderMenuInventoryGroupscanPriceChange();
		       });
	     menuInventoryscanPriceChangeRouter
		 .bind('route:menuInventoryStorescanPriceChange',
		       function(){
			   console.log("menuInventoryView, route:menuInventoryStorescanPriceChange");
			   view.renderMenuInventoryStorescanPriceChange();
		       });
	 },
	 renderMenuInventoryCompanyscanPriceChange: function(searchQueryString) {
	     function saveNewInvItems(newItemList,company_id,allStore_ids){
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
					       if(wholeCompanyUpdate){

						   var changeIds = _.chain(allStore_ids)
						       .map(function(id){return {location_id:id.id, type:"store", label : id.number + " : " + id.name};})
						       .concat({location_id:company_id})
						       .value();
						   var invData = _.extend({},generalInvItemData,{locid:company_id}); //if we are dealing witha  company wide change, then we make our company's inv item here 
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
						   var changeIds = _.map(idsToSave,function(id){return {location_id:id.id, type:"store", label : id.number + " : " + id.name};});
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
			     _.each(newItemList,pushItemForIDs(runAfter)(company_id));
			 }
			 else{
			     _.each(newItemList,pushItemForIDs(runAfter)(ids));
			 }
		     };
		 };
	     }
	     var view = this;
	     var searchQuery = (_.isDefined(searchQueryString) && 
				_.isNotEmpty(searchQueryString))
		 ?searchQueryString:undefined;
	     var html = 
		 ich.menuInventoryScanItemPriceChanges_TMP({startPage:"companyReport", 
	     						    breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(view.el).html(html);

	     var companyID = ReportData.company._id;
	     var storeIDs = extractStores(ReportData);

	     currentInventoryFor(companyID)
	     (function(err,inventory){
		  var filteredInv = (searchQuery)?_.filterSearchSubStr(inventory,searchQuery):inventory;
		  var formattedInv = _.walk_pre(
		      filteredInv,
		      function(item){
			  if(item.selling_price){
			      return _.extend({},
					      item,
					      {selling_price:currency_format(item.selling_price)});
			  }
			  return item;
		      });
		  var html =  ich.menuInventoryScanPricetable_TMP({filter:searchQuery,list:formattedInv});
		  $(view.el).find("#priceChangeTable").html(html);
		  $("#filterInv").keypress(
		      function(e){
			  var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
			  if (code == enterCode){
			      view.renderMenuInventoryCompanyscanPriceChange($(this).val());}
			  });
		  $("#submitPriceChanges").button().click(
		      function(){
			  var newInvList = _.chain(varFormGrabber($("#priceChangeTable"))).
			      filter$(_.isNotEmpty).	  
			      map(function(price,strUPC){
				      var upc = strUPC.replace("upc-","");
				      var invItem = _.find(filteredInv,function(val,key){return upc==val.upccode;});
				      invItem.price.selling_price = Number(price);
				      return invItem;
				  })
			      .value();
			  if(_.isEmpty(newInvList)){alert("there were no price changes made");return;}

			  var html = ich.menuInventoryApplyStoresQuickViewDialog_TMP({items:storeIDs});
			  menuInventoryApplyStoresViewDialog(
			      html,
			      {title:"Apply price changes to stores", 
			       stores:storeIDs,
			       makeButtons:saveNewInvItems(newInvList,companyID,storeIDs)
			       (function(){view.renderMenuInventoryCompanyscanPriceChange(searchQuery);})});
		      });
	      });
	 },
	 renderMenuInventoryGroupscanPriceChange: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.group.groupName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryStorescanPriceChange: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	   //  var html = ich.menuInventory_TMP({startPage:"storeReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.groupName,
	 	//				     		     ReportData.store.storeName,
	 	//				     		     ReportData.store.number)});
	     //$(this.el).html(html);
	 }
	});