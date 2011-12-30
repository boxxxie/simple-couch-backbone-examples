var menuReportsInventoryRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportInventory":"menuReportsCompanyInventory",
		  "menuReports/groupReportInventory":"menuReportsGroupInventory",
		  "menuReports/storeReportInventory":"menuReportsStoreInventory"
	      },
	      menuReportsCompanyInventory:function() {
		  console.log("menuReportsCompanyInventory  ");
	      },
	      menuReportsGroupInventory:function() {
		  console.log("menuReportsGroupInventory  ");
	      },
	      menuReportsStoreInventory:function() {
		  console.log("menuReportsStoreInventory  ");
	      }
	     }));


var menuReportsInventoryView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyInventory',
		       'renderMenuReportsGroupInventory',
		       'renderMenuReportsStoreInventory');
	     menuReportsInventoryRouter
		 .bind('route:menuReportsCompanyInventory', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyInventory");
			   view.renderMenuReportsCompanyInventory();
		       });
	     menuReportsInventoryRouter
		 .bind('route:menuReportsGroupInventory', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupInventory");
			   view.renderMenuReportsGroupInventory();
		       });
	     menuReportsInventoryRouter
		 .bind('route:menuReportsStoreInventory',
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreInventory");
			   view.renderMenuReportsStoreInventory();
		       });
	 },
	 renderMenuReportsCompanyInventory: function() {
	     
	     var html = ich.inventoryReports_TMP({startPage:"companyReport", 
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
				      renderInventoryReportTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupInventory: function() {
	     
	     var html = ich.inventoryReports_TMP({startPage:"groupReport", 
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
	     dropdownGroup.append('<option value=' +ReportData.group.group_id +'>'+ReportData.group.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderInventoryReportTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreInventory: function() {
	     
	     var html = ich.inventoryReports_TMP({startPage:"storeReport", 
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
	     dropdownStore.append('<option value=' +ReportData.store.store_id + '>'+ReportData.store.storeName+ '</option>');
	     dropdownStore.attr('disabled','disabled');
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderInventoryReportTable();
				   });
	     
	     console.log("rendered general report");
	 }
	});

/********************************************* helper functions ***************************************/

function renderInventoryReportTable() {
    console.log("renderInventoryReportTable");
    var groupdown = $("#groupsdown");
    var storedown = $("#storesdown");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	endDateForQuery.addDays(1);
	
	//var ids = [];
	var id;
	
		
	//if(storedown.val()=="ALL") {
	//    _.each($('option', storedown), function(option){ if(option.value!=="ALL"){ids=ids.concat(option.value);}});
	//} else {
	//    ids = ids.concat(_.isEmpty(storedown.val())?ReportData.store.store_id:storedown.val());
	//}
	
	if(storedown.val()!="ALL") {
		var sd = $("#storesdown option:selected");
		id = {id:sd.val(), name:sd.text()};
	} else if(groupdown.val()!="ALL") {
		var sd = $("#groupsdown option:selected");
		id = {id:sd.val(), name:sd.text()};
	} else if(storedown.val()=="ALL" && groupdown.val()=="ALL") {
		id = {id:ReportData.company._id, name:ReportData.company.companyName};
	}
	
	console.log(id);
	
	//cashoutFetcher_Period(ids,startDate,endDateForQuery,
	//		      function(a,for_TMP){
	//      			  console.log(for_TMP);
	//      			  var data_TMP = extractSalesSummaryTableInfo(for_TMP);
	//      			  
	//      			  var html = ich.salesSummaryTabel_TMP(data_TMP);
	//			  $("#summarytable").html(html);
	//
	//		      });
	
    } else {
   	alert("Input Date");
    }
};


/*
function extractSalesSummaryTableInfo(list) {
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
    
    function getSummarySales(item) {
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
				      .pluck('summary')
				      .reduce(function(init,item){ return Number(item.sales)+init;},0)
				      .value())
	;

	total.totaltransactions=_(input.list).chain()
	    .pluck('summary')
	    .reduce(function(init,item){ return Number(item.numberoftransactions)+init;},0)
	    .value();
	total.totaltax1 = toFixedWithSep(2)(_(input.list).chain()
				     .pluck('summary')
				     .reduce(function(init,item){ return Number(item.tax1)+init;},0)
				     .value());
	total.totaltax3 = toFixedWithSep(2)(_(input.list).chain()
				     .pluck('summary')
				     .reduce(function(init,item){ return Number(item.tax3)+init;},0)
				     .value());
	total.totaltotalsales = toFixedWithSep(2)(_(input.list).chain()
					   .pluck('summary')
					   .reduce(function(init,item){ return Number(item.totalsales)+init;},0)
					   .value());
	total.totalcash = toFixedWithSep(2)(_(input.list).chain()
				     .pluck('summary')
				     .reduce(function(init,item){ return Number(item.cash)+init;},0)
				     .value());
	total.totalcredit = toFixedWithSep(2)(_(input.list).chain()
				       .pluck('summary')
				       .reduce(function(init,item){ return Number(item.credit)+init;},0)
				       .value());
	total.totaldebit = toFixedWithSep(2)(_(input.list).chain()
				      .pluck('summary')
				      .reduce(function(init,item){ return Number(item.debit)+init;},0)
				      .value());
	total.totalmobile = toFixedWithSep(2)(_(input.list).chain()
				       .pluck('summary')
				       .reduce(function(init,item){ return Number(item.mobile)+init;},0)
				       .value());
	total.totalother = toFixedWithSep(2)(_(input.list).chain()
				      .pluck('summary')
				      .reduce(function(init,item){ return Number(item.other)+init;},0)
				      .value());
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
	
	result.list = _.map(result.list, function(item){
		_.applyToValues(item.summary, function(obj){
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
				var period = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					summary:getSummarySales(period)
				       };
			    });
	
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
		_.applyToValues(item.summary, function(obj){
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
				var period = item.period;
				return {groupName:ReportData.groupName,
					storeName:ReportData.store.storeName,
					storeNumber:ReportData.store.number,
					summary:getSummarySales(period)
				       };
			    });
	
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
		_.applyToValues(item.summary, function(obj){
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
*/