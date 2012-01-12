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
	 renderMenuInventoryCompanyscanPriceChange: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     //				       breadCrumb:breadCrumb(ReportData.company.companyName),
	     //				       showMenuPriceChange:true});
	     //$(this.el).html(html);
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