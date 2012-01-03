var menuReportsTaxCollectedRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuReports/companyReportTaxCollected":"menuReportsCompanyTaxes",
	     	  "menuReports/groupReportTaxCollected":"menuReportsGroupTaxes",
		  "menuReports/storeReportTaxCollected":"menuReportsStoreTaxes"
	      },
	      menuReportsCompanyTaxes:function() {
		  console.log("menuReportsCompanyTaxes  ");
	      },
	      menuReportsGroupTaxes:function() {
		  console.log("menuReportsGroupTaxes  ");
	      },
	      menuReportsStoreTaxes:function() {
		  console.log("menuReportsStoreTaxes  ");
	      }	      
	     }));

var menuReportsTaxCollectedView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyTaxes',
		       'renderMenuReportsGroupTaxes',
		       'renderMenuReportsStoreTaxes');
	     menuReportsTaxCollectedRouter
		 .bind('route:menuReportsCompanyTaxes', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanyTaxes");
			   view.renderMenuReportsCompanyTaxes();
		       });
	     
	     menuReportsTaxCollectedRouter
		 .bind('route:menuReportsGroupTaxes', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupTaxes");
			   view.renderMenuReportsGroupTaxes();
		       });
	     
	     menuReportsTaxCollectedRouter
		 .bind('route:menuReportsStoreTaxes', 
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreTaxes");
			   view.renderMenuReportsStoreTaxes();
		       });
	 },
	 renderMenuReportsCompanyTaxes: function() {
	     
	     var html = ich.taxCollectedReports_TMP({startPage:"companyReport", 
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
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderTaxCollectedTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupTaxes: function() {
	     
	     var html = ich.taxCollectedReports_TMP({startPage:"groupReport", 
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
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderTaxCollectedTable();
				   });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreTaxes: function() {
	     
	     var html = ich.taxCollectedReports_TMP({startPage:"storeReport", 
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
	     
	     var btn = $('#generalgobtn')
			    .button()
			    .click(function(){
				      renderTaxCollectedTable();
				   });
	     
	     console.log("rendered general report");
	 }
	});

/******************************************** helper functions ************************************/
function renderTaxCollectedTable() {
    console.log("renderTaxCollectedTable");
    
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

	taxReportFetcher(ids,startDate,endDateForQuery,function(data_TMP){
				//TODO: to be refracted
				var totalrow={};
				totalrow.sales = (_.reduce(data_TMP, function(init, item){
									return init + Number(item.sales);
								}, 0)).toFixed(2);
				totalrow.tax1 = (_.reduce(data_TMP, function(init, item){
									return init + Number(item.tax1);
								}, 0)).toFixed(2);
				totalrow.tax3 = (_.reduce(data_TMP, function(init, item){
									return init + Number(item.tax3);
								}, 0)).toFixed(2);
				totalrow.totalsales = (_.reduce(data_TMP, function(init, item){
									return init + Number(item.totalsales);
								}, 0)).toFixed(2);
				
			     data_TMP=
				 _.map(data_TMP, function(item){
						item._id = item.id;
					   return item;
				       });
			     data_TMP = _.applyToValues(data_TMP,toFixed(2),true);
			     
			     if(_.isEmpty(data_TMP)){
				 var html = "<p>There are no taxes collected for this time period</p>";	 
			     }
			     else{
			     	/*data_TMP = _.map(data_TMP, function(item){
			     		item.firstindex = Number(item.firstindex)+"";
			     		item.lastindex = Number(item.lastindex)+"";
			     		return item;
			     	});*/
			     	_.applyToValues(data_TMP, function(obj){
					     var strObj = obj+"";
					     if(strObj.indexOf(".")>=0) {
					     	obj = toFixedWithSep(2)(obj);
					     }
					     return obj;
					 }, true);
					 _.applyToValues(totalrow, function(obj){
					     var strObj = obj+"";
					     if(strObj.indexOf(".")>=0) {
					     	obj = toFixedWithSep(2)(obj);
					     }
					     return obj;
					 }, true);
				 var html = ich.taxCollectedTabel_TMP({items:data_TMP, totalrow:totalrow});
			     }

			     $("#taxcollectedtable").html(html);
			     _.each(data_TMP, function(item){	
					var btn = $('#'+item._id)
					    .button()
					    .click(function(){
					    	var dialogtitle= getDialogTitle(ReportData,
									   item.name,
									   startDate,
									   endDateForQuery);
							var firstindex = Number(item.firstindex)+"";
			     			var lastindex = Number(item.lastindex)+"";
							quickTaxView(item._id,dialogtitle ,firstindex,lastindex);
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
