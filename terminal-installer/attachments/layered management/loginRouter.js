var LoginRouter = 
   new( Backbone.Router.extend(
	{
	    routes: {
		"":"reportLogin"

	    },
	    reportLogin:function(){
		console.log("reportLogin");
		var html = ich.layerLogin_TMP();
		$("body").html(html);
	    }}));

var reportLoginView = Backbone.View.extend(
    {initialize:function(){
	 var view = this;
	 _.bindAll(view, 'renderLoginPage');
	 LoginRouter.bind('route:reportLogin', function(){
			    console.log('reportLoginView:route:reportLogin');
			    view.el= _.first($("ids_form"));
			    view.renderLoginPage();});
     },
     renderLoginPage:function(){
	 var view = this;
	 console.log("reportview renderLoginPage");
	 return this;
     }});