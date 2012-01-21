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
	     var view = this;
	     var html = ich.menuInventoryScanPriceLog_TMP({startPage:"companyReport", 
	     						   breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(view.el).html(html);

	     var companyID = ReportData.company._id;

	     inventoryPriceChangeLog(companyID)
	     (function(err,resp){
		  console.log(resp);
		  resp = _.map(resp, function(item){
		  		   item.date = dateFormatter(new Date(item.date));
		  		   item.price.selling_price = currency_format(item.price.selling_price);
		  		   return item;
		  	       });
		  var html =  ich.menuInventoryScanPriceLogtable_TMP({list:resp});
		  $(view.el).find("#scanPriceChangeLogTable").html(html);
		  
	      });	 	
	 },
	 renderMenuInventoryGrouppriceChangeLog: function() {
	     var view = this;
	     var html = ich.menuInventoryScanPriceLog_TMP({startPage:"groupReport", 
	     						   breadCrumb:breadCrumb(ReportData.companyName, 
										 ReportData.group.groupName)});
	     $(view.el).html(html);

	     var groupID = ReportData.group.group_id;

	     inventoryPriceChangeLog(groupID)
	     (function(err,resp){
		  console.log(resp);
		  resp = _.map(resp, function(item){
		  		   item.date = dateFormatter(new Date(item.date));
		  		   item.price.selling_price = currency_format(item.price.selling_price);
		  		   return item;
		  	       });
		  var html =  ich.menuInventoryScanPriceLogtable_TMP({list:resp});
		  $(view.el).find("#scanPriceChangeLogTable").html(html);
		  
	      });
	 },
	 renderMenuInventoryStorepriceChangeLog: function() {
	     var view = this;
	     var html = ich.menuInventoryScanPriceLog_TMP({startPage:"groupReport", 
	     						   breadCrumb:breadCrumb(ReportData.companyName, 
	     							   		 ReportData.groupName,
	     							   		 ReportData.store.storeName,
	     							   		 ReportData.store.number)});
	     $(view.el).html(html);

	     var storeID = ReportData.store.store_id;

	     inventoryPriceChangeLog(storeID)
	     (function(err,resp){
		  console.log(resp);
		  resp = _.map(resp, function(item){
		  		   item.date = dateFormatter(new Date(item.date));
		  		   item.price.selling_price = currency_format(item.price.selling_price);
		  		   return item;
		  	       });
		  var html =  ich.menuInventoryScanPriceLogtable_TMP({list:resp});
		  $(view.el).find("#scanPriceChangeLogTable").html(html);
		  
	      });
	 }
	});