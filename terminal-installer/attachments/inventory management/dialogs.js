var genericErrorClass = "ui-state-error";
var genericHighlightClass = "ui-state-highlight";

function jsPather(pathStr){
    //converts js obj notation into a path array
    return pathStr
	.replace(/\[/g,'.')
	.replace(/\]/g,'')
	.split(".");
};
function assignFromPath(obj,travel,assignVal){
    //walks a path defined by an array of fields, assigns a value to the last field walked
    if(_.isEmpty(travel)){
	obj = assignVal;
	return obj;
    }
    if(!obj){
	return null;
    }
    var prop = _.first(travel);
    obj[prop] = assignFromPath(obj[prop],_.rest(travel),assignVal);
    return obj;
};
//TODO: make the assignFromPath function create the obj structure for the path if it doesn't exist

function PostValidator($node,tips,validationResults) {
    function clearErrorsAndTips(){	
	tips.html("");
    }
    function tagFieldName($node,fieldName){
	function tagField($field){$field.addClass(genericErrorClass);}
	function tagID($node,field_id){tagField($node.find("#"+field_id));}
	return function(item){
	    tagID($node,item[fieldName]);
	};
    }
    var tag_fieldname_field = tagFieldName($node,'fieldname');
    function displayTip(tips,message){
	    $(tips).html(message);
	    $(tips).addClass(genericHighlightClass);
	    setTimeout(function() {$(tips).removeClass(genericHighlightClass, 1500 );}, 500 ); 
    };
    
    clearErrorsAndTips();
    var invalidsWithEmptyMessages = 
	_.filter(validationResults, 
		 function(validationResult){return validationResult.isInvalid && _.isEmpty(validationResult.errMsg);});
    var foundInvalidFieldWithMessage = 
	_.filter(validationResults, 
		 function(validationResult){return validationResult.isInvalid && !_.isEmpty(validationResult.errMsg);});

    if(!_.isEmpty(foundInvalidFieldWithMessage) && 
       _.isEmpty(invalidsWithEmptyMessages)){
	var tipMessage = ich.tips_TMP({tips: _.map(foundInvalidFieldWithMessage,function(invalid){return invalid.errMsg;})});
	_.each(foundInvalidFieldWithMessage,tag_fieldname_field);
	displayTip(tips,tipMessage);
    }
    else { 
	_.each(invalidsWithEmptyMessages,tag_fieldname_field);
	displayTip(tips,"The highlighted fields are required!");
    }	 
};

function InventoryItemCreateDialog (attachTo,options){
    _.extend(options,{clearOnExit:true, isCreate:true});
    InventoryItemInputDialog(attachTo,options);
};

function InventoryItemModifyDialog (attachTo,options){
    InventoryItemInputDialog(attachTo,options);
};

function InventoryItemInputDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $("#dialog:ui-dialog").dialog( "destroy" );
    var tips = $(".validateTips");
    var d = $("#dialog-form");
    var allFields = d.find('[var]');

    d.dialog(
	{
	    autoOpen: false,
	    height: 510,
	    width: 300,
	    modal: true,
	    close: function() {
		if(options.clearOnExit) {
		    allFields.val("").removeClass(genericErrorClass);
		}
	    },
	    buttons: {			 
		"Submit" : function() {
//		    var allFields = d.find('[var]');
		    var newInventoryItemData = {
		    							description:d.find("#description").val(),
		    							category:d.find("#category").val(),
		    							location:{company:d.find("#location\\.company").val(), 
		    										group:d.find("#location\\.group").val(), 
		    										store:d.find("#location\\.store").val()},
		    							apply_taxes:{tax1:d.find("#apply_taxes\\.tax1").is(":checked"),
		    										 tax2:d.find("#apply_taxes\\.tax2").is(":checked"),
		    										 tax3:d.find("#apply_taxes\\.tax3").is(":checked"),
		    										 exemption:d.find("#apply_taxes\\.exemption").is(":checked")},
		    							price:{selling_price:d.find("#selling_price").val(),
		    									standard_price:d.find("#standard_price").val()}
		    							};

		    var newInventoryItemData_w_options = _.clone(newInventoryItemData);

		    if(options.isCreate) {
			_.extend(newInventoryItemData, {creationdate:new Date()});
			_.extend(newInventoryItemData_w_options, {isCreate:options.isCreate});
		    }
		    
		    var validator = options.validator;
		    if(validator){
			var validationResults = validator(newInventoryItemData_w_options);
		    }

		    var passedValidation;
		    (_.isEmpty(validationResults))?passedValidation=true:passedValidation=false;
		    allFields.removeClass(genericErrorClass);

		    if (passedValidation) {
			options.success(newInventoryItemData);
			allFields.val("");
			d.dialog("close");
		    }
		    else{
			PostValidator(d,tips,validationResults);
		    } 
		},	
		Cancel: function() {
		    d.dialog("close");
		}
	    }
	});


    $("#"+attachTo).button().click(function() {
				       d.dialog("open");
				   });
};