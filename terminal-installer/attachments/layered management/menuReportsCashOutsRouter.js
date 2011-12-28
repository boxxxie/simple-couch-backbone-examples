var menuReportsCashOutsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuReports/companyReportCashOuts":"menuReportsCompanyCashouts",
	     	  "menuReports/groupReportCashOuts":"menuReportsGroupCashouts",
		  "menuReports/storeReportCashOuts":"menuReportsStoreCashouts"
	      },
	      menuReportsCompanyCashouts:function() {
		  console.log("menuReportsCompanyCashouts  ");
	      },
	      menuReportsGroupCashouts:function() {
		  console.log("menuReportsGroupCashouts  ");
	      },
	      menuReportsStoreCashouts:function() {
		  console.log("menuReportsStoreCashouts  ");
	      }
	     }));

var menuReportsCashOutsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyCashouts',
		       'renderMenuReportsGroupCashouts',
		       'renderMenuReportsStoreCashouts');
	     menuReportsCashOutsRouter
		 .bind('route:menuReportsCompanyCashouts', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyCashouts");
			   view.renderMenuReportsCompanyCashouts();
		       });
	     menuReportsCashOutsRouter
		 .bind('route:menuReportsGroupCashouts', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupCashouts");
			   view.renderMenuReportsGroupCashouts();
		       });
	     menuReportsCashOutsRouter
		 .bind('route:menuReportsStoreCashouts', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreCashouts");
			   view.renderMenuReportsStoreCashouts();
		       });
	 },
	 renderMenuReportsCompanyCashouts: function() {
	     
	     var html = ich.menuReportsCashOutsReports_TMP({startPage:"companyReport", 
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
				      rendermenuReportsCashOutsTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupCashouts: function() {
	     
	     var html = ich.menuReportsCashOutsReports_TMP({startPage:"groupReport", 
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
				      rendermenuReportsCashOutsTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreCashouts: function() {
	     
	     var html = ich.menuReportsCashOutsReports_TMP({startPage:"storeReport", 
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
				      rendermenuReportsCashOutsTable();
				   });
	     
	     console.log("rendered general report");
	 }
	});

/******************************************** helper functions ************************************/
function rendermenuReportsCashOutsTable() {
    console.log("renderCashOutsTable");
    
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	var today = (new Date()).toString("MM/dd/yyyy");
	
	endDateForQuery.addDays(1);
	
	var ids;
	
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
	
	cashoutReportFetcher(ids,startDate,endDateForQuery)
	(function(data_TMP){
		var numofcashout = data_TMP.length+"";
	     data_TMP = _.map(data_TMP, function(item){
				  var dialogtitle=getDialogTitle(ReportData,item.name);
				  return _.extend(item, {dialogtitle:dialogtitle});
			      });

	     if(_.isEmpty(data_TMP)){
		 var html = "<p>There are no cashouts for this time period</p>";	 
	     }
	     else{
		 var html = ich.menuReportsCashOutsTabel_TMP({items:data_TMP, numofcashout:numofcashout});
	     }
	     $("#cashoutstable").html(html);
	     
	     _.each(data_TMP, function(item){	
			var btn = $('#'+item.id)
			    .button()
			    .click(function(){
				       var data = item.cashout;
				       _.applyToValues(data, function(obj){
						     var strObj = obj+"";
						     if(strObj.indexOf(".")>=0) {
						     	obj = toFixedWithSep(2)(obj);
						     }
						     return obj;
						 }, true);
				       var html = ich.menuReportsCashoutQuickViewDialog_TMP(data);
				       quickmenuReportsCashoutViewDialog(html, {title:item.dialogtitle});
				   });
		    });		
	 });
	
    } else {
   	alert("Input Date");
    }
};
