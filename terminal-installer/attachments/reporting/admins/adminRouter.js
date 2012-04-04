var current_user_info_view =
    Backbone.View.extend(
	{
	    events:{
		"click .change_logged_in_user_password":"change_password"
	    },
	    user_id:function(event){
		return event.currentTarget.id;
	    },
	    change_password:function(event){
		this.trigger("change-current-user-password",this.user_id(event));
	    },
	    render:function(current_user){
		console.log("render current user info");
		var el = this.$el;
		var template = this.options.template;
		if(template && el && current_user){
		    el.html(ich[template](current_user.toJSON()))
		    el.find('button').button();
		}
	    }
	});
var company_tree_navigation_view =
    Backbone.View.extend(
	{
	    events:{
		"click li":"view_entity"
	    },
	    view_entity:function(event){
		var entity_id = event.currentTarget.id
		this.trigger('view-entity',entity_id);
	    },
	    render:function(tree) {
		console.log("render company navigation tree");
		var el = this.$el
		el.html(ich[this.options.template](tree))
	    }
	});
var customer_admin_add_user_view =
    Backbone.View.extend(
	{
	    events:{
		"click":"add_user"
	    },
	    add_user:function(event){
		this.trigger('add-user');
	    }
	});

var menuAdminUsersView =
    Backbone.View.extend(
	{
	    events:{
		"click .edit_user":"edit_user",
		"click .delete_user":"delete_user",
		"click .edit_user_password":"change_password"
	    },
	    user_id:function(event){
		return event.currentTarget.id
	    },
	    edit_user:function(event){
		this.trigger('edit-user',this.user_id(event))
	    },
	    delete_user:function(event){
		this.trigger('delete-user',this.user_id(event))
	    },
	    change_password:function(event){
		this.trigger('change-user-password',this.user_id(event))
	    },
	    render:function(users) {
		console.log("render users");
		var view = this;
		var user_list =
		    _.chain(users)
		    .sortBy(function(item){return new Date(item.creationdate);})
		    .reverse()
		    .value();

		$(view.$el).html(ich.adminUsersInfotable_TMP({list:user_list}));
		$('button').button();

	    }
	});

