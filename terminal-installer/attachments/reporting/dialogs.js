
/********************* management page and groups/stores/terminals table quickview dialog ************/
function quickReportViewDialog (html,options) {
	var form = $(html).filter('#cashoutdialog');
    var d = $("#dialog-quickView");    	
    d.html(form);
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 550,
	 width: 750,
	 modal: true,
	 buttons: {
	     "Close": function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};

function quickReportView(id, title){
    cashoutFetcher(id,
    		   function(for_TMP){
    		       var datamtd = _(for_TMP.mtd).chain()
			   .map(function(val,key){
				    val = Number(val);
				    return [key,val];
				})
			   .toObject()
			   .value();
		       var dataytd = _(for_TMP.ytd).chain()
			   .map(function(val,key){
				    val = Number(val);
				    return [key,val];
				})
			   .toObject()
			   .value();
		       var datayesterday = _(for_TMP.yesterday).chain()
			   .map(function(val,key){
				    val = Number(val);
				    return [key,val];
				})
			   .toObject()
			   .value();
    		       
    		       for_TMP.mtd = datamtd;
    		       for_TMP.ytd = dataytd;
    		       for_TMP.yesterday = datayesterday;
    		       
    		       var yesterday_noofsale = Number(for_TMP.yesterday.noofsale)+"";
    		       var yesterday_noofrefund = Number(for_TMP.yesterday.noofrefund)+"";
    		       var mtd_noofsale = Number(for_TMP.mtd.noofsale)+"";
    		       var mtd_noofrefund = Number(for_TMP.mtd.noofrefund)+"";
    		       var ytd_noofsale = Number(for_TMP.ytd.noofsale)+"";
    		       var ytd_noofrefund = Number(for_TMP.ytd.noofrefund)+"";
    		       
    		       for_TMP = _.applyToValues(for_TMP,currency_format,true);
    		       
    		       for_TMP.yesterday.noofsale=yesterday_noofsale;
    		       for_TMP.yesterday.noofrefund=yesterday_noofrefund;
    		       for_TMP.mtd.noofsale=mtd_noofsale;
    		       for_TMP.mtd.noofrefund=mtd_noofrefund;
    		       for_TMP.ytd.noofsale=ytd_noofsale;
    		       for_TMP.ytd.noofrefund=ytd_noofrefund;
    		       
    		       var yesterdayPropsToChange = _.selectKeys(for_TMP.yesterday,['netsalestotal', 'netrefundtotal', 'netsaleactivity', 'avgpayment', 'avgrefund' , 'cashtotal' , 'allDiscount', 'cancelledtotal','avgcancelled','menusalesamount', 'scansalesamount','ecrsalesamount']);
		       yesterdayPropsToChange =_(yesterdayPropsToChange)
			   .map$(function(val,key){
				    if(val.indexOf('-')>=0) { val = val.replace('-',''); val = "-$ " +val;}
				    else {val = "$ " +val;}
				    return [key,val];
				});
		       var yesterdayCashoutForm = _.extend({},for_TMP.yesterday,yesterdayPropsToChange);
		       
		       var mtdPropsToChange = _.selectKeys(for_TMP.mtd,['netsalestotal', 'netrefundtotal', 'netsaleactivity', 'avgpayment', 'avgrefund' , 'cashtotal' , 'allDiscount', 'cancelledtotal','avgcancelled','menusalesamount', 'scansalesamount','ecrsalesamount']);
		       mtdPropsToChange =_(mtdPropsToChange).chain()
			   .map(function(val,key){
				    if(val.indexOf('-')>=0) { val = val.replace('-',''); val = "-$ " +val;}
				    else {val = "$ " +val;}
				    return [key,val];
				})
			   .toObject()
			   .value();
		       var mtdCashoutForm = _.extend({},for_TMP.mtd,mtdPropsToChange);
		       
		       var ytdPropsToChange = _.selectKeys(for_TMP.ytd,['netsalestotal', 'netrefundtotal', 'netsaleactivity', 'avgpayment', 'avgrefund' , 'cashtotal' , 'allDiscount', 'cancelledtotal','avgcancelled','menusalesamount', 'scansalesamount','ecrsalesamount']);
		       ytdPropsToChange =_(ytdPropsToChange).chain()
			   .map(function(val,key){
				    if(val.indexOf('-')>=0) { val = val.replace('-',''); val = "-$ " +val;}
				    else {val = "$ " +val;}
				    return [key,val];
				})
			   .toObject()
			   .value();
		       var ytdCashoutForm = _.extend({},for_TMP.ytd,ytdPropsToChange); 
    		       
    		       for_TMP.yesterday = yesterdayCashoutForm;
    		       for_TMP.ytd = ytdCashoutForm;
    		       for_TMP.mtd = mtdCashoutForm;
    		       
    		       var html = ich.cashOutReportDialog_TMP(for_TMP);
    		       quickReportViewDialog(html,{title:title});
    		   });
}


/********************************* menu Administration *****************************************/
function quickCreateUserInfoDialog(html,options) {
    _.extend(options,{title:"Add New User", isCreate:true});
    quickInputUserInfoDialog(html,options);
}

function quickModifyUserInfoDialog(html,options) {
    _.extend(options,{title:"Edit User"});
    quickInputUserInfoDialog(html,options);
}

function quickInputUserInfoDialog(html,options) {
    var userCollection = options.collection;
    var targetUser = options.userJSON;
    var roles = targetUser.roles;
    var hierarchyLevel = options.hierarchyLevel;
    
    var d = $("#dialog-quickView");
    d.html(html);
    
    var roleBOdown = d.find("#roleBOdown");
    var rolePOSdown = d.find("#rolePOSdown");
    var statusdown = d.find("#statusdown");
    
    if(_.contains(roles, hierarchyLevel+"_admin")) {
        roleBOdown.val("admin");
    } else if(_.contains(roles, hierarchyLevel)) {
        roleBOdown.val("user");
    } else {
        roleBOdown.val("empty");
    }
    
    if(_.contains(roles, "pos_admin")) {
        rolePOSdown.val("admin");
    } else if(_.contains(roles, "pos_sales")) {
        rolePOSdown.val("user");
    } else {
        rolePOSdown.val("empty");
    }
    
    if(targetUser.status=="ACTIVE") {
        statusdown.val("ACTIVE");
    } else {
        statusdown.val("SUSPENDED");
    }
    
    if(!options.isCreate) {
        var currentUser = options.currentUser;
        // TODO : disable user
        $("#txtinputuser").attr("disabled",true);
        
        if(!_.contains(currentUser.roles,hierarchyLevel+"_admin")) {
            d.find("#roleBOdown").attr("disabled",true);
            d.find("#rolePOSdown").attr("disabled",true);
            d.find("#statusdown").attr("disabled",true);
        }     
    } 
    
    var dialogOptions = _.extend(
    {autoOpen: false,
     height: 540,
     width: 380,
     modal: true,
     buttons: {
         "Submit": function() {
             function transformRolesFromForm(formData, targetUser, hierarchyLevel) {
                 function getLowerHierarchy(hier, isIncludeCurrnt) {
                     var list = [];
                     if(hier=="company") {
                         list = list.concat(["group","store"]);
                     } else if(hier=="group") {
                         list = list.concat("store");
                     } 
                     
                     if(isIncludeCurrnt) {
                        return ([hier]).concat(list); 
                     } else {
                        return list; 
                     }
                 }
                 
                 var newRoles = targetUser.roles;
                 if(formData.roleBO=="admin") {
                     if(!_.contains(targetUser.roles,hierarchyLevel+"_admin")) {
                        var roleList = _.map(getLowerHierarchy(hierarchyLevel,true),function(level){ return level+"_admin";});
                        newRoles = _.uniq((targetUser.roles).concat(roleList));                     
                     }
                 } else if(formData.roleBO=="user") {
                     if(_.contains(targetUser.roles,hierarchyLevel+"_admin")) {
                        var roleList = _.map(getLowerHierarchy(hierarchyLevel,true),function(level){ return level+"_admin";});
                        newRoles = _.reject(targetUser.roles, function(role){ return _.contains(roleList,role);});                     
                     }
                 } else {
                     var roleList = _.map(getLowerHierarchy(hierarchyLevel,true),function(level){ return level+"_admin";});
                     roleList = roleList.concat(getLowerHierarchy(hierarchyLevel,true));
                     newRoles = _.reject(targetUser.roles, function(role){ return _.contains(roleList,role);});
                 }
                 
                 if(formData.rolePOS=="admin") {
                     newRoles = _.uniq((newRoles).concat("pos_admin"));
                 } else if(formData.rolePOS=="user") {
                     newRoles = _.reject(newRoles, function(role){ return role=="pos_admin";});
                 } else {
                     newRoles = _.reject(newRoles, function(role){ return (role=="pos_admin" || role=="pos_sales");});
                 }
                 
                 formData = _.removeKeys(formData,"rolePOS","roleBO");
                 return _.extend(formData,{roles:newRoles});    
             }
             
             var f = d.find("#form");
             var userInfo = varFormGrabber(f);
             var userData = transformRolesFromForm(userInfo, targetUser, hierarchyLevel);
             
             if(options.isCreate && (_.isEmpty(userInfo.user) || _.isEmpty(userInfo.password))) {
                 alert("Please, fill user/password");
             } else {
                 if(!(userCollection.findUser((_.str.trim(userInfo.user)).toLowerCase())===undefined)) {
                     alert("User already exists");
                 } else {
                     options.success(userData);
                     d.dialog('close');
                 }
             }
             
             /*
             if(_.isEmpty(userInfo.user) || _.isEmpty(userInfo.password)) {
                 alert("Please, fill user/password");
             } else {
                 if(options.isCreate && 
                     !(userCollection.findUser((_.str.trim(userInfo.user)).toLowerCase())===undefined)) {
                     alert("User already exists");
                 } else {
                     options.success(userInfo);
                     d.dialog('close');
                 }
             }
             */
         },
         "Close": function() {
         d.dialog('close');
         }
     },
     title:options.title
    },_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};


/******************************* menuReports - tax collected quick view dialog ************************/
function quickTaxViewDialog (html,options) {
    var form = $(html).filter('#taxcollecteddialog');
    var d = $("#dialog-quickView");    	
    d.html(form);
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 450,
	 width: 424,
	 modal: true,
	 buttons: {
	     "Close": function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};

function quickTaxView(id, title, firstindex, lastindex) {
    taxReportTransactionsFetcher(id,firstindex,lastindex,function(for_TMP){
				     _.applyToValues(for_TMP, function(obj){
							 var strObj = obj+"";
							 if(strObj.indexOf(".")>=0) {
					     		     obj = currency_format(Number(obj));
							 }
							 return obj;
						     }, true);
				     var html = ich.taxCollectedQuickViewDialog_TMP(for_TMP);
    				     quickTaxViewDialog(html,{title:title});
				 });
};

/********************************** menuReports - cashouts quick view dialog *****************************/
function quickmenuReportsCashoutViewDialog (html,options) {
    var form = $(html).filter('#menucashoutdialog');
    var d = $("#dialog-quickView");    	
    d.html(form);
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 450,
	 width: 424,
	 modal: true,
	 buttons: {
	     "Close": function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};

/********************************** menuReports - cancelled trans quick view dialog *****************************/
function quickmenuReportsTransactionViewDialog (html,options) {
    var form = $(html).filter('#transactiondialog');
    var d = $("#dialog-quickView");    	
    d.html(form);
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 450,
	 width: 424,
	 modal: true,
	 buttons: {
	     "Print": function() {
	         var w = window.open();
	         w.document.write($("#dialog-quickView").html());
	         w.document.close();
             w.focus();
	         w.print();
	         w.close();
	     },
	     "Close": function() {
		     d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};

function detailsDialog (html,options) {
    var d = $("#detailsDialog");    	
    d.html(html);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 450,
	 width: 424,
	 modal: true,
	 buttons: {
	     "Close": function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},options);
    
    d.dialog(dialogOptions);
    d.dialog("open");
};