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
    function editUserInInstallDB(userModel,reportData){
        var newUser = userModel.get('user');
        var newPassword = userModel.get('password');
        var currentUser = reportData.currentUser;
        var company = new CompanyForUser({_id:currentUser.company_id});
        company.fetch({
            success:function(companyModel) {
                if(_.isNotEmpty(currentUser.store_id)) {
                    var foundStore = companyModel.getStore(currentUser.group_id,currentUser.store_id);
                    _.extend(foundStore,{user:newUser,password:newPassword});
                    companyModel.editStore(currentUser.group_id,currentUser.store_id,foundStore);
                } else if(_.isNotEmpty(currentUser.group_id)) {
                    var foundGroup = companyModel.getGroup(currentUser.group_id);
                    _.extend(foundGroup,{user:newUser,password:newPassword});
                    companyModel.editGroup(currentUser.group_id,foundGroup);
                } else {
                    companyModel.save({user:newUser,password:newPassword});
                }
            },
            error: function() {
                alert("error: Please, try again");
            }
        });
        
    };
     return { 
         success : function(userInfo) {
            userModel.signup(_.extend(_.extend(userModel.toJSON(),userInfo), {
                success: function(model) {
                    console.log(model);
                },
                error: function() {
                    console.log("error");
                }
            }));
            /*
            userModel.save(userInfo, {
                success: function(model) {
                    userCollection.trigger("change",userCollection);
                    editUserInInstallDB(model,ReportData);
                    alert("user edited successfully");
                },
                error: function() {
                    alert("Error; please, try again");
                },
                silent:true
            });
            */
         }
     }; 
}


var adminRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuAdministration/companyReport":"menuAdministrationCompany",
		  "menuAdministration/groupReport":"menuAdministrationGroup",
		  "menuAdministration/storeReport":"menuAdministrationStore",
		  "companyReport/group/:group_id/admins" :"menuAdministrationCompany",
		  "companyReport/store/:store_id/admins" :"menuAdministrationCompany",
		  "groupReport/store/:store_id/admins" :"menuAdministrationGroup"
	      },
	      menuAdministrationCompany:function(id) {
          var levelid, breadCrumb;
          if(_.isEmpty(id)) {
              levelid = ReportData.company._id;
              breadCrumb = autoBreadCrumb();
          } else {
              levelid = id;
              var strsURL = (Backbone.history.fragment).split("/");
              if(_.contains(strsURL,"group")) {
                  breadCrumb = {breadCrumb:getStoresTableBreadCrumb(id)};
              } else if(_.contains(strsURL,"store")) {
                  breadCrumb = {breadCrumb:getTerminalsTableBreadCrumb(id)};
              } else {
                  breadCrumb = autoBreadCrumb();
              }
          }
		  this._setup("companyReport",levelid, breadCrumb);
		  console.log("menuAdministrationCompany");
	      },
	      menuAdministrationGroup:function(id) {
          var levelid = _.isEmpty(id)?ReportData.group.group_id:id;
          var breadCrumb = _.isEmpty(id)?autoBreadCrumb():{breadCrumb:getTerminalsTableBreadCrumb(id)};
		  this._setup("groupReport",levelid,breadCrumb);
		  console.log("menuAdministrationGroup");
	      },
	      menuAdministrationStore:function() {
		  this._setup("storeReport",ReportData.store.store_id,autoBreadCrumb());
		  console.log("menuAdministrationStore");
	      },
	      _setup:function(startPage, id, breadCrumb){
	      // this function should be used only in here, not general
          function getHierachyLevel(breadCrumb) {
	          switch(_(breadCrumb).chain().toArray().compact().size().value()) {
              case 1:
                return "company";
                break;
              case 2:
                return "group";
                break;
              case 3:
                return "store";
                break;
              }
              return "store";
	      }
	      
	      //var opts = _.extend({hierarchyLevel:getHierachyLevel(breadCrumb.breadCrumb)},{reportData:ReportData});
		  fetchRetailerUserCollection(id)(function(err,collection){
		                      if(_.isNotEmpty(collection)) {
    						      var view = this.view;
    						      var html = ich.adminManagement_TMP(_.extend({startPage:startPage},breadCrumb));
    						      $("#main").html(html);
    						      view = new menuAdminUsersView({collection:collection},{hierarchyLevel:getHierachyLevel(breadCrumb.breadCrumb)});
						      } else {
						          alert("Empty Users");
						          window.history.go(-1);
						      }
						  });
              }
	     }));

