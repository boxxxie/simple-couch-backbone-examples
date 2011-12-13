var menuReportsDiscountsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/storeReportDiscounts":"menuReportsStoreDiscounts"
	      },
	      menuReportsStoreDiscounts:function() {
		  console.log("menuReportsStoreDiscounts  ");
	      }
	     }));
	     
var menuReportsDiscountsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsStoreDiscounts');
	     menuReportsDiscountsRouter
		 .bind('route:menuReportsStoreDiscounts', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreDiscounts");
			   view.renderMenuReportsStoreDiscounts();
		       });
	 },
	 renderMenuReportsStoreDiscounts: function() {
	     
	     var html = ich.menuReportsDiscountsReports_TMP({startPage:"storeReport", 
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
function renderDiscountsTable() {
	console.log("renderDiscountsTable");

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
	
	discountTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)(function(err,data_TMP){
		//data_TMP = _.reject(data_TMP, function(item){return item.discount<=0});
		
		data_TMP=_.map(data_TMP, function(item){
			var item = _.clone(item);
			item.time.start=(new Date(item.time.start)).toString("yyyy/MM/dd-HH:mm:ss");
			item.transactionNumber += "";
			item.totaldiscount = item.discount;
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
			
		
		var html = ich.menuReportsDiscountsTabel_TMP({items:data_TMP});
		$("discountstable").html(html);
		
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
