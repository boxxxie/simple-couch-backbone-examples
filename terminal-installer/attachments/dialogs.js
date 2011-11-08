function newCompanyDialogSetup (options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    
    var name = $("#name"),
    password = $("#password"),
    companyName = $("#company-name"),
   
    street = $("#address\\.street"),
    city = $("#address\\.city"),
    province = $("#address\\.province"),
    country = $("#address\\.country"),
  
    centrallyControlledMenus = $("#centrally-controlled-menus"),
    allFields = $([])
	.add(name)
	.add(companyName)
	.add(street)
	.add(city)
	.add(province)
	.add(country)
	.add(centrallyControlledMenus)
	.add(password),
    tips = $( ".validateTips" );

    function updateTips( t ) {
	tips
	    .text( t )
	    .addClass( "ui-state-highlight" );
	setTimeout(function() {
		       tips.removeClass( "ui-state-highlight", 1500 );
		   }, 500 );
    }

    function checkLength( o, n, min, max ) {
	if ( o.val().length > max || o.val().length < min ) {
	    o.addClass( "ui-state-error" );
	    updateTips( "Length of " + n + " must be between " +
			min + " and " + max + "." );
	    return false;
	} else {
	    return true;
	}
    }

    function checkRegexp( o, regexp, n ) {
	if ( !( regexp.test( o.val() ) ) ) {
	    o.addClass( "ui-state-error" );
	    updateTips( n );
	    return false;
	} else {
	    return true;
	}
    }
    
    $("#dialog-form").dialog({
				   autoOpen: false,
				   height: 1000,
				   width: 500,
				   modal: true,
				   buttons: {
				       "Create the Company": function() {
					   var bValid = true;
					   allFields.removeClass( "ui-state-error" );
/*
					   bValid = bValid && checkLength( name, "username", 3, 16 );
					   bValid = bValid && checkLength( email, "email", 6, 80 );
					   bValid = bValid && checkLength( password, "password", 5, 16 );
					   bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
					   bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
*/
					   if ( bValid ) {
					       options.success({name:name.val(),
								password:password.val(),
								address : {street:street.val(),
									  city:city.val(),
									  country:country.val(),
									  province:province.val()},
								centrallyControlledMenus:centrallyControlledMenus.is(":checked"),
								companyName:companyName.val()});
					       //appends to a table on the webpage... need to make it give me it's data instead
					    /*   $( "#users tbody" ).append( "<tr>" +
									   "<td>" + name.val() + "</td>" + 
									   "<td>" + email.val() + "</td>" + 
									   "<td>" + password.val() + "</td>" +
									   "</tr>" );*/
					       
					       $( this ).dialog( "close" );
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
