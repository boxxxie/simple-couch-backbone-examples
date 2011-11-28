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

    var companySalesBaseKey = [id,'SALE'];
    var companyRefundBaseKey = [id,'REFUND'];

    var companySalesRangeQuery = typedTransactionRangeQuery(companySalesBaseKey);
    var companyRefundRangeQuery = typedTransactionRangeQuery(companyRefundBaseKey);

    function extractTotalSales(salesData,refundData){
	var sales,refunds;
	_.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows).value.sum : sales = 0;
	_.isFirstNotEmpty(refundData.rows)? refunds = _.first(refundData.rows).value.sum : refunds = 0;
	return sales - refunds;
    }
    var sales = {};
    async
	.waterfall(
	    [function(callback){
		 companySalesRangeQuery(yesterday,today)
		 (function(salesData){
		      callback(null, salesData);
		  });
	     },
	     function(salesData, callback){
		 companyRefundRangeQuery(yesterday,today)
		 (function(refundData){
		      sales.yesterdaysales = extractTotalSales(salesData,refundData).toFixed(2);
		      callback(null);
		  });
	     },
	     function(callback){
		 companySalesRangeQuery(startOfMonth,tomorrow)
		 (function(salesData){
		      callback(null, salesData);
		  });
	     },
	     function(salesData, callback){
		 companyRefundRangeQuery(startOfMonth,tomorrow)
		 (function(refundData){
		      sales.mtdsales = extractTotalSales(salesData,refundData).toFixed(2);
		      callback(null);
		  });
	     },
	     function(callback){
		 companySalesRangeQuery(startOfYear,tomorrow)
		 (function(salesData){
		      callback(null, salesData);
		  });
	     },
	     function(salesData, callback){
		 companyRefundRangeQuery(startOfYear,tomorrow)
		 (function(refundData){
		      sales.ytdsales = extractTotalSales(salesData,refundData).toFixed(2);
		      callback(null);
		  });
	     },
	     function(callback){
		 runAfter({sales:sales});
		 callback(null, 'done');	  
	     }
	    ]);
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
    var transactionsView = cdb.view('reporting','id_type_date');
    var transaction_db = cdb.db('transactions');
    if(!_.isArray(ids)){
	return generalSalesReportFetcher(transactionsView,transaction_db,ids,callback);
    }
    else if(_.isArray(ids)){
	return generalSalesReportArrayFetcher(transactionsView,transaction_db,ids,callback);
    }
};