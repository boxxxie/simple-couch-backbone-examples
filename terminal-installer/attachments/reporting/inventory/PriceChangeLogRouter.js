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
	 _renderInventoryPriceChangesLog : function(id,startPageStr){
	     var view = this;
	     var html = ich.menuInventoryScanPriceLog_TMP(_.extend({startPage:startPageStr},autoBreadCrumb()));
	     $(view.el).html(html);
	     inventoryPriceChangeLog(id)
	     (function(err,resp){
		  console.log(resp);
		  resp = _.map(resp, function(aitem){
				   var item = _.clone(aitem);
		  		   item.date = dateFormatter(new Date(item.date));
		  		   item.price.selling_price = currency_format(item.price.selling_price);
				   item.locations = _.filter(item.locations,_.has_F('label'));
		  		   return item;
		  	       });
		  var html =  ich.menuInventoryScanPriceLogtable_TMP({list:resp});
		  $(view.el).find("#scanPriceChangeLogTable").html(html);
	      });
	 },
	 renderMenuInventoryCompanypriceChangeLog: function() {
	     this._renderInventoryPriceChangesLog(ReportData.company._id,"companyReport");
	 },
	 renderMenuInventoryGrouppriceChangeLog: function() {
	     this._renderInventoryPriceChangesLog(ReportData.group.group_id,"groupReport");
	 },
	 renderMenuInventoryStorepriceChangeLog: function() {
	     this._renderInventoryPriceChangesLog(ReportData.store.store_id,"storeReport");
	 }
	 
	});
