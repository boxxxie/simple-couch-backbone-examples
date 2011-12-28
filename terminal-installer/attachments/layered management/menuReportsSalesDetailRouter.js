var menuReportsSalesDetailRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportSalesDetail":"menuReportsCompanySalesDetail",
		  "menuReports/groupReportSalesDetail":"menuReportsGroupSalesDetail",
		  "menuReports/storeReportSalesDetail":"menuReportsStoreSalesDetail"
	      },
	      menuReportsCompanySalesDetail:function() {
		  console.log("menuReportsCompanySalesDetail  ");
	      },
	      menuReportsGroupSalesDetail:function() {
		  console.log("menuReportsGroupSalesDetail  ");
	      },
	      menuReportsStoreSalesDetail:function() {
		  console.log("menuReportsStoreSalesDetail  ");
	      }
	     }));


var menuReportsSalesDetailView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanySalesDetail',
		       'renderMenuReportsGroupSalesDetail',
		       'renderMenuReportsStoreSalesDetail');
	     menuReportsSalesDetailRouter
		 .bind('route:menuReportsCompanySalesDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanySalesDetail");
			   view.renderMenuReportsCompanySalesDetail();
		       });
	     menuReportsSalesDetailRouter
		 .bind('route:menuReportsGroupSalesDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupSalesDetail");
			   view.renderMenuReportsGroupSalesDetail();
		       });
	     menuReportsSalesDetailRouter
		 .bind('route:menuReportsStoreSalesDetail',
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreSalesDetail");
			   view.renderMenuReportsStoreSalesDetail();
		       });
	 },
	 renderMenuReportsCompanySalesDetail: function() {
	     
	     var html = ich.salesDetailReports_TMP({startPage:"companyReport", 
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
	     
	     _.each(ReportData.company.hierarchy.groups, function(group) {
			dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
		    });
	     
	     var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
										 return group.stores; 
									     }).flatten().value();
	     
	     _.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderSalesDetailReportTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupSalesDetail: function() {
	     
	     var html = ich.salesDetailReports_TMP({startPage:"groupReport", 
	 					     breadCrumb:breadCrumb(ReportData.companyName,
	 					     			   ReportData.group.groupName)});
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
	     dropdownGroup.append('<option>'+ReportData.group.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderSalesDetailReportTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreSalesDetail: function() {
	     
	     var html = ich.salesDetailReports_TMP({startPage:"storeReport", 
	 					     breadCrumb:breadCrumb(ReportData.companyName,
	 					     			   ReportData.groupName,
	 					     			   ReportData.store.storeName)});
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
	     
	     dropdownGroup.append('<option>'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value="">'+ReportData.store.storeName+ '</option>');
	     dropdownStore.attr('disabled','disabled');
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderSalesDetailReportTable();
				   });
	     
	     console.log("rendered general report");
	 }
	});

/********************************************* helper functions ***************************************/
/*function updateStoreDropdown() {
    var groups = ReportData.company.hierarchy.groups;
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    $('option', dropdownStore).remove();
    dropdownStore.append('<option value="ALL">ALL</option>');
    
    if(dropdownGroup.val()=="ALL") {
	var stores = _(groups).chain().map(function(group) {
					       return group.stores; 
					   }).flatten().value();
	
	_.each(stores, function(store) {
	 	   dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	       });		
    } else {
	var group = _.filter(groups, function(group){ return group.group_id==dropdownGroup.val();});
	var stores = group[0].stores;
	_.each(stores, function(store) {
	 	   dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	       }); 
    }
};
*/

function renderSalesDetailReportTable() {
    console.log("renderSalesDetailReportTable");
    var groupdown = $("#groupsdown");
    var storedown = $("#storesdown");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	endDateForQuery.addDays(1);
	
	var ids = [];
	
	if(storedown.val()=="ALL") {
	    _.each($('option', storedown), function(option){ if(option.value!=="ALL"){ids=ids.concat(option.value);}});
	} else {
	    ids = ids.concat(_.isEmpty(storedown.val())?ReportData.store.store_id:storedown.val());
	}
	
	var dayCounter = startDate.clone();
	var daysList = [dayCounter.clone()];
	while(Date.compare(dayCounter.addDays(1),endDate) != 1){
	    daysList.push(dayCounter.clone());
	}

	async.map(daysList,
		  function(day,callback){  
		      cashoutFetcher_Period(ids,day,day.clone().addDays(1),
					    function(err,data){
						var withDates = _(data).map(function(item){return _.extend(item,{date:datePartFormatter(day)});});
						callback(err,withDates);
					    });
		  },
		  function(a,for_TMP){
	      	      console.log(for_TMP);
	      	      //TODO
	      	      for_TMP = _(for_TMP).flatten();
	      	      
	      	      var data_TMP = extractSalesDetailTableInfo(for_TMP);
	      	      
	      	      var html = ich.salesDetailTabel_TMP(data_TMP);
		      $("#salesdetailtable").html(html);
		  });
    } else {
   	alert("Input Date");
    }
};



