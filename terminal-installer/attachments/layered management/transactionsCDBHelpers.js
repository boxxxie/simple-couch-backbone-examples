function typedTransactionRangeQuery(view,db,base){
    return function(startDate,endDate){
	var startKey = base.concat(startDate);
	var endKey = base.concat(endDate);
	var options = {
	    reduce:true,
	    group_level:_.size(endKey),
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
	var sales,refunds = 0;
	_.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows,sum,0): sales = 0;
	return sales - refunds;
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
	     years:function(callback){companySalesRangeQuery(d.startOfYear,d.tomorrow)(returnQuery(callback));}
	    },
	    function(err,report){
		var cashouts = {};
		cashouts.yesterday = _.first(report.yesterday.rows);
		cashouts.month = _.first(report.month.rows);
		cashouts.year = _.first(report.year.rows);
		runAfter(cashouts);	  
	    });
};

function generalSalesReportArrayFetcher(view,db,ids,runAfter){
    async.map(ids, 
	      function(id,callback){
		  generalSalesReportFetcher(view,db,
					    id,
					    function(salesData){
						callback(null,salesData);
					    });
	      },
	      runAfter);
};

function generalCashoutReportArrayFetcher(view,db,ids,runAfter){
    async.map(ids, 
	      function(id,callback){
		  generalCashoutReportFetcher(view,db,
					    id,
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
	return generalSalesReportFetcher(transactionsView,transaction_db,ids,callback);
    }
    else{
	return generalSalesReportArrayFetcher(transactionsView,transaction_db,ids,callback);
    }
};