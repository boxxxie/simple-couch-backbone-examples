function DialogValidator(){
    return {
	updateTips:function(tips){
	    return function (tipText) {
		tips.text(tipText).addClass( "ui-state-highlight" );
		setTimeout(function() {tips.removeClass( "ui-state-highlight", 1500 );}, 500 );
	    };
	},
	checkLength:function( o, n, min, max, updateTips ) {
	    if ( o.val().length > max || o.val().length < min ) {
		o.addClass( "ui-state-error" );
		updateTips( "Length of " + n + " must be between " +
			    min + " and " + max + "." );
		return false;
	    } else {
		return true;
	    }
	},
	checkRegexp:function( o, regexp, n , updateTips) {
	    if(_.isEmpty(o.val()))return true; //accept empty strings
	    if ( !( regexp.test( o.val() ) ) ) {
		o.addClass( "ui-state-error" );
		updateTips( n );
		return false;
	    } else {
		return true;
	    }
	},
	checkRequiredFields:function(fields) {
	    return !_.any(fields, function(field) {return _.isEmpty($(field).val());});	
	},
	missingRequiredFields:function(fields) {
	    return _.filter(fields, function(field) {return _.isEmpty($(field).val());});	
	},
	handleMissingFields:function(fields,updateTips){
	    _.each(missingRequiredFields(fields),
		   function(el){
		       $(el).addClass( "ui-state-error" );
		       updateTips("The highlighted fields are required!");});
	}
    };
};

