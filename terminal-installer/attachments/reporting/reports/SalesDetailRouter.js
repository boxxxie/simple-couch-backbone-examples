var menuReportsSalesDetailRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportSalesDetail":"menuReportsCompanySalesDetail",
		  "menuReports/groupReportSalesDetail":"menuReportsGroupSalesDetail",
		  "menuReports/storeReportSalesDetail":"menuReportsStoreSalesDetail"
	      },
	      menuReportsCompanySalesDetail:function() {
		  console.log("menuReportsCompanySalesDetail  ");
	      },
	      menuReportsGroupSalesDetail:function() {
		  console.log("menuReportsGroupSalesDetail  ");
	      },
	      menuReportsStoreSalesDetail:function() {
		  console.log("menuReportsStoreSalesDetail  ");
	      }
	     }));


var menuReportsSalesDetailView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanySalesDetail',
		       'renderMenuReportsGroupSalesDetail',
		       'renderMenuReportsStoreSalesDetail');
	     menuReportsSalesDetailRouter
		 .bind('route:menuReportsCompanySalesDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsCompanySalesDetail");
			   view.renderMenuReportsCompanySalesDetail();
		       });
	     menuReportsSalesDetailRouter
		 .bind('route:menuReportsGroupSalesDetail', 
		       function(){
			   console.log("menuReportsView, route:menuReportsGroupSalesDetail");
			   view.renderMenuReportsGroupSalesDetail();
		       });
	     menuReportsSalesDetailRouter
		 .bind('route:menuReportsStoreSalesDetail',
		       function(){
			   console.log("menuReportsView, route:menuReportsStoreSalesDetail");
			   view.renderMenuReportsStoreSalesDetail();
		       });
	 },
	 renderMenuReportsCompanySalesDetail: function() {
	     
	     var html = ich.salesDetailReports_TMP({startPage:"companyReport", 
	     					    breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(this.el).html(html);
	     
	     resetDatePicker();
	     
	     //resetGroupStoreDropdownbox(ReportData, true);
             resetDropdownBox(ReportData, false, true);
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderSalesDetailReportTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupSalesDetail: function() {
	     
	     var html = ich.salesDetailReports_TMP({startPage:"groupReport", 
	 					    breadCrumb:breadCrumb(ReportData.companyName,
	 					     			  ReportData.group.groupName)});
	     $(this.el).html(html);
	     
	     resetDatePicker();
	     
	     //resetGroupStoreDropdownbox(ReportData, true);
             resetDropdownBox(ReportData, false, true);
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderSalesDetailReportTable();
			});
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreSalesDetail: function() {
	     
	     var html = ich.salesDetailReports_TMP({startPage:"storeReport", 
	 					    breadCrumb:breadCrumb(ReportData.companyName,
	 					     			  ReportData.groupName,
	 					     			  ReportData.store.storeName,
	 					     			  ReportData.store.number)});
	     $(this.el).html(html);
	     
	     resetDatePicker();
	     
	     //resetGroupStoreDropdownbox(ReportData, true);
             resetDropdownBox(ReportData, false, true);
	     
	     var btn = $('#generalgobtn')
		 .button()
		 .click(function(){
			    renderSalesDetailReportTable();
			});
	     
	     console.log("rendered general report");
	 }
	});

/********************************************* helper functions ***************************************/

