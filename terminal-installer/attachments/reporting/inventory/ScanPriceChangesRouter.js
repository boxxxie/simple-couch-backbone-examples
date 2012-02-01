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

	     var companyData = {id:ReportData.company._id, type:"company", label:ReportData.company.companyName};
	     var storeIDs = extractStores(ReportData);

	     currentInventoryFor(companyData.id)
	     (function(err,inventory){
		  var filteredInv = (searchQuery)?_.filterSearch_SubStr(inventory,searchQuery):inventory;
		  var formattedInv = _.walk_pre(
		      filteredInv,
		      function(item){
			  if(item.selling_price){
			      return _.extend({},
					      item,
					      {selling_price:currency_format(Number(item.selling_price))});
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
				      var invItemReturn = _.selectKeys(invItem,"price","date","description","locid","upccode");
                      invItemReturn.price.selling_price = price;
                      return invItemReturn;
				  })
			      .value();
			  if(_.isEmpty(newInvList)){alert("there were no changes made");return;}

			  var html = ich.menuInventoryApplyStoresQuickViewDialog_TMP({items:storeIDs});
			  menuInventoryApplyStoresViewDialog(
			      html,
			      {title:"Apply changes to stores", 
			       stores:storeIDs,
			       makeButtons:inv_helpers.saveNewInvItems(newInvList,[companyData],storeIDs)
			       (function(){view.renderMenuInventoryCompanyscanPriceChange(searchQuery);})});
		      });
	      });
	 },
	 renderMenuInventoryGroupscanPriceChange: function(searchQueryString) {
	     var view = this;
	     var searchQuery = (_.isDefined(searchQueryString) && 
				_.isNotEmpty(searchQueryString))
		 ?searchQueryString:undefined;
	     var html = 
		 ich.menuInventoryScanItemPriceChanges_TMP(_.extend({startPage:"groupReport"}, 
	     							    autoBreadCrumb()));
	     $(view.el).html(html);

	     var companyData = {id:ReportData.company_id, type:"company", label:ReportData.companyName};
	     var groupData = {id:ReportData.group.group_id, type:"group", label:ReportData.group.groupName};
	     var storeIDs = extractStores(ReportData);

	     currentInventoryFor(groupData.id)
	     (function(err,inventory){
		  var filteredInv = (searchQuery)?_.filterSearch_SubStr(inventory,searchQuery):inventory;
		  var formattedInv = _.walk_pre(
		      filteredInv,
		      function(item){
			  if(item.selling_price){
			      return _.extend({},
					      item,
					      {selling_price:currency_format(Number(item.selling_price))});
			  }
			  return item;
		      });
		  var html =  ich.menuInventoryScanPricetable_TMP({filter:searchQuery,list:formattedInv});
		  $(view.el).find("#priceChangeTable").html(html);
		  $("#filterInv").keypress(
		      function(e){
			  var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
			  if (code == enterCode){
			      view.renderMenuInventoryGroupscanPriceChange($(this).val());}
		      });
		  $("#submitPriceChanges").button().click(
		      function(){
			  var newInvList = _.chain(varFormGrabber($("#priceChangeTable"))).
			      filter$(_.isNotEmpty).	  
			      map(function(price,strUPC){
				      var upc = strUPC.replace("upc-","");
				      var invItem = _.find(filteredInv,function(val,key){return upc==val.upccode;});
				      var invItemReturn = _.selectKeys(invItem,"price","date","description","locid","upccode");
                      invItemReturn.price.selling_price = price;
                      return invItemReturn;
				      return invItem;
				  })
			      .value();
			  if(_.isEmpty(newInvList)){alert("there were no changes made");return;}

			  var html = ich.menuInventoryApplyStoresQuickViewDialog_TMP({items:storeIDs});
			  menuInventoryApplyStoresViewDialog(
			      html,
			      {title:"Apply changes to stores", 
			       stores:storeIDs,
			       makeButtons:inv_helpers.saveNewInvItems(newInvList,[companyData,groupData],storeIDs)
			       (function(){view.renderMenuInventoryGroupscanPriceChange(searchQuery);})});
		      });
	      });
	 },
	 renderMenuInventoryStorescanPriceChange: function(searchQueryString) {
	     var view = this;
	     var searchQuery = (_.isDefined(searchQueryString) && 
				_.isNotEmpty(searchQueryString))
		 ?searchQueryString:undefined;
	     var html = 
		 ich.menuInventoryScanItemPriceChanges_TMP(_.extend({startPage:"storeReport"}, 
	     							    autoBreadCrumb()));
	     $(view.el).html(html);

	     var companyData = {id:ReportData.company_id, type:"company", label:ReportData.companyName};
	     var groupData = {id:ReportData.group_id, type:"group", label:ReportData.groupName};
	     var storeData = {id:ReportData.store.store_id, type:"store", label:(ReportData.store.number+":"+ReportData.store.storeName)};
	     var storeIDs = extractStores(ReportData);

	     currentInventoryFor(storeData.id)
	     (function(err,inventory){
		  var filteredInv = (searchQuery)?_.filterSearch_SubStr(inventory,searchQuery):inventory;
		  var formattedInv = _.walk_pre(
		      filteredInv,
		      function(item){
			  if(item.selling_price){
			      return _.extend({},
					      item,
					      {selling_price:currency_format(Number(item.selling_price))});
			  }
			  return item;
		      });
		  var html =  ich.menuInventoryScanPricetable_TMP({filter:searchQuery,list:formattedInv});
		  $(view.el).find("#priceChangeTable").html(html);
		  $("#filterInv").keypress(
		      function(e){
			  var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
			  if (code == enterCode){
			      view.renderMenuInventoryStorescanPriceChange($(this).val());}
		      });
		  $("#submitPriceChanges").button().click(
		      function(){
			  var newInvList = _.chain(varFormGrabber($("#priceChangeTable"))).
			      filter$(_.isNotEmpty).	  
			      map(function(price,strUPC){
				      var upc = strUPC.replace("upc-","");
				      var invItem = _.find(filteredInv,function(val,key){return upc==val.upccode;});
				      
				      var invItemReturn = _.selectKeys(invItem,"price","date","description","locid","upccode");
				      invItemReturn.price.selling_price = price;
				      return invItemReturn;
				  })
			      .value();
			  if(_.isEmpty(newInvList)){alert("there were no changes made");return;}

			  inv_helpers.saveNewInvItems(newInvList,[companyData,groupData,storeData],storeIDs)
  			  (function(){view.renderMenuInventoryStorescanPriceChange(searchQuery);})(storeIDs);
		      });
	      });
	 }
	});