var menuReportsCancelledTransactionsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuReports/companyReportCancelled":"menuReportsCompanyCancelled",
	     	  "menuReports/groupReportCancelled":"menuReportsGroupCancelled",
		  "menuReports/storeReportCancelled":"menuReportsStoreCancelled"
	      },
	      menuReportsCompanyCancelled:function() {
		  console.log("menuReportsCompanyCancelled  ");
	      },
	      menuReportsGroupCancelled:function() {
		  console.log("menuReportsGroupCancelled  ");
	      },
	      menuReportsStoreCancelled:function() {
		  console.log("menuReportsStoreCancelled  ");
	      }
	     }));

var menuReportsCancelledTransactionsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyCancelled',
		       'renderMenuReportsGroupCancelled',
		       'renderMenuReportsStoreCancelled');
	     menuReportsCancelledTransactionsRouter
		 .bind('route:menuReportsCompanyCancelled', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyCancelled");
			   view.renderMenuReportsCompanyCancelled();
		       });
	     menuReportsCancelledTransactionsRouter
		 .bind('route:menuReportsGroupCancelled', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupCancelled");
			   view.renderMenuReportsGroupCancelled();
		       });
	     menuReportsCancelledTransactionsRouter
		 .bind('route:menuReportsStoreCancelled', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreCancelled");
			   view.renderMenuReportsStoreCancelled();
		       });
	 },
	 renderMenuReportsCompanyCancelled: function() {
	     
	     var html = ich.menuReportsCancelledReports_TMP({startPage:"companyReport", 
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
	     var dropdownTerminal = $("#terminalsdown");
	     
	     _.each(ReportData.company.hierarchy.groups, function(group) {
			dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
		    });
	     
	     var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
										 return group.stores; 
									     }).flatten().value();
	     
	     _.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var terminals = _(stores).chain().map(function(store) {
						       return store.terminals?store.terminals:[]; 
						   }).flatten().value();
	     if(terminals.length>0) {
		 _.each(terminals, function(terminal) {
		 	    dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
		 	});	
	     } else {
	 	 $('option', dropdownTerminal).remove();
	    	 dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	     }
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderCancelledTransactionsTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupCancelled: function() {
	     
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
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     dropdownGroup.append('<option value ='+ReportData.group.group_id+'>'+ReportData.group.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var terminals = _(ReportData.group.stores).chain().map(function(store) {
									return store.terminals?store.terminals:[]; 
								    }).flatten().value();
	     if(terminals.length>0) {
		 _.each(terminals, function(terminal) {
		 	    dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
		 	});	
	     } else {
	 	 $('option', dropdownTerminal).remove();
	    	 dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	     }
	     
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderCancelledTransactionsTable();
				   });
				   
	     console.log("rendered general report");
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
	     
	     $("#dateFrom").datepicker("setDate", new Date().addDays(-1));
	     $("#dateTo").datepicker("setDate", new Date());
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     $('option', dropdownStore).remove();
	     
	     dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName+ '</option>');
	     dropdownStore.attr('disabled','disabled');
	     
	     var terminals = ReportData.store.terminals?ReportData.store.terminals:[];
	     
	     if(terminals.length>0) {
		 _.each(terminals, function(terminal) {
		 	    dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
		 	});	
	     } else {
	 	 $('option', dropdownTerminal).remove();
	    	 dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	     }
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderCancelledTransactionsTable();
				   });
	     
	     console.log("rendered general report");
	 }
	});

/******************************************** helper functions ************************************/
function renderCancelledTransactionsTable() {
    console.log("renderCancelledTransactionsTable");

    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");
    
    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	endDateForQuery.addDays(1);
	
	//TODO
	if(dropdownTerminal.val()=="ALL") {
	    ids = _($('option', dropdownTerminal)).chain()
	    	.filter(function(item){ return item.value!=="ALL";})
	    	.map(function(item){
	    		 return {id:item.value, name:item.text};
	    	     })
	    	.value();
	} else {
	    var sd = $("#terminalsdown option:selected");
	    ids =[{id:sd.val(), name:sd.text()}];
	}
	console.log(ids);
	
	canceledTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)
	(function(err,data_TMP){
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
	     	data_TMP = _.map(data_TMP, function(item){
	     		item.subTotal = currency_format(item.subTotal);
	     		item.tax1and2 = currency_format(item.tax1and2);
	     		item.tax3 = currency_format(item.tax3);
	     		item.total = currency_format(item.total);
	     		return item;
	     	});
		 var html = ich.menuReportsCancelledTabel_TMP({items:data_TMP, totalrow:totalrow});
	     }

	     $("#cancelledtable").html(html);
	     
	     _.each(data_TMP, function(item){
			var item = _.clone(item);
			
			var dialogtitle=getDialogTitle(ReportData,item.name);
			
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
					
					  _.applyToValues(btnData, function(obj){
						     var strObj = obj+"";
						     if(strObj.indexOf(".")>=0) {
						     	obj = currency_format(obj);
						     }
						     return obj;
						 }, true);
						 
				       var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
				       quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
				   });
		    });	
	 });
	
    } else {
   	alert("Input Date");
    }
};