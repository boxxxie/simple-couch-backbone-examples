
function PostValidator(allFields, results) {
	 //var foundInvalidFields = _.filter(results, function(result){ return result.isInvalid == true; });
	 //$("#"+field.fieldname).addClass( "ui-state-error" );
	// _.each(allFields, 
	//	 function(field){
	//	  field.removeClass( "ui-state-error" );
	//	  });
	allFields.removeClass("ui-state-error");
	 var tips = $( ".validateTips" );
	 tips.text("");
	 var foundEmptyFields = _.filter(results, function(result){ return result.isInvalid == true && result.errMsg == "EMPTY"; });
	 if(foundEmptyFields.length==0) {
		 var foundInvalidField = _.find(results, function(result){ return result.isInvalid == true; });
		 if(!foundInvalidField) {
			 return true;		 
		 } else {
			 //var tips = $( ".validateTips" );
			 $("#"+foundInvalidField.fieldname).addClass( "ui-state-error" );
			 tips.text(foundInvalidField.errMsg).addClass( "ui-state-highlight" );
			 setTimeout(function() {tips.removeClass( "ui-state-highlight", 1500 );}, 500 );
			 return false;
		 }
	 } else {
		 _.each(foundEmptyFields, 
		 function(field){
		  $("#"+field.fieldname).addClass( "ui-state-error" );
		  tips.text("The highlighted fields are required!").addClass( "ui-state-highlight" );
		  setTimeout(function() {tips.removeClass( "ui-state-highlight", 1500 );}, 500 );
		  });
		  return false;
	 }
	 
};

function CompanyCreateDialog (attachTo,options){
    _.extend(options,{clearOnExit:true, isCreate:true});
    CompanyInputDialog(attachTo,options);
};
function CompanyModifyDialog (attachTo,options){
    CompanyInputDialog(attachTo,options);
};
function GroupCreateDialog (attachTo,options){
    _.extend(options,{clearOnExit:true, isCreate:true});
    GroupInputDialog(attachTo,options);
};
function GroupModifyDialog (attachTo,options){
	//options.isCreate, options.groupName
	_.extend(options,{isCreate:false});
    GroupInputDialog(attachTo,options);
};
function StoreCreateDialog (attachTo,options){
    _.extend(options,{clearOnExit:true, isCreate:true});
    StoreInputDialog(attachTo,options);
};
function StoreModifyDialog (attachTo,options){
	_.extend(options,{isCreate:false});
    StoreInputDialog(attachTo,options);
};
function TerminalCreateDialog (attachTo,options){
    _.extend(options,{clearOnExit:true, isCreate:true});
    TerminalInputDialog(attachTo,options);
};
function TerminalModifyDialog (attachTo,options){
    TerminalInputDialog(attachTo,options);
};
function CompanyInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    //_.extend(this,DialogValidator());
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

    
   // requiredFields = $([])
	//.add(user)
	//.add(companyName)
	//.add(operationalname)
	//.add(password),
    
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

    //var tips = $( ".validateTips" );
    
    $("#dialog-form").dialog({
				 autoOpen: false,
				 height: 900,
				 width: 500,
				 modal: true,
				 close: function() {
				 	if(options.clearOnExit) {
				 	 allFields.val("").removeClass( "ui-state-error" );
				     allFields.filter("input:checked").attr("checked",false);
				    }
				 },
				 buttons: {			 
				     Submit : function() {
				       	 var bValid = true;
				       	 
				 var newCompanyData = {user:user.val(),
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
							      //creationdate:new Date(),					
							      companyName:companyName.val()};
					 var newCompanyData_w_options = _.clone(newCompanyData);
					 if(options.isCreate) {
						_.extend(newCompanyData, {creationdate:new Date()});
						_.extend(newCompanyData_w_options, {isCreate:options.isCreate});
					 }

					 var results = options.validator(newCompanyData_w_options);
					 bValid = PostValidator(allFields, results);

					 if (bValid) {
					     options.success(newCompanyData);
					     
					     allFields.val("").removeClass("ui-state-error");
					     $(this).dialog("close");
					 } 
					 //else if(bValid && !unfilledRequiredFields) {
					 //    handleMissingFields(requiredFields,updateTips(tips));
					 //}		
				     },	
				     Cancel: function() {
					 $(this).dialog("close");
				     }
				 }
			     });


    $("#"+attachTo).button().click(function() {
				       $("#dialog-form").dialog("open");
				   });
};
function GroupInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    var d = $("#dialog-form");
    var groupName = d.find("#group-name"),
    user = d.find("#user"),
    password = d.find("#password"),
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


    allFields = $([])
	.add(groupName)
   	.add(user)
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
    
    //var tips = $( ".validateTips" );
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 900,
	 width: 500,
	 modal: true,
	 close: function() {
	     if(options.clearOnExit) {
		 allFields.val("").removeClass( "ui-state-error" );
		 allFields.filter("input:checked").attr("checked",false);
	     }
	 },
	 buttons: {
	     "Submit": function() {
		 var bValid = true;

		 var newGroupData = {user:user.val(),
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
				      groupName:groupName.val(),
				      };
		 var newGroupData_w_options = _.clone(newGroupData);

		 if(options.isCreate) {
			_.extend(newGroupData, {creationdate:new Date()});
			_.extend(newGroupData_w_options, {isCreate:options.isCreate});
		 }


		 var results = options.validator(newGroupData_w_options);
		 var bValid = PostValidator(allFields, results);

		 if(bValid) {
			 options.success(newGroupData);
			 allFields.val("").removeClass( "ui-state-error" );
		     d.dialog("close");
		 }

	     },		
	     Cancel: function() {
		 d.dialog("close");
	     }
	 }
	},_.clone(options));
    
    d.dialog(dialogOptions);
    $("#"+attachTo).button().click(function() {
				       d.dialog( "open" );
				   });
};
function StoreInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
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
    
    d.dialog({
		 autoOpen: false,
		 height: 700,
		 width: 500,
		 modal: true,
		 buttons: {
		     "Submit": function() {
			 var bValid = true;

			 var newStoreData = {
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
						 //creationdate:new Date(),
						 storeName:storeName.val(),
						 number:storeNum.val()   
					     };
			var newStoreData_w_options = _.clone(newStoreData);

			if(options.isCreate) {
				_.extend(newStoreData, {creationdate:new Date()});
				_.extend(newStoreData_w_options, {isCreate:options.isCreate});
			}

			var results = options.validator(newStoreData_w_options);
			var bValid = PostValidator(allFields, results);

			 if ( bValid) {
			     options.success(newStoreData);
			     allFields.val("").removeClass("ui-state-error");
		     	     allFields.filter("input:checked").attr("checked",false);
			     $(this).dialog("close");
			 }
			 
		     },
		     Cancel: function() {
			 $(this).dialog("close");
		     }
		 },
		 close: function() {
		 	if(options.clearOnExit) {
		 	 allFields.val("").removeClass( "ui-state-error" );
		     allFields.filter("input:checked").attr("checked",false);
		    }
		 }
	     });

    $("#"+attachTo).button().click(function() {
				       d.dialog( "open" );
				   });
};
function TerminalInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $( "#dialog:ui-dialog" ).dialog( "destroy" );
    var d = $("#dialog-form");
 //   _.extend(this,DialogValidator());
    var label = d.find("#terminal-id"),
    areaCode = d.find("#areaCode"),
    postalCode = d.find("#postalCode"),
    countryCode = d.find("#countryCode"),
    cityCode = d.find("#cityCode"),
    storeCode = d.find("#storeCode"),
    companyCode = d.find("#companyCode"),
    
 //   requiredFields = $([])
