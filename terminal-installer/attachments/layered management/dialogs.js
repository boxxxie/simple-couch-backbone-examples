
/********************* management page and groups/stores/terminals table quickview dialog ************/
function quickReportViewDialog (html,options) {
	var form = $(html).filter('cashoutdialog');
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
    			    var html = ich.cashOutReportDialog_TMP(for_TMP);
    			    quickReportViewDialog(html,{title:title});
    		      });
}




/******************************* menuReports - tax collected quick view dialog ************************/
function quickTaxViewDialog (html,options) {
	var form = $(html).filter('taxcollecteddialog');
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
		var html = ich.taxCollectedQuickViewDialog_TMP(for_TMP);
    	quickTaxViewDialog(html,{title:title});
	});
};

/********************************** menuReports - cashouts quick view dialog *****************************/
function quickmenuReportsCashoutViewDialog (html,options) {
	var form = $(html).filter('menucashoutdialog');
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
	var form = $(html).filter('transactiondialog');
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
