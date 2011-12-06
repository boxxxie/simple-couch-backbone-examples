var ZEROED_FIELDS = {allDiscount: 0, netsales: 0, netsaletax1: 0, netsaletax3: 0, netsalestotal: 0, netrefund: 0, netrefundtax1: 0, netrefundtax3: 0, netrefundtotal: 0, netsaleactivity: 0, cashpayment: 0, creditpayment: 0, debitpayment: 0, mobilepayment: 0, otherpayment: 0, noofpayment: 0, avgpayment: 0, cashrefund: 0, creditrefund: 0, debitrefund: 0, mobilerefund: 0, otherrefund: 0, noofrefund: 0, avgrefund: 0, menusalesno: 0, menusalesamount: 0, scansalesno: 0, scansalesamount: 0, ecrsalesno: 0, ecrsalesamount: 0};

function toFixed(mag){
    return function(num){
	if(_.isNumber(num)){
	    return num.toFixed(mag);
	}
	return num;
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
function todaysSalesFetcher(view,db,id,runAfter){
    var d = relative_dates();
    var sales = typedTransactionRangeQuery(view,db,[id,'SALE'])(d.today,d.tomorrow);
    var refunds = typedTransactionRangeQuery(view,db,[id,'REFUND'])(d.today,d.tomorrow);

    function extractTotalSales(salesData,refundsData){
	function sum(total,cur){
	    return total + cur.value.sum;
	}
	var sales = 0, refunds = 0;
	_.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows).value.sum: sales = 0;
	_.isFirstNotEmpty(refundsData.rows)? refunds = _.first(refundsData.rows).value.sum: refunds = 0;
	return sales - refunds;
    }

    function extractTotalTransactions(salesData,refundsData){
	function sum(total,cur){
	    return total + cur.value.count;
	}
	var sales = 0, refunds = 0;
	_.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows).value.count: sales = 0;
	_.isFirstNotEmpty(refundsData.rows)? refunds = _.first(refundsData.rows).value.count: refunds = 0;
	return {transactions:sales+"" , refunds:refunds+""};
    }

    async
	.parallel(
	    {sales:function(callback){sales(returnQuery(callback));},
	     refunds:function(callback){refunds(returnQuery(callback));}
	    },
	    function(err,report){
		var sales = {};
		sales.total = extractTotalSales(report.sales,report.refunds);
		_.extend(sales,extractTotalTransactions(report.sales,report.refunds));
		sales.avgsale = sales.total / sales.transactions;
		if(_.isNaN(sales.avgsale)){sales.avgsale = 0;}
		runAfter(sales);	  
	    });
};
function originTodaysSalesFetcher(view,db,id,runAfter){
    var d = relative_dates();
    var menuSales = typedTransactionRangeQuery(view,db,[id,'SALE','MENU'])(d.today,d.tomorrow);
    var menuRefunds = typedTransactionRangeQuery(view,db,[id,'REFUND','MENU'])(d.today,d.tomorrow);
    var scanSales = typedTransactionRangeQuery(view,db,[id,'SALE','SCAN'])(d.today,d.tomorrow);
    var scanRefunds = typedTransactionRangeQuery(view,db,[id,'REFUND','SCAN'])(d.today,d.tomorrow);
    var ecrSales = typedTransactionRangeQuery(view,db,[id,'SALE','ECR'])(d.today,d.tomorrow);
    var ecrRefunds = typedTransactionRangeQuery(view,db,[id,'REFUND','ECR'])(d.today,d.tomorrow);

    function extractTotalSales(salesData,refundsData){
	function sum(total,cur){
	    return total + cur.value.sum;
	}
	var sales = 0, refunds = 0;
	_.isFirstNotEmpty(salesData.rows)? sales = _.first(salesData.rows).value.sum: sales = 0;
	_.isFirstNotEmpty(refundsData.rows)? refunds = _.first(refundsData.rows).value.sum: refunds = 0;
	return sales - refunds;
    }

    async
	.parallel(
	    {menuSales:function(callback){menuSales(returnQuery(callback));},
	     menuRefunds:function(callback){menuRefunds(returnQuery(callback));},
	     scanSales:function(callback){scanSales(returnQuery(callback));},
	     scanRefunds:function(callback){scanRefunds(returnQuery(callback));},
	     ecrSales:function(callback){ecrSales(returnQuery(callback));},
	     ecrRefunds:function(callback){ecrRefunds(returnQuery(callback));}
	    },
	    function(err,report){
		var sales = {};
		sales.menu = extractTotalSales(report.menuSales,report.menuRefunds);
		sales.scan = extractTotalSales(report.scanSales,report.scanRefunds);
		sales.ecr = extractTotalSales(report.ecrSales,report.ecrRefunds);
		runAfter(sales);	  
	    });
};

