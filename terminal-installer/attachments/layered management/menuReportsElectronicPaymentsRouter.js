var menuReportsElectronicPaymentsRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuReports/companyReportElectronicPayments":"menuReportsCompanyPayments",
	     	  "menuReports/groupReportElectronicPayments":"menuReportsGroupPayments",
		  "menuReports/storeReportElectronicPayments":"menuReportsStorePayments"
	      },
	      menuReportsCompanyPayments:function() {
		  console.log("menuReportsCompanyPayments  ");
	      },
	      menuReportsGroupPayments:function() {
		  console.log("menuReportsGroupPayments  ");
	      },
	      menuReportsStorePayments:function() {
		  console.log("menuReportsStorePayments  ");
	      }	      
	     }));

var menuReportsElectronicPaymentsView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyPayments',
		       'renderMenuReportsGroupPayments',
		       'renderMenuReportsStorePayments');
	     menuReportsElectronicPaymentsRouter
		 .bind('route:menuReportsCompanyPayments', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyPayments");
			   view.renderMenuReportsCompanyPayments();
		       });
	     
	     menuReportsElectronicPaymentsRouter
		 .bind('route:menuReportsGroupPayments', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupPayments");
			   view.renderMenuReportsGroupPayments();
		       });
	     
	     menuReportsElectronicPaymentsRouter
		 .bind('route:menuReportsStorePayments', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStorePayments");
			   view.renderMenuReportsStorePayments();
		       });
	 },
	 renderMenuReportsCompanyPayments: function() {
	     
	     var html = ich.electronicPaymentsReports_TMP({startPage:"companyReport", 
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
			dropdownGroup.append('<option value=' 
					     + group.group_id + '>' + 
					     group.groupName + 
					     '</option>');
		    });
	     
	     var stores = _(ReportData.company.hierarchy.groups)
		 .chain().map(function(group) {
				  return group.stores; 
			      }).flatten().value();
	     
	     _.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + 
					     store.store_id + '>' + 
					     store.storeName + 
					     '</option>');
	 	    });
	     
	     var terminals = _(stores).chain().map(function(store) {
						       return store.terminals?store.terminals:[]; 
						   }).flatten().value();
	     if(_.isNotEmpty(terminals)) {
		 _.each(terminals, function(terminal) {
		 	    dropdownTerminal.append('<option value=' + 
						    terminal.terminal_id + '>' + 
						    terminal.terminal_label + 
						    '</option>');
		 	});	
	     } else {
	 	 $('option', dropdownTerminal).remove();
	    	 dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	     }
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupPayments: function() {
	     
	     var html = ich.electronicPaymentsReports_TMP({startPage:"groupReport", 
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
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     dropdownGroup.append('<option value ='+
				  ReportData.group.group_id + '>' +
				  ReportData.group.groupName+ 
				  '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + 
					     store.store_id + '>' + 
					     store.storeName + 
					     '</option>');
	 	    });
	     
	     var terminals = _(ReportData.group.stores)
		 .chain().map(function(store) {
				  return store.terminals?store.terminals:[]; 
			      }).flatten().value();
	     if(terminals.length>0) {
		 _.each(terminals, function(terminal) {
		 	    dropdownTerminal.append('<option value=' + 
						    terminal.terminal_id + '>' + 
						    terminal.terminal_label + 
						    '</option>');
		 	});	
	     } else {
	 	 $('option', dropdownTerminal).remove();
	    	 dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	     }
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStorePayments: function() {
	     
	     var html = ich.electronicPaymentsReports_TMP({startPage:"storeReport", 
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
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     $('option', dropdownStore).remove();
	     
	     dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value='
				  +ReportData.store.store_id+'>'+
				  ReportData.store.storeName+ 
				  '</option>');

	     dropdownStore.attr('disabled','disabled');
	     
	     var terminals = ReportData.store.terminals?ReportData.store.terminals:[];
	     
	     if(terminals.length>0) {
		 _.each(terminals, function(terminal) {
		 	    dropdownTerminal.append('<option value=' + 
						    terminal.terminal_id + '>' + 
						    terminal.terminal_label + 
						    '</option>');
		 	});	
	     } else {
	 	 $('option', dropdownTerminal).remove();
	    	 dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	     }
	     
	     console.log("rendered general report");
	 }
	});

/******************************************** helper functions ************************************/
function renderElectronicPaymentsTable() {
    console.log("renderElectronicPaymentsTable");
    
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");
    
    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
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
	electronicPaymentsReportFetcher(ids,startDate,endDateForQuery)
	(function(err,data_TMP){

	     data_TMP=
		 _.map(data_TMP, 
		       function(item){
			   var dialogtitle 
			       = getDialogTitle(ReportData,
						item.name,
						startDate,
						endDateForQuery);
			   return _.extend(item, {dialogtitle:dialogtitle},{transaction_index:item.transaction_index+""});
		       });
	     data_TMP = _.applyToValues(data_TMP,toFixed(2),true);

	     if(_.isEmpty(data_TMP)){
		 var html = "<p>There are no Electronic Payments for this time period</p>";	 
	     }
	     else{
		 var html = ich.electronicPaymentsTabel_TMP({items:data_TMP});
	     }
	     $("reportTable").html(html);
	     _.each(data_TMP, function(item){
			var item = _.clone(item);
			
			var dialogtitle=getDialogTitle(ReportData,item.name);
			
			var btn = $('#'+item._id)
			    .each()
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
				       var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
				       quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
				   });
		    });	
	 });
	
    } else {
   	alert("Input Date");
    }
};

function getDialogTitle(ReportData, name, startDate, endDate) {
    var companyName, groupName, storeName, terminalName;
    if(!_.isEmpty(ReportData.company)){
	companyName = ReportData.company.companyName;
    } else if(!_.isEmpty(ReportData.group)){
	companyName = ReportData.companyName;
	groupName = ReportData.group.groupName;
    } else if(!_.isEmpty(ReportData.store)){
	companyName = ReportData.companyName;
	groupName = ReportData.groupName;
	storeName = ReportData.store.storeName; 		
    }
    terminalName = name;
    
    var title = "".concat("Company : ").concat(companyName);
    if(groupName) title = title.concat(" , Group : ").concat(groupName);
    if(storeName) title = title.concat(" , Store : ").concat(storeName);
    title = title.concat(" , Terminal : ")
	.concat(terminalName);
    if(startDate) {
	title= title.concat(" , Date : ")
	    .concat(startDate.toString("yyyy/MM/dd"))
	    .concat(" ~ ")
	    .concat(endDate.toString("yyyy/MM/dd"));
    }
    
    return title;
};
