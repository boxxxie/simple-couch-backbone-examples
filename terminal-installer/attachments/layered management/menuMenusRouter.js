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
	    //fetch_company_menu(ReportData.company._id)(function(for_TMP){
	    //	console.log(for_TMP);
	    	var html = ich.menuSetMenus_TMP({startPage:"companyReport", 
	     						    breadCrumb:breadCrumb(ReportData.company.companyName)});
		     $(this.el).html(html);
		     
		     var htmlleft = ich.menuSetMenus_Left_TMP({});
		     $("menusetmenusleft").html(htmlleft);
	
			var htmlcenter = ich.menuSetMenus_Center_TMP({});
		     $("menusetmenuscenter").html(htmlcenter);
		     
		     var htmlbottom = ich.menuSetMenus_Bottom_TMP({menu1title:"MENU1",
		     											menu2title:"MENU2",
		     											menu3title:"MENU3",
		     											menu4title:"MENU4"});
		     $("menusetmenusbottom").html(htmlbottom);
		     
		     var htmlright = ich.menuSetMenus_Right_TMP({menuSetMenusrighttitle:"Edit Menu Item"});
		     $("menusetmenusright").html(htmlright);
			
		     console.log("rendered set menus");	
	    //}); 
	     
	 },
	 renderMenuSetMenusGroup: function() {
	     
	     var html = ich.menuSetMenus_TMP({startPage:"groupReport", 
	     						    breadCrumb:breadCrumb(ReportData.companyName, ReportData.group.groupName)});
	     $(this.el).html(html);
	     
	    
		
	     console.log("rendered set menus");
	 },
	 renderMenuSetMenusStore: function() {
	     
	     var html = ich.menuSetMenus_TMP({startPage:"storeReport", 
	     						    breadCrumb:breadCrumb(ReportData.companyName, ReportData.groupName, ReportData.store.storeName)});
	     $(this.el).html(html);
	          
	 	
	     console.log("rendered set menus");
	 }
	});

/******************************************** helper functions ************************************/
/*
 function rendermenuReportsCashOutsTable() {
    console.log("renderCashOutsTable");
    
    	
	console.log(ids);
	
	cashoutReportFetcher(ids,startDate,endDateForQuery)
	(function(data_TMP){
	     data_TMP = _.map(data_TMP, function(item){
				var dialogtitle=getDialogTitle(ReportData,item.name);
				return _.extend(item, {dialogtitle:dialogtitle});
			    });

	     var html = ich.menuReportsCashOutsTabel_TMP({items:data_TMP});
	     $("cashoutstable").html(html);
	     
	     _.each(data_TMP, function(item){	
			var btn = $('#'+item.id)
			    .button()
			    .click(function(){
				       var data = item.cashout;
				       var html = ich.menuReportsCashoutQuickViewDialog_TMP(data);
				       quickmenuReportsCashoutViewDialog(html, {title:item.dialogtitle});
				   });
		    });		
	 });
};
*/
function renderMenuSetMenusScreen(numScreen) {
	
};

function renderMenusSetMenusHeader(numHeader) {
	
};


