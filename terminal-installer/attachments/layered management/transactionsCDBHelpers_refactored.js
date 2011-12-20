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
    typedTransactionQuery:function(start,end){
	return function(view,db,base){
	    var startKey = base.concat(start);
	    var endKey = base.concat(end);
	    var options = {
		reduce:true,
		startkey:startKey,
		endkey:endKey
	    };
	    return function(callback){queryF(view,db)(options)(returnQuery(callback));};
	};
    },
    typedSandwichTransactionQuery:function(start,end){
	return function(view,db,base,tail){
	    var startKey = base.concat(start).concat(tail);
	    var endKey = base.concat(end).concat(tail);
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

function extract(dataArrays,field){
    function extractProperty(data,field){
	return _(data.rows).pluck(field);
    }
    if(_.isEmpty(dataArrays)) {
	return [];	
    }

    else if(!_.isArray(dataArrays)){
	return extractProperty(dataArrays,field);
    }
    
    return _(dataArrays)
	.chain()
	.pluck('rows')
	.flatten()
	.pluck(field)
	.value();
}
function extractValue(dataArrays){
    return extract(dataArrays,'value');
}
function extractFirstValue(dataArrays){
    return _.first(extractValue(dataArrays));
}
function extractDoc(dataArrays){
    return extract(dataArrays,'doc');
}
function extractSum(dataArrays){
    var value = extractValue(dataArrays);
    if(value && value.sum){
	return value.sum;
    }
    else{
	return 0;	
    }
}
function extractDocs(parallelFunctionsArray){
    return function(callback){
	async.parallel(parallelFunctionsArray,
		       function(err,responses){  
			   callback(err,extract(responses,'doc'));	  
		       });
    };
}
function extractVals(parallelFunctionsArray){
    return function(callback){
	async.parallel(parallelFunctionsArray,
		       function(err,responses){  
			   callback(err,extract(responses,'value'));	  
		       });
    };
}
function extractDocValMerge(parallelFunctionsArray){
    return function(callback){
	async.parallel(parallelFunctionsArray,
		       function(err,responses){  
			   var extractedDocs = extractDoc(responses);
			   var extractedValues = extractValue(responses);
			   var extractedData = _.zipMerge(extractedDocs,extractedValues);
			   callback(err,extractedData);	  
		       });
    };
}
function electronicPaymentsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','electronic_payments');
    var db = cdb.db('transactions',{},true);
    return function(startIndex,endIndex){
	var payments = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id]);
	return extractDocValMerge([payments]);
    };
}
function electronicPaymentsTotalsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','electronic_payments');
    var db = cdb.db('transactions',{},true);
    return function(startIndex,endIndex){
	var debit = _async.typedSandwichTransactionQuery(startIndex,endIndex)(view,db,[id],["DEBIT"]);
	var credit = _async.typedSandwichTransactionQuery(startIndex,endIndex)(view,db,[id],["CREDIT"]);
	var deposit = _async.typedTransactionQuery(startIndex,endIndex)(view,db,[id]);
	var visa = _async.typedSandwichTransactionQuery(startIndex,endIndex)(view,db,[id],["VISA"]);
	var mastercard = _async.typedSandwichTransactionQuery(startIndex,endIndex)(view,db,[id],["MASTERCARD"]);
	var amex = _async.typedSandwichTransactionQuery(startIndex,endIndex)(view,db,[id],["AMEX"]);
	return function(callback){
	    async.parallel({debit:debit,credit:credit,visa:visa,mastercard:mastercard,amex:amex,deposit:deposit},
			   function(err,responses){
			       function extractSafeAmount(data){
				   if (!data || !data.amount){
				       return 0;
				   }
				   return data.amount;
			       }
			       var totals = {debit:extractSafeAmount(extractFirstValue(responses.debit)),
					     credit:extractSafeAmount(extractFirstValue(responses.credit)),
					     deposit:extractSafeAmount(extractFirstValue(responses.deposit)),
					     visa:extractSafeAmount(extractFirstValue(responses.visa)),
					     mastercard:extractSafeAmount(extractFirstValue(responses.mastercard)),
					     amex:extractSafeAmount(extractFirstValue(responses.amex))
					    };
			       callback(err,totals);	  
			   });
	};
    };
}
function canceledTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','terminalID_type_index');
    var db = cdb.db('transactions',{},true);
    return function(startIndex,endIndex){
	var voids = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"VOID"]);
	var voidRefunds = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"VOIDREFUND"]);
	return extractDocs([voids,voidRefunds]);
    };
}
function discountTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','Discounts_terminalID_type_index');
    var db = cdb.db('transactions',{},true);
    return function(startIndex,endIndex){
	var sales = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"SALE"]);
	return extractDocs([sales]);
    };
}
function refundTransactionsIndexRangeFetcher_F(id){
    var view = cdb.view('reporting','terminalID_type_index');
    var db = cdb.db('transactions',{},true);
    return function(startIndex,endIndex){
	var refunds = _async.transactionRangeQuery(startIndex,endIndex)(view,db,[id,"REFUND"]);
	return extractDocs([refunds]);
    };
};
function generalCashoutListFetcher_Period_F(startDate,endDate){
    var view = cdb.view('reporting','cashouts_id_date');
    var db = cdb.db('cashouts',{},true);
    return function(id){
	var dateStart = date.toArray.until.day(startDate);
	var dateEnd = date.toArray.until.day(endDate);
	var cashouts = _async.transactionRangeQuery(dateStart,dateEnd)(view,db,[id]);
	return extractDocs([cashouts]);
    };
};
function generalCashoutFetcher_Period_F(startDate,endDate){
    var view = cdb.view('reporting','cashouts_id_date');
    var db = cdb.db('cashouts',{},true);
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
function processTransactions(mapFn,callback){
    return function(err,transactions){
	function startTime(transaction){return (new Date(transaction.time.start)).getTime();};
	var terminals_merged_with_reduced_transactions = 
	    _(transactions)
	    .chain()
	    .flatten()
	    .map(mapFn)
	    .sortBy(startTime)
	    .value(); 
	callback(err,terminals_merged_with_reduced_transactions);
    };
};

function mapReduceTransactions(mapFn,reduceFn,callback){
    return function(err,transactions){
	var terminals_merged_with_reduced_transactions = 
	    _(transactions)
	    .chain()
	    .flatten()
	    .map(mapFn)
	    .reduce(reduceFn,{})
	    .value(); 
	callback(err,terminals_merged_with_reduced_transactions);
    };
};
function mapReduceTransactionsFromCashouts(terminals,startDate,endDate){
    return function (IndexRangeFetcher,mapFn,reduceFn){
	return function(callback) {
	    if(!_.isArray(terminals)){terminals = [terminals];}
	    var ids = _.pluck(terminals,'id');
	    _async.map(ids,
		       transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate),
						  IndexRangeFetcher),
		       mapReduceTransactions(mapFn,reduceFn,callback));
	};
    };
}