var adminRouter =
    new (Backbone.Router.extend(
	     {
		 routes: {
		     "menuAdministration/":"setup"//,
		     //"menuAdministration/:id":"load_users_for_id"
		 },
		 initialize:function(){
		     var router = this;
		     router.template = 'adminManagement_TMP'
		     var UserCollection = Backbone.Collection.extend({model:UserDoc})
		     router.user_collection = new UserCollection()
		     router.current_user = new UserDoc();
		     router.views = {
			 user_table : new menuAdminUsersView(),
			 add_button : new customer_admin_add_user_view(),
			 current_user : new current_user_info_view({template:"logged_in_user_info_TMP"}),
			 navigation : new company_tree_navigation_view({template:"hierarchy_list_TMP"})
		     };

		     router
			 .user_collection
			 .on('all',
			     function(){router.views.user_table.render(this.toJSON());})

		     router
			 .views
			 .add_button
			 .on('user-added', router.add_user)

		     router.views.user_table.on('edit-user',router.edit_user,router)
		     router.views.user_table.on('delete-user',router.delete_user,router)
		     router.views.user_table.on('change-user-password',router.change_user_password,router)
		     router.current_user.on('change',router.views.current_user.render,router.views.current_user)
		     router.views.current_user.on("change-current-user-password",router.change_user_password,router)
		     router.views.add_button.on("add-user",router.add_user, router)

		     router.views.navigation.on('view-entity',router.load_users_for_id,router) //this could be a problem if setup isn't called
		 },
		 switch_company:function(){
		     console.log(arguments)
		 },
		 setup:function(){
		     var router = this;
		     var html = ich[router.template](_.extend({startPage:ReportData.startPage},breadCrumb))
    		     $("#main").html(html)
		     router.views.current_user.setElement("#current_user")
		     router.current_user.set(ReportData.currentUser)
		     router.views.current_user.render(router.current_user)
		     router
			 .views
			 .add_button
			 .setElement("#addusers")
			 .options.default_data = topLevelEntityInfo(ReportData)
		     router.views.user_table.setElement("#usersInfoTable")
		     router.views.add_button.$el.button()

		     router.views.navigation.setElement("#company-tree").render(ReportData)
		     router.load_users()
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
			  if(_.isEmpty(users)) {
			      alert("There are no users for this entity")
			  }
 			  function exclude_logged_in_user(reportData,users_list){
			      return _.reject(users_list,function(user){return reportData.currentUser._id === user._id})
			  }
			  router.user_collection.reset(exclude_logged_in_user(ReportData,users))
		      });
		 },
		 change_user_password:function(user_id){
		     var router = this;
		     console.log("change_user_password")
		     console.log(arguments);
		     function verify_user(user){
			 if(user && user.id){
			     return false;
			 }
			 return {
			     code:5462,
			     type:"invalid user",
			     message:"There is a problem with your login sesssion, you may need to login again"
			 }
		     }
		     function verify_session(session){
			 if(session && session.info && session.info.authentication_db){
			     return false;
			 }
			 return {
			     code:4232,
			     type:"invalid session",
			     message:"There is a problem with your login session, you may need to login again"
			 }

		     }
		     function verify_password(password){
			 if(_.isEmpty(password)){
			     return {
				 code:2341,
				 type:'invalid password',
				 message:"The password was left blank"
			     }
			 }
			 return false
		     }
		     function verify_user_session_password(user,session,new_password){
			 return function(callback){
			     var first_error =
				 _.either(verify_user(user),
					  verify_session(session),
					  verify_password(new_password))
			     if(first_error){
				 callback(first_error);
			     }
			     else{
				 callback(null,
					  user.id,
					  session.info.authentication_db,
					  new_password);
			     }
			 }
		     }
		     function fetch_user_doc(user_id,authDB,new_password,callback){
			 var SE_handler = {
			     error: function (code,type,message) {
				 callback({code:code,type:type,message:message})
			     },
			     success: function (user_doc){
				 user_doc.password = new_password;
				 user_doc.exposed_password = new_password;
				 callback(undefined,user_doc,authDB)
			     }
			 }
			 $.couch
			     .db(authDB)
			     .openDoc(user_id,SE_handler)
		     }
		     function  save_user_with_new_password(user_doc_new_password,authDB,callback){
			 var SE_handler = {
			     success: function(){
				 callback(undefined,user_doc_new_password)
			     },
			     error: function (code,type,message) {
				 callback({code:code,type:type,message:message})
			     }
			 }
			 $.couch
			     .db(authDB)
			     .saveDoc(user_doc_new_password,SE_handler)

		     }
		     function login_with_new_password(user_doc,callback){
			 var SE_handler = {
			     success : function(){
				 var simple_user = simple_user_format(user_doc);
				 callback(undefined,simple_user)
			     },
			     error: function (code,type,message) {
				 callback({code:code,type:type,message:message})
			     }
			 }
			 var login_options =
			     _.extend({
					  name : user_doc.name,
					  password : user_doc.password
				      },
				      SE_handler)

			 $.couch.login(login_options)
		     }
		     function edit_router_user_collection(user_doc,callback){
			 var simple_user = simple_user_format(user_doc);
			 router.user_collection.get(simple_user._id).set(simple_user);
			 callback(undefined);
		     }
		     function setup_router_current_user(simple_user,callback){
			 router.current_user.set(simple_user);
			 callback(undefined,simple_user);
		     }
		     function setup_report_data(simple_user,callback){
			 ReportData.currentUser = simple_user;
			 callback(undefined);
		     }
		     function setup_session(callback){
			 $.couch.session(
			     {
				 success:function(resp){
				     ReportData.session = resp;
				     callback(undefined)
				 },
				 error:function(code,type,message){
				     callback({code:code,type:type,message:message})
				 }
			     })
		     }

		     function is_logged_in_user(logged_in_user,user_id_to_edit){
			 return logged_in_user.id === user_id_to_edit;
		     }

		     function report(err){
			 if(err){
			     alert(JSON.stringify(err));
			 }
		     }

		     var new_password = prompt("new password");
		     var session = ReportData.session;
		     if(is_logged_in_user(router.current_user,user_id)){
			 var user = router.current_user
			 async.waterfall(
			     [
				 verify_user_session_password(user,session,new_password),
				 fetch_user_doc,
				 save_user_with_new_password,
				 login_with_new_password,
				 setup_router_current_user,
				 setup_report_data,
				 setup_session
			     ],
			     report)
		     }
		     else{
			 var user = router.user_collection.find(function(user){return user.get('_id') === user_id});
			 async.waterfall(
			     [
				 verify_user_session_password(user,session,new_password),
				 fetch_user_doc,
				 save_user_with_new_password,
				 edit_router_user_collection
			     ],
			     report)
		     }
		 },
		 edit_logged_in_users_password:function(user,session){
		     var router = this;
		     //TODO: put this in the user doc model


		 },
		 edit_user:function(user_id){
		     console.log("edit user: " + user_id);
		     we_are_fixing_this_feature("editing users is being fixed right now");return;
		     var user = this.user_collection.find(function(user_model){return user_model.get('_id') === user_id})

		     var all_fields = [
			 {"var":'userName'},
			 {"var":'password'},
			 {"var":'roles',value:[
			      {value:'company_admin'},
			      {value:'company'},
			      {value:'store'},
			      {value:'store_admin'},
			      {value:'group_admin'},
			      {value:'group'},
			      {value:'pos_sales'},
			      {value:'pos_admin'}
			  ]},
			 {"var":"enabled",type:'bool'},
			 {"var":"firstname"},
			 {"var":"lastname"},
			 {"var":"website"},
			 {"var":"email",type:'email'},
			 {"var":"phone",type:'phone'},
			 {"var":"street0"},
			 {"var":"street1"},
			 {"var":"city"},
			 {"var":"country"},
			 {"var":"province"},
			 {"var":"postalcode"}
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
	/*	     var user_editing_rules ={
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
	 */

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
		 add_user:function(){
		     console.log("add user button pressed");
		     var router = this;
		     //assume that this is a company_admin level user making a company level user
		     function generate_add_user_dialog_blueprint(reportData){
			 if(topLevelEntity(ReportData).type === 'store'){
			     return {
				 consts : _.defaults(
				     {
					 "creationdate": (new Date()).toJSON(),
					 "type": "user"

				     },
				     topLevelEntityInfo(ReportData)),
				 display:
				 {
				     user_name:{"var":'userName',label:"User Name",enabled:true,value:""},
				     password:{"var":'password',label:"Password",enabled:true,value:""},
				     "roles": [
					 {"var":'pos_sales',label:"POS User",enabled:true,value:false},
					 {"var":'pos_admin',label:"POS Admin",enabled:true,value:false}
				     ],
				     is_enabled:{"var":"enabled",label:"Enabled",enabled:true,value:true},
				     contact:[
					 {"var":"firstname",label:"First Name", enabled:true,value:""},
					 {"var":"lastname",label:"Last Name", enabled:true,value:""},
					 {"var":"website",label:"WebSite", enabled:true,value:""},
					 {"var":"email", label:"Email",enabled:true,value:""},
					 {"var":"phone", label:"Phone Number",enabled:true,value:""}
				     ],
				     address:[
					 {"var":"street0",label:"Street", enabled:true,value:""},
					 {"var":"street1", label:"Street",enabled:true,value:""},
					 {"var":"city", label:"City",enabled:true,value:""},
					 {"var":"country", label:"Country",enabled:true,value:""},
					 {"var":"province", label:"Province",enabled:true,value:""},
					 {"var":"postalcode", label:"Postal Code",enabled:true,value:""}
				     ]
				 }
			     }
			 }
			 return undefined;
		     }
		     var user_creation_rules =  generate_add_user_dialog_blueprint(ReportData);
		     if(_.isUndefined(user_creation_rules)){
			 we_are_fixing_this_feature("support for creating users at other levels is being worked on");
			 return;
		     }
		     quickInputUserInfoDialog(
			 {
			     title:"Add New User",
			     html:ich.inputUserInfo_TMP(user_creation_rules.display), //here we have to merge the rules with the default_data to come up with the blueprint for the dialog
			     on_submit:function(simple_user_data){
				 console.log(simple_user_data);
				 function user_name(user){
				     return _.combine(user, {name:_.either(user.store_id,user.group_id,user.company_id)+user.userName})
				 }
				 function apply_constants(consts){
				     return function(user){
					 return _.combine(user,consts);
				     }
				 }
				 function complex_user_format(user_data){
				     var extract_strings = ['company','company_admin','group','group_admin','store','store_admin','pos_sales','pos_admin'];
				     var extract_obj = ['companyName','company_id','groupName','group_id','storeName','store_id','storeNumber','userName','enabled'].concat(extract_strings);
				     var roles_strings = _.chain(user_data).selectKeys(extract_strings).filter$(_.identity).keys().value()
				     var roles_complex = _.selectKeys(user_data,extract_obj);
				     var roles = roles_strings.concat(roles_complex);
				     return _.chain(user_data).removeKeys(extract_obj).combine({roles:roles}).value();
				 }
				 var user_data = _.compose(complex_user_format,
							 user_name)(_.combine(user_creation_rules.consts,
									      simple_user_data,
									      {exposed_password:simple_user_data.password}));
				 (new UserDoc(user_data))
				     .signup(
					 {
					     success:function(resp){
						 //	alert("created new user: " + user_data.userName);
						 router.user_collection.add(simple_user_format(user_data));
					     },
					     error:function(err_code,err,err_message){
						 alert(err_message);
					     }});
			     }
			 });
		 }
	     }));