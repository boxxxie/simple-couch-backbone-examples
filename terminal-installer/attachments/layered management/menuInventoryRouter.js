var menuInventoryRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportInventory":"menuInventoryCompanyInventory",
		  "menuInventory/groupReportInventory":"menuInventoryGroupInventory",
		  "menuInventory/storeReportInventory":"menuInventoryStoreInventory"
	      },
	      menuInventoryCompanyInventory:function() {
		  console.log("menuInventoryCompanyInventory  ");
	      },
	      menuInventoryGroupInventory:function() {
		  console.log("menuInventoryGroupInventory  ");
	      },
	      menuInventoryStoreInventory:function() {
		  console.log("menuInventoryStoreInventory  ");
	      }
	     }));


var menuInventoryView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanyInventory',
		       'renderMenuInventoryGroupInventory',
		       'renderMenuInventoryStoreInventory');
	     menuInventoryRouter
		 .bind('route:menuInventoryCompanyInventory', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyInventory");
			   view.renderMenuInventoryCompanyInventory();
		       });
	     menuInventoryRouter
		 .bind('route:menuInventoryGroupInventory', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupInventory");
			   view.renderMenuInventoryGroupInventory();
		       });
	     menuInventoryRouter
		 .bind('route:menuInventoryStoreInventory',
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreInventory");
			   view.renderMenuInventoryStoreInventory();
		       });
	 },
	 renderMenuInventoryCompanyInventory: function() {
	     
	     var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     					  breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(this.el).html(html);
	 },
	 renderMenuInventoryGroupInventory: function() {
	     
	     var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 					  breadCrumb:breadCrumb(ReportData.companyName,
	 					     			ReportData.group.groupName)});
	     $(this.el).html(html);
	 },
	 renderMenuInventoryStoreInventory: function() {
	     
	     var html = ich.menuInventory_TMP({startPage:"storeReport", 
	 					  breadCrumb:breadCrumb(ReportData.companyName,
	 					     			ReportData.groupName,
	 					     			ReportData.store.storeName)});
	     $(this.el).html(html);
	 }
	});