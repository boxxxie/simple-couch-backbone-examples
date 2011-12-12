var _async = {
    transactionRangeQuery:function(start,end){
	return function(view,db,base){
	    var startKey = base.concat(start);
	    var endKey = base.concat(end,{});
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
    }
};

function generalArrayFetcher_F(array,fn){
    return function(runAfter) {
	/*
	 * fn() must return a function of the form fn(err,response)
	 */
	async.map(array, 
		  function(array_item,callback){fn(array_item)(callback);},
		  runAfter);
    };
};

function canceledTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','terminalID_type_index');
    var db = cdb.db('transactions');
    return function(startIndex,endIndex){
	var voids = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"VOID"]);
	var voidRefunds = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"VOIDREFUND"]);

	return function(callback){
	    async
		.parallel(
		    {voids:voids,
		     voidRefunds:voidRefunds
		    },
		    function(err,responses){

			var concatedSortedVoids = _([]).chain()
			    .concat(responses.voids.rows,
				    responses.voidRefunds.rows)
			    .pluck('doc')
			    .value();
			callback(err,concatedSortedVoids);	  
		    });
	};
    };
}

function refundTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','terminalID_type_index');
    var db = cdb.db('transactions');
    return function(startIndex,endIndex){
	var refunds = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"REFUND"]);
	refunds
	(function(err,responses){
	     callback(err,response.rows);	  
	 });
    };
};


function generalCashoutListFetcher_Period_F(view,db,startDate,endDate){
    //changed this function to return a function of id, this is so that it's easily used with async functions (should follow this standard)
    //changed the runAfter to be of a fn(err,response) form, and to be returned as a function (this is a standard to follow)
    return function(id){
	return function(callback){
	    var baseKey = [id];
	    var dateStart = _.first(startDate.toArray(),3);
	    var dateEnd = _.first(endDate.toArray(),3);

	    var cashoutQuery = transactionRangeQuery(dateStart,dateEnd)(view,db,baseKey)
	    (function(response){
		 callback(null,_.pluck(response.rows,'doc'));
	     });
	};
    };
};

function generalCashoutFetcher_Period_F(startDate,endDate){
    var view = cdb.view('reporting','cashouts_id_date');
    var db = cdb.db('cashouts');
    return function(id){
	return function(callback){
            var baseKey = [id];
            var dateStart = _.first(startDate.toArray(),3);
            var dateEnd = _.first(endDate.toArray(),3);

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

function cashoutListFetcher_Period(ids,startDate,endDate,callback){
    var view = cdb.view('reporting','cashouts_id_date');
    var db = cdb.db('cashouts');
    return generalArrayFetcher(ids,
			       generalCashoutListFetcher_Period_F(view,db,startDate,endDate),
			       callback);
};

function cashoutReportFetcher(terminals,startDate,endDate,callback){
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
			          cashoutnumber:cashout.cashoutnumber.toString()
			         };
		     })
        	.value();
            
	    callback(templateData);
	};
    }
    cashoutListFetcher_Period(ids,startDate,endDate,processCashouts(terminals,callback));
}

//untested... swap out canceledTransactions with this
function transactionsFromIndexRange(indexFn,transactionFn){
    return function(continuation){
	async
	    .waterfall([indexFn,
			function(indexObj,callback){
			    transactionFn(indexObj.firstindex,indexObj.lastindex)
			    (continuation);
			}]);};}

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
	async.map(ids,
		  function(terminal_id,callback){
		      transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate)(terminal_id),
						 canceledTransactionsIndexRangeFetcher_F(terminal_id))
		      (callback);},
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
	async.map(ids,
		  function(terminal_id,callback){
		      transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate)(terminal_id),
						 refundTransactionsIndexRangeFetcher_F(terminal_id))
		      (callback);},
		  processTransactions(terminals,callback));
    };
};