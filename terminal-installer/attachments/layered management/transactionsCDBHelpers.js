function generalSalesReportFetcher(view,db,id,runAfter){
    var transactionQuery = queryF(view,db);
    
    function typedTransactionRangeQuery(base){
	return function(startDate,endDate){
	    var startKey = base.concat(startDate);
	    var endKey = base.concat(endDate);
	    var options = {
		group_level:_.size(endKey),
		startkey:startKey,
		endkey:endKey
	    };
	    return transactionQuery(options);
	};
    }
    var today = _.first(Date.today().toArray(),3);
    var tomorrow = _.first(Date.today().addDays(1).toArray(),3);
    var yesterday = _.first(Date.today().addDays(-1).toArray(),3);

    var startOfMonth = _.first(Date.today().moveToFirstDayOfMonth().toArray(),3);
    var startOfYear = _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3);

    var companySalesBaseKey = [id];
    //var companyRefundBaseKey = [id,'REFUND'];

    var companySalesRangeQuery = typedTransactionRangeQuery(companySalesBaseKey);
   // var companyRefundRangeQuery = typedTransactionRangeQuery(companyRefundBaseKey);

    function extractTotalSales(salesData,refundData){
	function sum(total,cur){
	    return total + cur.value.sum;
	}
	var sales,refunds = 0;
	_.isFirstNotEmpty(salesData.rows)? sales = _.reduce(salesData.rows,sum,0): sales = 0;
	//_.isFirstNotEmpty(refundData.rows)? refunds = _.reduce(refundData.rows,sum,0): refunds = 0;
	return sales - refunds;
    }
    function returnQuery(callback){
	return function(query){
	    callback(null, query);
	};
    };

    var sales = {};
    async
	.parallel(
	    {yesterdaysSales:function(callback){companySalesRangeQuery(yesterday,today)(returnQuery(callback));},
	    // yesterdaysRefunds:function(callback){companyRefundRangeQuery(yesterday,today)(returnQuery(callback));},
	     monthsSales:function(callback){companySalesRangeQuery(startOfMonth,tomorrow)(returnQuery(callback));},
	    // monthsRefunds:function(callback){companyRefundRangeQuery(startOfMonth,tomorrow)(returnQuery(callback));},
	     yearsSales:function(callback){companySalesRangeQuery(startOfYear,tomorrow)(returnQuery(callback));}
	    // yearsRefunds:function(callback){companyRefundRangeQuery(startOfYear,tomorrow)(returnQuery(callback));}},
	    },
	    function(err,report){
		var sales = {};
		sales.yesterdaysales= extractTotalSales(report.yesterdaysSales,report.yesterdaysRefunds).toFixed(2);
		sales.mtdsales = extractTotalSales(report.monthsSales,report.monthsRefunds).toFixed(2);
		sales.ytdsales = extractTotalSales(report.yearsSales,report.yearsRefunds).toFixed(2);
		runAfter({sales:sales});	  
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
}
function transactionsSalesFetcher(ids,callback){
    var transactionsView = cdb.view('reporting','netsaleactivity');
    var transaction_db = cdb.db('cashouts');
    if(!_.isArray(ids)){
	return generalSalesReportFetcher(transactionsView,transaction_db,ids,callback);
    }
    else if(_.isArray(ids)){
	return generalSalesReportArrayFetcher(transactionsView,transaction_db,ids,callback);
    }
};