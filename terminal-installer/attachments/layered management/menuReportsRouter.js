
var menuReportsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReport":"menuReportsCompany",
		  "menuReports/groupReport":"menuReportsGroup",
		  "menuReports/storeReport":"menuReportsStore",
		  "menuReports/companyReportSalesSummary":"menuReportsCompanySales",
		  "menuReports/groupReportSalesSummary":"menuReportsGroupSales",
		  "menuReports/storeReportSalesSummary":"menuReportsStoreSales"
	      },
	      menuReportsCompany:function(){
		  console.log("menuCompanyReport  ");
	      },
	      menuReportsGroup:function() {
	     	  console.log("menuGroupReport  ");
	      },
	      menuReportsStore:function(group_id) {
	     	  console.log("menuStoreReport ");
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
	      

var menuReportsView = 
    Backbone.View.extend(
	{initialize:function(){
		var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompany' , 
		       'renderMenuReportsGroup', 
		       'renderMenuReportsStore',
		       'renderMenuReportsCompanySales',
		       'renderMenuReportsGroupSales',
		       'renderMenuReportsStoreSales');
	     menuReportsRouter
		 .bind('route:menuReportsCompany', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompany");
			   view.renderMenuReportsCompany();
		       });
	     menuReportsRouter
		 .bind('route:menuReportsGroup', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroup");
			   view.renderMenuReportsGroup();						
		       });

	     menuReportsRouter
		 .bind('route:menuReportsStore', 
		       function(group_id){
			   console.log("menuReportsView, route:menuReportsStore");
			   view.renderMenuReportsStore(group_id);						
		       });
		menuReportsRouter
		 .bind('route:menuReportsCompanySales', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanySales");
			   view.renderMenuReportsCompanySales();
		       });
		menuReportsRouter
		 .bind('route:menuReportsGroupSales', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupSales");
			   view.renderMenuReportsGroupSales();
		       });
		menuReportsRouter
		 .bind('route:menuReportsStoreSales', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreSales");
			   view.renderMenuReportsStoreSales();
		       });
	 },
	 renderMenuReportsCompany: function() {
	 	var html = ich.menuReports_TMP({startPage:"companyReport", breadCrumb:"Company : " + ReportData.company.operationalname});
			 $(this.el).html(html);
	 	console.log("renderMenuReportsCompany");	
	 },
	 renderMenuReportsGroup: function() {
	     var html = ich.menuReports_TMP({startPage:"groupReport", 
	     								breadCrumb:"Company : " + ReportData.companyName
	     										+ " , Group : " + ReportData.group.groupName});
			 $(this.el).html(html);
	 	console.log("renderMenuReportsGroup");
	 },
	 renderMenuReportsStore: function() {
	     var html = ich.menuReports_TMP({startPage:"storeReport", 
	     								breadCrumb:"Company : " + ReportData.companyName
	     										+ " , Group : " + ReportData.groupName
	     										+ " , Store : " + ReportData.store.storeName});
			 $(this.el).html(html);
	 	console.log("renderMenuReportsStore");
	 },
	 renderMenuReportsCompanySales: function() {
			 
	 		var html = ich.salesSummaryReports_TMP({startPage:"companyReport", breadCrumb:"Company : " + ReportData.company.operationalname});
			 $(this.el).html(html);
			 
			var selectedDates = $( "#dateFrom, #dateTo" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3,
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
	 												breadCrumb:"Company : " + ReportData.companyName
	 														+ " , Group : " + ReportData.group.groupName});
			 $(this.el).html(html);
			 
			var selectedDates = $( "#dateFrom, #dateTo" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3,
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
	 												breadCrumb:"Company : " + ReportData.companyName
	 														+ " , Group : " + ReportData.groupName
	 														+ " , Store : " + ReportData.store.storeName});
			 $(this.el).html(html);
			 
			var selectedDates = $( "#dateFrom, #dateTo" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3,
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