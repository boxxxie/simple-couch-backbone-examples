var ZEROED_FIELDS = {allDiscount: 0, netsales: 0, netsaletax1: 0, netsaletax3: 0, netsalestotal: 0, netrefund: 0, netrefundtax1: 0, netrefundtax3: 0, netrefundtotal: 0, netsaleactivity: 0, cashpayment: 0, creditpayment: 0, debitpayment: 0, mobilepayment: 0, otherpayment: 0, noofpayment: 0, avgpayment: 0, cashrefund: 0, creditrefund: 0, debitrefund: 0, mobilerefund: 0, otherrefund: 0, noofrefund: 0, avgrefund: 0, menusalesno: 0, menusalesamount: 0, scansalesno: 0, scansalesamount: 0, ecrsalesno: 0, ecrsalesamount: 0};

function toFixed(mag){
    return function(num){
	return num.toFixed(mag);
    };
}

function typedTransactionRangeQuery(view,db,base){
    return function(startDate,endDate){
	var startKey = base.concat(startDate);
	var endKey = base.concat(endDate);
	var options = {
	    reduce:true,
	    //group_level:_.size(endKey),
	    startkey:startKey,
	    endkey:endKey
	};
	return queryF(view,db)(options);
    };
};

function relative_dates(){
    return {
	today : _.first(Date.today().toArray(),3),
	tomorrow : _.first(Date.today().addDays(1).toArray(),3),
	yesterday : _.first(Date.today().addDays(-1).toArray(),3),
	startOfMonth : _.first(Date.today().moveToFirstDayOfMonth().toArray(),3),
	startOfYear : _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3)
    };
};

function returnQuery(callback){
    return function(query){
	callback(null, query);
    };
};

function generalSalesReportFetcher(view,db,id,runAfter){
    var companySalesBaseKey = [id];
    var companySalesRangeQuery = typedTransactionRangeQuery(view,db,companySalesBaseKey);

    function extractTotalSales(salesData,refundData){
	function sum(total,cur){
	    return total + cur.value.sum;
	}
	var sales = 0;
	_.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows).value.sum: sales = 0;
	return sales;
    }
    var d = relative_dates();
    async
	.parallel(
	    {yesterdaysSales:function(callback){companySalesRangeQuery(d.yesterday,d.today)(returnQuery(callback));},
	     monthsSales:function(callback){companySalesRangeQuery(d.startOfMonth,d.tomorrow)(returnQuery(callback));},
	     yearsSales:function(callback){companySalesRangeQuery(d.startOfYear,d.tomorrow)(returnQuery(callback));}
	    },
	    function(err,report){
		var sales = {};
		sales.yesterdaysales= extractTotalSales(report.yesterdaysSales,report.yesterdaysRefunds).toFixed(2);
		sales.mtdsales = extractTotalSales(report.monthsSales,report.monthsRefunds).toFixed(2);
		sales.ytdsales = extractTotalSales(report.yearsSales,report.yearsRefunds).toFixed(2);
		runAfter({sales:sales});	  
	    });
};

function generalCashoutReportFetcher(view,db,id,runAfter){
    var companySalesBaseKey = [id];
    var companySalesRangeQuery = typedTransactionRangeQuery(view,db,companySalesBaseKey);
    var d = relative_dates();
    async
	.parallel(
	    {yesterday:function(callback){companySalesRangeQuery(d.yesterday,d.today)(returnQuery(callback));},
	     month:function(callback){companySalesRangeQuery(d.startOfMonth,d.tomorrow)(returnQuery(callback));},
	     year:function(callback){companySalesRangeQuery(d.startOfYear,d.tomorrow)(returnQuery(callback));}
	    },
	    function(err,report){
		var cashouts = {};
		cashouts.yesterday = (_.isFirstNotEmpty(report.yesterday.rows)? _.first(report.yesterday.rows).value:ZEROED_FIELDS);
		cashouts.mtd = (_.isFirstNotEmpty(report.month.rows)? _.first(report.month.rows).value:ZEROED_FIELDS);
		cashouts.ytd = (_.isFirstNotEmpty(report.year.rows)? _.first(report.year.rows).value:ZEROED_FIELDS);

		function appendCategorySalesPercent(total, cashoutReport) {
		    var cashout = _.clone(cashoutReport);
		    if(total!=0) {
			cashout.menusalespercent = cashout.menusalesamount / total*100;
			cashout.ecrsalespercent = cashout.ecrsalesamount / total*100;
			cashout.scansalespercent = cashout.scansalesamount / total*100;
		    } else {
			cashout.menusalespercent = 0;
			cashout.ecrsalespercent = 0;
			cashout.scansalespercent = 0;
		    }
		    return cashout;
		};
		
		function modifiedCashouts(input) {
		    var data = _.clone(input);
		    return _(data).chain()
			.applyToValues(toFixed(2))
			.extend(_.selectKeys(data, ['noofpayment','noofrefund']))
			.value();
		};
		
		var totalyesterday = cashouts.yesterday['menusalesamount'] + cashouts.yesterday['scansalesamount'] + cashouts.yesterday['ecrsalesamount'];
		var totalmtd = cashouts.mtd['menusalesamount'] + cashouts.mtd['scansalesamount'] + cashouts.mtd['ecrsalesamount'];
		var totalytd = cashouts.ytd['menusalesamount'] + cashouts.ytd['scansalesamount'] + cashouts.ytd['ecrsalesamount'];
		
		cashouts.yesterday = appendCategorySalesPercent(totalyesterday, cashouts.yesterday);
		cashouts.mtd = appendCategorySalesPercent(totalmtd, cashouts.mtd);
		cashouts.ytd = appendCategorySalesPercent(totalytd, cashouts.ytd);

		cashouts.yesterday = modifiedCashouts(cashouts.yesterday); 
		cashouts.mtd = modifiedCashouts(cashouts.mtd);
		cashouts.ytd = modifiedCashouts(cashouts.ytd);
		
		
		runAfter(cashouts);	  
	    });
};

