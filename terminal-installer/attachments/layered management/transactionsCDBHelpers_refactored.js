var date = { toArray : { until : { day : function(date){return _.first(date.toArray(),3);}}}};
var _async = {
    transactionRangeQuery:function(start,end){
	return function(view,db,base){
	    var startKey = base.concat(start);
	    var endKey = base.concat(end);
	    var options = {
		reduce:false,
		include_docs: true,
		startkey:startKey,
		endkey:endKey
	    };
	    return function(callback){queryF(view,db)(options)(returnQuery(callback));};
	};
    },
    typedTransactionQuery:function(startDate,endDate){
	return function(view,db,base){
	    var startKey = base.concat(startDate);
	    var endKey = base.concat(endDate);
	    var options = {
		reduce:true,
		startkey:startKey,
		endkey:endKey
	    };
	    return function(callback){queryF(view,db)(options)(returnQuery(callback));};
	};
    },
    map:function(array,fn,runAfter){
	/*
	 * fn() must return a function of the form fn(err,response)
	 */
	async.map(array, 
		  function(array_item,callback){fn(array_item)(callback);},
		  runAfter);
    }
};


function extractDocs(parallelFunctionsArray){
    return function(callback){
	async.parallel(parallelFunctionsArray,
		       function(err,responses){  
			   var extractedData = 
			       _(responses)
			       .chain()
			       .pluck('rows')
			       .flatten()
			       .pluck('doc')
			       .value();
			   callback(err,extractedData);	  
		       });
    };
}
function canceledTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','terminalID_type_index');
    var db = cdb.db('transactions');
    return function(startIndex,endIndex){
	var voids = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"VOID"]);
	var voidRefunds = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"VOIDREFUND"]);
	return extractDocs([voids,voidRefunds]);
    };
}
function discountTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','Discounts_terminalID_type_index');
    var db = cdb.db('transactions');
    return function(startIndex,endIndex){
	var sales = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"SALE"]);
	return extractDocs([sales]);
    };
}
function refundTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','terminalID_type_index');
    var db = cdb.db('transactions');
    return function(startIndex,endIndex){
	var refunds = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"REFUND"]);
	return extractDocs([refunds]);
    };
};
function generalCashoutListFetcher_Period_F(startDate,endDate){
    var view = cdb.view('reporting','cashouts_id_date');
    var db = cdb.db('cashouts');
    return function(id){
	var dateStart = date.toArray.until.day(startDate);
	var dateEnd = date.toArray.until.day(endDate);
	var cashouts = _async.transactionRangeQuery(dateStart,dateEnd)(view,db,[id]);
	return extractDocs([cashouts]);
    };
};
function generalCashoutFetcher_Period_F(startDate,endDate){
    var view = cdb.view('reporting','cashouts_id_date');
    var db = cdb.db('cashouts');
    return function(id){
	return function(callback){
	    
            var baseKey = [id];
	    var dateStart = date.toArray.until.day(startDate);
	    var dateEnd = date.toArray.until.day(endDate);

            var cashoutQuery = _async.typedTransactionQuery(dateStart,dateEnd)(view,db,baseKey);
 
	    cashoutQuery
	    (function(err,report){
		 var cashouts = (_.isFirstNotEmpty(report.rows)? _.first(report.rows).value:ZEROED_FIELDS);

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
			 .extend(_.selectKeys(data, ['noofpayment','noofrefund','firstindex','lastindex']))
			 .value();
		 };
		 
		 var totalperiod = cashouts['menusalesamount'] + cashouts['scansalesamount'] + cashouts['ecrsalesamount'];
		 
		 cashouts = appendCategorySalesPercent(totalperiod, cashouts);
		 cashouts = modifiedCashouts(cashouts); 
		 cashouts.id  = id;
		 
		 callback(null,cashouts);      
	     });
	};
    };
};
function cashoutReportFetcher(terminals,startDate,endDate){

    var ids = _.pluck(terminals,'id');
    function processCashouts(terminals,callback){
	return function(err,cashouts){
	    var templateData =
		_(cashouts).chain()
	    	.flatten()
		.map(function(cashout){
			 return  {cashout : cashout,
			          id:cashout._id,
			          name:cashout.terminalname,
			          cashouttime:(new Date(cashout.cashouttime)).toString("yyyy/MM/dd-HH:mm:ss"),
			          cashoutnumber:cashout.cashoutnumber.toString()};
		     })
        	.value();	    
	    callback(templateData);
	};
    }

    return function(callback){
	_async.map(ids,
		  generalCashoutListFetcher_Period_F(startDate,endDate),
		  processCashouts(terminals,callback));
    };
}

