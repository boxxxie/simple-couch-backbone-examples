var idleInventoryRouter = 
    new (Backbone.Router.extend({
				    routes: {
					"menuInventory/IdleInventory":"idleInventory"
				    },
				    idleInventory:function() {
					this._setup();
				    },
				    _setup:function() {
					var html = ich.idleInventoryReports_TMP(_.extend({startPage:ReportData.startPage},autoBreadCrumb()));
					$("#main").html(html);
					
					var dropdownGroup = $("#groupsdown");
					var dropdownStore = $("#storesdown");
					
					switch(_.indexOf(["companyReport","groupReport","storeReport"],ReportData.startPage)) {
					case 0: //: company
					    $('option', dropdownGroup).remove();
					    _.each(ReportData.company.hierarchy.groups, function(group) {
						       dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
						   });
					    
					    var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
														return group.stores; 
													    }).flatten().value();
					    
					    $('option', dropdownStore).remove();
					    _.each(stores, function(store) {
						       dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
									    + "(" + store.number + ")" + '</option>');
						   });
					    break;
					case 1: //: group
					    $('option', dropdownGroup).remove();
					    dropdownGroup.append('<option value ='+ReportData.group.group_id+'>'+ReportData.group.groupName+ '</option>');
					    dropdownGroup.attr('disabled','disabled');
					    
					    $('option', dropdownStore).remove();
					    _.each(ReportData.group.stores, function(store) {
						       dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName 
									    + "(" + store.number + ")" + '</option>');
						   });
					    break;
					case 2: //: store
					    $('option', dropdownGroup).remove();
					    $('option', dropdownStore).remove();
					    
					    dropdownGroup.append('<option value='+ReportData.group_id+'>'+ReportData.groupName+ '</option>');
					    dropdownGroup.attr('disabled','disabled');
					    dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName
								 + "(" + ReportData.store.number + ")" + '</option>');
					    dropdownStore.attr('disabled','disabled');
					    break;
					}
					
					$("#groupsdown")
                       .change(function(){
                           updateStoreDropdown(true); // don't show "ALL"
                       });
					
					// TODO : view
					var view = this.view;
					view = new idleInventoryView();  
				    }
				}));

var idleInventoryView =
    Backbone.View.extend({
			     initialize:function() {
				 var view = this;
				 var btn = $("#generalgobtn");
				 btn.button()
				     .click(function() {
						var group = $("#groupsdown :selected");
						var store = $("#storesdown :selected");
						var days = $("#txtInputday").val();
						
						idleInventoryFetcher_F(store.val(),days)
						(function(err,resp){
						     //console.log(resp);
						     $("#idleinventorymain").html(ich.inventoryStockMain_TMP({}));
						     $("#submitAddStock").hide();
						     
						     view.idleInvList = resp;
						     view._initUPCbox();
						     view._renderTable(resp);
						 });
					    });
			     },
			     _initUPCbox:function() {
				 var view = this;
				 $("#upc").keypress(
				     function(e){
					 var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
					 if (code == enterCode){
					     view._searchInv($(this).val());}
				     });
			     },
			     _searchInv:function(searchString){
				 var view = this;
				 var idleInvList = view.idleInvList;
				 
				 if(_.isEmpty(searchString)){
				     var searchQuery = undefined;
				 }
				 else{
				     var searchQuery = searchString;
				 }
				 
				 if(!searchQuery) {
				     view._renderTable(idleInvList);
				 } else {
				     //var listJSON = invCollection.getJSONbyUPC(_.str.trim(searchQuery));
				     var foundList = _.filter(idleInvList,function(item){ return item.inventory.upccode == _.str.trim(searchQuery);});
				     
				     if(_.size(foundList)>0) {
					 view._renderTable(foundList);
				     } else {
					 view._renderTable({});
				     }
				 } 
			     },
			     _renderTable:function(list) {
				 var view = this;
				 var idleInvList = view.idleInvList;
				 
				 var for_TMP = 
				     _.chain(_.combine({},list))
				     .map(function(item_constant){
					      var item = _.combine({},item_constant);
					      item.inventory.price.selling_price = currency_format(Number(item.inventory.price.selling_price));
					      return item;
					  })
				     .sortBy(function(item){ return item.inventory.upccode;})
				     .value();
				 
				 var html = ich.idleInventorytable_TMP({items:for_TMP});
				 $("#inventorystocktable").html(html);
			     }
			 });


// http://localhost:5984/transactions/_design/reporting/_view/inventory_sold?limit=11&descending=true&group=true&group_level=4&endkey=[%226542320d1d681daf126107d5c624307c%22]&startkey=[%226542320d1d681daf126107d5c624307c%22,2012,1,5]
// http://localhost:5984/transactions/_design/reporting/_view/inventory_sold?limit=11&descending=true&group=true&group_level=1&endkey=[%226542320d1d681daf126107d5c624307c%22]&startkey=[%226542320d1d681daf126107d5c624307c%22,2012,1,6]