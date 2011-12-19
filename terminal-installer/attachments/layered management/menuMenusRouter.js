var menuSetMenusRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	"menuSetMenus/companyReport":"menuSetMenusCompany",
	     	"menuSetMenus/groupReport":"menuSetMenusGroup",
		  "menuSetMenus/storeReport":"menuSetMenusStore",
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
	    	
	    	var html = ich.menuSetMenus_TMP({startPage:"companyReport", 
	     						    breadCrumb:breadCrumb(ReportData.company.companyName)});
		     $(view.el).html(html);
		     
		     var htmlleft = ich.menuSetMenus_Left_TMP({});
		     $("menusetmenusleft").html(htmlleft);
	
			var htmlcenter = ich.menuSetMenus_Center_TMP(menu.menu_screen(1));
		     $("menusetmenuscenter").html(htmlcenter);
		     
		     var htmlbottom = ich.menuSetMenus_Bottom_TMP({menu1title:"MENU1",
		     											menu2title:"MENU2",
		     											menu3title:"MENU3",
		     											menu4title:"MENU4"});
		     $("menusetmenusbottom").html(htmlbottom);
		     
		     var htmlright = ich.menuSetMenus_Right_TMP({menuSetMenusrighttitle:"Edit Menu Item"});
		     $("menusetmenusright").html(htmlright);
			
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
	
};

function renderEditPage(isMenu,num,position) {
	
};

function renderEditHeader(numHeader) {
	
};

function renderEditMenuItem(numScreen,position) {
	
};


