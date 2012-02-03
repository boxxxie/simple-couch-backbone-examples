//todo : refactor. inforce constants
var menuReportsTransactionsDetailRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuReports/companyReportTransactionsDetail":"menuReportsCompanyTransactionsDetail",
	     	  "menuReports/groupReportTransactionsDetail":"menuReportsGroupTransactionsDetail",
	  	  "menuReports/storeReportTransactionsDetail":"menuReportsStoreTransactionsDetail"
	      },
	      menuReportsCompanyTransactionsDetail:function() {
		  console.log("menuReportsCompanyTransactionsDetail  ");
	      },
	      menuReportsGroupTransactionsDetail:function() {
		  console.log("menuReportsGroupTransactionsDetail  ");
	      },
	      menuReportsStoreTransactionsDetail:function() {
		  console.log("menuReportsStoreTransactionsDetail  ");
	      }
	     }));

var menuReportsTransactionsDetailView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyTransactionsDetail',
		       'renderMenuReportsGroupTransactionsDetail',
		       'renderMenuReportsStoreTransactionsDetail');
	     menuReportsTransactionsDetailRouter
		 .bind('route:menuReportsCompanyTransactionsDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyTransactionsDetail");
			   view.renderMenuReportsCompanyTransactionsDetail();
		       });
	     menuReportsTransactionsDetailRouter
		 .bind('route:menuReportsGroupTransactionsDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupTransactionsDetail");
			   view.renderMenuReportsGroupTransactionsDetail();
		       });
	     menuReportsTransactionsDetailRouter
		 .bind('route:menuReportsStoreTransactionsDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreTransactionsDetail");
			   view.renderMenuReportsStoreTransactionsDetail();
		       });
	 },
	 renderMenuReportsCompanyTransactionsDetail: function() {
	     
	     var html = ich.transactionsDetailReports_TMP({startPage:"companyReport", 
	     						   breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(this.el).html(html);
	     $("#btnBack2").hide();
	     
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
	     
	     $("#dateFrom").datepicker("setDate", new Date().addDays(-1));
	     $("#dateTo").datepicker("setDate", new Date());
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     
	     $('option', dropdownGroup).remove();
	     _.each(ReportData.company.hierarchy.groups, function(group) {
			dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
		    });
	     
	     var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
										 return group.stores; 
									     }).flatten().value();
	     
	     $('option', dropdownStore).remove();
	     _.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
	 				     + "(" + store.number + ")" + '</option>');
	 	    });
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderTransactionsDetailTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupTransactionsDetail: function() {
	     
	     var html = ich.menuReportsCancelledReports_TMP({startPage:"groupReport", 
	     						     breadCrumb:breadCrumb(ReportData.companyName, 
										   ReportData.group.groupName)});
	     $(this.el).html(html);
	     $("#btnBack2").hide();
	     
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
	     
	     $("#dateFrom").datepicker("setDate", new Date().addDays(-1));
	     $("#dateTo").datepicker("setDate", new Date());
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     
	     $('option', dropdownGroup).remove();
	     dropdownGroup.append('<option value ='+ReportData.group.group_id+'>'+ReportData.group.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     $('option', dropdownStore).remove();
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName 
 					     + "(" + store.number + ")" + '</option>');
	 	    });
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderTransactionsDetailTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreTransactionsDetail: function() {
	     
	     var html = ich.menuReportsCancelledReports_TMP({startPage:"storeReport", 
	     						     breadCrumb:breadCrumb(ReportData.companyName, 
										   ReportData.groupName, 
										   ReportData.store.storeName, 
										   ReportData.store.number)});
	     $(this.el).html(html);
	     $("#btnBack2").hide();
	     
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
	     
	     $("#dateFrom").datepicker("setDate", new Date().addDays(-1));
	     $("#dateTo").datepicker("setDate", new Date());
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     
	     $('option', dropdownGroup).remove();
	     $('option', dropdownStore).remove();
	     
	     dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName
     				  + "(" + ReportData.store.number + ")" + '</option>');
	     dropdownStore.attr('disabled','disabled');
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderTransactionsDetailTable();
			});
	     
	     console.log("rendered general report");
	 }
	});