function renderSalesDetailReportTable() {
    console.log("renderSalesDetailReportTable");
    var groupdown = $("#groupsdown");
    var storedown = $("#storesdown");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	endDateForQuery.addDays(1);
	
	var ids = [];
	
	if(storedown.val()=="ALL") {
	    _.each($('option', storedown), function(option){ if(option.value!=="ALL"){ids=ids.concat(option.value);}});
	} else {
	    ids = ids.concat(_.isEmpty(storedown.val())?ReportData.store.store_id:storedown.val());
	}
	
	var dayCounter = startDate.clone();
	var daysList = [dayCounter.clone()];
	while(Date.compare(dayCounter.addDays(1),endDate) != 1){
	    daysList.push(dayCounter.clone());
	}

	async.map(daysList,
		  function(day,callback){  
		      cashoutFetcher_Period(ids,day,day.clone().addDays(1),
					    function(err,data){
						var withDates = _(data).map(function(item){return _.extend(item,{date:datePartFormatter(day)});});
						callback(err,withDates);
					    });
		  },
		  function(a,for_TMP){
	      	      console.log(for_TMP);
	      	      //TODO
	      	      for_TMP = _(for_TMP).flatten();
	      	      
	      	      var data_TMP = extractSalesDetailTableInfo(for_TMP);
	      	      
	      	      var html = ich.salesDetailtable_TMP(data_TMP);
		      $("#salesdetailtable").html(html);
		  });
    } else {
   	alert("Input Date");
    }
};



