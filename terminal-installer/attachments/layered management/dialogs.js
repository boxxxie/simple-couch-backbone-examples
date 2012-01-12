
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
		       yesterdayPropsToChange =_(yesterdayPropsToChange).chain()
			   .map(function(val,key){
				    if(val.indexOf('-')>=0) { val = val.replace('-',''); val = "-$ " +val;}
				    else {val = "$ " +val;}
				    return [key,val];
				})
			   .toObject()
			   .value();
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
	     "Close": function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};

/**************************************** menuInventory - apply stores dialog ****************************/
function menuInventoryApplyStoresViewDialog (html,options) {
    var stores = options.stores;
    var form = $(html).filter('#menuinventoryapplystoresdialog');
    var d = $("#dialog-quickView");    	
    d.html(form);

    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 450,
	 width: 424,
	 modal: true,
	 buttons: {
	     "Apply" : function() {
		 var checkedStores = form.find("input:checked").toArray();
		 if(_.isEmpty(checkedStores)){
		     
		 }
		 else if(checkedStores.length != stores.length) {
		     var store_ids_to_update = _(checkedStores)
										 .map(function(item){
										 	return item.id;
										 });
		     console.log("The price change will be applied to selected stores");
		     console.log(store_ids_to_update);
		     options.makeButtons(store_ids_to_update);
		 } else if (checkedStores.length == stores.length){
		     console.log("The price change will be applied to all stores in this company");
		     options.makeButtons([]);
		 }
		 d.dialog('close');
	     },
	     "Cancel" : function() {
		 d.dialog('close');
	     }
	 },
	 title:options.title
	},_.clone(options));
    
    d.dialog(dialogOptions);
    d.dialog("open");
};