function processedTransactionsFromCashouts(terminals,startDate,endDate){
    return function (IndexRangeFetcher,mapFn){
	return function(callback) {
	    if(!_.isArray(terminals)){terminals = [terminals];}
	    var ids = _.pluck(terminals,'id');
	    _async.map(ids,
		       transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate),
						  IndexRangeFetcher),
		       processTransactions(mapFn,callback));
	};
    };
}

function processedReducedTransactionsFromCashouts(terminals,startDate,endDate){
    return function (IndexRangeFetcher){
	return function(callback) {
	    if(!_.isArray(terminals)){terminals = [terminals];}
	    var ids = _.pluck(terminals,'id');
	    _async.map(ids,
		       transactionsFromIndexRange(generalCashoutFetcher_Period_F(startDate,endDate),
						  IndexRangeFetcher),
		       returnQuery(callback));
	};
    };
}
function canceledTransactionsFromCashoutsFetcher(terminals,startDate,endDate){
    function cancelledMap(terminals){
	return function(transaction){
	    var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
	    return _.extend({},transaction,terminalForTransaction,{date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")});
	};
    };
    return processedTransactionsFromCashouts(terminals,startDate,endDate)(canceledTransactionsIndexRangeFetcher_F,cancelledMap(terminals));
};
function refundTransactionsFromCashoutsFetcher(terminals,startDate,endDate){
    function refundMap(terminals){
	return function(transaction){
	    var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
	    return _.extend({},
			    transaction,
			    terminalForTransaction,
			    {date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")});
	};
    };
    return processedTransactionsFromCashouts(terminals,startDate,endDate)(refundTransactionsIndexRangeFetcher_F,refundMap(terminals));
};
function discountTransactionsFromCashoutsFetcher(terminals,startDate,endDate){
    function discountMap(terminals){
	return function(transaction){
	    var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
	    var sales = transaction.discount+transaction.subTotal;
	    return _.extend({},
			    transaction,
			    terminalForTransaction,
			    {date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")},
			    {sales:sales},
			    {percentdiscount:transaction.discount/sales*100});
	};
    };
    return processedTransactionsFromCashouts(terminals,startDate,endDate)(discountTransactionsIndexRangeFetcher_F,discountMap(terminals));
};
function cashoutReportFetcher(terminals,startDate,endDate){
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
    if(!_.isArray(terminals)){terminals = [terminals];}
    var ids = _.pluck(terminals,'id');
    return function(callback){
	_async.map(ids,
		   generalCashoutListFetcher_Period_F(startDate,endDate),
		   processCashouts(terminals,callback));
    };
}

function electronicPaymentsReportFetcher(terminals,startDate,endDate){
   // var zero_total = {amount:0};
    function addPropertiesTogether(addTo,addFrom){
	if(addTo == {}){return addFrom;}
	for (var prop in addFrom) {
	    if(addTo[prop] == undefined){addTo[prop] = addFrom[prop];}
	    else{addTo[prop] += addFrom[prop];}
	};
	return addTo;
    }
    function paymentMap(terminals){
	return function(transaction){
	    var terminalForTransaction = _.find(terminals, function(ter){return transaction.terminal_id==ter.id;});
	    var sales = transaction.discount+transaction.subTotal;
	    return _.extend({},
			    transaction,
			    terminalForTransaction,
			    {date:(new Date(transaction.time.start)).toString("yyyy-MM-dd HH:mm:ss")},
			    {sales:sales});
	};
    };
    function identity(o){
	return o;
    }
    function mapTotals(total){
/*	var zeroTotal =  {debit:zero_total,
			  credit:zero_total,
			  deposit:zero_total,
			  visa:zero_total,
			  mastercard:zero_total,
			  amex:zero_total
			 };
*/
	return total;
	//return addPropertiesTogether(total,zero_total);
    };

    function reduceTotals(sum,cur){
	return addPropertiesTogether(sum,cur);
    };

    //process payments
    return function(callback){
	async.parallel({
			   paymentList: processedTransactionsFromCashouts(terminals,startDate,endDate)(electronicPaymentsIndexRangeFetcher_F,paymentMap(terminals)),
			   //totals: processedReducedTransactionsFromCashouts(terminals,startDate,endDate)(electronicPaymentsTotalsIndexRangeFetcher_F)
			   totals: mapReduceTransactionsFromCashouts(terminals,startDate,endDate)(electronicPaymentsTotalsIndexRangeFetcher_F,identity,addPropertiesTogether)
		       },
		       callback);
    };
};