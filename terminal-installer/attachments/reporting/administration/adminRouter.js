
var menuAdministrationRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuAdministration/companyReport":"menuAdministrationCompany",
		  "menuAdministration/groupReport":"menuAdministrationGroup",
		  "menuAdministration/storeReport":"menuAdministrationStore"
	      },
	      _setup:function(startPage, id){
	          fetchRetailerUserCollection(id)(function(err,collection){
                 console.log(collection);
                 $("#main").html(ich.adminManagement_TMP(_.extend({startPage:startPage},autoBreadCrumb())));
                 this.view = new menuAdminUsersView({collection:collection});
                 
                 /*
                 $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:startPage},autoBreadCrumb())));
                  var invItem = new InventoryDoc();
                  var id = getTopLevelId(ReportData);
                  invItem.cid = id;
                  this.views = [ 
                      new upc_code_input_view({model:invItem}).setElement("#upc"),
                      new inv_display_view({model:invItem}).setElement("#item_display")
                  ];
                  */
             });
          
          },
	      menuAdministrationCompany:function() {
          this._setup("companyReport",ReportData.company._id);
		  console.log("menuAdministrationCompany");
	      },
	      menuAdministrationGroup:function() {
          this._setup("companyReport",ReportData.group.group_id);
		  console.log("menuAdministrationGroup");
	      },
	      menuAdministrationStore:function() {
	      this._setup("companyReport",ReportData.store.store_id);
		  console.log("menuAdministrationStore");
	      }
	     }));

var menuAdminUsersView = Backbone.View.extend({
        initialize:function() {
            alert("aaa");
        }
});

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