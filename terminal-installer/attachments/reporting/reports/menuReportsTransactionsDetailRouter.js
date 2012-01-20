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
	     						     breadCrumb:breadCrumb(ReportData.companyName, ReportData.group.groupName)});
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
	     						     breadCrumb:breadCrumb(ReportData.companyName, ReportData.groupName, ReportData.store.storeName, ReportData.store.number)});
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
    console.log("renderTransactionsDetailTable");

    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    
    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	endDateForQuery.addDays(1);
	
	//TODO
	var sd = $("#storesdown option:selected");
    ids =[{id:sd.val(), name:sd.text()}];
	
	console.log(ids);
	
	
	/*
	canceledTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)
	(function(err,data_TMP){
		data_TMP = appendGroupStoreInfoFromStoreID(data_TMP);
		
	     var totalrow = {};
	     totalrow.numofcancelled = data_TMP.length + "";
	     totalrow.subTotal = currency_format(_.reduce(data_TMP, function(init, item){
							      return init + Number(item.subTotal);
							  }, 0));
	     totalrow.tax1and2 = currency_format(_.reduce(data_TMP, function(init, item){
							      return init + Number(item.tax1and2);
							  }, 0));
	     totalrow.tax3 = currency_format(_.reduce(data_TMP, function(init, item){
							  return init + Number(item.tax3);
						      }, 0));
	     totalrow.total = currency_format(_.reduce(data_TMP, function(init, item){
							   return init + Number(item.total);
						       }, 0));
	     
	     data_TMP = applyReceiptInfo(data_TMP);
	     
	     data_TMP = 
		 _.applyToValues(data_TMP, function(obj){
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
	     
	     data_TMP = _.map(data_TMP, function(item){
				  if(item.payments) {
				      item.payments = _.map(item.payments, function(payment){
								if(payment.paymentdetail) {
								    payment.paymentdetail.crt = payment.type;
								}
								if(payment.paymentdetail && payment.paymentdetail.errmsg) {
								    payment.paymentdetail.errmsg = (payment.paymentdetail.errmsg).replace(/<br>/g," ");
								}
								return payment;
							    }); 
				  }
				  return item;
			      });
	     
	     
	     if(_.isEmpty(data_TMP)){
		 var html = "<p>There are no cancelled transactions for this time period</p>";	 
	     }
	     else{
	     	 //data_TMP = _.map(data_TMP, function(item){
	     	//		      item.subTotal = currency_format(item.subTotal);
	     	//		      item.tax1and2 = currency_format(item.tax1and2);
	     	//		      item.tax3 = currency_format(item.tax3);
	     	//		      item.total = currency_format(item.total);
	     	//		      return item;
	     	//		  });
	     	data_TMP = 
		     _.applyToValues(data_TMP, function(obj){
					 var strObj = obj+"";
					 if(strObj.indexOf(".")>=0 && strObj.indexOf("$")<0) {
					     obj = currency_format(Number(obj));
					 }
					 return obj;
				     }, true);
		 var html = ich.menuReportsCancelledTabel_TMP({items:data_TMP, totalrow:totalrow});
	     }

	     $("#cancelledtable").html(html);
	     
	     _.each(data_TMP, function(item){
			var item = _.clone(item);
			
			var dialogtitle=getDialogTitle(ReportData,item);
			
			var btn = $('#'+item._id)
			    .button()
			    .click(function(){
				       var btnData = item;
				       btnData.discount=null;
				       //TODO:
				       //btnData.storename = ReportData.store.storeName;
				       //FIXME: use walk,
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
	*/
    } else {
   		alert("Input Date");
    }
};