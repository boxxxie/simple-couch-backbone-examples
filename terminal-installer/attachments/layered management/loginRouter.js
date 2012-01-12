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
    function valuesToLowerCase(pair){
	pair[1] = pair[1].toLowerCase();return pair;
    }
    var isValueEmpty = _.isLastEmpty;

    var $form = $("#ids_form");
    var formEntries = varFormGrabber($form);
    console.log("form entries");
    console.log(formEntries);
    var location_key = _(formEntries).chain()
	.selectKeys(['company','group','store'])
	.kv()
	.reject(isValueEmpty)
	.map(valuesToLowerCase)
	.toObject()
	.value();
    var user_pass_key = _.selectKeys(formEntries,['user','password']);
    var login_key = _.extend(location_key,user_pass_key);
    console.log("login_key");
    console.log(login_key);
    
    var db_install = cdb.db("api",{},true);
    var user_passwordView = appView("user_pass");
    var branch_show = appShow("branch");

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
				      ReportData = {store:data, companyName:login_key.company, groupName:login_key.group};
				      window.location.href = "#storeReport/";
				  }
				  else if(_.isNotEmpty(account.loginTo.group)) {
				      ReportData = {group:data, companyName:login_key.company};
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
