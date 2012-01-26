var menuInventorytaxChangeLogRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReporttaxChangeLog":"menuInventoryCompanytaxChangeLog",
		  "menuInventory/groupReporttaxChangeLog":"menuInventoryGrouptaxChangeLog",
		  "menuInventory/storeReporttaxChangeLog":"menuInventoryStoretaxChangeLog"
	      },
	      menuInventoryCompanytaxChangeLog:function() {
		  inv_helpers.renderTaxChangesLog({el: $("#main")}, ReportData.company._id, "companyReport");
		  console.log("menuInventoryCompanytaxChangeLog");
	      },
	      menuInventoryGrouptaxChangeLog:function() {
		  inv_helpers.renderTaxChangesLog({el: $("#main")}, ReportData.group.group_id, "groupReport");
		  console.log("menuInventoryGroupaddiItem");
	      },
	      menuInventoryStoretaxChangeLog:function() {
		  inv_helpers.renderTaxChangesLog({el: $("#main")},ReportData.store.store_id, "storeReport");
		  console.log("menuInventoryStoretaxChangeLog");
	      }
	     }));