/******************************************** helper functions ************************************/
function renderTransactionsDetailTable() {
    function getTerminalLabel(terminal_id) {
    	var terminal_label = "";
    	_.walk_pre(ReportData, 
		   function(obj) {
		       if(obj.terminal_id == terminal_id) {
			   terminal_label = obj.terminal_label;
		       }
		       return obj;
		   });
	return terminal_label;	
    };
    function renderTransactionDetail(startDate, endDateForQuery, option) {
        transactionsReportFetcher(startDate,endDateForQuery)
        ([option.id])
        (function(err,resp){
             var respForBtn = _.extend({},resp);
             resp.transactionsForDates = 
		 _.walk_pre(resp.transactionsForDates, 
			    function(obj) {
				if(obj.totalsForDate) {
				    obj.totalsForDate = _.extend({date:obj.date},obj.totalsForDate);
				}
				return obj;
			    });
             
             resp.transactionsForDates = 
		 _.map(resp.transactionsForDates, function(item) {
			   item.totalsForDate = 
			       _.applyToValues(item.totalsForDate, function(obj){
						   if(_.isNumber(obj)) {
						       obj = currency_format(obj);
						   }
						   return obj;
					       }, true);
			   
			   item.transactions = 
			       _.map(item.transactions, function(item) {
					 var terminal_label = getTerminalLabel(item.terminal_id);
					 return _.extend(item,{name:terminal_label}, 
							 {date:item.time.start},
							 {transdate:jodaDatePartFormatter(item.time.start)},
							 {transtime:jodaTimePartFormatter(item.time.start)},
							 {subTotal:currency_format(item.subTotal)},
							 {tax1and2:currency_format(item.tax1and2)},
							 {tax3:currency_format(item.tax3)},
							 {total:currency_format(item.total)});
				     });
			   
			   return item;
		       });
             
             var html = ich.transactionsDetailTable_TMP(resp);
             $("#transactionsdetailtable").html(html);
             
             $("#transactionssummarytable").hide();             
             $("#ulGroupDropDown").hide();
             $("#dateRangePicker").hide();
             $("#generalgobtn").hide();
             $("#btnBackHistory").hide();
             $("#btnBack2").show();
             
             $("#btnBack2").click(
		 function(){
		     $("#transactionsdetailtable").html({});
		     $("#transactionssummarytable").show();
		     $("#ulGroupDropDown").show();
		     $("#dateRangePicker").show();
		     $("#generalgobtn").show();
		     $("#btnBackHistory").show();
		     $("#btnBack2").hide();
		 });
             
             
             respForBtn.transactionsForDates = _.map(respForBtn.transactionsForDates, 
						     function(item) {
							 item.transactions = 
							     _.map(item.transactions, 
								   function(item) {
								       var terminal_label = getTerminalLabel(item.terminal_id);
								       return _.extend(item,{name:terminal_label} 
										       ,{date:item.time.start});
								   });
							 
							 return item;
						     });
             
             _.each(respForBtn.transactionsForDates, function(item) {
			item.transactions = applyReceiptInfo(item.transactions);
			
			item.transactions = _.applyToValues(item.transactions, function(obj){
								if(obj && obj.discount==0){
								    obj.discount=null;
								}
								if(obj && obj.quantity){
								    obj.orderamount = toFixed(2)(obj.price * obj.quantity);
								    obj.quantity+="";
								    if(obj.discount) {
									obj.discountamount = toFixed(2)(obj.discount * obj.quantity);
								    }
								}
								return toFixed(2)(obj);
							    }, true);
			
			item.transactions = _.map(item.transactions, function(item){
						      if(item.payments) {
							  item.payments = _.map(item.payments, function(payment){
										    if(payment.paymentdetail) {
											payment.paymentdetail.crt = payment.type;
										    }
										    if(payment.paymentdetail && payment.paymentdetail.errmsg) {
											payment.paymentdetail.errmsg = (payment.paymentdetail.errmsg).replace("<br>"," ");
										    }
										    return payment;
										});
						      }
						      return item;
						  });
			
			
			item.transactions = 
			    _.applyToValues(item.transactions, function(obj){
						var strObj = obj+"";
						if(strObj.indexOf(".")>=0 && strObj.indexOf("$")<0) {
						    obj = currency_format(Number(obj));
						}
						return obj;
					    }, true);
			
			
			_.each(item.transactions, function(item) {
				   var item = _.clone(item);
				   
				   var dialogtitle=getDialogTitle(ReportData,item);
				   
				   var btn = $('#'+item._id)
				       .each(function(){
						 $(this).button()
						     .click(function(){
								var btnData = item;
								btnData.discount=null;
								//TODO use walk
								_.applyToValues(ReportData,
										function(o){
										    if(o.store_id==btnData.store_id){
											btnData.storename = o.storeName;
										    }
										    return o;
										}
										,true);
								
								var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
								quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
							    });
					     });
			       });
		    });
             
         });
    };
    
    console.log("renderTransactionsDetailTable");
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    
    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	endDateForQuery.addDays(1);
	
	var sd = $("#storesdown option:selected");
	var ids =[{id:sd.val(), name:sd.text()}];
	
	console.log(ids);
	
	startDate = startDate.toArray().slice(0,3);
	endDateForQuery = endDateForQuery.toArray().slice(0,3);
	
	transactionsReportDaySummaryFetcher(startDate,endDateForQuery)
	([_.first(ids).id])
	(function(err,resp){
	     var formattedTemplateData = _.map(resp,transactionFormattingWalk);
	     console.log("formattedTemplateData");
	     console.log(formattedTemplateData);
	     $("#transactionssummarytable").html(ich.transactionsSummaryTable_TMP({list:formattedTemplateData}));
	     
	     _.each(data,function(item){
			var row = $("#"+item.date);
			row.click(function(){
				      var startDate = item.date;
				      var endDate = date_arrayinc_day(startDate);
				      renderTransactionDetail(startDate,endDate,{id:_.first(ids).id});
				  });
		    });
	 });	
    }
};