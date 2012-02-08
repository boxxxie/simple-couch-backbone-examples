
var menuAdministrationRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuAdministration/companyReport":"menuAdministrationCompany",
		  "menuAdministration/groupReport":"menuAdministrationGroup",
		  "menuAdministration/storeReport":"menuAdministrationStore"
	      },
	      _setup:function(startPage, id){
	          fetchRetailerUserCollection(id)(function(err,collection){
	              var view = this.view;
                 $("#main").html(ich.adminManagement_TMP(_.extend({startPage:startPage},autoBreadCrumb())));
                 view = new menuAdminUsersView({collection:collection});
                 /*
                 $("#main").html(ich.inventoryManagementHome_TMP(_.extend({startPage:startPage},autoBreadCrumb())));
                  var invItem = new InventoryDoc();
                  var id = topLevelEntity(ReportData).id;
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
          this._setup("groupReport",ReportData.group.group_id);
		  console.log("menuAdministrationGroup");
	      },
	      menuAdministrationStore:function() {
	      this._setup("storeReport",ReportData.store.store_id);
		  console.log("menuAdministrationStore");
	      }
	     }));
 
var menuAdminUsersView = Backbone.View.extend({
        initialize:function() {
            console.log(this.collection);
            (this.collection).on("change",this._renderTable,this);
            this._renderTable(this.collection);
        },
        _renderTable:function(collection) {
            $("#usersInfoTable").html(ich.adminUsersInfotable_TMP({list:(collection).toJSON()}));
            $("#addusers").button().click(function(){
                function getDefaultData(ReportData) {
                  if(ReportData.company) {
                      return {company_id:ReportData.company._id,
                              companyName:ReportData.company.companyName};
                  } else if(ReportData.group) {
                      return {company_id:ReportData.company_id,
                              companyName:ReportData.companyName,
                              group_id:ReportData.group.group_id,
                              groupName:ReportData.group.groupName};
                  } else if(ReportData.store) {
                      return {company_id:ReportData.company_id,
                              companyName:ReportData.companyName,
                              group_id:ReportData.group_id,
                              groupName:ReportData.groupName,
                              store_id:ReportData.store.store_id,
                              storeName:ReportData.store.storeName,
                              storeNumber:ReportData.store.number};
                  }
              };
                 quickInputUserInfoDialog(ich.inputUserInfo_TMP({}),{title:"Add New User"
                                                                    ,collection:collection
                                                                    ,defaultData:getDefaultData(ReportData)});
                 });
        },
        
});
