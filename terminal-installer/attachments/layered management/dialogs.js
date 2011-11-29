function CashoutReportDialog (attachTo,options) {
    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
    $("#dialog:ui-dialog").dialog( "destroy" );
    var d = $("#dialog-form");
    var allFields = d.find('[var]');
    d.dialog(
	{
	    autoOpen: false,
	    height: 580,
	    width: 900,
	    modal: true,
	    buttons : {
	    	"Cancel": function() {
		    d.dialog("close");
		}
	    }
	});


    $("#"+attachTo).button().click(function() {
				       d.dialog("open");
				   });
};


function quickViewDialog (html,options) {
    var d = $("#dialog-quickView");    	
    d.html(_.extend(html, {title:"report view"}));
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 580,
	 width: 900,
	 modal: true,
	 buttons: {
	     "Cancel": function() {
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


function quickView(){
    var for_TMP = globalReportTestData;
    var html = ich.cashOutReportDialog_TMP(for_TMP);
    quickViewDialog(html);
}