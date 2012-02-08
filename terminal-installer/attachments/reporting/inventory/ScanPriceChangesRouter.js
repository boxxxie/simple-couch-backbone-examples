var menuInventoryscanPriceChangeRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportscanPriceChange":"menuInventoryScanPriceChange",
		  "menuInventory/groupReportscanPriceChange":"menuInventoryScanPriceChange",
		  "menuInventory/storeReportscanPriceChange":"menuInventoryScanPriceChange"
	      },
	      menuInventoryScanPriceChange:function() {
		  console.log("menuInventory scanPriceChange");
		  this.view = new menuInventoryscanPriceChangeView();
		  this.view.setElement("#main");
		  this.view.renderScanPriceChange();
	      }
	     }));


var menuInventoryscanPriceChangeView = 
    Backbone.View.extend(
	{
	    renderScanPriceChange: function(searchQueryString) {
		console.log("renderScanPriceChange");
		var view = this;
		
		if(_.isEmpty(searchQueryString)){
		    var searchQuery = undefined;
		}
		else{
		    var searchQuery = searchQueryString;
		}
		
		var html = 
		    ich.menuInventoryScanItemPriceChanges_TMP(
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

		     var html =  ich.menuInventoryScanPricetable_TMP({filter:searchQuery,list:formattedInv});
		     $(view.el).find("#priceChangeTable").html(html);

		     //set the search text box to filter the item list when 'enter' is clicked
		     $("#filterInv").keypress(
			 function(e){
			     var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
			     if (code == enterCode){
				 view.renderScanPriceChange($(this).val());}
			 });

		     $("#submitPriceChanges").button().click(
			 function(){
			     var currentDate = new Date();
			     var newInvList = 
				 _.chain(varFormGrabber($("#priceChangeTable")))
				 .removeEmptyKeys()	  
				 .map(function(price,strUPC){
					  var upc = strUPC.replace("upc-","");//need to do this due to a limitation in forms.js
					  var invItem = _.find(filteredInv,function(item){return upc==item.upccode;});
					  var invItemReturn = _.selectKeys(invItem,"price","date","description","locid","upccode");
					  invItemReturn.price.selling_price = price;
					  return invItemReturn;
				      })
				 .value();
			     if(_.isEmpty(newInvList)){alert("there were no changes made");return;}
			     
			     //the store level doesn't need to have a dialog because there is only one place to save to.
			     if(userLevel.type == 'store'){
				 var locations_to_save_to = _.values(getParentsInfo(ReportData));
				 async.forEach(newInvList,
					       function(invItemObj,callback){
						   invItemObj.date = currentDate;
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
					   view.renderScanPriceChange(searchQuery);
				       })});
				 
			     }
			 });
		 });
	    }
	});