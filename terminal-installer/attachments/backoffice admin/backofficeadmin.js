function doc_setup() {
	getDate();
	$("#password")
    .keyup(function(event){
	if(event.keyCode == 13){
	    login();
	}
    });
	$("#userID").focus();
}


function login() {
	var id = document.getElementById('userID').value;
	var pw = document.getElementById('password').value;
	if(id=="admin" && pw=="1") {
	    location.href = "mainMenus.html"
	} else {
	    alert("wrong")
	}
}

function getDate() {
    //var date = new Date();
    //document.formLogin.txtDate.value = date;
    //return date;
    $(document).everyTime("1s", function(){
	var date = new Date();
	$("#txtDate").val(date.toLocaleDateString());
	$("#txtTime").val(date.toLocaleTimeString());
    }, 0);
}


