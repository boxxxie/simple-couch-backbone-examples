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
	     var view = this;
	     var searchQuery = (_.isDefined(searchQueryString) && 
				_.isNotEmpty(searchQueryString))
		 ?searchQueryString:undefined;
	     var html = 
		 ich.menuInventoryScanItemPriceChanges_TMP(_.extend({startPage:"companyReport"}, 
	     							    autoBreadCrumb()));
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
			  if(_.isEmpty(newInvList)){alert("there were no changes made");return;}

			  var html = ich.menuInventoryApplyStoresQuickViewDialog_TMP({items:storeIDs});
			  menuInventoryApplyStoresViewDialog(
			      html,
			      {title:"Apply changes to stores", 
			       stores:storeIDs,
			       makeButtons:inv_helpers.saveNewInvItems(newInvList,companyID,storeIDs)
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