var menuModel;

var menuSetMenusRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuSetMenus/companyReport":"menuSetMenusCompany"
	      },
	      menuSetMenusCompany:function() {
		  console.log("menuSetMenusCompany  ");
	      }
	     }));

var menuSetMenusView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuSetMenusCompany',
		       'renderMenuHeaderPartial',
		       'renderMenuScreenPartial');
	     menuSetMenusRouter
		 .bind('route:menuSetMenusCompany', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusCompany");
			   view.renderMenuSetMenusCompany();
		       });
	 },
	 renderMenuSetMenusCompany: function() {
	     var view = this;
	     fetch_company_menu(ReportData.company._id)
	     (function(menu){
	    	  console.log(menu);
	    	  menuModel = menu;
	    	  
	    	  var html = ich.menuSetMenus_TMP({startPage:"companyReport", 
	     					   breadCrumb:breadCrumb(ReportData.company.companyName)});
		  $(view.el).html(html);
		  
		  
		  var htmlleft = ich.menuSetMenus_Left_TMP({});
		  $("menusetmenusleft").html(htmlleft);
		  $("#menumodifiersbutton").button()
					    .click(function(){
						      view.renderMenuScreenPartial(0);
						      $("menusetmenusright").html({});
						   });
		 $("#menueditheader1").button()
					    .click(function(){
						      renderEditHeader(1);
						   });
		$("#menueditheader2").button()
					    .click(function(){
						      renderEditHeader(2);
						   });
		$("#menueditheader3").button()
					    .click(function(){
						      renderEditHeader(3);
						   });
		$("#menueditheader4").button()
					    .click(function(){
						      renderEditHeader(4);
						   });						   						   
						   
		  
		  view.renderMenuScreenPartial(1);
		  view.renderMenuHeaderPartial();
		  
		  menuModel.bind("change:menuButtonHeaders",view.renderMenuHeaderPartial);
		  menuModel.bind("change:menuButtons", view.renderMenuScreenPartial)
		  
		  console.log("rendered set menus");	
	      }); 
	     
	 },
	 renderMenuHeaderPartial: function() {
	 	var view = this;
	 	var menuModelHeaders = menuModel.get('menuButtonHeaders');
		  
		menuModelHeaders = _.map(menuModelHeaders, function(item) {
				if(_.isEmpty(item.description1) 
			  		&& _.isEmpty(item.description2)
			  		&& _.isEmpty(item.description3)) {
				  	item.description2="MENU" + item.menu_id;
				  }
				  return item;
		  });
		  
		  
		  var htmlbottom = ich.menuSetMenus_Bottom_TMP({menuButtonHeaders:menuModelHeaders});
		  $("menusetmenusbottom").html(htmlbottom);
		  
		  _.each(menuModelHeaders, function(item){
		  	$("#menubuttonheader"+item.menu_id).button()
					    .click(function(){
						      view.renderMenuScreenPartial(item.menu_id);
						      $("menusetmenusright").html({});
						   });;
		  });
	 },
	 renderMenuScreenPartial: function(model,menus,item) {
	 	if(_.isNumber(model)){
	 	    console.log("screen num : " + model);
	 	    var menuscreentitle;
	 	    
	 	    if(model==0) {
	 	    	menuscreentitle = "MODIFIERS";
	 	    } else {
	 	    	var header = menuModel.get_header(model);
	 	    	menuscreentitle = "".concat(header.description1)
	 	    						.concat(header.description2)
	 	    						.concat(header.description3);
	 	    }
	 	    
		    var htmlcenter = ich.menuSetMenus_Center_TMP(_.extend({menuscreentitle:menuscreentitle},menuModel.menu_screen(model)));
		    $("menusetmenuscenter").html(htmlcenter);
		    console.log("menuscreen rendered");
		} else if(!_.isEmpty(item)) {
			console.log("screen num : " + item.display.screen);
			
			var menuscreentitle;
			var header = menuModel.get_header(item.display.screen);
	 	    	menuscreentitle = "".concat(header.description1)
	 	    						.concat(header.description2)
	 	    						.concat(header.description3);
	 	    						
		    var htmlcenter = ich.menuSetMenus_Center_TMP(_.extend({menuscreentitle:menuscreentitle},menuModel.menu_screen(item.display.screen)));
		    $("menusetmenuscenter").html(htmlcenter);
		    console.log("menuscreen rendered");
		}
	 }
	});

/******************************************** helper functions ************************************/

function renderEditPage(num,position) {
    if(_.isNumber(position)) {
	//renderEditMenuItem
	var button = menuModel.get_button(num,position);
	
	var htmlright = ich.menuSetMenus_Right_TMP(button);
	$("menusetmenusright").html(htmlright);
	
    } else {
	//renderEditHeader
	var menu_id=num;
	var header  = menuModel.get_header(menu_id);
	
	var htmlright = ich.menuSetMenuHeader_TMP(header);
	$("menusetmenusright").html(htmlright);
	
    }
};

function renderEditHeader(numHeader) {
    renderEditPage(numHeader);
};

function renderEditMenuItem(numScreen,position) {
    renderEditPage(numScreen,position);
};

function clearEditMenu() {
    
};

function closeEditMenu() {
    $("menusetmenusright").html({});
};

function saveEditMenu() {
    var editDialog = $("#editMenuButton");

    var newButtonItemData = varFormGrabber(editDialog);

    console.log("newButtonItemData.display.description");
    console.log(newButtonItemData.display.description);
    newButtonItemData.display.description = _(newButtonItemData.display.description).chain().toArray().map(function(s){return _.str.trim(s);}).value();
    console.log("newButtonItemData.display.description");
    console.log(newButtonItemData.display.description);

    console.log("newButtonItemData");
    console.log(newButtonItemData);
    
    menuModel.set_button(newButtonItemData);    
    menuModel.save();
    
    console.log("menuModel, saved");
//    renderMenuSetMenusScreen(newButtonItemData.display.screen);
    closeEditMenu();
};

function clearEditHeader() {
	
}

function closeEditHeader() {
	 $("menusetmenusright").html({});
}

function saveEditHeader() {
	var editDialog = $("#editMenuHeaderButton");

    var newHeaderItemData = varFormGrabber(editDialog);

    console.log("newHeaderItemData");
    console.log(newHeaderItemData);
    
    menuModel.set_header(newHeaderItemData);    
    menuModel.save();
    closeEditMenu();
}

//menuModel.bind("change:menuButtonHeaders",function(){console.log('afdklsjsakjhaskdjhsadlkjhsladk')})
//menuModel.bind("change:menuButtons",function(){console.log('afdklsjsakjhaskdjhsadlkjhsladk')})