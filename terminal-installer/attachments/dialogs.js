function updateTips(tips){
    return function (t) {
	tips.text( t ).addClass( "ui-state-highlight" );
	setTimeout(function() {tips.removeClass( "ui-state-highlight", 1500 );}, 500 );
    };
}

function checkLength( o, n, min, max, updateTips ) {
    if ( o.val().length > max || o.val().length < min ) {
	o.addClass( "ui-state-error" );
	updateTips( "Length of " + n + " must be between " +
		    min + " and " + max + "." );
	return false;
    } else {
	return true;
    }
}

function checkRegexp( o, regexp, n , updateTips) {
    if ( !( regexp.test( o.val() ) ) ) {
	o.addClass( "ui-state-error" );
	updateTips( n );
	return false;
    } else {
	return true;
    }
}
function checkRequiredFields(fields) {
	return !_.any(fields, function(field) { 
							       var val = $(field).val();
							       return val=="";
							   });	
}
function newCompanyDialogSetup (options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    
    var user = $("#user"),
    password = $("#password"),
    companyName = $("#company-name"),
    contact = $("#contact"),
    street = $("#address\\.street"),
    city = $("#address\\.city"),
    province = $("#address\\.province"),
    country = $("#address\\.country"),
    centrallyControlledMenus = $("#centrally-controlled-menus"),

    allFields = $([])
	.add(user)
	.add(companyName)
	.add(contact)
	.add(street)
	.add(city)
	.add(province)
	.add(country)
//	.add(centrallyControlledMenus)
	.add(password),
    tips = $( ".validateTips" );
   
    $("#dialog-form").dialog({
				   autoOpen: false,
				   height: 900,
				   width: 500,
				   modal: true,
				   buttons: {
				       "Create the Company": function() {
				       	var bValid = true;
				       	
				       //if(user.val()=="" || password.val()=="" || contact.val()=="" ||
				       //		street.val()=="" || city.val()=="" || country.val()=="" ||
				       //		province.val()=="" || companyName.val()==""){bValid=false;}
				   

					   var requiredFields = checkRequiredFields(allFields);
					   allFields.removeClass( "ui-state-error" );

					   bValid = bValid && checkLength( companyName, "The Company Name", 3, 64, updateTips(tips) );
					   bValid = bValid && checkRegexp( companyName, /^[a-z]([0-9a-z_])+$/i, "The Company Name may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
					   bValid = bValid && checkLength( user, "The Master User ID", 3, 64, updateTips(tips) );
					   bValid = bValid && checkRegexp( user, /^[a-z]([0-9a-z_])+$/i, "The Master User ID may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
					   bValid = bValid && checkLength( password, "The Master User Password", 10, 256 ,updateTips(tips));
					   bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "The Master Password field only allow : a-z 0-9", updateTips(tips) );

					   if ( bValid && requiredFields ) {
					       options.success({user:user.val(),
								password:password.val(),
								contact:contact.val(),
								address : {street:street.val(),
									  city:city.val(),
									  country:country.val(),
									  province:province.val()},
								centrallyControlledMenus:centrallyControlledMenus.is(":checked"),
								_id:companyName.val()});
					       
					       $( this ).dialog( "close" );
					   } else if(bValid && !requiredFields) {
					   		alert("All fields are required!");
					   }		
				     },		
				       Cancel: function() {
					   $( this ).dialog( "close" );
				       }
				   },
				   close: function() {
				       allFields.val("").removeClass( "ui-state-error" );
				   }
			       });

    $( "#create-company" )
	.button()
	.click(function() {
		   $( "#dialog-form" ).dialog( "open" );
	       });
};
function newStoreDialogSetup (options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    
    var user = $("#user"),
    password = $("#password"),
    storeName = $("#store-name"),
    storeNum = $("#store-num"),
    contact = $("#contact"),
    street = $("#address\\.street"),
    city = $("#address\\.city"),
    province = $("#address\\.province"),
    country = $("#address\\.country"),
    mobQRedits = $("#mobQRedits"),
    autoPayment = $("#automated-payment"),
    

    

    allFields = $([])
	.add(user)
	.add(password)
	.add(storeName)
	.add(storeNum)
//	.add(mobQRedits)
//	.add(autoPayment)
	.add(contact)
	.add(street)
	.add(city)
	.add(province)
	.add(country),
    
    tips = $( ".validateTips" );
    
    $("#dialog-form").dialog({
				   autoOpen: false,
				   height: 700,
				   width: 500,
				   modal: true,
				   buttons: {
				   "Create the Store": function() {
				   var bValid = true;
				   //if(user.val()=="" || password.val()=="" || contact.val()=="" ||
				   //		street.val()=="" || city.val()=="" || country.val()=="" ||
				   //		province.val()=="" || storeName.val()=="" || storeNum.val()=="") {bValid=false}
				   //bValid = !(_.any(allFields, function(field) { return field.val()=="" }))
				   var requiredFields = checkRequiredFields(allFields);
				   
				   allFields.removeClass( "ui-state-error" );
					
				   bValid = bValid && checkLength( storeName, "The Stroe Name", 3, 64, updateTips(tips) );
				   bValid = bValid && checkRegexp( storeName, /^[a-z]([0-9a-z_])+$/i, "The Store Name may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
				   bValid = bValid && checkLength( user, "The Master User ID", 3, 64, updateTips(tips) );
				   bValid = bValid && checkRegexp( user, /^[a-z]([0-9a-z_])+$/i, "The Master User ID may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
				   bValid = bValid && checkLength( password, "The Master User Password", 10, 256 ,updateTips(tips));
				   bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "The Master Password field only allow : a-z 0-9", updateTips(tips) );
				
				   if ( bValid ) {
				       options.success({user:user.val(),
							password:password.val(),
							contact:contact.val(),
							address : {street:street.val(),
								  city:city.val(),
								  country:country.val(),
								  province:province.val()},
							mobQRedits:mobQRedits.is(":checked"),
				        autoPayment:autoPayment.is(":checked"),
						name:storeName.val(),
					       number:storeNum.val()});
				   
				   $( this ).dialog( "close" );
				   }else if(bValid && !requiredFields) {
				   		alert("All fields are required!");
				   }
				    },
				       Cancel: function() {
					   $( this ).dialog( "close" );
				       }
				   },
				   close: function() {
				       allFields.val("").removeClass( "ui-state-error" );
				   }
			       });

    $( "#create-store" )
	.button()
	.click(function() {
		   $( "#dialog-form" ).dialog( "open" );
	       });
};
function newTerminalDialogSetup (options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    
    var id = $("#terminal-id"),
    mobilePayment = $("#mobile-payment"),
    debitPayment = $("#debit-payment"),
    creditPayment = $("#credit-payment"),
    bonusCodes = $("#bonus-codes"),
    convertPercentage = $("#convert-percentage"),

    allFields = $([])
	.add(id);
//	.add(mobilePayment)
//	.add(debitPayment)
//	.add(creditPayment)
//	.add(bonusCodes)
//	.add(convertPercentage);

    
    tips = $( ".validateTips" );

   
    $("#dialog-form").dialog({
				   autoOpen: false,
				   height: 500,
				   width: 500,
				   modal: true,
				   buttons: {
				       "Create the Terminal": function() {
					   var bValid = true;
					   var requiredFields=checkRequiredFields(allFields);
					   allFields.removeClass( "ui-state-error" );
/*
					   bValid = bValid && checkLength( name, "username", 3, 16 );
					   bValid = bValid && checkLength( email, "email", 6, 80 );
					   bValid = bValid && checkLength( password, "password", 5, 16 );
					   bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
					   bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
*/
					   if ( bValid ) {
					       var userBonusCodes;
					       (bonusCodes.val())?userBonusCodes = _.flatten(bonusCodes.val().split(',')):userBonusCodes = null;
					       options.success(
						   {id:id.val(),
						    mobilePayment:mobilePayment.is(":checked"),
						    debitPayment:debitPayment.is(":checked"),
						    creditPayment: creditPayment.is(":checked"),
						    mobQRedits : {bonusCodes:userBonusCodes,
								  convertPercentage:convertPercentage.val()}
						   });
					       
					       $( this ).dialog( "close" );
					   } else if(bValid && !requiredFields) {
					   		alert("All fields are required!");
				       }
				       },
				       Cancel: function() {
					   $( this ).dialog( "close" );
				       }
				   },
				   close: function() {
				       allFields.val("").removeClass( "ui-state-error" );
				   }
			       });

    $( "#create-terminal" )
	.button()
	.click(function() {
		   $( "#dialog-form" ).dialog( "open" );
	       });
};