function newCompanyDialogSetup (options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    _.extend(this,DialogValidator());
   /* var user = $("#user"),
    password = $("#password"),
    companyName = $("#company-name"),
    contact = $("#contact"),
    street = $("#address\\.street"),
    city = $("#address\\.city"),
    province = $("#address\\.province"),
    country = $("#address\\.country"),
    centrallyControlledMenus = $("#centrally-controlled-menus"),*/
	var user = $("#user"),
	password = $("#password"),
	companyName = $("#company-name"),
	//contact = $("#contact"),
	firstname = $("#contact\\.firstname"),
	lastname = $("#contact\\.lastname"),
	website = $("#contact\\.website"),
	email = $("#contact\\.email"),
	phone = $("#contact\\.phone"),
	street0 = $("#address\\.street0"),
	street1 = $("#address\\.street1"),
	street2 = $("#address\\.street2"),
	city = $("#address\\.city"),
	province = $("#address\\.province"),
	country = $("#address\\.country"),
	postalcode = $("#address\\.postalcode"),
	operationalname = $("#operationalname"),
	//creationdate = new Date(),
				
    requiredFields = $([])
	.add(user)
	.add(companyName)
	//.add(contact)
	.add(firstname)
	.add(lastname)
	.add(website)
	.add(email)
	.add(phone)
	.add(street0)
	.add(street1)
	.add(street2)
	//.add(street)
	.add(city)
	.add(province)
	.add(country)
	.add(postalcode)
	.add(operationalname)
	.add(password),
    
    allFields = $([])
    	.add(user)
	.add(companyName)
	//.add(contact)
	.add(firstname)
	.add(lastname)
	.add(website)
	.add(email)
	.add(phone)
	.add(street0)
	.add(street1)
	.add(street2)
	//.add(street)
	.add(city)
	.add(province)
	.add(country)
	.add(postalcode)
	.add(operationalname)
	.add(password);

    var tips = $( ".validateTips" );
    
    $("#dialog-form").dialog({
				 autoOpen: false,
				 height: 900,
				 width: 500,
				 modal: true,
				 buttons: {
				     "Create the Company": function() {
				       	 var bValid = true;
				       	 var unfilledRequiredFields = checkRequiredFields(requiredFields);
					 requiredFields.removeClass( "ui-state-error" );

					 bValid = bValid && checkLength( user, "The Master User ID", 1, 8, updateTips(tips) );
					 bValid = bValid && checkLength( password, "The Master User Password", 1, 8 ,updateTips(tips));

/*
					 bValid = bValid && checkLength( companyName, "The Company Name", 3, 64, updateTips(tips) );
					 bValid = bValid && checkRegexp( companyName, /^[a-z]([0-9a-z_])+$/i, "The Company Name may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
					 bValid = bValid && checkLength( user, "The Master User ID", 1, 8, updateTips(tips) );
					 bValid = bValid && checkRegexp( user, /^[a-z]([0-9a-z_])+$/i, "The Master User ID may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
					 bValid = bValid && checkLength( password, "The Master User Password", 10, 256 ,updateTips(tips));
					 bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "The Master Password field only allow : a-z 0-9", updateTips(tips));
*/
					 if ( bValid && unfilledRequiredFields ) {
					     options.success({user:user.val(),
									    password:password.val(),
									    //contact:contact.val(),
									    contact:{firstname : firstname.val(),
									    		 lastname : lastname.val(),
									    		 website : website.val(),
									    		 email : email.val(),
									    		 phone : phone.val()},
									    address:{street0:street0.val(),
									    		 street1:street1.val(),
									    		 street2:street2.val(),
											     city:city.val(),
											     country:country.val(),
											     province:province.val(),
											     postalcode:postalcode.val()},
										 operationalname:operationalname.val(),
										 creationdate:new Date(),					
								    	 _id:companyName.val()});
					     
					     $( this ).dialog( "close" );
					 } else if(bValid && !unfilledRequiredFields) {
					     handleMissingFields(requiredFields,updateTips(tips));
					 }		
				     },		
				     Cancel: function() {
					 $( this ).dialog( "close" );
				     }
				 },
				 close: function() {
				     allFields.val("").removeClass( "ui-state-error" );
				     allFields.filter("input:checked").attr("checked",false);
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
    _.extend(this,DialogValidator());
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
    

    requiredFields = $([])
	.add(user)
	.add(password)
	.add(storeName)
	.add(storeNum)

	.add(contact)
	.add(street)
	.add(city)
	.add(province)
	.add(country),
    
    allFields = $([])
	.add(user)
	.add(password)
	.add(storeName)
	.add(storeNum)
	.add(mobQRedits)
	.add(autoPayment)
	.add(contact)
	.add(street)
	.add(city)
	.add(province)
	.add(country);
    
    var tips = $( ".validateTips" );
    
    $("#dialog-form").dialog({
				 autoOpen: false,
				 height: 700,
				 width: 500,
				 modal: true,
				 buttons: {
				     "Create the Store": function() {
					 var bValid = true;
					 var unfilledRequiredFields = checkRequiredFields(requiredFields);
					 
					 requiredFields.removeClass( "ui-state-error" );
					 bValid = bValid && checkLength( user, "The Master User ID", 1, 8, updateTips(tips) );
					 bValid = bValid && checkLength( password, "The Master User Password", 1, 8 ,updateTips(tips));
			/*		 
					 bValid = bValid && checkLength( storeName, "The Store Name", 3, 64, updateTips(tips) );
					 bValid = bValid && checkRegexp( storeName, /^[a-z]([0-9a-z_])+$/i, "The Store Name may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
					 bValid = bValid && checkRegexp( storeNum, /^([0-9])+$/i, "The Store Number may consist of Digits only.", updateTips(tips));
					 bValid = bValid && checkLength( user, "The Master User ID", 3, 64, updateTips(tips) );
					 bValid = bValid && checkRegexp( user, /^[a-z]([0-9a-z_])+$/i, "The Master User ID may consist of a-z, 0-9, underscores, begin with a letter.", updateTips(tips));
					 bValid = bValid && checkLength( password, "The Master User Password", 10, 256 ,updateTips(tips));
					 bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "The Master Password field only allow : a-z 0-9", updateTips(tips) );
			*/		 
					 if ( bValid && unfilledRequiredFields) {
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
					 }else if(bValid && !unfilledRequiredFields) {
					     handleMissingFields(requiredFields,updateTips(tips));
					 }
				     },
				     Cancel: function() {
					 $( this ).dialog( "close" );
				     }
				 },
				 close: function() {
				     allFields.val("").removeClass( "ui-state-error" );
				     allFields.filter("input:checked").attr("checked",false);
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
     _.extend(this,DialogValidator());
    var id = $("#terminal-id"),
    mobilePayment = $("#mobile-payment"),
    debitPayment = $("#debit-payment"),
    creditPayment = $("#credit-payment"),
    bonusCodes = $("#bonus-codes"),
    convertPercentage = $("#convert-percentage"),

    requiredFields = $([])
	.add(id),

    allFields = $([])
	.add(id)
	.add(mobilePayment)
	.add(debitPayment)
	.add(creditPayment)
	.add(bonusCodes)
	.add(convertPercentage);
     
    var tips = $( ".validateTips" );

    $("#dialog-form").dialog({
				 autoOpen: false,
				 height: 600,
				 width: 500,
				 modal: true,
				 buttons: {
				     "Create the Terminal": function() {
					 var bValid = true;
					 var unfilledRequiredFields=checkRequiredFields(requiredFields);
					 requiredFields.removeClass( "ui-state-error" );
/*
					 bValid = bValid && checkRegexp( id, /^([0-9a-zA-Z]?[0-9a-zA-Z_]+)$/i, 
									 "The Terminal ID can only consist of digits letters and underscores, and can not start with an underscore", 
									 updateTips(tips));
					 bValid = bValid && checkRegexp( bonusCodes, /^(([0-9a-zA-Z][0-9a-zA-Z_]*)([,][0-9a-zA-Z][0-9a-zA-Z_]*)*)$/i,
									 "MobQRedits Bonus Codes need to be in the form of 'code,code,code' and can not start with an underscore", 
									 updateTips(tips));
					 bValid = bValid && checkRegexp( convertPercentage, /^(\.[0-9]+)$/i, "MobQRedits Conversion Percentage need to be in the form of '.###'", updateTips(tips));
*/
					 if ( bValid && unfilledRequiredFields) {
					     var userBonusCodes;
					     (bonusCodes.val())?userBonusCodes = _.unique(bonusCodes.val().split(',')):userBonusCodes = null;
					     options.success(
						 {id:id.val(),
						  mobilePayment:mobilePayment.is(":checked"),
						  debitPayment:debitPayment.is(":checked"),
						  creditPayment: creditPayment.is(":checked"),
						  mobQRedits : {bonusCodes:userBonusCodes,
								convertPercentage:convertPercentage.val()}
						 });
					     
					     $( this ).dialog( "close" );
					 } else if(bValid && !unfilledRequiredFields) {
					     handleMissingFields(requiredFields,updateTips(tips));
					 }
				     },
				     Cancel: function() {
					 $( this ).dialog( "close" );
				     }
				 },
				 close: function() {
				     allFields.val("").removeClass( "ui-state-error" );
				     allFields.filter("input:checked").attr("checked",false);
				 }
			     });

    $( "#create-terminal" )
	.button()
	.click(function() {
		   $( "#dialog-form" ).dialog( "open" );
	       });
};

/*
function CompanyViewDialogSetup (options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    _.extend(this,DialogValidator());

	var user = $("#user"),
	password = $("#password"),
	companyName = $("#company-name"),
	//contact = $("#contact"),
	firstname = $("#contact\\.firstname"),
	lastname = $("#contact\\.lastname"),
	website = $("#contact\\.website"),
	email = $("#contact\\.email"),
	phone = $("#contact\\.phone"),
	street0 = $("#address\\.street0"),
	street1 = $("#address\\.street1"),
	street2 = $("#address\\.street2"),
	city = $("#address\\.city"),
	province = $("#address\\.province"),
	country = $("#address\\.country"),
	postalcode = $("#address\\.postalcode"),
	operationalname = $("#operationalname");
	//creationdate = new Date(),
				
    
    
    $("#dialog-form").dialog({
				 autoOpen: false,
				 height: 900,
				 width: 500,
				 modal: true,
				 buttons: {
				     "Create the Company": function() {
					     options.success({user:user.val(),
									    password:password.val(),
									    //contact:contact.val(),
									    contact:{firstname : firstname.val(),
									    		 lastname : lastname.val(),
									    		 website : website.val(),
									    		 email : email.val(),
									    		 phone : phone.val()},
									    address:{street0:street0.val(),
									    		 street1:street1.val(),
									    		 street2:street2.val(),
											     city:city.val(),
											     country:country.val(),
											     province:province.val(),
											     postalcode:postalcode.val()},
										 operationalname:operationalname.val(),
										 creationdate:new Date(),					
								    	 _id:companyName.val()});
					     
					     $( this ).dialog( "close" );
				     },		
				     Cancel: function() {
					 $( this ).dialog( "close" );
				     }
				 },
				 close: function() {
				     allFields.val("").removeClass( "ui-state-error" );
				     allFields.filter("input:checked").attr("checked",false);
				 }
			     });

    $( "#create-company" )
	.button()
	.click(function() {
		   $( "#dialog-form" ).dialog( "open" );
	       });
};
*/