function todaysRefundsFetcher(view,db,id,runAfter){
    var d = relative_dates();
    var refunds = typedTransactionRangeQuery(view,db,[id,'REFUND'])(d.today,d.tomorrow);

    function extractTotalRefunds(refundsData){
	function sum(total,cur){
	    return total + cur.value.count;
	}
	var refunds = 0;
	_.isFirstNotEmpty(refundsData.rows)? refunds = _.first(refundsData.rows).value.count: refunds = 0;
	return refunds;
    }

    async
	.parallel(
	    {
		refunds:function(callback){refunds(returnQuery(callback));}
	    },
	    function(err,report){
		var refunds = extractTotalRefunds(report.refunds);
		runAfter(refunds);	  
	    });
};
function todaysVoidsFetcher(view,db,id,runAfter){
    var d = relative_dates();
    var refunds = typedTransactionRangeQuery(view,db,[id,'VOIDREFUND'])(d.today,d.tomorrow);
    var voids = typedTransactionRangeQuery(view,db,[id,'VOID'])(d.today,d.tomorrow);

    function extractTotal(refundsData){
	function sum(total,cur){
	    return total + cur.value.count;
	}
	var refunds = 0;
	_.isFirstNotEmpty(refundsData.rows)? refunds = _.first(refundsData.rows).value.count: refunds = 0;
	return refunds;
    }

    async
	.parallel(
	    {
		refunds:function(callback){refunds(returnQuery(callback));},
		voids:function(callback){voids(returnQuery(callback));}
	    },
	    function(err,report){
		var refunds = extractTotal(report.refunds);
		var voids = extractTotal(report.voids);
		var total = refunds + voids;
		runAfter(total);	  
	    });
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
		runAfter(sales);	  
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
	    {period:function(callback){companySalesRangeQuery(dateStart,dateEnd)(returnQuery(callback));}},
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

function originTodaysSalesArrayFetcher(view,db,ids,runAfter){
    async.map(ids, 
	      function(id,callback){
		  originTodaysSalesFetcher(view,db,id,
					    function(salesData){
						callback(null,salesData);
					    });
	      },
	      runAfter);
};

function todaysSalesArrayFetcher(view,db,ids,runAfter){
    async.map(ids, 
	      function(id,callback){
		  todaysSalesFetcher(view,db,id,
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
    if(!_.isArray(ids)){ids = [ids];}
    return generalSalesReportArrayFetcher(transactionsView,transaction_db,ids,callback);
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

function howAreWeDoingTodayReportFetcher(childrenObjs,parentObj,runAfter){
//    childrenObjs = [{id:"3d563af3-4b07-5780-01ab-2a579b6d6b0c",name:"boib"}];
//    parentObj = {id:"3d563af3-4b07-5780-01ab-2a579b6d6b0c"};

    var childrenIDs = _.pluck(childrenObjs,'id');
    var parentID = parentObj.id;

    var transactionsView = cdb.view('reporting','id_type_origin_date');
    var transactionsTotalView = cdb.view('reporting','id_type_date');
    var transaction_db = cdb.db('transactions');
    if(!_.isArray(childrenIDs)){childrenIDs = [childrenIDs];} 
    if(!_.isArray(parentID)){parentID = [parentID];}

    async
	.parallel(
	    {originSales:function(callback){originTodaysSalesArrayFetcher(transactionsView,transaction_db,childrenIDs,function(err,data){callback(null, data);});},
	     totalSales:function(callback){todaysSalesArrayFetcher(transactionsTotalView,transaction_db,childrenIDs,function(err,data){callback(null, data);});},
	     parentOriginSales:function(callback){originTodaysSalesArrayFetcher(transactionsView,transaction_db,parentID,function(err,data){callback(null, data);});},
	     parentTotalSales:function(callback){todaysSalesArrayFetcher(transactionsTotalView,transaction_db,parentID,function(err,data){callback(null, data);});}
	    },
	    function(err,report){
		var salesActivityList = {items:_(report.originSales)
					 .chain()
					 .zip(report.totalSales,childrenObjs)
					 .map(function(group){return _.applyToValues(_.merge(group),toFixed(2));})
					 .value(),
					 total:_.applyToValues(_.extend({},
									_.first(report.parentOriginSales),
									_.first(report.parentTotalSales)),
							       toFixed(2))
					};
		runAfter(salesActivityList);	  
	    });
};

function howAreWeDoingTodayTerminalReportFetcher(childrenObjs,parentObj,runAfter){
    var childrenIDs = _.pluck(childrenObjs,'id');
    var parentID = parentObj.id;

    var transactionsTotalView = cdb.view('reporting','id_type_date');
    var transaction_db = cdb.db('transactions');

    async
	.parallel({
		      hwdt: function(callback){howAreWeDoingTodayReportFetcher(childrenObjs,parentObj, function(data){callback(null,data);});},
		      //refunds:function(callback){todaysRefundsFetcher(transactionsTotalView,transaction_db,parentID,function(data){callback(null,data);});},
		      voids:function(callback){todaysVoidsFetcher(transactionsTotalView,transaction_db, parentID,function(data){callback(null,data);});}
		  },
		  function(err,report){
		      var templateObj = _.merge([report.hwdt,{cancelledtransactions:report.voids}]);
		      runAfter(templateObj);
		  });
};