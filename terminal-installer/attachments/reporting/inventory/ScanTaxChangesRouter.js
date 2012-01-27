var menuInventoryscanTaxChangeRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportscanTaxChange":"menuInventoryCompanyscanTaxChange",
		  "menuInventory/groupReportscanTaxChange":"menuInventoryGroupscanTaxChange",
		  "menuInventory/storeReportscanTaxChange":"menuInventoryStorescanTaxChange"
	      },
	      menuInventoryCompanyscanTaxChange:function() {
		  console.log("menuInventoryCompanyscanTaxChange");
	      },
	      menuInventoryGroupscanTaxChange:function() {
		  console.log("menuInventoryGroupscanTaxChange");
	      },
	      menuInventoryStorescanTaxChange:function() {
		  console.log("menuInventoryStorescanTaxChange");
	      }
	     }));


var menuInventoryscanTaxChangeView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanyscanTaxChange',
		       'renderMenuInventoryGroupscanTaxChange',
		       'renderMenuInventoryStorescanTaxChange');
	     menuInventoryscanTaxChangeRouter
		 .bind('route:menuInventoryCompanyscanTaxChange', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryCompanyscanTaxChange");
			   view.renderMenuInventoryCompanyscanTaxChange();
		       });
	     menuInventoryscanTaxChangeRouter
		 .bind('route:menuInventoryGroupscanTaxChange', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryGroupscanTaxChange");
			   view.renderMenuInventoryGroupscanTaxChange();
		       });
	     menuInventoryscanTaxChangeRouter
		 .bind('route:menuInventoryStorescanTaxChange',
		       function(){
			   console.log("menuInventoryView, route:menuInventoryStorescanTaxChange");
			   view.renderMenuInventoryStorescanTaxChange();
		       });
	 },
	 renderMenuInventoryCompanyscanTaxChange: function(searchQueryString) {
	     var view = this;
	     var searchQuery = (_.isDefined(searchQueryString) && 
				_.isNotEmpty(searchQueryString))
		 ?searchQueryString:undefined;
	     var html = 
		 ich.menuInventoryScanItemTaxChanges_TMP(_.extend({startPage:"companyReport"}, 
	     							    autoBreadCrumb()));
	     $(view.el).html(html);

	     var companyID = ReportData.company._id;
	     var storeIDs = extractStores(ReportData);

	     currentInventoryFor(companyID)
	     (function(err,inventory){
		  var filteredInv = (searchQuery)?_.filterSearch_SubStr(inventory,searchQuery):inventory;
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
		  var html =  ich.menuInventoryScanTaxtable_TMP({filter:searchQuery,list:formattedInv});
		  $(view.el).find("#taxChangeTable").html(html);
		  
		  _.each(formattedInv, function(item){
		  	var tg = $("#"+item.upccode);
		  	tg.click(function(){
		  		var row = $(this).parent().parent().find("input");
		  		if((_.first(row)).disabled) {
		  			$(this).html("Disable");
		  			_.each(row,function(item){item.disabled=false});
		  		} else {
		  			$(this).html("Enable");
		  			_.each(row,function(item){item.disabled=true});
		  		}
		  	});
		  });
		  
		  $("#filterInv").keypress(
		      function(e){
			  var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
			  if (code == enterCode){
			      view.renderMenuInventoryCompanyscanTaxChange($(this).val());}
			  });
		  $("#submitTaxChanges").button().click(
		      function(){
			  var newInvList = _.chain(varFormGrabber($("#taxChangeTable"))).
			      map(function(item,strUPC){
				      var upc = strUPC.replace("upc-","");
				      var invItem = _.find(filteredInv,function(val,key){return upc==val.upccode;});
				      invItem.apply_taxes = item.apply_taxes;
				      return invItem;
				  })
				  .filter(function(item){
				  	return $("#"+item.upccode).html() == "Disable";
				  })
			      .value();
		      console.log(newInvList);
		      
			  if(_.isEmpty(newInvList)){alert("there were no changes made");return;}

			  var html = ich.menuInventoryApplyStoresQuickViewDialog_TMP({items:storeIDs});
			  menuInventoryApplyStoresViewDialog(
			      html,
			      {title:"Apply changes to stores", 
			       stores:storeIDs,
			       makeButtons:inv_helpers.saveNewInvItems(newInvList,companyID,storeIDs)
			       (function(){view.renderMenuInventoryCompanyscanTaxChange(searchQuery);})});
		      });
	      });
	 },
	 renderMenuInventoryGroupscanTaxChange: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.group.groupName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryStorescanTaxChange: function() {
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