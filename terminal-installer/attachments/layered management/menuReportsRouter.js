var testMenuReportsParam = {
	list : [{groupName : "test1",
			 storeName : "test1",
			 storeNumber : "1",
			 summary : {numberoftransactions : "100",
			 			sales:"100",
			 			tax1:"100",
			 			tax3:"100",
			 			totalsales:"100",
			 			cash:"100",
			 			credit:"100",
			 			debit:"100",
			 			mobile:"100",
			 			other:"100"}
			},
			{groupName : "test2",
			 storeName : "test2",
			 storeNumber : "2",
			 summary : {numberoftransactions : "200",
			 			sales:"200",
			 			tax1:"200",
			 			tax3:"200",
			 			totalsales:"200",
			 			cash:"200",
			 			credit:"200",
			 			debit:"200",
			 			mobile:"200",
			 			other:"200"}
			}],
	companyName : "test com",
	totalsales : "300",
	totaltransactions : "300",
	startPage:"companyReport"
};


var testMenuReportsParam2 = {
	list : [{groupName : "test3",
			 storeName : "test3",
			 storeNumber : "3",
			 summary : {numberoftransactions : "100",
			 			sales:"100",
			 			tax1:"100",
			 			tax3:"100",
			 			totalsales:"100",
			 			cash:"100",
			 			credit:"100",
			 			debit:"100",
			 			mobile:"100",
			 			other:"100"}
			},
			{groupName : "test4",
			 storeName : "test4",
			 storeNumber : "4",
			 summary : {numberoftransactions : "200",
			 			sales:"200",
			 			tax1:"200",
			 			tax3:"200",
			 			totalsales:"200",
			 			cash:"200",
			 			credit:"200",
			 			debit:"200",
			 			mobile:"200",
			 			other:"200"}
			}],
	companyName : "test com",
	totalsales : "300",
	totaltransactions : "300",
	startPage:"companyReport"
};


var testSummaryTable1 = {
	list : [{groupName : "test3",
			 storeName : "test3",
			 storeNumber : "3",
			 summary : {numberoftransactions : "100",
			 			sales:"100",
			 			tax1:"100",
			 			tax3:"100",
			 			totalsales:"100",
			 			cash:"100",
			 			credit:"100",
			 			debit:"100",
			 			mobile:"100",
			 			other:"100"}
			},
			{groupName : "test4",
			 storeName : "test4",
			 storeNumber : "4",
			 summary : {numberoftransactions : "200",
			 			sales:"200",
			 			tax1:"200",
			 			tax3:"200",
			 			totalsales:"200",
			 			cash:"200",
			 			credit:"200",
			 			debit:"200",
			 			mobile:"200",
			 			other:"200"}
			}],
	totalsales : "300",
	totaltransactions : "300"
};

var testSummaryTable2 = {
	list : [{groupName : "test3",
			 storeName : "test3",
			 storeNumber : "3",
			 summary : {numberoftransactions : "100",
			 			sales:"100",
			 			tax1:"100",
			 			tax3:"100",
			 			totalsales:"100",
			 			cash:"100",
			 			credit:"100",
			 			debit:"100",
			 			mobile:"100",
			 			other:"100"}
			},
			{groupName : "test4",
			 storeName : "test4",
			 storeNumber : "4",
			 summary : {numberoftransactions : "200",
			 			sales:"200",
			 			tax1:"200",
			 			tax3:"200",
			 			totalsales:"200",
			 			cash:"200",
			 			credit:"200",
			 			debit:"200",
			 			mobile:"200",
			 			other:"200"}
			}],
	totalsales : "300",
	totaltransactions : "300"
};

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
			 $("body").html(html);
	 	console.log("renderMenuReportsCompany");	
	 },
	 renderMenuReportsGroup: function() {
	     var html = ich.menuReports_TMP({startPage:"groupReport", 
	     								breadCrumb:"Company : " + ReportData.companyName
	     										+ " , Group : " + ReportData.group.groupName});
			 $("body").html(html);
	 	console.log("renderMenuReportsGroup");
	 },
	 renderMenuReportsStore: function() {
	     var html = ich.menuReports_TMP({startPage:"storeReport", 
	     								breadCrumb:"Company : " + ReportData.companyName
	     										+ " , Group : " + ReportData.groupName
	     										+ " , Store : " + ReportData.store.storeName});
			 $("body").html(html);
	 	console.log("renderMenuReportsStore");
	 },
	 renderMenuReportsCompanySales: function() {
			 
	 		var html = ich.salesSummaryReports_TMP({startPage:"companyReport", breadCrumb:"Company : " + ReportData.company.operationalname});
			 $("body").html(html);
			 
			$( "#dateFrom, #dateTo" ).datepicker("destroy");			 
			 //FIXME : doesn't work properly (go back and salessummary)
			var selectedDates = $( "#dateFrom, #dateTo" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3,
				onSelect: function( selectedDate ) {
					console.log("onSelect");
					var option = this.id == "dateFrom" ? "minDate" : "maxDate",
						instance = $( this ).data( "datepicker" ),
						date = $.datepicker.parseDate(
							instance.settings.dateFormat ||
							$.datepicker._defaults.dateFormat,
							selectedDate, instance.settings );
					selectedDates.not( this ).datepicker( "option", option, date );
				}, 
				onClose : function() {
					if(this.id=="dateFrom") {
						console.log("close dateFrom");
					} else {
						console.log("close dateTo");
					}
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
			 $("body").html(html);
			 
			$( "#dateFrom, #dateTo" ).datepicker("destroy");			 
			 //FIXME : doesn't work properly (go back and salessummary)
			var selectedDates = $( "#dateFrom, #dateTo" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3,
				onSelect: function( selectedDate ) {
					console.log("onSelect");
					var option = this.id == "dateFrom" ? "minDate" : "maxDate",
						instance = $( this ).data( "datepicker" ),
						date = $.datepicker.parseDate(
							instance.settings.dateFormat ||
							$.datepicker._defaults.dateFormat,
							selectedDate, instance.settings );
					selectedDates.not( this ).datepicker( "option", option, date );
				}, 
				onClose : function() {
					if(this.id=="dateFrom") {
						console.log("close dateFrom");
					} else {
						console.log("close dateTo");
					}
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
			 $("body").html(html);
			 
			$( "#dateFrom, #dateTo" ).datepicker("destroy");			 
			 //FIXME : doesn't work properly (go back and salessummary)
			var selectedDates = $( "#dateFrom, #dateTo" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3,
				onSelect: function( selectedDate ) {
					console.log("onSelect");
					var option = this.id == "dateFrom" ? "minDate" : "maxDate",
						instance = $( this ).data( "datepicker" ),
						date = $.datepicker.parseDate(
							instance.settings.dateFormat ||
							$.datepicker._defaults.dateFormat,
							selectedDate, instance.settings );
					selectedDates.not( this ).datepicker( "option", option, date );
				}, 
				onClose : function() {
					if(this.id=="dateFrom") {
						console.log("close dateFrom");
					} else {
						console.log("close dateTo");
					}
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