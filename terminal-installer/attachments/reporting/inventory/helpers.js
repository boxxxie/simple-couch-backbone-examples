var inv_helpers = {renderChangesLog : function(view,id,startPageStr,mainTMP,tableTMP,fetcher){
		       var html = ich[mainTMP](_.extend({startPage:startPageStr},autoBreadCrumb()));
		       $(view.el).html(html);
		       fetcher(id)
		       (function(err,resp_raw){
			    var resp = _.map(resp_raw, function(aitem){
						 var item = _.clone(aitem);
		  				 item.date = dateFormatter(new Date(item.date));
		  				 item.price.selling_price = currency_format(item.price.selling_price);
						 item.locations = _.filter(item.locations,_.has_F('label'));
		  				 return item;
		  			     });
			    var html =  ich[tableTMP]({list:resp});
			    $(view.el).find("#changeLogTable").html(html);
			    //set the buttons to open a dialog list of the stores that apply to each price change
			    _.each(resp,function(item){
				       $("#"+item._id).button().click(
					   function(){
					       detailsDialog(ich.simpleList_TMP({items:item.locations}),
							     {title:"changes applied to these locations"});
					   });
				   });
			});
		   },
		   renderTaxChangesLog : function(view,id,startPageStr){
		       this.renderChangesLog(view,id,startPageStr,
					     "menuInventoryScanTaxLog_TMP",
					     "menuInventoryScanTaxLogtable_TMP",
					     inventoryTaxChangeLog);
		   },
		   renderPriceChangesLog : function(view,id,startPageStr){
		       this.renderChangesLog(view,id,startPageStr,
					     "menuInventoryScanPriceLog_TMP",
					     "menuInventoryScanPriceLogtable_TMP",
					     inventoryPriceChangeLog);
		   }
		  };