function extractSalesDetailTableInfo(list) {
    function getGroupName(groups, store_id) {
	var name="";
	_.each(groups, function(group){
		   name = !_(group.stores).chain()
		       .pluck("store_id")
		       .filter(function(id){return id==store_id;})
		       .isEmpty()
		       .value()? group.groupName:name;
	       });
	return name;
    };
    
    function getStoreNameNum(groups, store_id) {
	var namenum ={name:"",num:""};
	_.each(groups, function(group){
		   _.each(group.stores, function(store){
			      namenum.name = store.store_id==store_id?store.storeName:namenum.name;
			      namenum.num = store.store_id==store_id?store.number:namenum.num;
			  });
	       });
	return namenum;
    };
    
    function getSalesDetail(item) {
    	return {
	    numberoftransactions:Number(item.noofsale)+"",
	    sales:toFixedWithSep(2)(item.netsales),
	    tax1:toFixedWithSep(2)(item.netsaletax1),
	    tax3:toFixedWithSep(2)(item.netsaletax3),
	    totalsales:toFixedWithSep(2)(Number(item.netsalestotal)),
	    cash:toFixedWithSep(2)(item.cashpayment),
	    credit:toFixedWithSep(2)(item.creditpayment),
	    debit:toFixedWithSep(2)(item.debitpayment),
	    mobile:toFixedWithSep(2)(item.mobilepayment),
	    other:toFixedWithSep(2)(item.otherpayment)
		};
    };
    
    function getRefundsDetail(item) {
    	var refund,tax1,tax3,total,cash,credit,debit,mobile,other;
    	
    	refund = ((Number(item.netrefund))>0)? "-" + toFixedWithSep(2)(item.netrefund):toFixedWithSep(2)(item.netrefund);
    	tax1 = ((Number(item.netrefundtax1))>0)? "-" + toFixedWithSep(2)(item.netrefundtax1):toFixedWithSep(2)(item.netrefundtax1);
    	tax3 = ((Number(item.netrefundtax3))>0)? "-" + toFixedWithSep(2)(item.netrefundtax3):toFixedWithSep(2)(item.netrefundtax3);
    	total = ((Number(item.netrefundtotal))>0)? "-" + toFixedWithSep(2)(item.netrefundtotal):toFixedWithSep(2)(item.netrefundtotal);
    	cash = ((Number(item.cashrefund))>0)? "-" + toFixedWithSep(2)(item.cashrefund):toFixedWithSep(2)(item.cashrefund);
    	credit = ((Number(item.creditrefund))>0)? "-" + toFixedWithSep(2)(item.creditrefund):toFixedWithSep(2)(item.creditrefund);
    	debit = ((Number(item.debitrefund))>0)? "-" + toFixedWithSep(2)(item.debitrefund):toFixedWithSep(2)(item.debitrefund);
    	mobile = ((Number(item.mobilerefund))>0)? "-" + toFixedWithSep(2)(item.mobilerefund):toFixedWithSep(2)(item.mobilerefund);
    	other = ((Number(item.otherrefund))>0)? "-" + toFixedWithSep(2)(item.otherrefund):toFixedWithSep(2)(item.otherrefund);
    	
    	return {
	    numberoftransactions:Number(item.noofrefund)+"",
	    sales:refund,
	    tax1:tax1,
	    tax3:tax3,
	    totalsales:total,
	    cash:cash,
	    credit:credit,
	    debit:debit,
	    mobile:mobile,
	    other:other
		};
    };
    
    // toFixedWithSep will be done after totalrow is calculated
    function getTotalDetail(item) {
    	return {
	    numberoftransactions:(Number(item.noofsale)+Number(item.noofrefund))+"",
	    sales:toFixed(2)(Number(item.netsales)-Number(item.netrefund)),
	    tax1:toFixed(2)(Number(item.netsaletax1)-Number(item.netrefundtax1)),
	    tax3:toFixed(2)(Number(item.netsaletax3)-Number(item.netrefundtax3)),
	    totalsales:toFixed(2)(Number(item.netsaleactivity)),
	    cash:toFixed(2)(Number(item.cashpayment)-Number(item.cashrefund)),
	    credit:toFixed(2)(Number(item.creditpayment)-Number(item.creditrefund)),
	    debit:toFixed(2)(Number(item.debitpayment)-Number(item.debitrefund)),
	    mobile:toFixed(2)(Number(item.mobilepayment)-Number(item.mobilerefund)),
	    other:toFixed(2)(Number(item.otherpayment)-Number(item.otherrefund))
		};
    };
    
    //TODO : don't calculate here, ask server
    function appendTotals(inputs) {
	var input = _.clone(inputs);
	var total={};
	
	total.totalsales = toFixedWithSep(2)(_(input.list).chain()
				      .pluck('totalrow')
				      .reduce(function(init,item){ return Number(item.sales)+init;},0)
				      .value())
	;

	total.totaltransactions=_(input.list).chain()
				    .pluck('totalrow')
				    .reduce(function(init,item){ return Number(item.numberoftransactions)+init;},0)
				    .value();
	total.totaltax1 = toFixedWithSep(2)(_(input.list).chain()
				     .pluck('totalrow')
				     .reduce(function(init,item){ return Number(item.tax1)+init;},0)
				     .value());
	total.totaltax3 = toFixedWithSep(2)(_(input.list).chain()
				     .pluck('totalrow')
				     .reduce(function(init,item){ return Number(item.tax3)+init;},0)
				     .value());
	total.totaltotalsales = toFixedWithSep(2)(_(input.list).chain()
					   .pluck('totalrow')
					   .reduce(function(init,item){ return Number(item.totalsales)+init;},0)
					   .value());
	total.totalcash = toFixedWithSep(2)(_(input.list).chain()
				     .pluck('totalrow')
				     .reduce(function(init,item){ return Number(item.cash)+init;},0)
				     .value());
	total.totalcredit = toFixedWithSep(2)(_(input.list).chain()
				       .pluck('totalrow')
				       .reduce(function(init,item){ return Number(item.credit)+init;},0)
				       .value());
	total.totaldebit = toFixedWithSep(2)(_(input.list).chain()
				      .pluck('totalrow')
				      .reduce(function(init,item){ return Number(item.debit)+init;},0)
				      .value());
	total.totalmobile = toFixedWithSep(2)(_(input.list).chain()
				       .pluck('totalrow')
				       .reduce(function(init,item){ return Number(item.mobile)+init;},0)
				       .value());
	total.totalother = toFixedWithSep(2)(_(input.list).chain()
				      .pluck('totalrow')
				      .reduce(function(init,item){ return Number(item.other)+init;},0)
				      .value());
	input.total = total;
	
	return input;
    };
    
    var result = {};
    
    if(!_.isEmpty(ReportData.company)) {
	var groups = ReportData.company.hierarchy.groups;
	result.list = _.map(list, function(item){
				//var cashout = item.cashout;
				var cashout = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					date:item.date,
					salerow:getSalesDetail(cashout),
					refundrow:getRefundsDetail(cashout),
					totalrow:getTotalDetail(cashout)
				       };
			    });
		
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
		_.applyToValues(item.totalrow, function(obj){
					     var strObj = obj+"";
					     if(strObj.indexOf(".")>=0) {
					     	obj = toFixedWithSep(2)(obj);
					     }
					     return obj;
					 }, true);
		return item;
	});
	
	return result;
	
    } else if(!_.isEmpty(ReportData.group)) {
	var groups = [ReportData.group];
	result.list = _.map(list, function(item){
				//var cashout = item.cashout;
				var cashout = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					date:item.date,
					salerow:getSalesDetail(cashout),
					refundrow:getRefundsDetail(cashout),
					totalrow:getTotalDetail(cashout)
				       };
			    });
	
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
		_.applyToValues(item.totalrow, function(obj){
					     var strObj = obj+"";
					     if(strObj.indexOf(".")>=0) {
					     	obj = toFixedWithSep(2)(obj);
					     }
					     return obj;
					 }, true);
		return item;
	});
	
	return result;
	
    } else if(!_.isEmpty(ReportData.store)) {
	result.list = _.map(list, function(item){
				//var cashout = item.cashout;
				var cashout = item.period;
				return {groupName:ReportData.groupName,
					storeName:ReportData.store.storeName,
					storeNumber:ReportData.store.number,
					date:item.date,
					salerow:getSalesDetail(cashout),
					refundrow:getRefundsDetail(cashout),
					totalrow:getTotalDetail(cashout)
				       };
			    });
	
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
		_.applyToValues(item.totalrow, function(obj){
					     var strObj = obj+"";
					     if(strObj.indexOf(".")>=0) {
					     	obj = toFixedWithSep(2)(obj);
					     }
					     return obj;
					 }, true);
		return item;
	});
	
	return result;
    }
};