var menuReportsTaxCollectedRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/storeReportTaxCollected":"menuReportsStoreTaxes"
	      },
	      menuReportsStoreTaxes:function() {
		  console.log("menuReportsStoreTaxes  ");
	      }
	     }));
	     
var menuReportsTaxCollectedView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsStoreTaxes');
	     menuReportsTaxCollectedRouter
		 .bind('route:menuReportsStoreTaxes', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreTaxes");
			   view.renderMenuReportsStoreTaxes();
		       });
	 },
	 renderMenuReportsStoreTaxes: function() {
	     
	     var html = ich.taxCollectedReports_TMP({startPage:"storeReport", 
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
function renderTaxCollectedTable() {
	console.log("renderTaxCollectedTable");

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
	
	taxReportFetcher(ids,startDate,endDateForQuery,function(data_TMP){
		data_TMP=_.map(data_TMP, function(item){
		var dialogtitle="".concat("Company : ")
						.concat(ReportData.companyName)
						.concat(" , Group : ")
						.concat(ReportData.groupName)
						.concat(" , Store : ")
						.concat(ReportData.store.storeName)
						.concat(" , Terminal : ")
						.concat(item.name)
						.concat(" , Date : ")
						.concat(startDate.toString("yyyy/MM/dd"))
						.concat(" ~ ")
						.concat(endDate.toString("yyyy/MM/dd"));
			return _.extend(item, {dialogtitle:dialogtitle});
		});
		
		var html = ich.taxCollectedTabel_TMP({items:data_TMP});
		$("taxcollectedtable").html(html);
	});
		
    } else {
   	alert("Input Date");
    }
};
