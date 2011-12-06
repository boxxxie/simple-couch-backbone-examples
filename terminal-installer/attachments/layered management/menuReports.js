
function updateStoreDropdown() {
	var groups = ReportData.company.hierarchy.groups;
	var dropdownGroup = $("#groupsdown");
	var dropdownStore = $("#storesdown");
	$('option', dropdownStore).remove();
	dropdownStore.append('<option value="ALL">ALL</option>');
	
	if(dropdownGroup.val()=="ALL") {
		var stores = _(groups).chain().map(function(group) {
					       return group.stores; 
					   }).flatten().value();
					   
		_.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 		});		
	} else {
		var group = _.filter(groups, function(group){ return group.group_id==dropdownGroup.val();});
		var stores = group[0].stores;
		_.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 		}); 
	}
};


function renderSalesSummaryReportTable() {
		console.log("renderSalesSummaryReportTable");
		var groupdown = $("#groupsdown");
		var storedown = $("#storesdown");

	if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
		var startDate = new Date($("#dateFrom").val());
		var endDate = new Date($("#dateTo").val());
		
		if(startDate.equals(endDate)) {
			endDate.addDays(1);
		}
		
		var ids = [];
		
		if(storedown.val()=="ALL") {
			_.each($('option', storedown), function(option){ if(option.value!=="ALL"){ids=ids.concat(option.value)}});
		} else {
			ids = ids.concat(_.isEmpty(storedown.val())?ReportData.store.store_id:storedown.val());
		}
		
		cashoutFetcher_Period(ids,startDate,endDate,
    		      function(a,for_TMP){
    		      	console.log(for_TMP);
    		      	var data_TMP = extractSalesSummaryTableInfo(for_TMP);
    		      	
    		      	var html = ich.salesSummaryTabel_TMP(data_TMP);
					$("summarytable").html(html);
    		      });
   } else {
   	alert("Input Date");
   }
};



function extractSalesSummaryTableInfo(list) {
	function getGroupName(groups, store_id) {
		var name="";
		_.each(groups, function(group){
			name = !_(group.stores).chain()
								  .pluck("store_id")
								  .filter(function(id){return id==store_id})
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
	
	function appendTotals(inputs) {
		var input = _.clone(inputs);
		var total={};
		
		total.totalsales = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.sales)+init},0)
								  .value()
								  .toFixed(2);

		total.totaltransactions=_(input.list).chain()
									  .pluck('summary')
									  .reduce(function(init,item){ return Number(item.numberoftransactions)+init},0)
									  .value();
		total.totaltax1 = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.tax1)+init},0)
								  .value()
								  .toFixed(2);
		total.totaltax3 = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.tax3)+init},0)
								  .value()
								  .toFixed(2);
		total.totaltotalsales = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.totalsales)+init},0)
								  .value()
								  .toFixed(2);
		total.totalcash = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.cash)+init},0)
								  .value()
								  .toFixed(2);
		total.totalcredit = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.credit)+init},0)
								  .value()
								  .toFixed(2);
		total.totaldebit = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.debit)+init},0)
								  .value()
								  .toFixed(2);
		total.totalmobile = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.mobile)+init},0)
								  .value()
								  .toFixed(2);
		total.totalother = _(input.list).chain()
								  .pluck('summary')
								  .reduce(function(init,item){ return Number(item.other)+init},0)
								  .value()
								  .toFixed(2);
		input.total = total;
		return input;
	};
	
	var result = {};
	
	if(!_.isEmpty(ReportData.company)) {
		var groups = ReportData.company.hierarchy.groups;
		result.list = _.map(list, function(item){
			var peroid = item.period;
			var namenum = getStoreNameNum(groups,item.id);
			return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					summary:{
						numberoftransactions:peroid.noofpayment+peroid.noofrefund,
						sales:(peroid.netsales-peroid.netrefund).toFixed(2),
						tax1:(peroid.netsaletax1-peroid.netrefundtax1).toFixed(2),
						tax3:(peroid.netsaletax3-peroid.netrefundtax3).toFixed(2),
						totalsales:(Number(peroid.netsalestotal)).toFixed(2),
						cash:(peroid.cashpayment-peroid.cashrefund).toFixed(2),
						credit:(peroid.creditpayment-peroid.creditrefund).toFixed(2),
						debit:(peroid.debitpayment-peroid.debitrefund).toFixed(2),
						mobile:(peroid.mobilepayment-peroid.mobilerefund).toFixed(2),
						other:(peroid.otherpayment-peroid.otherrefund).toFixed(2)
					}};
		});
		
		
		result = appendTotals(result);
		return result;
		
	} else if(!_.isEmpty(ReportData.group)) {
		var groups = [ReportData.group];
		result.list = _.map(list, function(item){
			var peroid = item.period;
			var namenum = getStoreNameNum(groups,item.id);
			return {groupName:getGroupName(groups,item.id),
					storeName:namenum.name,
					storeNumber:namenum.num,
					summary:{
						numberoftransactions:peroid.noofpayment+peroid.noofrefund,
						sales:(peroid.netsales-peroid.netrefund).toFixed(2),
						tax1:(peroid.netsaletax1-peroid.netrefundtax1).toFixed(2),
						tax3:(peroid.netsaletax3-peroid.netrefundtax3).toFixed(2),
						totalsales:(Number(peroid.netsalestotal)).toFixed(2),
						cash:(peroid.cashpayment-peroid.cashrefund).toFixed(2),
						credit:(peroid.creditpayment-peroid.creditrefund).toFixed(2),
						debit:(peroid.debitpayment-peroid.debitrefund).toFixed(2),
						mobile:(peroid.mobilepayment-peroid.mobilerefund).toFixed(2),
						other:(peroid.otherpayment-peroid.otherrefund).toFixed(2)
					}};
		});
		
		
		result = appendTotals(result);
		return result;
		
	} else if(!_.isEmpty(ReportData.store)) {
		//var groups = [ReportData.group];
		result.list = _.map(list, function(item){
			var peroid = item.period;
			//var namenum = getStoreNameNum(groups,item.id);
			return {groupName:ReportData.groupName,//getGroupName(groups,item.id),
					storeName:ReportData.store.storeName,//namenum.name,
					storeNumber:ReportData.store.number,
					summary:{
						numberoftransactions:peroid.noofpayment+peroid.noofrefund,
						sales:(peroid.netsales-peroid.netrefund).toFixed(2),
						tax1:(peroid.netsaletax1-peroid.netrefundtax1).toFixed(2),
						tax3:(peroid.netsaletax3-peroid.netrefundtax3).toFixed(2),
						totalsales:(Number(peroid.netsalestotal)).toFixed(2),
						cash:(peroid.cashpayment-peroid.cashrefund).toFixed(2),
						credit:(peroid.creditpayment-peroid.creditrefund).toFixed(2),
						debit:(peroid.debitpayment-peroid.debitrefund).toFixed(2),
						mobile:(peroid.mobilepayment-peroid.mobilerefund).toFixed(2),
						other:(peroid.otherpayment-peroid.otherrefund).toFixed(2)
					}};
		});
		
		
		result = appendTotals(result);
		return result;
	}
};

