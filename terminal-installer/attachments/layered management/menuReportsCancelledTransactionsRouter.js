var menuReportsCancelledTransactionsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/storeReportCancelled":"menuReportsStoreCancelled"
	      },
	      menuReportsStoreCancelled:function() {
		  console.log("menuReportsStoreCancelled  ");
	      }
	     }));
	     
var menuReportsCancelledTransactionsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsStoreCancelled');
	     menuReportsCancelledTransactionsRouter
		 .bind('route:menuReportsStoreCancelled', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreCancelled");
			   view.renderMenuReportsStoreCancelled();
		       });
	 },
	 renderMenuReportsStoreCancelled: function() {
	     
	     var html = ich.menuReportsCancelledReports_TMP({startPage:"storeReport", 
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
function renderCancelledTransactionsTable() {
	console.log("renderCancelledTransactionsTable");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
    endDateForQuery.addDays(1);
	
	//TODO
	var ids = _.map(ReportData.store.terminals, function(terminal){
		return {id:terminal.terminal_id, name:terminal.terminal_label};
	});
	console.log(ids);
	
	canceledTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)(function(err,data_TMP){
		data_TMP=_.map(data_TMP, function(item){
			var item = _.clone(item);
			item.time.start=(new Date(item.time.start)).toString("yyyy/MM/dd-HH:mm:ss");
			item.transactionNumber += "";
			item.type = item.type.replace("VOID","CANCELL");
			return item;
		});
		
		data_TMP = _.applyToValues(data_TMP, function(obj){
				if(obj && obj.discount==0){
					obj.discount=null;
				}
				if(obj && obj.quantity){
					obj.quantity+="";
				}
				return toFixed(2)(obj);
			}, true);
		
		var html = ich.menuReportsCancelledTabel_TMP({items:data_TMP});
		$("cancelledtable").html(html);
		
		_.each(data_TMP, function(item){
			var item = _.clone(item);
			
			var dialogtitle="".concat("Company : ")
						.concat(ReportData.companyName)
						.concat(" , Group : ")
						.concat(ReportData.groupName)
						.concat(" , Store : ")
						.concat(ReportData.store.storeName)
						.concat(" , Terminal : ")
						.concat(item.name);
							
			var btn = $('#'+item._id).button().click(function(){
				var btnData = item;
				btnData.discount=null;
				btnData.storename = ReportData.store.storeName;
				var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
				quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
			});
		});	
	});
		
    } else {
   	alert("Input Date");
    }
};
