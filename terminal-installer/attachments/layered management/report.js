function doc_setup() {
    var AppRouter = new 
    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 "company/:company":"companyReportManagementHome"
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     companyReportManagementHome:function(){
		 console.log("companyReportManagement");
	     }
	 }));
    
    var ReportView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderLoginPage');
	     AppRouter.bind('route:reportLogin', function(){
				console.log('reportLoginView:route:reportLogin');
				view.el= _.first($("ids_form"));
				view.renderLoginPage();});
	 },
	 renderLoginPage:function(){
	     var view = this;
	     console.log("reportview renderLoginPage");
	     return this;
	 }
	});

    var ReportDisplay = new ReportView();
    Backbone.history.start();

}

function varFormGrabber($form){
    return formGrabber($form,'var');
}

function login() {
    var $form = $("#ids_form");
    var formEntries = varFormGrabber($form);
    console.log("form entries");
    console.log(formEntries);
    var login_key = _(formEntries).chain()
	.kv()
	.reject(_.isLastEmpty)
	.toObject()
	.value();
    console.log("login_key");
    console.log(login_key);
    
    var db_install = db("install");
    var user_passwordView = appView("user_pass");
    var branch_show = appShow("branch");

    keyQuery(login_key, user_passwordView, db_install)
    (function (resp){
	 console.log("view resp");
	 console.log(resp);
	 //todo: include {data:{:group,:store}} in the arg where the success function is
	 db_install.show(branch_show,
			 _.first(resp.rows).id,
			 {success:function(data){console.log(data);}});
     });
    
}