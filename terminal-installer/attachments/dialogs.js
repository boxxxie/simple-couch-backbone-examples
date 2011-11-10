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
function CompanyInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    _.extend(this,DialogValidator());
    var d = $("#dialog-form");
    var user = d.find("#user"),
    password = d.find("#password"),
    companyName = d.find("#company-name"),
    firstname = d.find("#contact\\.firstname"),
    lastname = d.find("#contact\\.lastname"),
    website = d.find("#contact\\.website"),
    email = d.find("#contact\\.email"),
    phone = d.find("#contact\\.phone"),
    street0 = d.find("#address\\.street0"),
    street1 = d.find("#address\\.street1"),
    street2 = d.find("#address\\.street2"),
    city = d.find("#address\\.city"),
    province = d.find("#address\\.province"),
    country = d.find("#address\\.country"),
    postalcode = d.find("#address\\.postalcode"),
    operationalname = d.find("#operationalname"),

    
    requiredFields = $([])
	.add(user)
	.add(companyName)
	.add(operationalname)
	.add(password),
    
    allFields = $([])
    	.add(user)
	.add(companyName)
	.add(firstname)
	.add(lastname)
	.add(website)
	.add(email)
	.add(phone)
	.add(street0)
	.add(street1)
	.add(street2)
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
				 close: function() {
				     allFields.val("").removeClass( "ui-state-error" );
				     allFields.filter("input:checked").attr("checked",false);
				 },
				 buttons: {			 
				     Submit : function() {
				       	 var bValid = true;
				       	 var unfilledRequiredFields = checkRequiredFields(requiredFields);
					 requiredFields.removeClass( "ui-state-error" );

					 bValid = bValid && checkLength( user, "The Master User ID", 1, 8, updateTips(tips) );
					 bValid = bValid && checkLength( password, "The Master User Password", 1, 8 ,updateTips(tips));

					 if ( bValid && unfilledRequiredFields ) {
					     options.success({user:user.val(),
							      password:password.val(),
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
							      companyName:companyName.val()});
					     
					     $( this ).dialog( "close" );
					 } else if(bValid && !unfilledRequiredFields) {
					     handleMissingFields(requiredFields,updateTips(tips));
					 }		
				     },	
				     Cancel: function() {
					 $( this ).dialog( "close" );
				     }
				 }
			     });
    $("#"+attachTo).button().click(function() {
				       $("#dialog-form").dialog("open");
				   });
};
function newStoreDialogSetup (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    _.extend(this,DialogValidator());
    var d = $("#dialog-form");

    var user = d.find("#user"),
    password = d.find("#password"),
    storeName = d.find("#store-name"),
    storeNum = d.find("#store-num"),
    firstname = d.find("#contact\\.firstname"),
    lastname = d.find("#contact\\.lastname"),
    website = d.find("#contact\\.website"),
    email = d.find("#contact\\.email"),
    phone = d.find("#contact\\.phone"),
    street0 = d.find("#address\\.street0"),
    street1 = d.find("#address\\.street1"),
    street2 = d.find("#address\\.street2"),
    city = d.find("#address\\.city"),
    province = d.find("#address\\.province"),
    country = d.find("#address\\.country"),
    postalcode = d.find("#address\\.postalcode"),
 
    requiredFields = $([])
	.add(storeName)
	.add(storeNum)
	.add(user)
 	.add(password),
    
    allFields = $([])
	.add(user)
	.add(storeName)
	.add(storeNum)
	.add(firstname)
	.add(lastname)
	.add(website)
	.add(email)
	.add(phone)
	.add(street0)
	.add(street1)
	.add(street2)
 	.add(city)
	.add(province)
	.add(country)
	.add(postalcode)
	.add(password);
    
    var tips = $( ".validateTips" );
    
    d.dialog({
		 autoOpen: false,
		 height: 700,
		 width: 500,
		 modal: true,
		 buttons: {
		     "Submit": function() {
			 var bValid = true;
			 var unfilledRequiredFields = checkRequiredFields(requiredFields);
			 
			 requiredFields.removeClass( "ui-state-error" );
			 bValid = bValid && checkLength( user, "The Master User ID", 1, 8, updateTips(tips) );
			 bValid = bValid && checkLength( password, "The Master User Password", 1, 8 ,updateTips(tips));
			 bValid = bValid && checkRegexp( storeNum, /^([0-9])+$/i, "The Store Number may consist of Digits only.", updateTips(tips));
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
			     options.success({
						 user:user.val(),
						 password:password.val(),
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
						 creationdate:new Date(),
						 storeName:storeName.val(),
						 number:storeNum.val()   
					     });
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

    $("#"+attachTo).button().click(function() {
				       d.dialog( "open" );
				   });
};
function newTerminalDialogSetup (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    var d = $("#dialog-form");
    _.extend(this,DialogValidator());
    var id = d.find("#terminal-id"),
    areaCode = d.find("#areaCode"),
    postalCode = d.find("#postalCode"),
    countryCode = d.find("#countryCode"),
    cityCode = d.find("#cityCode"),
    storeCode = d.find("#storeCode"),
    companyCode = d.find("#companyCode"),
    
    requiredFields = $([])
	.add(id),

    allFields = $([])
	.add(id)
	.add(areaCode)
	.add(postalCode)
	.add(countryCode)
	.add(cityCode)
	.add(storeCode)
	.add(companyCode);

    var tips = $( ".validateTips" );

    d.dialog({
		 autoOpen: false,
		 height: 600,
		 width: 500,
		 modal: true,
		 buttons: {
		     "Submit": function() {
			 var bValid = true;
			 var unfilledRequiredFields=checkRequiredFields(requiredFields);
			 requiredFields.removeClass( "ui-state-error" );

			 if ( bValid && unfilledRequiredFields) {

			     options.success(
				 {
				     terminal_id:id.val(),
				     creationdate:new Date(),
				     installed:false,
				     areaCode:areaCode.val(),
				     postalCode:postalCode.val(),
				     countryCode:countryCode.val(),
				     cityCode:cityCode.val(),
				     storeCode:storeCode.val(),
				     companyCode:companyCode.val()
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

    $("#"+attachTo).button().click(function() {
				       d.dialog("open");
				   });
};
function GroupInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    _.extend(this,DialogValidator());
    var d = $("#dialog-form");
    var groupName = d.find("#group-name");
    var allFields = $([]).add(groupName);
    
    d.dialog({
		 autoOpen: false,
		 height: 400,
		 width: 500,
		 modal: true,
		 buttons: {
		     "Submit": function() {
			 options.success({
					     groupName:groupName.val(),
					     creationdate:new Date()}					
					);
			 
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

    $("#"+attachTo).button().click(function() {
				       d.dialog( "open" );
				   });
};
function quickViewDialog (html,options) {
    var form = $(html).find('fieldset');    	
    $("#dialog-quickView").html(form);
    $("#dialog-quickView").dialog({
		       autoOpen: false,
		       height: 400,
		       width: 500,
		       modal: true,
		       buttons: {
			   Cancel: function() {
			       $("#dialog-quickView").dialog('destroy');
			   }
		       },
		       close: function() {
			   $("#dialog-quickView").dialog('destroy');
		       }
		   });
    $("#dialog-quickView").dialog("open");
};

