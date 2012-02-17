function addUser(originData, userCollection) {
     return { 
         success : function(userInfo) {
             var userData = {creationdate:new Date()};
             _.extend(userData,originData,userInfo);
             var userDoc = new RetailerUserDoc();
             userDoc.save(userData,{success:function(resp){
                                        userCollection.add(resp);
                                        userCollection.trigger("change",userCollection);
                                        alert("user added successfully");
                                    }, 
                                    error:function(){
                                        alert("Error; please, try again");
                                    }});
         }
     }; 
}

function editUser(userModel, userCollection) {
     return { 
         success : function(userInfo) {
            userModel.save(userInfo, {
                success: function() {
                    userCollection.trigger("change",userCollection);
                    alert("user edited successfully");
                },
                error: function() {
                    alert("Error; please, try again");
                },
                silent:true
            });
         }
     }; 
}


var adminRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuAdministration/companyReport":"menuAdministrationCompany",
		  "menuAdministration/groupReport":"menuAdministrationGroup",
		  "menuAdministration/storeReport":"menuAdministrationStore"
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
	      },
	      _setup:function(startPage, id){
		  fetchRetailerUserCollection_Report(id, ReportData.currentUser._id)(function(err,collection){
						      var view = this.view;
						      var html = ich.adminManagement_TMP(_.extend({startPage:startPage},autoBreadCrumb()));
						      $("#main").html(html);
						      view = new menuAdminUsersView({collection:collection});
						  });
              }
	     }));

var menuAdminUsersView = 
    Backbone.View.extend({
			     initialize:function() {
				 console.log(this.collection);
				 (this.collection).on("change",this._renderTable,this);
				 this._renderTable(this.collection);
			     },
			     _renderTable:function(collection) {
                 var view = this;
                 var colJSON = collection.toJSON();
                 
				 var list = _.sortBy(colJSON, function(item){ return (_.isNaN((new Date(item.creationdate)).getTime()))?getDateObjFromStr(item.creationdate):new Date(item.creationdate);})
				                .reverse();
				 
				 $("#usersInfoTable").html(ich.adminUsersInfotable_TMP({list:list}));
				 _.each(list,function(item){
					    $("#edit-"+item._id).button().click(function(){
										    //alert("edit");
										    var userModel = collection.get(item._id);
										    var userJSON = userModel.toJSON();
										    var data_TMP = {ismaster:(userJSON.role=="MASTERADMIN"?true:false)
										                   ,isactive:(userJSON.status=="ACTIVE"?true:false)};
                                            _.extend(data_TMP,userJSON);
										    
										    quickModifyUserInfoDialog(ich.inputUserInfo_TMP(data_TMP)
                                                                       ,_.extend(editUser(userModel,collection)
                                                                               ,{collection:collection
                                                                                 ,currentUser:ReportData.currentUser
                                                                                 ,userJSON:userJSON}));
										});
					    
					    $("#del-"+item._id).button().click(function(){
										   //alert("del");
										   var adminModel = collection.get(item._id);
										   if(_.isNotEmpty(adminModel) && (adminModel.toJSON())._id!=ReportData.currentUser._id) {
										       adminModel.destroy({
										           success:function() {
										               view._renderTable(collection);
										               alert("user deleted");
										           },
										           error:function() {
										               alert("Error; please, try again");
										           }
										       });
										   } else {
										       alert("Can't delete Current User");
										   }
									       });
					});
				 $("#addusers")
				     .button()
				     .click(function(){
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
						    } else {
							return undefined;
						    }
						};
						
						if(ReportData.currentUser.role=="MASTERADMIN") {
    						quickCreateUserInfoDialog(ich.inputUserInfo_TMP({})
    									   ,_.extend(addUser(getDefaultData(ReportData),collection)
    									           ,{collection:collection}));
                        } else {
                            alert("You can't add USER");    
                        }
    					    });
			     }
			     
			 });
