var loginRouter = 
    new (Backbone.Router.extend(
	     {routes: {			 
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
    var login_key_form_raw = _.extend(location_key,user_pass_key);
    _.log('location_key')(location_key);
    _.log("login_key_form_raw")(login_key_form_raw);
    _.log("user_pass_key")(user_pass_key);
    
    var db_install = cdb.db("api");
    var db_users = cdb.db("layered_login_users");
    var user_passwordView = appView("user_pass");
    var branch_show = appShow("branch");

    //FIXME : key non-sensitive, perhaps walk or other things will be better
    function toLowerCase(str){
	if(_.isString(str)){
	    return str.toLowerCase();
	}
	return str;
    }
    function applyToKey(fn){
	return function(val,key){
	    return [fn(key),val];
	};
    }
    function applyToVal(fn){
	return function(val,key){
	    return [key,fn(val)];
	};
    }
    //transform the form data (removing empty fields and normalizing the user data (cept the password)
    var login_key = _.chain(login_key_form_raw)
	.removeKeys('password')
	.filter$(_.isNotEmpty)
	.map$(applyToVal(toLowerCase))
	.extend({password:login_key_form_raw.password})
	.value();

    _.log("login key")(login_key);
    
    keyQuery(user_passwordView, db_users, login_key)
    (function (resp){
	 console.log(resp);
	 var accountMatches = resp.rows;
	 if(_.isNotEmpty(accountMatches)) {
	     var account = {company_id:_.first(resp.rows).value.company,loginTo:_.first(resp.rows).value};
	     db_install.show(branch_show,
			     account.company_id,
			     {data : account.loginTo,
			      success:function(data){
				  if(_.isNotEmpty(account.loginTo.store)) {
				      ReportData = {store:data, companyName:account.loginTo.companyName, company_id:account.loginTo.company, groupName:account.loginTo.groupName, group_id:account.loginTo.group};
				      _.extend(ReportData,{startPage:"storeReport"});
				      window.location.href = "#storeReport/";
				      //loginRouter.navigate(ReportData.startPage);
				  }
				  else if(_.isNotEmpty(account.loginTo.group)) {
				      ReportData = {group:data, companyName:account.loginTo.companyName, company_id:account.loginTo.company};
				      _.extend(ReportData,{startPage:"groupReport"});
				      window.location.href = "#groupReport/";
				  } 
				  else if(_.isNotEmpty(account.loginTo.company)) {
				      ReportData = {company:data};
				      _.extend(ReportData,{startPage:"companyReport"});
				      //loginRouter.navigate(ReportData.startPage+"/");
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