var menuAdminUsersView = 
    Backbone.View.extend({
			     initialize:function() {
				 console.log(this.collection);
				 this.hierarchyLevel = arguments[1].hierarchyLevel;
				 (this.collection).on("change",this._renderTable,this);
				 this._renderTable(this.collection);
			     },
			     _renderTable:function(collection) {
                 var view = this;
                 var hierarchyLevel = view.hierarchyLevel;
                 var colJSON = collection.toJSON();
                 
				 var list = _.sortBy(colJSON, function(item){ return (_.isNaN((new Date(item.creationdate)).getTime()))?getDateObjFromStr(item.creationdate):new Date(item.creationdate);})
				                .reverse();
				 
				 $("#usersInfoTable").html(ich.adminUsersInfotable_TMP({list:list}));
				 _.each(list,function(item){
					    $("#edit-"+item.name).button().click(function(){
										    //alert("edit");
										    if(_.contains(ReportData.currentUser.roles, hierarchyLevel+"_admin")
										      || ReportData.currentUser._id==item._id) {
    										    var userModel = collection.get(item._id);
    										    var userJSON = userModel.toJSON();
    										    var data_TMP = userJSON;
    										    
    										    quickModifyUserInfoDialog(ich.inputUserInfo2_TMP(data_TMP)
                                                                           ,_.extend(editUser(userModel,collection)
                                                                                   ,{collection:collection
                                                                                     ,currentUser:ReportData.currentUser
                                                                                     ,userJSON:userJSON
                                                                                     ,hierarchyLevel:hierarchyLevel}));
                                            } else {
                                                alert("You're not allowed to edit");
                                            }
										});
					    
					    $("#del-"+item.name).button().click(function(){
										   //alert("del");
										   if(_.contains(ReportData.currentUser.roles, hierarchyLevel+"_admin")) {
    										   var adminModel = collection.get(item._id);
    										   if(_.isNotEmpty(adminModel) && (adminModel.toJSON())._id!=ReportData.currentUser._id
    										                               && (adminModel.toJSON())._id!=(_.last(list))._id) {
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
    										       alert("Can't delete This User");
    										   }
										   } else {
										        alert("You're not allowed to delete");
										   }
								       });
					});
				 
				 $("#addusers")
				     .button()
				     .click(function(){
						function getDefaultData(reportData) {
						    if(reportData.company) {
							return {company_id:reportData.company._id,
								companyName:reportData.company.companyName};
						    } else if(reportData.group) {
							return {company_id:reportData.company_id,
								companyName:reportData.companyName,
								group_id:reportData.group.group_id,
								groupName:reportData.group.groupName};
						    } else if(reportData.store) {
							return {company_id:reportData.company_id,
								companyName:reportData.companyName,
								group_id:reportData.group_id,
								groupName:reportData.groupName,
								store_id:reportData.store.store_id,
								storeName:reportData.store.storeName,
								storeNumber:reportData.store.number};
						    } else {
							return undefined;
						    }
						};
						
						if(_.contains(ReportData.currentUser.roles, hierarchyLevel+"_admin")) {
    						quickCreateUserInfoDialog(ich.inputUserInfo2_TMP({})
    									   ,_.extend(addUser(getDefaultData(ReportData),collection)
    									           ,{collection:collection}
    									           ,{hierarchyLevel:hierarchyLevel}));
                        } else {
                            alert("You can't add USER");    
                        }
    				});
			     }
			     
			 });
