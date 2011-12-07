var menuReportsSalesSummaryRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportSalesSummary":"menuReportsCompanySales",
		  "menuReports/groupReportSalesSummary":"menuReportsGroupSales",
		  "menuReports/storeReportSalesSummary":"menuReportsStoreSales"
	      },
	      menuReportsCompanySales:function() {
		  console.log("menuReportsCompanySales  ");
	      },
	      menuReportsGroupSales:function() {
		  console.log("menuReportsGroupSales  ");
	      },
	      menuReportsStoreSales:function() {
		  console.log("menuReportsStoreSales  ");
	      }
	     }));


var menuReportsSalesSummaryView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanySales',
		       'renderMenuReportsGroupSales',
		       'renderMenuReportsStoreSales');
	     menuReportsSalesSummaryRouter
		 .bind('route:menuReportsCompanySales', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanySales");
			   view.renderMenuReportsCompanySales();
		       });
	     menuReportsSalesSummaryRouter
		 .bind('route:menuReportsGroupSales', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupSales");
			   view.renderMenuReportsGroupSales();
		       });
	     menuReportsSalesSummaryRouter
		 .bind('route:menuReportsStoreSales', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreSales");
			   view.renderMenuReportsStoreSales();
		       });
	 },
	 renderMenuReportsCompanySales: function() {
	     
	     var html = ich.salesSummaryReports_TMP({startPage:"companyReport", 
	     					     breadCrumb:breadCrumb(ReportData.company.operationalname)});
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
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupSales: function() {
	     
	     var html = ich.salesSummaryReports_TMP({startPage:"groupReport", 
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
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     
	     $('option', dropdownGroup).remove();
	     dropdownGroup.append('<option>'+ReportData.group.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreSales: function() {
	     
	     var html = ich.salesSummaryReports_TMP({startPage:"storeReport", 
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
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     
	     $('option', dropdownGroup).remove();
	     $('option', dropdownStore).remove();
	     
	     dropdownGroup.append('<option>'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value="">'+ReportData.store.storeName+ '</option>');
	     dropdownStore.attr('disabled','disabled');
	     
	     console.log("rendered general report");
	 }
	});

/********************************************* helper functions ***************************************/
function updateStoreDropdown() {
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


function renderSalesSummaryReportTable() {
    console.log("renderSalesSummaryReportTable");
    var groupdown = $("#groupsdown");
    var storedown = $("#storesdown");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	
	if(startDate.equals(endDate)) {
	    endDate.addDays(1);
	}
	
	var ids = [];
	
	if(storedown.val()=="ALL") {
	    _.each($('option', storedown), function(option){ if(option.value!=="ALL"){ids=ids.concat(option.value)}});
	} else {
	    ids = ids.concat(_.isEmpty(storedown.val())?ReportData.store.store_id:storedown.val());
	}
	
	//TODO : args need to be changed ; children ids, parent id, startData, endData, callback
	//		 so that this function will give back list items and total info
	cashoutFetcher_Period(ids,startDate,endDate,
		      function(a,for_TMP){
	      		  console.log(for_TMP);
	      		  var data_TMP = extractSalesSummaryTableInfo(for_TMP);
	      		  
	      		  var html = ich.salesSummaryTabel_TMP(data_TMP);
				  $("summarytable").html(html);
		      });
    } else {
   	alert("Input Date");
    }
};



function extractSalesSummaryTableInfo(list) {
    function getGroupName(groups, store_id) {
	var name="";
	_.each(groups, function(group){
		   name = !_(group.stores).chain()
		       .pluck("store_id")
		       .filter(function(id){return id==store_id})
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
    
    function getSummarySales(peroid) {
    	return {
				    numberoftransactions:peroid.noofpayment+peroid.noofrefund,
				    sales:(peroid.netsales-peroid.netrefund).toFixed(2),
				    tax1:(peroid.netsaletax1-peroid.netrefundtax1).toFixed(2),
				    tax3:(peroid.netsaletax3-peroid.netrefundtax3).toFixed(2),
				    totalsales:(Number(peroid.netsalestotal)).toFixed(2),
				    cash:(peroid.cashpayment-peroid.cashrefund).toFixed(2),
				    credit:(peroid.creditpayment-peroid.creditrefund).toFixed(2),
				    debit:(peroid.debitpayment-peroid.debitrefund).toFixed(2),
				    mobile:(peroid.mobilepayment-peroid.mobilerefund).toFixed(2),
				    other:(peroid.otherpayment-peroid.otherrefund).toFixed(2)
				};
    };
    
    //TODO : don't calculate here, ask server
    function appendTotals(inputs) {
	var input = _.clone(inputs);
	var total={};
	
	total.totalsales = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.sales)+init},0)
	    .value()
	    .toFixed(2);

	total.totaltransactions=_(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.numberoftransactions)+init},0)
	    .value();
	total.totaltax1 = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.tax1)+init},0)
	    .value()
	    .toFixed(2);
	total.totaltax3 = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.tax3)+init},0)
	    .value()
	    .toFixed(2);
	total.totaltotalsales = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.totalsales)+init},0)
	    .value()
	    .toFixed(2);
	total.totalcash = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.cash)+init},0)
	    .value()
	    .toFixed(2);
	total.totalcredit = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.credit)+init},0)
	    .value()
	    .toFixed(2);
	total.totaldebit = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.debit)+init},0)
	    .value()
	    .toFixed(2);
	total.totalmobile = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.mobile)+init},0)
	    .value()
	    .toFixed(2);
	total.totalother = _(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.other)+init},0)
	    .value()
	    .toFixed(2);
	input.total = total;
	return input;
    };
    
    var result = {};
    
    if(!_.isEmpty(ReportData.company)) {
	var groups = ReportData.company.hierarchy.groups;
	result.list = _.map(list, function(item){
				var period = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					summary:getSummarySales(period)
					};
			    });
	
	
	result = appendTotals(result);
	return result;
	
    } else if(!_.isEmpty(ReportData.group)) {
	var groups = [ReportData.group];
	result.list = _.map(list, function(item){
				var peroid = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					summary:getSummarySales(period)
					};
			    });
	
	
	result = appendTotals(result);
	return result;
	
    } else if(!_.isEmpty(ReportData.store)) {
	result.list = _.map(list, function(item){
				var peroid = item.period;
				return {groupName:ReportData.groupName,
					storeName:ReportData.store.storeName,
					storeNumber:ReportData.store.number,
					summary:getSummarySales(period)
					};
			    });
	
	
	result = appendTotals(result);
	return result;
    }
};