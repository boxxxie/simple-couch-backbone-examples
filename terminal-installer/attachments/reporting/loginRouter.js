var loginRouter = 
    new (Backbone.Router
	 .extend({
		     routes: {			 
			 "":"reportLogin"
		     },
		     reportLogin:function(){
			 console.log("reportLogin");
			 var html = ich.layerLogin_TMP();
			 $("#main").html(html);
		     }}));    

var reportLoginView = Backbone.View.extend(
    {initialize:function(){
	 var view = this;
	 _.bindAll(view, 'renderLoginPage');
	 loginRouter.bind('route:reportLogin', function(){
			      console.log('reportLoginView:route:reportLogin');
			      view.el= _.first($("ids_form"));
			      view.renderLoginPage();});
     },
     renderLoginPage:function(){
	 var view = this;
	 console.log("reportview renderLoginPage");
     }
    });

function login() {
    var $form = $("#ids_form");
    var formEntries = varFormGrabber($form);
    _.log("form entries")(formEntries);
    var location_key = _.selectKeysIf(formEntries,['company','group','store'],_.isNotEmpty);
    var user_pass_key = _.selectKeys(formEntries,['user','password']);
    var login_key = _.extend(location_key,user_pass_key);
    _.log('location_key')(location_key);
    _.log("login_key")(login_key);
    _.log("user_pass_key")(user_pass_key);
    
    var db_install = cdb.db("api",{},true);
    var user_passwordView = appView("user_pass");
    var branch_show = appShow("branch");

	//FIXME : key non-sensitive, perhaps walk or other things will be better
	if(!_.isEmpty(login_key.company)) {
		login_key.company = login_key.company.toLowerCase();
	}
	if(!_.isEmpty(login_key.group)) {
		login_key.group = login_key.group.toLowerCase();
	}
	if(!_.isEmpty(login_key.store)) {
		login_key.store = login_key.store.toLowerCase();
	}
	if(!_.isEmpty(login_key.user)) {
		login_key.user = login_key.user.toLowerCase();
	}
	if(!_.isEmpty(login_key.password)) {
		login_key.password = login_key.password.toLowerCase();
	}
	
    keyQuery(user_passwordView, db_install, login_key)
    (function (resp){
	 console.log(resp);
	 var accountMatches = resp.rows;
	 if(_.isNotEmpty(accountMatches)) {
	     var account = {company_id:_.first(resp.rows).id,loginTo:_.first(resp.rows).value};
	     db_install.show(branch_show,
			     account.company_id,
			     {data : account.loginTo,
			      success:function(data){
				  if(_.isNotEmpty(account.loginTo.store)) {
				  	  
				      ReportData = {store:data, companyName:account.loginTo.companyName, company_id:account.loginTo.company, groupName:account.loginTo.groupName, group_id:account.loginTo.group};
				      window.location.href = "#storeReport/";
				  }
				  else if(_.isNotEmpty(account.loginTo.group)) {
				      ReportData = {group:data, companyName:account.loginTo.companyName, company_id:account.loginTo.company};
				      window.location.href = "#groupReport/";
				  } 
				  else if(_.isNotEmpty(account.loginTo.company)) {
				      ReportData = {company:data};
				      window.location.href = "#companyReport/";
				  }}});}
	 else {
	     alert("wrong login info.");
	 }
     });
};

function logout() {
    ReportData=null;
    window.location.href ='login';
};
