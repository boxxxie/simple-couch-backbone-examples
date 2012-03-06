$(document)
    .ready(function() {
	       function IE7_fix(){
		   //this is for IE7
		   if(_.isUndefined(window.console)){
		       console = {log:function(){/*do nothing*/}};
		   }
	       }
	       function renderCurrentTime(){
		   var now = new Date();
		   var dateString = now.toDateString() + " / " + now.toLocaleTimeString();
		   $("#timespace").html(dateString);
	       }
	       function updateTimeEverySecond(){
		   $(document).everyTime("1s",renderCurrentTime, 0);
	       }
	       function onPressEnter(fn){
		   $(document).off('keyup');
		   $(document).keyup(
		       function(event){
			   if(event.keyCode == 13){
			       fn();
			   }
		       });
	       }
	       function setupLoginButton(fn){
		   $("#btnLogin").off('click');
		   $("#btnLogin").click(fn);
	       }
	       function enableLoginButton(){
		   setupLoginButton(_.once(login));
	       }
	       function enableLoginViaEnter(){
		   onPressEnter(_.once(login));
	       }
	       function enableLogin(){
		   enableLoginViaEnter();
		   enableLoginButton();
	       }
	       function disableLogin(){
		   disableLoginViaEnter();
		   disableLoginButton();
	       }
	       function login() {
		       var id = $('#userID').val();
		       var pw = $('#password').val();
		       //try to login to couchdb
		       $.couch.login({name:id,password:pw,
				      success:function(response){
					  console.log("successful user login");
					  console.log(response);
					  window.location.href = "mainMenus.html";
				      },
				      error:function(response){
					  console.log("error logging in");
					  alert("logging in failed, please enter a correct admin user-name and password");
					  enableLogin();
				      }
				     });
		   };
	       IE7_fix();
	       updateTimeEverySecond();
	       enableLogin();
	       $("#userID").focus();
	   });

