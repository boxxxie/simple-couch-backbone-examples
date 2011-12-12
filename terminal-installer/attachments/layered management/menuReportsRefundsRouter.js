var menuReportsRefundsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/storeReportRefunds":"menuReportsStoreRefunds"
	      },
	      menuReportsStoreRefunds:function() {
		  console.log("menuReportsStoreRefunds  ");
	      }
	     }));
	     
var menuReportsRefundsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsStoreRefunds');
	     menuReportsRefundsRouter
		 .bind('route:menuReportsStoreRefunds', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreRefunds");
			   view.renderMenuReportsStoreRefunds();
		       });
	 },
	 renderMenuReportsStoreRefunds: function() {
	     
	     var html = ich.menuReportsRefundsReports_TMP({startPage:"storeReport", 
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
function renderRefundsTable() {
	console.log("renderRefundsTable");

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
	
	canceledTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)(function(err,data_TMP){
		var tableData =_.clone(data_TMP);
		tableData=_.map(tableData, function(item){
		var dialogtitle="".concat("Company : ")
						.concat(ReportData.companyName)
						.concat(" , Group : ")
						.concat(ReportData.groupName)
						.concat(" , Store : ")
						.concat(ReportData.store.storeName)
						.concat(" , Terminal : ")
						.concat(item.name);
			item.time.start=(new Date(item.time.start)).toString("yyyy/MM/dd-HH:mm:ss");
			item.subTotal = item.subTotal.toFixed(2);
			item.tax1and2 = item.tax1and2.toFixed(2);
			item.tax3 = item.tax3.toFixed(2);
			item.total = item.total.toFixed(2);
			return _.extend(item, {dialogtitle:dialogtitle});
		});
		
		var html = ich.menuReportsRefundsTabel_TMP({items:data_TMP});
		$("refundstable").html(html);
		
		var dialogData =_.clone(data_TMP); 
		_.each(dialogData, function(item){	
			var btn = $('#'+item._id).button().click(function(){
				var btnData = item;
				//btnData.time.start=(new Date(btnData.time.start)).toString("yyyy/MM/dd-HH:mm:ss");
				//btnData.subTotal = btnData.subTotal.toFixed(2);
				//btnData.tax1and2 = btnData.tax1and2.toFixed(2);
				//btnData.tax3 = btnData.tax3.toFixed(2);
				//btnData.total = btnData.total.toFixed(2);
				btnData.storename = ReportData.store.storeName;
				var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
				quickmenuReportsTransactionViewDialog(html, {title:item.dialogtitle});
			});
		});
	});
		
    } else {
   	alert("Input Date");
    }
};
