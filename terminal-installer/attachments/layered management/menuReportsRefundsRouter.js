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
    endDateForQuery.addDays(1);
	
	//TODO
	var ids = _.map(ReportData.store.terminals, function(terminal){
		return {id:terminal.terminal_id, name:terminal.terminal_label};
	});
	console.log(ids);
	
	refundTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)(function(err,data_TMP){
		data_TMP=_.map(data_TMP, function(item){
			var item = _.clone(item);
			//item.time.start=(new Date(item.time.start)).toString("yyyy/MM/dd-HH:mm:ss");
			var t = new Date(item.time.start);
			item.processday = _(t.toDateString().split(' ')).chain().rest().join(' ').value();
			item.processtime = t.toString("h:mm").concat(t.getHours()>=12?" PM":" AM");
			item.transactionNumber = item.receipt_id+"-"+item.transactionNumber;
			if(item.type=="SALE") {item.type="SALE RECEIPT"}
			else if(item.type=="REFUND") {item.type="REFUND RECEIPT"}
			else if(item.type=="VOID") {item.type="SALE RECEIPT - VOIDED"}
			else if(item.type=="VOIDREFUND") {item.type="REFUND RECEIPT - VOIDED"}
			return item;
		});
		
		data_TMP = _.applyToValues(data_TMP, function(obj){
				if(obj && obj.discount==0){
					obj.discount=null;
				}
				if(obj && obj.quantity){
					obj.orderamount = (obj.price * obj.quantity).toFixed(2);
					obj.quantity+="";
				}
				return toFixed(2)(obj);
			}, true);
			
		
		var html = ich.menuReportsRefundsTabel_TMP({items:data_TMP});
		$("refundstable").html(html);
		
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
