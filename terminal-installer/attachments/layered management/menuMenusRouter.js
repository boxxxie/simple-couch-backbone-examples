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
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuSetMenusCompany');
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
		  
		  renderMenuSetMenusScreen(1); // default menuscreen MENU1
		  //var htmlcenter = ich.menuSetMenus_Center_TMP(menuModel.menu_screen(1));
		  //$("menusetmenuscenter").html(htmlcenter);
		  
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
						      renderMenuSetMenusScreen(item.menu_id);
						   });;
		  });
		  
		  //var htmlright = ich.menuSetMenus_Right_TMP({menuSetMenusrighttitle:"Edit Menu Item"});
		  //$("menusetmenusright").html(htmlright);
		  
		  console.log("rendered set menus");	
	      }); 
	     
	 }
	});

/******************************************** helper functions ************************************/

function renderMenuSetMenusScreen(numMenu) {
    console.log("screen num : " + numMenu);
    var htmlcenter = ich.menuSetMenus_Center_TMP(menuModel.menu_screen(numMenu));
    $("menusetmenuscenter").html(htmlcenter);
    console.log("menuscreen rendered");
};

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
    renderMenuSetMenusScreen(newButtonItemData.display.screen);
    closeEditMenu();
};

function clearEditHeader() {
	
}

function closeEditHeader() {
	 $("menusetmenusright").html({});
}

function saveEditHeader() {
	
}

//menuModel.bind("change:menuButtonHeaders",function(){console.log('afdklsjsakjhaskdjhsadlkjhsladk')})
//menuModel.bind("change:menuButtons",function(){console.log('afdklsjsakjhaskdjhsadlkjhsladk')})