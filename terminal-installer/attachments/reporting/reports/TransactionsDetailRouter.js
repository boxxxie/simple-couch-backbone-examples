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
	
	//TODO?????????
	var sd = $("#storesdown option:selected");
	ids =[{id:sd.val(), name:sd.text()}];
	
	console.log(ids);
	
	startDate = startDate.toArray().slice(0,3);
	endDateForQuery = endDateForQuery.toArray().slice(0,3);
	
	transactionsReportFetcher(startDate,endDateForQuery)
	([_.first(ids).id])
	(function(err,resp){
	     var re = resp;
	     console.log(re);
	     resp.transactionsForDates = 
		 pre_walk(resp.transactionsForDates, 
			  function(obj) {
			      if(obj.totalsForDate) {
				  obj.totalsForDate = _.extend({date:obj.date},obj.totalsForDate);
			      }
			      return obj;
			  });
	     var html = ich.transactionsDetailTable_TMP(resp);
	     $("#transactionsdetailtable").html(html); 
	 });
    } else {
   	alert("Input Date");
    }
};