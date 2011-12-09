var menuReportsCashOutsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/storeReportCashOuts":"menuReportsStoreCashouts"
	      },
	      menuReportsStoreCashouts:function() {
		  console.log("menuReportsStoreCashouts  ");
	      }
	     }));
	     
var menuReportsCashOutsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsStoreCashouts');
	     menuReportsCashOutsRouter
		 .bind('route:menuReportsStoreCashouts', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreCashouts");
			   view.renderMenuReportsStoreCashouts();
		       });
	 },
	 renderMenuReportsStoreCashouts: function() {
	     
	     var html = ich.menuReportsCashOutsReports_TMP({startPage:"storeReport", 
	     					     breadCrumb:breadCrumb(ReportData.companyName, ReportData.groupName, ReportData.store.storeName)});
	     $(this.el).html(html);
	     
	     var selectedDates = $( "#dateFrom, #dateTo" )
		 .datepicker({
				 defaultDate: "+1w",
				 changeMonth: true,
				 numberOfMonths: 2,
				 minDate:"-1y",
				 maxDate:new Date(),
				 onSelect: function( selectedDate ) {
				     var option = this.id == "dateFrom" ? "minDate" : "maxDate",
				     instance = $( this ).data( "datepicker" ),
				     date = $.datepicker.parseDate(
					 instance.settings.dateFormat ||
					     $.datepicker._defaults.dateFormat,
					 selectedDate, instance.settings );
				     selectedDates.not( this ).datepicker( "option", option, date );
				 }
			     });
	     
	     console.log("rendered general report");
	 }
	});
	
/******************************************** helper functions ************************************/
function rendermenuReportsCashOutsTable() {
	console.log("renderCashOutsTable");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	
	if(startDate.equals(endDate)) {
	    endDateForQuery.addDays(1);
	}
	
	//TODO
	var ids = _.map(ReportData.store.terminals, function(terminal){
		return {id:terminal.terminal_id, name:terminal.terminal_label};
	});
	console.log(ids);
	
	cashoutReportFetcher(ids,startDate,endDateForQuery,function(data_TMP){
		data_TMP=_.map(data_TMP, function(item){
		var dialogtitle="".concat("Company : ")
						.concat(ReportData.companyName)
						.concat(" , Group : ")
						.concat(ReportData.groupName)
						.concat(" , Store : ")
						.concat(ReportData.store.storeName)
						.concat(" , Terminal : ")
						.concat(item.name);
			return _.extend(item, {dialogtitle:dialogtitle});
		});
		var html = ich.menuReportsCashOutsTabel_TMP({items:data_TMP});
		$("cashoutstable").html(html);
	});
		
    } else {
   	alert("Input Date");
    }
};
