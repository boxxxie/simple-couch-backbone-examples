
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
    		      	var yesterday_noofsale = Number(for_TMP.yesterday.noofsale)+"";
    		      	var yesterday_noofrefund = Number(for_TMP.yesterday.noofrefund)+"";
    		      	var mtd_noofsale = Number(for_TMP.mtd.noofsale)+"";
    		      	var mtd_noofrefund = Number(for_TMP.mtd.noofrefund)+"";
    		      	var ytd_noofsale = Number(for_TMP.ytd.noofsale)+"";
    		      	var ytd_noofrefund = Number(for_TMP.ytd.noofrefund)+"";
    		      	
    		      	for_TMP = _.applyToValues(for_TMP,toFixedWithSep(2),true);
    		      	
    		      	for_TMP.yesterday.noofsale=yesterday_noofsale;
    		      	for_TMP.yesterday.noofrefund=yesterday_noofrefund;
    		      	for_TMP.mtd.noofsale=mtd_noofsale;
    		      	for_TMP.mtd.noofrefund=mtd_noofrefund;
    		      	for_TMP.ytd.noofsale=ytd_noofsale;
    		      	for_TMP.ytd.noofrefund=ytd_noofrefund;
    		      	
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
					     	obj = toFixedWithSep(2)(obj);
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
