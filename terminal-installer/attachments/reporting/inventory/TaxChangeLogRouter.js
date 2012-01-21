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
	     var view = this;
	     var html = ich.menuInventoryScanTaxLog_TMP({startPage:"companyReport", 
	     							   breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(view.el).html(html);

	     var companyID = ReportData.company._id;

	     inventoryTaxChangeLog(companyID)
	     (function(err,resp){
		  	console.log(resp);
		  	resp = _.map(resp, function(item){
		  		item.date = dateFormatter(new Date(item.date));
		  		return item;
		  	});
		  	var html =  ich.menuInventoryScanTaxLogtable_TMP({list:resp});
		  	$(view.el).find("#scanTaxChangeLogTable").html(html);
		  			  
	      });
	 },
	 renderMenuInventoryGrouptaxChangeLog: function() {
	     var view = this;
	     var html = ich.menuInventoryScanPriceLog_TMP({startPage:"groupReport", 
	     							   breadCrumb:breadCrumb(ReportData.companyName, ReportData.group.groupName)});
	     $(view.el).html(html);

	     var groupID = ReportData.group.group_id;
	     
	     inventoryTaxChangeLog(groupID)
	     (function(err,resp){
		  	console.log(resp);
		  	resp = _.map(resp, function(item){
		  		item.date = dateFormatter(new Date(item.date));
		  		return item;
		  	});
		  	var html =  ich.menuInventoryScanTaxLogtable_TMP({list:resp});
		  	$(view.el).find("#scanTaxChangeLogTable").html(html);
		  			  
	      });
	 },
	 renderMenuInventoryStoretaxChangeLog: function() {
	     var view = this;
	     var html = ich.menuInventoryScanPriceLog_TMP({startPage:"groupReport", 
	     							   breadCrumb:breadCrumb(ReportData.companyName, 
	     							   						ReportData.groupName,
	     							   						ReportData.store.storeName,
	     							   						ReportData.store.number)});
	     $(view.el).html(html);

	     var storeID = ReportData.store.store_id;
	     
	     inventoryTaxChangeLog(storeID)
	     (function(err,resp){
		  	console.log(resp);
		  	resp = _.map(resp, function(item){
		  		item.date = dateFormatter(new Date(item.date));
		  		return item;
		  	});
		  	var html =  ich.menuInventoryScanTaxLogtable_TMP({list:resp});
		  	$(view.el).find("#scanTaxChangeLogTable").html(html);
		  			  
	      });
	 }
	});