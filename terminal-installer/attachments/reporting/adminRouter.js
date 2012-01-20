var menuAdministrationRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuAdministration/companyReport":"menuAdministrationCompany",
		  "menuAdministration/groupReport":"menuAdministrationGroup",
		  "menuAdministration/storeReport":"menuAdministrationStore"
	      },
	      menuAdministrationCompany:function() {
		  console.log("menuAdministrationCompany");
	      },
	      menuAdministrationGroup:function() {
		  console.log("menuAdministrationGroup");
	      },
	      menuAdministrationStore:function() {
		  console.log("menuAdministrationStore");
	      }
	     }));


var menuAdministrationView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuAdministrationCompany',
		       'renderMenuAdministrationGroup',
		       'renderMenuAdministrationStore');
	     menuAdministrationRouter
		 .bind('route:menuAdministrationCompany', 
		       function(){
			   console.log("menuAdministrationView, route:menuAdministrationCompany");
			   view.renderMenuAdministrationCompany();
		       });
	     menuAdministrationRouter
		 .bind('route:menuAdministrationGroup', 
		       function(){
			   console.log("menuAdministrationView, route:menuAdministrationGroup");
			   view.renderMenuAdministrationGroup();
		       });
	     menuAdministrationRouter
		 .bind('route:menuAdministrationStore',
		       function(){
			   console.log("menuAdministrationView, route:menuAdministrationStore");
			   view.renderMenuAdministrationStore();
		       });
	 },
	 renderMenuAdministrationCompany: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"companyReport", 
	     //				       breadCrumb:breadCrumb(ReportData.company.companyName)});
	     //$(this.el).html(html);
	 },
	 renderMenuAdministrationGroup: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	     //var html = ich.menuInventory_TMP({startPage:"groupReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.group.groupName)});
	     //$(this.el).html(html);
	 },
	 renderMenuAdministrationStore: function() {
	     alert("Sorry, we're working on this menu.");
	     window.history.go(-1);
	   //  var html = ich.menuInventory_TMP({startPage:"storeReport", 
	 	//			       breadCrumb:breadCrumb(ReportData.companyName,
	 	//				     		     ReportData.groupName,
	 	//				     		     ReportData.store.storeName,
	 	//				     		     ReportData.store.number)});
	     //$(this.el).html(html);
	 }
	});