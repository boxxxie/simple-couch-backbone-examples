var menuInventoryscanTaxChangeRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportscanTaxChange":"menuInventoryScanTaxChange",
		  "menuInventory/groupReportscanTaxChange":"menuInventoryScanTaxChange",
		  "menuInventory/storeReportscanTaxChange":"menuInventoryScanTaxChange"
	      },
	      menuInventoryScanTaxChange:function() {
		  console.log("menuInventory scanTaxChange");
		  this.view = new menuInventoryscanTaxChangeView();
		  this.view.setElement("#main");
		  this.view.renderScanTaxChange();
	      }
	     }));

var menuInventoryscanTaxChangeView = 
    Backbone.View.extend(
	{	    
	    renderScanTaxChange : function(searchQueryString) {
		console.log("renderScanPriceChange");
		var view = this;
		
		if(_.isEmpty(searchQueryString)){
		    var searchQuery = undefined;
		}
		else{
		    var searchQuery = searchQueryString;
		}
		
		var html = 
		    ich.menuInventoryScanItemTaxChanges_TMP(
			_.extend({startPage:ReportData.startPage}, 
				 autoBreadCrumb()));
		
		$(view.el).html(html);

		var userLevel = topLevelEntity(ReportData);

		currentInventoryFor(userLevel.id)
		(function(err,inventory){
		     //todo: maybe i can make filterSearch return on undefined input
		     var filteredInv = (searchQuery)?_.filterSearch_SubStr(inventory,searchQuery):inventory;
		     var formattedInv = _.walk_pre(
			 filteredInv,
			 function(item){
			     if(item.selling_price){
				 return _.extend({},
						 item,
						 {selling_price:currency_format(Number(item.selling_price))});
			     }
			     return item;
			 });

		     var html =  ich.menuInventoryScanTaxtable_TMP({filter:searchQuery,list:formattedInv});
		     $(view.el).find("#taxChangeTable").html(html);
		     
		     //set up the enabled/disabled buttons
		     _.each(formattedInv, function(item){
				var tg = $("#"+item.upccode);
				tg.click(function(){
		  			     var row = $(this).parent().parent().find("input");
		  			     if((_.first(row)).disabled) {
		  				 $(this).html("Disable");
		  				 _.each(row,function(item){item.disabled=false;});
		  			     } else {
		  				 $(this).html("Enable");
		  				 _.each(row,function(item){item.disabled=true;});
		  			     }
		  			 });
			    });
		     

		     //set the search text box to filter the item list when 'enter' is clicked
		     $("#filterInv").keypress(
			 function(e){
			     var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
			     if (code == enterCode){
				 view.renderScanTaxChange($(this).val());}
			 });
		     $("#submitTaxChanges").button().click(
			 function(){
			     var currentDate = new Date();
			     var newInvList = 
				 _.chain(varFormGrabber($("#taxChangeTable")))
				 .map(function(item,strUPC){
					  var upc = strUPC.replace("upc-","");
					  var invItem = _.find(filteredInv,function(val,key){return upc==val.upccode;});
					  var invItemReturn = _.selectKeys(invItem,"apply_taxes","date","description","locid","upccode");
					  invItemReturn.apply_taxes = item.apply_taxes;
					  invItemReturn.date = currentDate;
					  return invItemReturn;
				      })
				 .filter(function(item){
					     return $("#"+item.upccode).html() == "Disable";
					 })
				 .value();
			     if(_.isEmpty(newInvList)){alert("there were no changes made");return;}
			     

			     //TODO: refactor this as it's the same in the price change view
			     //the store level doesn't need to have a dialog because there is only one place to save to.
			     if(userLevel.type == 'store'){
				 var locations_to_save_to = _.values(getParentsInfo(ReportData));
				 async.forEach(newInvList,
					       function(invItemObj,callback){
						   //invItemObj.date = currentDate;
						   inv_helpers.saveOneInvItem(invItemObj,locations_to_save_to)
						   (callback);
					       },
					       function(err){
						   alert("The selected items have been updated");
						   view.renderScanPriceChange(searchQuery);
					       });
			     }
			     else{
				 var stores = extractStores(ReportData);
				 var groups = extractGroups(ReportData);
				 var parents = _.values(getParentsInfo(ReportData));
				 var html = ich.menuInventoryApplyStoresQuickViewDialog_TMP({items:stores});
				 menuInventoryApplyStoresViewDialog(
				     html,
				     {title:"Apply changes to stores", 
				      stores:stores,
				      groups:groups,
				      parents:parents,
				      makeButtons:inv_helpers.saveNewInvItems(newInvList,parents,stores,groups)
				      (function(){
					   view.renderScanTaxChange(searchQuery);
				       })});
				 
			     }
			 });
		 });
	    }
	});