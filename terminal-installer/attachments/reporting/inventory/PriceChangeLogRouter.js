var menuInventorypriceChangeLogRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportpriceChangeLog":"menuInventoryCompanypriceChangeLog",
		  "menuInventory/groupReportpriceChangeLog":"menuInventoryGrouppriceChangeLog",
		  "menuInventory/storeReportpriceChangeLog":"menuInventoryStorepriceChangeLog"
	      },
	      menuInventoryCompanypriceChangeLog:function() {
		  inv_helpers.renderPriceChangesLog({el: $("#main")},ReportData.company._id, "companyReport");
		  console.log("menuInventoryCompanypriceChangeLog");
	      },
	      menuInventoryGrouppriceChangeLog:function() {
		  inv_helpers.renderPriceChangesLog({el: $("#main")},ReportData.group.group_id,"groupReport");
		  console.log("menuInventoryGroupaddiItem");
	      },
	      menuInventoryStorepriceChangeLog:function() {
		  inv_helpers.renderPriceChangesLog({el: $("#main")},ReportData.store.store_id,"storeReport");
		  console.log("menuInventoryStorepriceChangeLog");
	      }
	     }));
