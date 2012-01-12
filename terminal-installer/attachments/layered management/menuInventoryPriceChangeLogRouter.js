var menuInventorypriceChangeLogRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportpriceChangeLog":"menuInventoryCompanypriceChangeLog",
		  "menuInventory/groupReportpriceChangeLog":"menuInventoryGrouppriceChangeLog",
		  "menuInventory/storeReportpriceChangeLog":"menuInventoryStorepriceChangeLog"
	      },
	      menuInventoryCompanypriceChangeLog:function() {
		  console.log("menuInventoryCompanypriceChangeLog");
	      },
	      menuInventoryGrouppriceChangeLog:function() {
		  console.log("menuInventoryGroupaddiItem");
	      },
	      menuInventoryStorepriceChangeLog:function() {
		  console.log("menuInventoryStorepriceChangeLog");
	      }
	     }));


var menuInventorypriceChangeLogView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanypriceChangeLog',
		       'renderMenuInventoryGrouppriceChangeLog',
		       'renderMenuInventoryStorepriceChangeLog');
	     menuInventorypriceChangeLogRouter
		 .bind('route:menuInventoryCompanypriceChangeLog', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryCompanypriceChangeLog");
			   view.renderMenuInventoryCompanypriceChangeLog();
		       });
	     menuInventorypriceChangeLogRouter
		 .bind('route:menuInventoryGrouppriceChangeLog', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryGrouppriceChangeLog");
			   view.renderMenuInventoryGrouppriceChangeLog();
		       });
	     menuInventorypriceChangeLogRouter
		 .bind('route:menuInventoryStorepriceChangeLog',
		       function(){
			   console.log("menuInventoryView, route:menuInventoryStorepriceChangeLog");
			   view.renderMenuInventoryStorepriceChangeLog();
		       });
	 },
	 renderMenuInventoryCompanypriceChangeLog: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     //				       breadCrumb:breadCrumb(ReportData.company.companyName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryGrouppriceChangeLog: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.group.groupName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryStorepriceChangeLog: function() {
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