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
	
	var id;
	
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
	
	inventoryTotalsRangeFetcher_F(id.id)(startDate.toArray().slice(0,3), endDateForQuery.toArray().slice(0,3))(function(err,for_TMP) {
		console.log(for_TMP);
		var menuParam = {menu_sales:for_TMP.menu_sales, menu_sales_list:for_TMP.menu_sales_list, menu_list_totals:for_TMP.menu_list_totals};
		var scanParam = {scan_sales:for_TMP.scan_sales, scan_sales_list:for_TMP.scan_sales_list, scan_list_totals:for_TMP.scan_list_totals};
		var ecrParam = {ecr_sales:for_TMP.ecr_sales, 
						department_sales_list:for_TMP.department_sales_list,
						scale_sales_list:for_TMP.scale_sales_list,
						ecr_sales_list:for_TMP.ecr_sales_list,
						ecr_list_totals:for_TMP.ecr_list_totals};
							
		var html_menu = ich.menuReportsInventoryMenuTabel_TMP(menuParam);
	     $("#inventorymenutable").html(html_menu);
		
		var html_scan = ich.menuReportsInventoryScanTabel_TMP(scanParam);
	     $("#inventoryscantable").html(html_scan);
		
		var html_ecr = ich.menuReportsInventoryEcrTabel_TMP(ecrParam);
	     $("#inventoryecrtable").html(html_ecr);
		
		var cate_drop = $('#inventorydown');
		
		var opts = $('option',cate_drop);
		opts[0].selected=true;
		
		var drop = cate_drop.change(function() {
				var category = $(this).val();
				if(category=="ALL") {
				    $("#inventorymenutable").html(html_menu);
				    $("#inventoryscantable").html(html_scan);
				    $("#inventoryecrtable").html(html_ecr);
					//console.log(tmpAll);	
				} else if(category=="Menu") {
					$("#inventorymenutable").html(html_menu);
					$("#inventoryscantable").html({});
				    $("#inventoryecrtable").html({});
					//console.log(tmpMenu);
				} else if(category=="Scan") {
					$("#inventorymenutable").html({});
				    $("#inventoryscantable").html(html_scan);
				    $("#inventoryecrtable").html({});
					//console.log(tmpScan);
				} else if(category=="ECR") {
					$("#inventorymenutable").html({});
				    $("#inventoryscantable").html({});
				    $("#inventoryecrtable").html(html_ecr);
					//console.log(tmpEcr);
				}
			});
	});
		
    } else {
   	alert("Input Date");
    }
};
