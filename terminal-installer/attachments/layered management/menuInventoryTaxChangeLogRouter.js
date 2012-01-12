var menuInventorytaxChangeLogRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReporttaxChangeLog":"menuInventoryCompanytaxChangeLog",
		  "menuInventory/groupReporttaxChangeLog":"menuInventoryGrouptaxChangeLog",
		  "menuInventory/storeReporttaxChangeLog":"menuInventoryStoretaxChangeLog"
	      },
	      menuInventoryCompanytaxChangeLog:function() {
		  console.log("menuInventoryCompanytaxChangeLog");
	      },
	      menuInventoryGrouptaxChangeLog:function() {
		  console.log("menuInventoryGroupaddiItem");
	      },
	      menuInventoryStoretaxChangeLog:function() {
		  console.log("menuInventoryStoretaxChangeLog");
	      }
	     }));


var menuInventorytaxChangeLogView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanytaxChangeLog',
		       'renderMenuInventoryGrouptaxChangeLog',
		       'renderMenuInventoryStoretaxChangeLog');
	     menuInventorytaxChangeLogRouter
		 .bind('route:menuInventoryCompanytaxChangeLog', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryCompanytaxChangeLog");
			   view.renderMenuInventoryCompanytaxChangeLog();
		       });
	     menuInventorytaxChangeLogRouter
		 .bind('route:menuInventoryGrouptaxChangeLog', 
		       function(){
			   console.log("menuInventoryView, route:menuInventoryGrouptaxChangeLog");
			   view.renderMenuInventoryGrouptaxChangeLog();
		       });
	     menuInventorytaxChangeLogRouter
		 .bind('route:menuInventoryStoretaxChangeLog',
		       function(){
			   console.log("menuInventoryView, route:menuInventoryStoretaxChangeLog");
			   view.renderMenuInventoryStoretaxChangeLog();
		       });
	 },
	 renderMenuInventoryCompanytaxChangeLog: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     //				       breadCrumb:breadCrumb(ReportData.company.companyName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryGrouptaxChangeLog: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.group.groupName)});
	     //$(this.el).html(html);
	 },
	 renderMenuInventoryStoretaxChangeLog: function() {
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