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
	 renderMenuInventoryCompanyscanTaxChange: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     //				       breadCrumb:breadCrumb(ReportData.company.companyName)});
	     //$(this.el).html(html);
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