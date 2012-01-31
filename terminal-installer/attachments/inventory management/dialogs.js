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
    var prop = _.first(travel);
    //walks a path defined by an array of fields, assigns a value to the last field walked
    //creates a path if one does not exist
    if(_.isEmpty(travel)){
	obj = assignVal;
	return obj;
    }
    else if(obj && !obj[prop]){
	obj[prop] = {};
    }
    if(!obj){return null;}
    obj[prop] = assignFromPath(obj[prop],_.rest(travel),assignVal);
    return obj; 
};

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
		 function(validationResult){return validationResult.isInvalid && 
					    _.isEmpty(validationResult.errMsg);});
    var foundInvalidFieldWithMessage = 
	_.filter(validationResults, 
		 function(validationResult){return validationResult.isInvalid && 
					    !_.isEmpty(validationResult.errMsg);});

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
		    var newInventoryItemData = {};
		    _(allFields).chain()
			.map(function(el) {
				 var $el = $(el);
				 if($el.is(':checkbox')){
				     return [jsPather($el.attr('var')),$el.is(':checked')];
				 }
				 return [jsPather($el.attr('var')),$el.val()];
			     })
			.each(function(keyVal){
				  newInventoryItemData = assignFromPath(newInventoryItemData,_.first(keyVal),_.last(keyVal));
			      });
		    
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