var loginRouter =
    new (Backbone.Router.extend(
	     {routes: {
		  "":"reportLogin"
	      },
	      reportLogin:function(){
		  console.log("reportLogin");
		  var html = ich.layerLogin_TMP({});
		  $("#main").html(html);
	      }}));

var reportLoginView = Backbone.View.extend(
    {initialize:function(){
	 var view = this;
	 _.bindAll(view, 'renderLoginPage');
	 loginRouter.bind('route:reportLogin',
			  function(){
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
    var location_key = _.chain(formEntries).selectKeys('company','group','store').removeEmptyKeys().value();
    var user_pass_key = _.selectKeys(formEntries,['user','password']);
    var login_key_form_raw = _.extend(location_key,user_pass_key);
    _.log('location_key')(location_key);
    _.log("login_key_form_raw")(login_key_form_raw);
    _.log("user_pass_key")(user_pass_key);

    //FIXME : key non-sensitive, perhaps walk or other things will be better
    function toLowerCase(str){
	if(_.isString(str)){
	    return str.toLowerCase();
	}
	return str;
    }
    function applyToVal(fn){
	return function(pair){
		var key = _.first(pair);
		var val = _.second(pair);
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

    var companiesDB = cdb.db('companies');
    var name_to_id_view = appView("names_to_id");
    var branch_show = appShow("branch");

    function user_complex_roles(user){
	return _.chain(user.toJSON().roles).filter(_.isObj).first().value();
    }

    keyQuery(name_to_id_view, companiesDB, _.selectKeys(login_key,'company','group','store'))
    (function (resp){
	 console.log(resp);
	 var accountMatches = resp.rows;
	 if(_.isNotEmpty(resp.rows)){
	     var id_for_user = _.first(resp.rows).value;
	 }
	 if(_.isDefined(id_for_user)){
	     var user = new UserDoc({name:id_for_user+login_key.user,password:login_key.password});
	     user.login({
			    success:function(user){
				var user_roles_obj = _.chain(user.toJSON().roles).filter(_.isObj).merge().value();
				companiesDB.show(branch_show,
						 user_complex_roles(user).company_id,
						 {data : user_roles_obj,
						  success:function(company_branch_data){
						      var current_user = simple_user_format(user.toJSON());
						     /* var user_company_info =
						      _.chain(user.toJSON().roles)
						      .filter(_.isObj)
						      .merge()
						      .selectKeys('company_id','companyName','group_id','groupName')
						      .value()*/
						      var user_company_info = _.selectKeys(current_user,'company_id','companyName','group_id','groupName','storeName','storeNumber','store_id');
						      var general_report_data = _.combine({currentUser:current_user},user_company_info);
						      if(user_complex_roles(user).store_id) {
							  ReportData = _.combine(general_report_data,{store:company_branch_data,startPage:"storeReport"});
						      }
						      else if(user_complex_roles(user).group_id) {
							  ReportData = _.combine(general_report_data,{group:company_branch_data, startPage:"groupReport"});
						      }
						      else if(user_complex_roles(user).company_id) {
							  ReportData = _.combine(general_report_data,{company:company_branch_data,startPage:"companyReport"});
						      }
						      window.location.href = "#"+ReportData.startPage+"/";
						  }});
			    },
			    error:function(){
				alert("wrong login info.");
			    }});
	 }
	 else{
	     alert("There was a problem logging in, check your user name/password");
	 }
     });
}
function logout() {
    ReportData=null;
    $.couch.logout();
    window.location.href ='';
};
