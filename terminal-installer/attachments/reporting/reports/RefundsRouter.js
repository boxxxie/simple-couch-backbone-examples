var menuReportsRefundsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportRefunds":"menuReportsCompanyRefunds",
		  "menuReports/groupReportRefunds":"menuReportsGroupRefunds",
		  "menuReports/storeReportRefunds":"menuReportsStoreRefunds"
	      },
	      menuReportsCompanyRefunds:function() {
		  console.log("menuReportsCompanyRefunds  ");
	      },
	      menuReportsGroupRefunds:function() {
		  console.log("menuReportsGroupRefunds  ");
	      },
	      menuReportsStoreRefunds:function() {
		  console.log("menuReportsStoreRefunds  ");
	      }
	     }));

var menuReportsRefundsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyRefunds',
		       'renderMenuReportsGroupRefunds',
		       'renderMenuReportsStoreRefunds');
	     menuReportsRefundsRouter
		 .bind('route:menuReportsCompanyRefunds', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyRefunds");
			   view.renderMenuReportsCompanyRefunds();
		       });
	     
	     menuReportsRefundsRouter
		 .bind('route:menuReportsGroupRefunds', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupRefunds");
			   view.renderMenuReportsGroupRefunds();
		       });
	     
	     menuReportsRefundsRouter
		 .bind('route:menuReportsStoreRefunds', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreRefunds");
			   view.renderMenuReportsStoreRefunds();
		       });
	 },
	 renderMenuReportsCompanyRefunds: function() {
	     
	     var html = ich.menuReportsRefundsReports_TMP({startPage:"companyReport", 
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
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName 
	 																	 + "(" + store.number + ")" + '</option>');
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
	     
	     $("#groupsdown")
           .change(function(){
               updateStoreDropdown();updateTerminalDropdown();
           });
         $("#storesdown")
           .change(function(){
               updateTerminalDropdown();
           });
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderRefundsTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupRefunds: function() {
	     
	     var html = ich.menuReportsRefundsReports_TMP({startPage:"groupReport", 
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
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
 																		 + "(" + store.number + ")" + '</option>');
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
	     
         $("#storesdown")
           .change(function(){
               updateTerminalDropdown();
           });
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderRefundsTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreRefunds: function() {
	     
	     var html = ich.menuReportsRefundsReports_TMP({startPage:"storeReport", 
	     						   breadCrumb:breadCrumb(ReportData.companyName,
	     						   						 ReportData.groupName, 
	     						   						 ReportData.store.storeName,
	     						   						 ReportData.store.number)});
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
	     dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName
	     																	+ "(" + ReportData.store.number + ")" + '</option>');
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
			    renderRefundsTable();
			});
	     
	     console.log("rendered general report");
	 }
	});

/******************************************** helper functions ************************************/
function renderRefundsTable() {
    console.log("renderRefundsTable");

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
	
	refundTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery)
	(function(err,data_TMP){
		data_TMP = appendGroupStoreInfoFromStoreID(data_TMP);
		
	     var totalrow = {};
	     totalrow.numofrefund = data_TMP.length + "";
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
	     
	     data_TMP = _.applyToValues(data_TMP, function(obj){
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
								    payment.paymentdetail.errmsg = (payment.paymentdetail.errmsg).replace("<br>"," ");
								}
								return payment;
							    });
				  }
				  return item;
			      });
	     

	     	data_TMP = 
		     _.applyToValues(data_TMP, function(obj){
					 var strObj = obj+"";
					 if(strObj.indexOf(".")>=0 && strObj.indexOf("$")<0) {
					     obj = currency_format(Number(obj));
					 }
					 return obj;
				     }, true);
		 var html = ich.menuReportsRefundstable_TMP({items:data_TMP, totalrow:totalrow});
	     

	     $("#refundstable").html(html);
	     
	     _.each(data_TMP, function(item){	
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
						     
						     //_.applyToValues(btnData, function(obj){
							//		 var strObj = obj+"";
							//		 if(strObj.indexOf(".")>=0) {
							 //    		     obj = currency_format(obj);
							//		 }
							//		 return obj;
							//	     }, true);
						     
						     var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
						     quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
						 });
				  });		    
		    });
	 });
	
    } else {
   	alert("Input Date");
    }
};