function extractSalesDetailTableInfo(list) {
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
    
    function getSalesDetail(item) {
    	return {
	    numberoftransactions:Number(item.noofsale)+"",
	    sales:currency_format(item.netsales),
	    tax1:currency_format(item.netsaletax1),
	    tax3:currency_format(item.netsaletax3),
	    totalsales:currency_format(Number(item.netsalestotal)),
	    cash:currency_format(item.cashpayment),
	    credit:currency_format(item.creditpayment),
	    debit:currency_format(item.debitpayment),
	    mobile:currency_format(item.mobilepayment),
	    other:currency_format(item.otherpayment)
	};
    };
    
    function getRefundsDetail(item) {
    	var refund,tax1,tax3,total,cash,credit,debit,mobile,other;
    	
    	refund = ((Number(item.netrefund))>0)? "-" + currency_format(item.netrefund):currency_format(item.netrefund);
    	tax1 = ((Number(item.netrefundtax1))>0)? "-" + currency_format(item.netrefundtax1):currency_format(item.netrefundtax1);
    	tax3 = ((Number(item.netrefundtax3))>0)? "-" + currency_format(item.netrefundtax3):currency_format(item.netrefundtax3);
    	total = ((Number(item.netrefundtotal))>0)? "-" + currency_format(item.netrefundtotal):currency_format(item.netrefundtotal);
    	cash = ((Number(item.cashrefund))>0)? "-" + currency_format(item.cashrefund):currency_format(item.cashrefund);
    	credit = ((Number(item.creditrefund))>0)? "-" + currency_format(item.creditrefund):currency_format(item.creditrefund);
    	debit = ((Number(item.debitrefund))>0)? "-" + currency_format(item.debitrefund):currency_format(item.debitrefund);
    	mobile = ((Number(item.mobilerefund))>0)? "-" + currency_format(item.mobilerefund):currency_format(item.mobilerefund);
    	other = ((Number(item.otherrefund))>0)? "-" + currency_format(item.otherrefund):currency_format(item.otherrefund);
    	
    	return {
	    numberoftransactions:Number(item.noofrefund)+"",
	    sales:refund,
	    tax1:tax1,
	    tax3:tax3,
	    totalsales:total,
	    cash:cash,
	    credit:credit,
	    debit:debit,
	    mobile:mobile,
	    other:other
	};
    };
    
    // toFixedWithSep will be done after totalrow is calculated
    function getTotalDetail(item) {
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
	
	total.totalsales = currency_format(_(input.list).chain()
					   .pluck('totalrow')
					   .reduce(function(init,item){ return Number(item.sales)+init;},0)
					   .value())
	;

	total.totaltransactions=_(input.list).chain()
	    .pluck('totalrow')
	    .reduce(function(init,item){ return Number(item.numberoftransactions)+init;},0)
	    .value();
	total.totaltax1 = currency_format(_(input.list).chain()
					  .pluck('totalrow')
					  .reduce(function(init,item){ return Number(item.tax1)+init;},0)
					  .value());
	total.totaltax3 = currency_format(_(input.list).chain()
					  .pluck('totalrow')
					  .reduce(function(init,item){ return Number(item.tax3)+init;},0)
					  .value());
	total.totaltotalsales = currency_format(_(input.list).chain()
						.pluck('totalrow')
						.reduce(function(init,item){ return Number(item.totalsales)+init;},0)
						.value());
	total.totalcash = currency_format(_(input.list).chain()
					  .pluck('totalrow')
					  .reduce(function(init,item){ return Number(item.cash)+init;},0)
					  .value());
	total.totalcredit = currency_format(_(input.list).chain()
					    .pluck('totalrow')
					    .reduce(function(init,item){ return Number(item.credit)+init;},0)
					    .value());
	total.totaldebit = currency_format(_(input.list).chain()
					   .pluck('totalrow')
					   .reduce(function(init,item){ return Number(item.debit)+init;},0)
					   .value());
	total.totalmobile = currency_format(_(input.list).chain()
					    .pluck('totalrow')
					    .reduce(function(init,item){ return Number(item.mobile)+init;},0)
					    .value());
	total.totalother = currency_format(_(input.list).chain()
					   .pluck('totalrow')
					   .reduce(function(init,item){ return Number(item.other)+init;},0)
					   .value());
	input.total = total;
	
	return input;
    };
    
    var result = {};
    
    if(!_.isEmpty(ReportData.company)) {
	var groups = ReportData.company.hierarchy.groups;
	result.list = _.map(list, function(item){
				//var cashout = item.cashout;
				var cashout = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					date:item.date,
					salerow:getSalesDetail(cashout),
					refundrow:getRefundsDetail(cashout),
					totalrow:getTotalDetail(cashout)
				       };
			    });
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
				_.applyToValues(item.totalrow, function(obj){
						    var strObj = obj+"";
						    if(strObj.indexOf(".")>=0) {
					     		obj = currency_format(Number(obj));
						    }
						    return obj;
						}, true);
				_.applyToValues(item.salerow, function(obj){
						    var strObj = obj+"";
						    if(strObj.indexOf(".")>=0 && strObj.indexOf(",")<0 ) {
					     		obj = currency_format(Number(obj));
						    }
						    return obj;
						}, true);
				_.applyToValues(item.refundrow, function(obj){
						    var strObj = obj+"";
						    if(strObj.indexOf(".")>=0 && strObj.indexOf(",")<0 ) {
					     		if(strObj!="0.00") { obj = "-" + currency_format(Number(obj)*-1); }
						    }
						    return obj;
						}, true);
				
				return item;
			    });
	
	return result;
	
    } else if(!_.isEmpty(ReportData.group)) {
	var groups = [ReportData.group];
	result.list = _.map(list, function(item){
				//var cashout = item.cashout;
				var cashout = item.period;
				var namenum = getStoreNameNum(groups,item.id);
				return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					date:item.date,
					salerow:getSalesDetail(cashout),
					refundrow:getRefundsDetail(cashout),
					totalrow:getTotalDetail(cashout)
				       };
			    });
	
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
				_.applyToValues(item.totalrow, function(obj){
						    var strObj = obj+"";
						    if(strObj.indexOf(".")>=0) {
					     		obj = currency_format(obj);
						    }
						    return obj;
						}, true);
				return item;
			    });
	
	return result;
	
    } else if(!_.isEmpty(ReportData.store)) {
	result.list = _.map(list, function(item){
				//var cashout = item.cashout;
				var cashout = item.period;
				return {groupName:ReportData.groupName,
					storeName:ReportData.store.storeName,
					storeNumber:ReportData.store.number,
					date:item.date,
					salerow:getSalesDetail(cashout),
					refundrow:getRefundsDetail(cashout),
					totalrow:getTotalDetail(cashout)
				       };
			    });
	
	
	result = appendTotals(result);
	
	result.list = _.map(result.list, function(item){
				_.applyToValues(item.totalrow, function(obj){
						    var strObj = obj+"";
						    if(strObj.indexOf(".")>=0) {
					     		obj = currency_format(obj);
						    }
						    return obj;
						}, true);
				return item;
			    });
	
	return result;
    }
};