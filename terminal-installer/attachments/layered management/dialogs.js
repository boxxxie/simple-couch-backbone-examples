
function quickReportViewDialog (html,options) {
	var form = $(html).filter('form');
    var d = $("#dialog-quickView");    	
    d.html(form);
    d.find('input').attr('disabled',true);
    var dialogOptions = _.extend(
	{autoOpen: false,
	 height: 580,
	 width: 900,
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
    			    quickReportViewDialog(html,_.extend({title:title}));
    		      });
}