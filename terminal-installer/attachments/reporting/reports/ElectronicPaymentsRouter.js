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
	     view.el = $("#main");
	     
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
					     "(" + store.number + ")" + '</option>');
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
	     
	     $("#groupsdown")
           .change(function(){
               updateStoreDropdown();updateTerminalDropdown();
           });
         $("#storesdown")
           .change(function(){
               updateTerminalDropdown();
           });
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderElectronicPaymentsTable();
			});
	     
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
					     "(" + store.number + ")" + '</option>');
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
	     
	     $("#storesdown")
           .change(function(){
               updateTerminalDropdown();
           });
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderElectronicPaymentsTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStorePayments: function() {
	     
	     var html = ich.electronicPaymentsReports_TMP({startPage:"storeReport", 
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
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     $('option', dropdownStore).remove();
	     
	     dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value='
				  +ReportData.store.store_id+'>'+
				  ReportData.store.storeName+ 
				  "(" + ReportData.store.number + ")" + '</option>');

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
			    renderElectronicPaymentsTable();
			});
	     
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
	(function(err,response){

	     var data_TMP = response.paymentList;
	     data_TMP = appendGroupStoreInfoFromStoreID(data_TMP);
	     var totals = _.applyToValues(response.totals, toFixed(2));
	     
	     data_TMP = applyReceiptInfo(data_TMP);
	     data_TMP=
		 _.map(data_TMP, 
		       function(item){
			   return _.extend({},item);
		       });
	     
	     data_TMP = 
		 _.applyToValues(data_TMP, function(obj){
				     if(obj && obj.discount==0){
					 obj.discount=null;
				     }
				     if(obj && obj.quantity){
					 obj.orderamount = toFixed(2)(obj.price * obj.quantity);
					 obj.quantity+="";
					 if(obj.discount) {
					     obj.discountamount = toFixed(2)(obj.discount * obj.quantity);
					 }
				     }
				     return toFixed(2)(obj);
				 }, true);
	     
	     data_TMP = _.map(data_TMP, function(item){
				  if(item.payments) {
				      item.payments = _.map(item.payments, function(payment){
								if(payment.paymentdetail) {
								    payment.paymentdetail.crt = payment.type;
								}
								if(payment.paymentdetail && payment.paymentdetail.errmsg) {
								    payment.paymentdetail.errmsg = (payment.paymentdetail.errmsg).replace(/<br>/g," ");
								}
								return payment;
							    }); 
				  }
				  return item;
			      });
	     
	     data_TMP = 
		 _.applyToValues(data_TMP, function(obj){
				     var strObj = obj+"";
				     if(strObj.indexOf(".")>=0 && strObj.indexOf("$")<0) {
					 obj = currency_format(Number(obj));
				     }
				     return obj;
				 }, true);
	     totals =
		 _.applyToValues(totals,function(obj){
		     		     var strObj = obj+"";
				     if(strObj.indexOf(".")>=0) {
					 obj = currency_format(Number(obj));
				     }
				     return obj;
				 },true);
	     
	     var data = _(data_TMP).chain()
		 .map(function(item){
			  if(item.authCode=="refund") {
	                      var propsToChange = _.selectKeys(item,['credit','debit','sales','subTotal','tax1and2','tax3','total']);
			      
			      propsToChange =_(propsToChange).chain()
				  .map(function(val,key){
					   if(val!="0.00") {val = "-"+val;}
					   return [key,val];
				       })
				  .toObject()
				  .value();            
			      return _.extend({},item, propsToChange);
			  }
			  return item;
		      })
		 .value();
	     
	     if(_.isEmpty(data_TMP)){
		 var formatted_totals = false;	
	     }
	     else{
		 var formatted_totals = _(totals).chain()
		     .map(function(val,key){
			      if( (/_refund/).test(key)) {
	        		  if(val!="0.00") { val = "-"+val; }
	    		      }
			      return [key,val];
			  })
		     .toObject()
		     .value();
	     }
	     
	     var html = ich.electronicPaymentstable_TMP({items:data,totals:formatted_totals});
	     $("#reporttable").html(html);
	     
	     _.each(data_TMP, function(item){
			var item = _.clone(item);
			
			var dialogtitle=getDialogTitle(ReportData,item);
			
			$("[id]")
			    .filter(function(){return $(this).attr('id') == item._id;})
			    .each(function(){$(this).button()
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
							
							_.applyToValues(btnData,currency_format,true);
							
							var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
							quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
						    });
					    });	
		    });

	 });
    } else {
   	alert("Input Date");
    }
}

function getDialogTitle(ReportData, item, startDate, endDate) {
    var companyName, groupName, storeName, terminalName;
    /*
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
    */
    if(!_.isEmpty(ReportData.company)){
		companyName = ReportData.company.companyName;
    } else {
    	companyName = ReportData.companyName;
    }
    groupName = item.groupName;
    storeName = item.storeName;
    storeNumber = item.storeNumber;
    terminalName = item.name;
    
    var title = "".concat("Company : ").concat(companyName);
    if(groupName) title = title.concat(" , Group : ").concat(groupName);
    if(storeName) title = title.concat(" , Store : ").concat(storeName);
    if(storeNumber) title = title.concat(" , Store #: ").concat(storeNumber);
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


//FIXME:
function appendGroupStoreInfoFromStoreID(list) {
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
    
    
    var result = {};
    
    if(!_.isEmpty(ReportData.company)) {
	var groups = ReportData.company.hierarchy.groups;
	result = _.map(list, function(item){
				var namenum = getStoreNameNum(groups,item.store_id);
				return _.extend({},item,{groupName:getGroupName(groups,item.store_id),
								storeName:namenum.name,
								storeNumber:namenum.num
						       });
			    });
	
	return result;
	
    } else if(!_.isEmpty(ReportData.group)) {
	var groups = [ReportData.group];
	result = _.map(list, function(item){
				var namenum = getStoreNameNum(groups,item.store_id);
				return _.extend({},item,{groupName:getGroupName(groups,item.store_id),
								storeName:namenum.name,
								storeNumber:namenum.num
						       });
			    });
	
	return result;
	
    } else if(!_.isEmpty(ReportData.store)) {
	result = _.map(list, function(item){
				return _.extend({},item,{groupName:ReportData.groupName,
								storeName:ReportData.store.storeName,
								storeNumber:ReportData.store.number
						       });
			    });

	return result;
    }
};