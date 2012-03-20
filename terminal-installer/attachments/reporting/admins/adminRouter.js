var customer_admin_add_user_view =
    Backbone.View.extend(
	{
	    events:{
		"click":"add_user"
	    },
	    add_user:function(){
		console.log("add user button pressed");
		var view = this;
		//assume that this is a company_admin level user making a company level user
		var user_creation_rules = {
		    consts : _.defaults(
			{
			    "creationdate": (new Date()).toJSON(),
			    "type": "user"

			},
			view.options.default_data),
		    defaults:
		    {
			userName:"",
			password:"",
			"roles": [
			    "company",
			    "store",
			    "store_admin",
			    "group_admin",
			    "group",
			    "pos_sales",
			    "pos_admin"
			],
			"enabled": true,
			"firstname": "",
			"lastname": "",
			"website": "",
			"email": "",
			"phone": "",
			"street0": "",
			"street1": "",
			"city": "",
			"country": "",
			"province": "",
			"postalcode": ""
		    }
		};
		quickInputUserInfoDialog(
		    {
			title:"Add New User",
			html:ich.inputUserInfo_TMP(user_creation_rules.defaults), //here we have to merge the rules with the default_data to come up with the blueprint for the dialog
			on_submit:function(form_data){
			    console.log(form_data);
			    function format_roles(user){
				return _.combine(user,{roles:_.chain(user.roles).filter$(_.identity).keys().value()});
			    }
			    function user_name(user){
				return _.combine(user, {name:_.either(user.store_id,user.group_id,user.company_id)+user.userName})
			    }
			    function apply_constants(consts){
				return function(user){
				    return _.combine(user,consts);
				}
			    }
			    var user_data =
				_.compose(user_name,
					  apply_constants(user_creation_rules.consts),
					  format_roles)(form_data);
			    var user = new UserDoc(user_data);
			    user.signup(
				{
				    success:function(resp){
				//	alert("created new user: " + user_data.userName);
					view.trigger('user-added', user);
				    },
				    error:function(err_code,err,err_message){
					alert(err_message);
				    }});
			}
		    });
	    }
	});

var menuAdminUsersView =
    Backbone.View.extend(
	{
	    events:{
		"click .edit_user":"edit_user",
		"click .delete_user":"delete_user"
	    },
	    edit_user:function(event){
		var user_id = event.currentTarget.id;
		this.trigger('edit-user',user_id)
	    },
	    delete_user:function(event){
		var user_id = event.currentTarget.id;
		this.trigger('delete-user',user_id)
	    },
	    render:function(users) {
		console.log("render users");
		var view = this;
		var list =
		    _.chain(users)
		    .sortBy(function(item){ return (_.isNaN((new Date(item.creationdate)).getTime()))?getDateObjFromStr(item.creationdate):new Date(item.creationdate);})
		    .reverse()
		    .value();

		$(view.$el).html(ich.adminUsersInfotable_TMP({list:list}));
		$('button').button();

	    }
	});

var adminRouter =
    new (Backbone.Router.extend(
	     {
		 routes: {
		     "menuAdministration/":"load_users",
		     "menuAdministration/:id":"load_users_for_id"
		 },
		 initialize:function(){
		     var router = this;
		     this.user_collection = new Backbone.Collection();
		     router.views = {
			 user_table : new menuAdminUsersView(),
			 add_button : new customer_admin_add_user_view()
		     };

		     router
			 .user_collection
			 .on('remove add reset',
			     function(){router.views.user_table.render(this.toJSON());});

		     router
			 .views
			 .add_button
			 .on('user-added', router.user_collection.add,router.user_collection);

		     router.views.user_table.on('edit-user',router.edit_user,router);
		     router.views.user_table.on('delete-user',router.delete_user,router);
		 },
		 edit_user:function(user_id){
		     var user = this.user_collection.find(function(user_model){return user_model.get('_id') === user_id})
		 },
		 delete_user:function(user_id){

		 },
		 load_users:function(){
		     this.load_users_for_id(topLevelEntity(ReportData).id)
		 },
		 load_users_for_id:function(id){
		     var router = this;
		     router.user_collection.reset();
		     console.log("menuAdministration: " + id);
		     var breadCrumb = autoBreadCrumb();
		     fetch_users_by_location_id(id)
		     (function(err,users){
			  if(_.isNotEmpty(users)) {
    			      var view = this.view;
    			      var html = ich.adminManagement_TMP(_.extend({startPage:ReportData.startPage},breadCrumb));
    			      $("#main").html(html);
			      router
				  .views
				  .add_button
				  .setElement("#addusers")
				  .options.default_data = topLevelEntityInfo(ReportData);
			      router.views.user_table.setElement("#usersInfoTable");
			      router.views.add_button.$el.button()

			      router.user_collection.reset(users);
			  } else {
			      alert("There are no users for this entity");
			      window.history.go(-1);
			  }
		      });
		 }
	     }));