function transactionsFromIndexRange(indexFn,transactionFn){
    return function(terminal_id){
	return function(continuation){
	    async
		.waterfall([indexFn(terminal_id),
			    function(indexObj,callback){
				transactionFn(terminal_id)(indexObj.firstindex,indexObj.lastindex)
				(continuation);
			    }]);
	};
    };
}

function canceledTransactionsFromCashoutsFetcher(terminals,startDate,endDate){
    function processTransactions(terminals,callback){
    	return function(err,transactions){
	    function startTime(transaction){return (new Date(transaction.time.start)).getTime();};
	    var terminals_merged_with_reduced_transactions = 
		_(transactions)
		.chain()
		.flatten()
		.map(function(transaction){
			 var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
			 return _.extend({},transaction,terminalForTransaction,{date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")});
		     })
		.sortBy(startTime)
		.value(); 
	    callback(err,terminals_merged_with_reduced_transactions);
	};
    }

    return function(callback) {
	if(!_.isArray(terminals)){terminals = [terminals];}
	var ids = _.pluck(terminals,'id');
	_async.map(ids,
		   transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate),
					      canceledTransactionsIndexRangeFetcher_F),
		   processTransactions(terminals,callback));
    };
};
function refundTransactionsFromCashoutsFetcher(terminals,startDate,endDate){

    function processTransactions(terminals,callback){
    	return function(err,transactions){
	    function startTime(transaction){return (new Date(transaction.time.start)).getTime();};
	    var terminals_merged_with_reduced_transactions = 
		_(transactions)
		.chain()
		.flatten()
		.map(function(transaction){
			 var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
			 return _.extend({},
					 transaction,
					 terminalForTransaction,
					 {date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")});
		     })
		.sortBy(startTime)
		.value(); 
	    callback(err,terminals_merged_with_reduced_transactions);
	};
    }

    return function(callback) {
	if(!_.isArray(terminals)){terminals = [terminals];}
	var ids = _.pluck(terminals,'id');
	_async.map(ids,
		   transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate),
					      refundTransactionsIndexRangeFetcher_F),
		   processTransactions(terminals,callback));
    };
};
function discountTransactionsFromCashoutsFetcher(terminals,startDate,endDate){

    function processTransactions(terminals,callback){
    	return function(err,transactions){
	    function startTime(transaction){return (new Date(transaction.time.start)).getTime();};
	    var terminals_merged_with_reduced_transactions = 
		_(transactions)
		.chain()
		.flatten()
		.map(function(transaction){
			 var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
			 var sales = transaction.discount+transaction.subTotal;
			 return _.extend({},
					 transaction,
					 terminalForTransaction,
					 {date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")},
					 {sales:sales},
					 {percentdiscount:transaction.discount/sales*100});
		     })
		.sortBy(startTime)
		.value(); 
	    callback(err,terminals_merged_with_reduced_transactions);
	};
    }

    return function(callback) {
	if(!_.isArray(terminals)){terminals = [terminals];}
	var ids = _.pluck(terminals,'id');
	_async.map(ids,
		   transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate),
					      discountTransactionsIndexRangeFetcher_F),
		  processTransactions(terminals,callback));
    };
};