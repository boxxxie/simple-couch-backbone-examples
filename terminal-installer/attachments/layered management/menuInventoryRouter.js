var menuModelforInventory;

var menuInventoryRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuInventory/companyReportInventory":"menuInventoryCompanyInventory",
		  "menuInventory/companyReportmenuPriceChange":"menuInventoryCompanymenuPriceChange",
		  "menuInventory/groupReportInventory":"menuInventoryGroupInventory",
		  "menuInventory/storeReportInventory":"menuInventoryStoreInventory"
	      },
	      menuInventoryCompanyInventory:function() {
		  console.log("menuInventoryCompanyInventory");
	      },
	      menuInventoryGroupInventory:function() {
		  console.log("menuInventoryGroupInventory");
	      },
	      menuInventoryStoreInventory:function() {
		  console.log("menuInventoryStoreInventory");
	      },
	      menuInventoryCompanymenuPriceChange:function() {
	      	  console.log("menuInventoryCompanymenuPriceChange");
	      }
	     }));


var menuInventoryView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuInventoryCompanyInventory',
		       'renderMenuInventoryGroupInventory',
		       'renderMenuInventoryStoreInventory',
		       'renderMenuInventoryCompanymenuPriceChange');
	     menuInventoryRouter
		 .bind('route:menuInventoryCompanyInventory', 
		       function(){
			   console.log("menuInventoryView, route:menuReportsCompanyInventory");
			   view.renderMenuInventoryCompanyInventory();
		       });
	     menuInventoryRouter
		 .bind('route:menuInventoryGroupInventory', 
		       function(){
			   console.log("menuInventoryView, route:menuReportsGroupInventory");
			   view.renderMenuInventoryGroupInventory();
		       });
	     menuInventoryRouter
		 .bind('route:menuInventoryStoreInventory',
		       function(){
			   console.log("menuInventoryView, route:menuReportsStoreInventory");
			   view.renderMenuInventoryStoreInventory();
		       });
	     menuInventoryRouter
		 .bind('route:menuInventoryCompanymenuPriceChange',
		       function(){
			   console.log("menuInventoryView, route:menuInventoryCompanymenuPriceChange");
			   view.renderMenuInventoryCompanymenuPriceChange();
		       });
	 },
	 renderMenuInventoryCompanyInventory: function() {
	     
	     var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     				       breadCrumb:breadCrumb(ReportData.company.companyName),
	     				       showMenuPriceChange:true});
	     $(this.el).html(html);
	 },
	 renderMenuInventoryGroupInventory: function() {
	     
	     var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 				       breadCrumb:breadCrumb(ReportData.companyName,
	 					     		     ReportData.group.groupName)});
	     $(this.el).html(html);
	 },
	 renderMenuInventoryStoreInventory: function() {
	     
	     var html = ich.menuInventory_TMP({startPage:"storeReport", 
	 				       breadCrumb:breadCrumb(ReportData.companyName,
	 					     		     ReportData.groupName,
	 					     		     ReportData.store.storeName)});
	     $(this.el).html(html);
	 },
	 renderMenuInventoryCompanymenuPriceChange: function() {
	     var view = this;
	     fetch_company_menu(ReportData.company._id)
	     (function(err,menu){
	     	  if(!err) {
	    	      console.log(menu);
	    	      menuModelforInventory = menu;
	    	      
	    	      var html = ich.menuInventorymenuPriceChange_TMP({startPage:"companyReport", 
	     							       breadCrumb:breadCrumb(ReportData.company.companyName)});
		      $(view.el).html(html);
		      
		      
		      var htmlleft = ich.menuSetMenus_Left_TMP({});
		      $("#menusetmenusleft").html(htmlleft);
		      
		      $("#menumodifiersbutton").button()
			  .click(function(){
				     view.renderMenuScreenPartial(0);
				     $("#menusetmenusright").html({});
				 });
		      
		      view.renderMenuScreenPartial(1);
		      view.renderMenuHeaderPartial();
		      
		      menuModelforInventory.bind("change:menuButtonHeaders",view.renderMenuHeaderPartial);
		      menuModelforInventory.bind("change:menuButtons", view.renderMenuScreenPartial);
		      
		      console.log("rendered menus for inventory");
		  } else {
		      alert("Please, Create Menu first.");
		      window.history.go(-1);
		  }
	      });
	 },
	 renderMenuHeaderPartial: function() {
	     var view = this;
	     var menuModelHeaders = menuModelforInventory.get('menuButtonHeaders');
	     
	     menuModelHeaders = _.map(menuModelHeaders, function(item) {
					  if(_.isEmpty(item.description1) 
			  		     && _.isEmpty(item.description2)
			  		     && _.isEmpty(item.description3)) {
				  	      item.description1="MENU" + item.menu_id;
					  }
					  return item;
				      });
	     
	     
	     var htmlbottom = ich.menuSetMenus_Bottom_TMP({menuButtonHeaders:menuModelHeaders});
	     $("#menusetmenusbottom").html(htmlbottom);
	     
	     _.each(menuModelHeaders, function(item){
		  	$("#menubuttonheader"+item.menu_id).button()
			    .click(function(){
				       view.renderMenuScreenPartial(item.menu_id);
				       $("#menusetmenusright").html({});
				   });
		    });
	 },
	 renderMenuScreenPartial: function(model,menus,item) {
	     if(_.isNumber(model)){
	 	 console.log("screen num : " + model);
	 	 var menuscreentitle;
	 	 
	 	 if(model==0) {
	 	     menuscreentitle = "MODIFIERS";
	 	 } else {
	 	     var header = menuModelforInventory.get_header(model);
	 	     menuscreentitle = "".concat(header.description1)
	 	    	 .concat(header.description2)
	 	    	 .concat(header.description3);
	 	 }
	 	 var menuScreen = menuModelforInventory.menu_screen(model);
		 var htmlcenter = ich.menuSetMenus_Center_TMP(_.extend({menuscreentitle:menuscreentitle},menuScreen));
		 $("#menusetmenuscenter").html(htmlcenter);

		 _.each(menuScreen.menu_screen, function(item){
		 	    _.each(item.row, function(rowitem) {
		 		       var btn = $('#'+rowitem.display.screen+"\\:"+rowitem.display.position)
		 			   .click(function(){
			    			      renderEditMenuPrice(rowitem.display.screen, rowitem.display.position);
				   		  });	
		 		   });	
			});
		 
		 console.log("menuscreen rendered");
	     } else if(!_.isEmpty(item)) {
		 console.log("screen num : " + item.display.screen);
		 
		 var menuscreentitle;
		 if(item.display.screen==0) {
	 	     menuscreentitle = "MODIFIERS";
	 	 } else {
	 	     var header = menuModelforInventory.get_header(item.display.screen);
	 	     menuscreentitle = "".concat(header.description1)
	 	    	 .concat(header.description2)
	 	    	 .concat(header.description3);
	 	 }

		 var menuScreen = menuModelforInventory.menu_screen(item.display.screen);	 	 
		 var htmlcenter = ich.menuSetMenus_Center_TMP(_.extend({menuscreentitle:menuscreentitle},menuScreen));
		 $("#menusetmenuscenter").html(htmlcenter);
		 
		 _.each(menuScreen.menu_screen, function(item){
		 	    _.each(item.row, function(rowitem) {
		 		       var btn = $('#'+rowitem.display.screen+"\\:"+rowitem.display.position)
		 			   .click(function(){
			    			      renderEditMenuPrice(rowitem.display.screen, rowitem.display.position);
				   		  });	
		 		   });	
			});
		 console.log("menuscreen rendered");
	     }
	 }
	});

