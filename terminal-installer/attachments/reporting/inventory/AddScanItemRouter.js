var menuInventoryaddScanItemRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportaddScanItem":"menuInventoryCompanyaddScanItem",
		  "menuInventory/groupReportaddScanItem":"menuInventoryGroupaddScanItem",
		  "menuInventory/storeReportaddScanItem":"menuInventoryStoreaddScanItem"
	      },
	      menuInventoryCompanyaddScanItem:function() {
		  console.log("menuInventoryCompanyaddScanItem");
	      },
	      menuInventoryGroupaddScanItem:function() {
		  console.log("menuInventoryGroupaddiItem");
	      },
	      menuInventoryStoreaddScanItem:function() {
		  console.log("menuInventoryStoreaddScanItem");
	      }
	     }));


var menuInventoryaddScanItemView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanyaddScanItem',
		       'renderMenuInventoryGroupaddScanItem',
		       'renderMenuInventoryStoreaddScanItem');
	     menuInventoryaddScanItemRouter
		 .bind('route:menuInventoryCompanyaddScanItem', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryCompanyaddScanItem");
			   view.renderMenuInventoryCompanyaddScanItem();
		       });
	     menuInventoryaddScanItemRouter
		 .bind('route:menuInventoryGroupaddScanItem', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryGroupaddScanItem");
			   view.renderMenuInventoryGroupaddScanItem();
		       });
	     menuInventoryaddScanItemRouter
		 .bind('route:menuInventoryStoreaddScanItem',
		       function(){
			   console.log("menuInventoryView, route:menuInventoryStoreaddScanItem");
			   view.renderMenuInventoryStoreaddScanItem();
		       });
	 },
	 renderMenuInventoryCompanyaddScanItem: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     //				       breadCrumb:breadCrumb(ReportData.company.companyName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryGroupaddScanItem: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.group.groupName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryStoreaddScanItem: function() {
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