function doc_setup() {
    var AppRouter = new 

    (Backbone.Router.extend(
	 {
	     routes: {
		 "":"reportLogin",
		 "companyReport/:_id":"companyReport"
	     },
	     reportLogin:function(){
		 console.log("reportLogin");
		 var html = ich.layerLogin_TMP();
		 $("body").html(html);
	     },
	     companyReport:function(id){
		 console.log("companyReport");
	     }
	 }));

    
    var reportLoginView = Backbone.View.extend(
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


    var companyReportView = Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     _.bindAll(view, 'renderCompanyReport');
	     AppRouter.bind('route:companyReport', function(id){
				console.log("companyReportView, route:companyReport");
				//view.el= _.first($("main"));
				view.model = new Company({_id:id});
				//view.model.bind('change',function(){view.renderModifyPage(upc);});
				//view.model.bind('not_found',function(){view.renderAddPage(upc);});
				console.log("new company");
				view.model.fetch({error:function(a,b,c){
						      console.log("couldn't load model");
						      //view.model.trigger('not_found');
						  }});
				console.log("fetch");
				view.renderCompanyReport();			
			    });
	 },
	 renderCompanyReport: function() {
	     var view = this;
	     var company = view.model.toJSON();
	     var groups = company.hierarchy.groups; //_.filter(company.hierarchy.groups, function(group){ return !_.isEmpty(group.stores)});
	     var stores = _(groups).chain().map(function(group) {return group.stores;}).flatten().value();
	     
	     var numGroups = _.size(groups);
	     var numStores = _.reduce(groups, function(sum, group){ return sum + _.size(group.stores); }, 0);
	     var numTerminals = _.reduce(stores, function(sum, store){ return sum + _.size(store.terminals); }, 0);
	     var param =  {sales:{yesterdaysales:"100",mtdsales:"100",ytdsales:"100"},
			   numberOfGroups:numGroups,
			   numberOfStores:numStores,
			   numberOfTerminals:numTerminals
			  };
	     console.log("param");
	     var html = ich.companyManagementPage_TMP(param);
	     console.log("html");
	     $("body").html(html);
	     console.log("companyReportView renderCompanyReport");
	     return this;
	 }
	});
    var groupManagementView = Backbone.View.extend();
    var storeManagementView = Backbone.View.extend();

    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
    Backbone.history.start();

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