//	.add(label),

    allFields = $([])
	.add(label)
	.add(areaCode)
	.add(postalCode)
	.add(countryCode)
	.add(cityCode)
	.add(storeCode)
	.add(companyCode);

    var tips = $( ".validateTips" );

    d.dialog(
	{autoOpen: false,
	 height: 600,
	 width: 500,
	 modal: true,
	 close: function() {
	     if(options.clearOnExit) {
		 allFields.val("").removeClass( "ui-state-error" );
		 allFields.filter("input:checked").attr("checked",false);
	     }
	 },
	 buttons: {
	     "Submit": function() {
		 var bValid = true;
		 //var unfilledRequiredFields=checkRequiredFields(requiredFields);
		 //requiredFields.removeClass( "ui-state-error" );
		 var newTerminalData = {
			     terminal_label:label.val(),
			     //creationdate:new Date(),
			     //installed:false,
			     areaCode:areaCode.val(),
			     postalCode:postalCode.val(),
			     countryCode:countryCode.val(),
			     cityCode:cityCode.val(),
			     storeCode:storeCode.val(),
			     companyCode:companyCode.val()
			 };

		var newTerminalData_w_options = _.clone(newTerminalData);
		 if(options.isCreate) {
			_.extend(newTerminalData, {creationdate:new Date(), installed:false});
			_.extend(newTerminalData_w_options, {isCreate:options.isCreate});
		 }

		 var results = options.validator(newTerminalData_w_options);
		 bValid = PostValidator(allFields, results);

		 if ( bValid) {
		     options.success(newTerminalData);
		     allFields.val("").removeClass( "ui-state-error" );
		     allFields.filter("input:checked").attr("checked",false);
		     $(this).dialog("close");
		 } 
		 //else if(bValid && !unfilledRequiredFields) {
		 //    handleMissingFields(requiredFields,updateTips(tips));			 
		 //}
	     },
	     Cancel: function() {
		 $(this).dialog("close");
	     }
	 }
	});

    $("#"+attachTo).button().click(function() {
				       d.dialog("open");
				   });
};

function quickViewDialog (html,options) {
    var form = $(html).filter('fieldset');
    var d = $("#dialog-quickView");    	
    d.html(form);
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 400,
	 width: 500,
	 modal: true,
	 buttons: {
	     Cancel: function() {
		 d.dialog('destroy');
	     }
	 },
	 close: function() {
	     d.dialog('destroy');
	 }
	},_.clone(options));
    d.dialog(dialogOptions);
    d.dialog("open");
};