function generalCashoutFetcher_Period(view,db,id,startDate,endDate,runAfter){
    var companySalesBaseKey = [id];
    var companySalesRangeQuery = typedTransactionRangeQuery(view,db,companySalesBaseKey);
    //var d = relative_dates();
    
    var dateStart = _.first(startDate.toArray(),3);
    var dateEnd = _.first(endDate.toArray(),3);
    
    async
	.parallel(
	    {period:function(callback){companySalesRangeQuery(dateStart,dateEnd)(returnQuery(callback));},
	    },
	    function(err,report){
		var cashouts = {};
		cashouts.period = (_.isFirstNotEmpty(report.period.rows)? _.first(report.period.rows).value:ZEROED_FIELDS);

		function appendCategorySalesPercent(total, cashoutReport) {
		    var cashout = _.clone(cashoutReport);
		    if(total!=0) {
			cashout.menusalespercent = cashout.menusalesamount / total*100;
			cashout.ecrsalespercent = cashout.ecrsalesamount / total*100;
			cashout.scansalespercent = cashout.scansalesamount / total*100;
		    } else {
			cashout.menusalespercent = 0;
			cashout.ecrsalespercent = 0;
			cashout.scansalespercent = 0;
		    }
		    return cashout;
		};
		
		function modifiedCashouts(input) {
		    var data = _.clone(input);
		    return _(data).chain()
			.applyToValues(toFixed(2))
			.extend(_.selectKeys(data, ['noofpayment','noofrefund']))
			.value();
		};
		
		var totalperiod = cashouts.period['menusalesamount'] + cashouts.period['scansalesamount'] + cashouts.period['ecrsalesamount'];
		
		cashouts.period = appendCategorySalesPercent(totalperiod, cashouts.period);

		cashouts.period = modifiedCashouts(cashouts.period); 
		
		// add
		cashouts.id = id;
		
		runAfter(cashouts);	  
	    });
};

function generalSalesReportArrayFetcher(view,db,ids,runAfter){
     async.map(ids, 
	      function(id,callback){
		  generalSalesReportFetcher(view,db,id,
					    function(salesData){
						callback(null,salesData);
					    });
	      },
	      runAfter);
};

function generalCashoutReportArrayFetcher(view,db,ids,runAfter){
    async.map(ids, 
	      function(id,callback){
		  generalCashoutReportFetcher(view,db,id,
					      function(salesData){
						  callback(null,salesData);
					      });
	      },
	      runAfter);
};

function generalCashoutArrayFetcher_Period(view,db,ids,startDate,endDate,runAfter) {
	async.map(ids, 
	      function(id,callback){
		  generalCashoutFetcher_Period(view,db,id,startDate,endDate,
					      function(salesData){
						  callback(null,salesData);
					      });
	      },
	      runAfter);
};

function transactionsSalesFetcher(ids,callback){
    var transactionsView = cdb.view('reporting','netsaleactivity');
    var transaction_db = cdb.db('cashouts');
    if(!_.isArray(ids)){
	return generalSalesReportFetcher(transactionsView,transaction_db,ids,callback);
    }
    else{
	return generalSalesReportArrayFetcher(transactionsView,transaction_db,ids,callback);
    }
};

function cashoutFetcher(ids,callback){
    var transactionsView = cdb.view('reporting','cashouts_id_date');
    var transaction_db = cdb.db('cashouts');
    if(!_.isArray(ids)){
	return generalCashoutReportFetcher(transactionsView,transaction_db,ids,callback);
    }
    else{
	return generalCashoutReportArrayFetcher(transactionsView,transaction_db,ids,callback);
    }
};

function cashoutFetcher_Period(ids,startDate,endDate,callback){
    var transactionsView = cdb.view('reporting','cashouts_id_date');
    var transaction_db = cdb.db('cashouts');
    if(!_.isArray(ids)){
	return generalCashoutFetcher_Period(transactionsView,transaction_db,ids,startDate,endDate,callback);
    }
    else{
	return generalCashoutArrayFetcher_Period(transactionsView,transaction_db,ids,startDate,endDate,callback);
    }
};