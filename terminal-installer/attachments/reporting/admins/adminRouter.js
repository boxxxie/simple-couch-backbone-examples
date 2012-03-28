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
		    display:
		    {
			user_name:{var:'userName',label:"User Name",enabled:true,value:""},
			password:{var:'password',label:"Password",enabled:true,value:""},
			"roles": [
			    {var:'roles.company_admin',label:"Company Admin",enabled:false,value:false},
			    {var:'roles.company',label:"Company User",enabled:true,value:false},
			    {var:'roles.store',label:"Store User",enabled:true,value:false},
			    {var:'roles.store_admin',label:"Store Admin",enabled:true,value:false},
			    {var:'roles.group_admin',label:"Group Admin",enabled:true,value:false},
			    {var:'roles.group',label:"Group User",enabled:true,value:false},
			    {var:'roles.pos_sales',label:"POS User",enabled:true,value:false},
			    {var:'roles.pos_admin',label:"POS Admin",enabled:true,value:false}
			],
			is_enabled:{var:"enabled",label:"Enabled",enabled:true,value:true},
			contact:[
			    {var:"firstname",label:"First Name", enabled:true,value:""},
			    {var:"lastname",label:"Last Name", enabled:true,value:""},
			    {var:"website",label:"WebSite", enabled:true,value:""},
			    {var:"email", label:"Email",enabled:true,value:""},
			    {var:"phone", label:"Phone Number",enabled:true,value:""}
			],
			address:[
			    {var:"street0",label:"Street", enabled:true,value:""},
			    {var:"street1", label:"Street",enabled:true,value:""},
			    {var:"city", label:"City",enabled:true,value:""},
			    {var:"country", label:"Country",enabled:true,value:""},
			    {var:"province", label:"Province",enabled:true,value:""},
			    {var:"postalcode", label:"Postal Code",enabled:true,value:""}
			]
		    }
		};
		quickInputUserInfoDialog(
		    {
			title:"Add New User",
			html:ich.inputUserInfo_TMP(user_creation_rules.display), //here we have to merge the rules with the default_data to come up with the blueprint for the dialog
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

		     var all_fields = [
			 {var:'userName'},
			 {var:'password'},
			 {var:'roles',value:[
			      {value:'company_admin'},
			      {value:'company'},
			      {value:'store'},
			      {value:'store_admin'},
			      {value:'group_admin'},
			      {value:'group'},
			      {value:'pos_sales'},
			      {value:'pos_admin'}
			  ]},
			 {var:"enabled",type:'bool'},
			 {var:"firstname"},
			 {var:"lastname"},
			 {var:"website"},
			 {var:"email",type:'email'},
			 {var:"phone",type:'phone'},
			 {var:"street0"},
			 {var:"street1"},
			 {var:"city"},
			 {var:"country"},
			 {var:"province"},
			 {var:"postalcode"}
		     ];

		     //make things with no type or value be of type string
		     function fill_in_missing_types(thing){
			 return _.prewalk(function(o){
					 if(o && _.isObj(o) &&
					    !_.has(o,'type') &&
					    _.isUndefined(o.value)){
					     return _.combine(o,{type:'string'})
					 }
					 return o
				     },thing)
		     }

		     //make things of certain types be set to arbitrary detault values
		     function apply_default_values(thing){
			 return _.prewalk(function(o){
					 if(o && _.isObj(o) &&
					    _.has(o,'type') &&
					    _.isUndefined(o.value)){
					     switch(o.type){
					     case 'string':
						 return _.combine(o,{value:''});break;
					     case 'bool':
						 return _.combine(o,{value:true});break;
					     }
					 }
					 return o
				     },thing)
		     }
		     var test = fill_in_missing_types(all_fields);
		     var all_fields_with_defaults = _.compose(apply_default_values,fill_in_missing_types)(all_fields)
/*
		     user_name:{var:'userName',label:"User Name",enabled:true,value:""},
			 password:{var:'password',label:"Password",enabled:true,value:""},
			 roles: [
			     {company_admin:{var:'roles.company_admin',label:"Company Admin",enabled:false,value:false}},
			     {company:{var:'roles.company',label:"Company User",enabled:true,value:false}},
			     {store:{var:'roles.store',label:"Store User",enabled:true,value:false}},
			     {store_admin:{var:'roles.store_admin',label:"Store Admin",enabled:true,value:false}},
			     {group_admin:{var:'roles.group_admin',label:"Group Admin",enabled:true,value:false}},
			     {group:{var:'roles.group',label:"Group User",enabled:true,value:false}},
			     {pos_sales:{var:'roles.pos_sales',label:"POS User",enabled:true,value:false}},
			     {pos_admin:{var:'roles.pos_admin',label:"POS Admin",enabled:true,value:false}}
			 ],
			 is_enabled:{var:"enabled",label:"Enabled",enabled:true,value:true},
			 firstname:{var:"firstname",label:"First Name", enabled:true,value:""},
			 lastname:{var:"lastname",label:"Last Name", enabled:true,value:""},
			 website:{var:"website",label:"WebSite", enabled:true,value:""},
			 email:{var:"email", label:"Email",enabled:true,value:""},
			 phone:{var:"phone", label:"Phone Number",enabled:true,value:""},
			 street0:{var:"street0",label:"Street", enabled:true,value:""},
			 street1:{var:"street1", label:"Street",enabled:true,value:""},
			 city:{var:"city", label:"City",enabled:true,value:""},
			 country:{var:"country", label:"Country",enabled:true,value:""},
			 province:{var:"province", label:"Province",enabled:true,value:""},
			 postalcode:{var:"postalcode", label:"Postal Code",enabled:true,value:""}
*/
/*
		     var const_fields = _.chain([
						  {var:'creationdate'},
						  {var:'type'},
						  {var:'password'},
						  {roles:[{var:'company_admin'}]}
					      ])
			 .concat(_.keys(topLevelEntityInfo(ReportData)))
			 .value();

		     var disabled_fields = _.prewalk(function(o){
						       if(o && _.has(o,'var')){
							   return _.combine(o,{const:true})
						       }
						       return o
						   },
						   const_fields)

		     var fields = {
			 'userName':"",
			 'password':"",
			 roles:['company_admin'],
			 'enabled':true
		     };

		     _.prewalk_demo(fields);
		     /*
		     var t_fields = _.prewalk(function(o){
						 console.log([key,val]);
						 if(){
						     return {key:val};
						 }
						 else{
						     return val;
						 }
					     },fields);
		     /* var t_fields_2 = _.prewalk(function(val,key){
						   return {
						       key
						   }
					       },fields);*/
		     var user_editing_rules ={
			 user_name:{var:'userName',label:"User Name",enabled:true,value:""},
			 password:{var:'password',label:"Password",enabled:true,value:""},
			 roles: [
			     {company_admin:{var:'roles.company_admin',label:"Company Admin",enabled:false,value:false}},
			     {company:{var:'roles.company',label:"Company User",enabled:true,value:false}},
			     {store:{var:'roles.store',label:"Store User",enabled:true,value:false}},
			     {store_admin:{var:'roles.store_admin',label:"Store Admin",enabled:true,value:false}},
			     {group_admin:{var:'roles.group_admin',label:"Group Admin",enabled:true,value:false}},
			     {group:{var:'roles.group',label:"Group User",enabled:true,value:false}},
			     {pos_sales:{var:'roles.pos_sales',label:"POS User",enabled:true,value:false}},
			     {pos_admin:{var:'roles.pos_admin',label:"POS Admin",enabled:true,value:false}}
			 ],
			 is_enabled:{var:"enabled",label:"Enabled",enabled:true,value:true},
			 firstname:{var:"firstname",label:"First Name", enabled:true,value:""},
			 lastname:{var:"lastname",label:"Last Name", enabled:true,value:""},
			 website:{var:"website",label:"WebSite", enabled:true,value:""},
			 email:{var:"email", label:"Email",enabled:true,value:""},
			 phone:{var:"phone", label:"Phone Number",enabled:true,value:""},
			 street0:{var:"street0",label:"Street", enabled:true,value:""},
			 street1:{var:"street1", label:"Street",enabled:true,value:""},
			 city:{var:"city", label:"City",enabled:true,value:""},
			 country:{var:"country", label:"Country",enabled:true,value:""},
			 province:{var:"province", label:"Province",enabled:true,value:""},
			 postalcode:{var:"postalcode", label:"Postal Code",enabled:true,value:""}
		     };

		     var apply_remove_rules = apply_removal(const_fields);
		    // var apply_hidden_rules = apply_simple_rule(hidden_fields,{hidden:true});
		     var apply_disabled_rules = apply_simple_rule(disabled_fields,{enabled:false});
		     var user_edit_display =
			 _.chain(user_editing_rules)
			 .map$(apply_remove_rules)
			 //.map$(apply_disabled_rules)
			 .value();

		     quickInputUserInfoDialog(
		    {
			title:"Add New User",
			html:ich.inputUserInfo_TMP(user_edit_display), //here we have to merge the rules with the default_data to come up with the blueprint for the dialog
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
			    /*user.signup(
				{
				    success:function(resp){
				//	alert("created new user: " + user_data.userName);
					view.trigger('user-added', user);
				    },
				    error:function(err_code,err,err_message){
					alert(err_message);
				    }});*/
			}
		    });

		 },
		 delete_user:function(user_id){

		 },
		 load_users:function(){
		     this.load_users_for_id(topLevelEntity(ReportData).id)
		 },
		 load_users_for_id:function(id){
		     we_are_fixing_this_page("this page is being fixed right now");
		     return;
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