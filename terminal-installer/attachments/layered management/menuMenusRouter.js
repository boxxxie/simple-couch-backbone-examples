var menuModel;

var menuSetMenusRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	"menuSetMenus/companyReport":"menuSetMenusCompany"
	     	//,
	     	//"menuSetMenus/groupReport":"menuSetMenusGroup",
		  //"menuSetMenus/storeReport":"menuSetMenusStore",
	      },
	      menuSetMenusCompany:function() {
		  console.log("menuSetMenusCompany  ");
	      },
	      menuSetMenusGroup:function() {
		  console.log("menuSetMenusGroup  ");
	      },
	      menuSetMenusStore:function() {
		  console.log("menuSetMenusStore  ");
	      }
	     }));

var menuSetMenusView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuSetMenusCompany',
		       'renderMenuSetMenusGroup',
		       'renderMenuSetMenusStore');
	     menuSetMenusRouter
		 .bind('route:menuSetMenusCompany', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusCompany");
			   view.renderMenuSetMenusCompany();
		       });
		menuSetMenusRouter
		 .bind('route:menuSetMenusGroup', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusGroup");
			   view.renderMenuSetMenusGroup();
		       });
		menuSetMenusRouter
		 .bind('route:menuSetMenusStore', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusStore");
			   view.renderMenuSetMenusStore();
		       });
	 },
	 renderMenuSetMenusCompany: function() {
	 	var view = this;
	    fetch_company_menu(ReportData.company._id)(function(menu){
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
		     
		     var menu1title = "MENU1";//menuModel.menuButtonHeaders[0].description1?"MENU1":menuModel.menuButtonHeaders[0].description1;
		     var menu2title = "MENU2";//menuModel.menuButtonHeaders[1].description1?"MENU2":menuModel.menuButtonHeaders[1].description1;
		     var menu3title = "MENU3";//menuModel.menuButtonHeaders[2].description1?"MENU3":menuModel.menuButtonHeaders[2].description1;
		     var menu4title = "MENU4";//menuModel.menuButtonHeaders[3].description1?"MENU4":menuModel.menuButtonHeaders[3].description1;
		     
		     var htmlbottom = ich.menuSetMenus_Bottom_TMP({menu1title:menu1title,
		     											menu2title:menu2title,
		     											menu3title:menu3title,
		     											menu4title:menu4title});
		     $("menusetmenusbottom").html(htmlbottom);
		     
		     //var htmlright = ich.menuSetMenus_Right_TMP({menuSetMenusrighttitle:"Edit Menu Item"});
		     //$("menusetmenusright").html(htmlright);
			
		     console.log("rendered set menus");	
	    }); 
	     
	 },
	 renderMenuSetMenusGroup: function() {
	     var view = this;
	     var html = ich.menuSetMenus_TMP({startPage:"groupReport", 
	     						    breadCrumb:breadCrumb(ReportData.companyName, ReportData.group.groupName)});
	     $(view.el).html(html);
	     
	    
		
	     console.log("rendered set menus");
	 },
	 renderMenuSetMenusStore: function() {
	     var view = this;
	     var html = ich.menuSetMenus_TMP({startPage:"storeReport", 
	     						    breadCrumb:breadCrumb(ReportData.companyName, ReportData.groupName, ReportData.store.storeName)});
	     $(view.el).html(html);
	          
	 	
	     console.log("rendered set menus");
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
		
		var htmlright = ich.menuSetMenus_Right_TMP(_.extend({menuSetMenusrighttitle:"Edit Menu Item"},button));
		$("menusetmenusright").html(htmlright);
		
	} else {
	//renderEditHeader
		var menu_id=num;
	
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

    console.log(newButtonItemData.display.description);
    newButtonItemData.display.description = _(newButtonItemData.display.description).toArray();
    console.log(newButtonItemData.display.description);

    console.log("newButtonItemData");
    console.log(newButtonItemData);

    newButtonItemData.display.position = Number(newButtonItemData.display.position); 
    newButtonItemData.display.screen = Number(newButtonItemData.display.screen);
    newButtonItemData.foodItem.price = Number(newButtonItemData.foodItem.price);
    
    console.log("after change newButtonItemData");
    console.log(newButtonItemData);
    
    menuModel.set_button(newButtonItemData);    
    menuModel.save();
    
    console.log("menuModel, saved");
    renderMenuSetMenusScreen(newButtonItemData.display.screen);
};