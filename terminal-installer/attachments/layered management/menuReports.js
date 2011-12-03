
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

		//alert("group : " + groupdown.val() + " , store : " + storedown.val());
		
		var tomorrow = Date.today();
		var startOfYear = Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth();
		var ids = [];
		
		if(storedown.val()=="ALL") {
			_.each($('option', storedown), function(option){ if(option.value!=="ALL"){ids=ids.concat(option.value)}});
		} else {
			ids = ids.concat(_.isEmpty(storedown.val())?ReportData.store.store_id:storedown.val());
		}
		
		cashoutFetcher_Period(ids,startOfYear,tomorrow,
    		      function(a,for_TMP){
    		      	console.log("GO");
    		      	console.log(for_TMP);
    		      	var data_TMP = extractSalesSummaryTableInfo(for_TMP);
    		      	
    		      	var html = ich.salesSummaryTabel_TMP(data_TMP);
					$("summarytable").html(html);
    		      });
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
		result.totalsales = 100;
		result.totaltransactions=100;
		
		return result;
		
	} else if(!_.isEmpty(ReportData.group)) {
		
	} else if(!_.isEmpty(ReportData.store)) {
		
	}
};