/*********************************************** helper functions *********************************************/
function renderEditMenuPrice(num,position) {
    if(_.isNumber(position)) {
	var button = menuModelforInventory.get_button(num,position);
	
	var htmlright = ich.menuSetMenus_Right_TMP(button);
	$("#menusetmenusright").html(htmlright);

	$('input:checkbox').parent().hide();
	$('#displayColor').parent().parent().hide();
	
	var txtLine1 = $("#editmenudescription0");
	var txtLine2 = $("#editmenudescription1");
	var txtLine3 = $("#editmenudescription2");
	
	txtLine1.attr('disabled',true);
	txtLine2.attr('disabled',true);
	txtLine3.attr('disabled',true);
	
	var btn = $("#btnMenuSave")
	    .click(function(){
		       console.log("menuInventory Price Change");
		       save_button_into_db();
		   });
	
    } else {
	//renderEditHeader ???
    }
};

function save_button_into_db() {
    var editDialog = $("#editMenuButton");

    var newButtonItemData = varFormGrabber(editDialog);

    function extractStores(obj){
	var stores = [];
	pre_walk(obj,function(o){
		     if(o.stores){
			 stores = stores.concat(o.stores);
		     }
		     return o;
		 });
	return stores.map(function(store){
			      return {type:'store',id:store.store_id,name:store.storeName};
			  });
    };
    function rebuildMenus(company_id,store_ids){
	var db = cdb.db("menu_buttons");
	var view = cdb.view("menubuttons","id");
	var keyQ = _async.generalKeyQuery(view,db);
	
	async.parallel({company_menu_buttons:keyQ(company_id),
			stores_menu_buttons:function(callback){async.parallel(_.map(store_ids,function(id){return keyQ(id);}),callback);}},
		       function(err,responses){
			   //for each store make a menu by concating the menu from company with the menu from store and then fetch the stores menu from the menu_corp db and overwrite the menuButtons and then save.
			   
			   console.log(responses);
		       });
				     
}
    //concat all of the .rows together from couchdb views over that return buttons
    function constructMenu_keyValue(couchDB_responses){
	/*returns (can extend with transformed empty menu 
	 Object:
	 0:0: Object
	 1:0: Object
	 */
	return _(couchDB_responses).chain()
	    .map(function(response){
		     return {date: response.doc.date, menuButton: response.doc.menuButton};
		 })
	    .groupBy(function(item){
			 return item.menuButton.display.screen +":"+
			     item.menuButton.display.position;
		     })
	    .map(function(buttonChangeLog,location){
		     var mostRecentMenuButton = 
			 _(buttonChangeLog).chain()
			 .sortBy(function(item){return item.date;})
			 .last()
			 .value();
		     return [location,mostRecentMenuButton.menuButton];
		 })
	    .toObject()
	    .value();
    }
    
    var isAllStore = confirm("Apply Stores : All?\n*Cancel:Select Stores");

    if(isAllStore) {
    	var button = new MenuButton({menuButton:newButtonItemData, date: (new Date()).toString(), id:ReportData.company._id});
	button.save();
	rebuildMenus(ReportData.company._id,_.pluck(extractStores(ReportData),'id'));
    } else {
    	var stores = extractStores(ReportData);
    	menuInventoyApplyStoresView(stores, newButtonItemData);
    }


};
