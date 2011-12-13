var ZEROED_FIELDS = {allDiscount: 0, 
		     netsales: 0, 
		     netsaletax1: 0, 
		     netsaletax3: 0, 
		     netsalestotal: 0, 
		     netrefund: 0, 
		     netrefundtax1: 0,
		     netrefundtax3: 0,
		     netrefundtotal: 0,
		     netsaleactivity: 0, 
		     cashpayment: 0, 
		     creditpayment: 0, 
		     debitpayment: 0, 
		     mobilepayment: 0, 
		     otherpayment: 0, 
		     noofpayment: 0, 
		     avgpayment: 0, 
		     cashrefund: 0, 
		     creditrefund: 0, 
		     debitrefund: 0, 
		     mobilerefund: 0,
		     otherrefund: 0, 
		     noofrefund: 0, 
		     avgrefund: 0, 
		     menusalesno: 0,
		     menusalesamount: 0, 
		     scansalesno: 0, 
		     scansalesamount: 0, 
		     ecrsalesno: 0, 
		     ecrsalesamount: 0};

function toFixed(mag){
    return function(num){
	if(_.isNumber(num)){
	    return num.toFixed(mag);
	}
	return num;
    };
}

function addPropertiesTogether(addTo,addFrom){
    for (var prop in addFrom) {
	(addTo[prop] !== undefined && _.isNumber(addFrom[prop])) ? addTo[prop] += addFrom[prop]: addTo[prop] = addFrom[prop];
    }
    return addTo;
};

function isValidDate(d){
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
	return false;
    return !isNaN(d.getTime());
}

function formatTime(time){
    return time+":00-"+(Number(time)+1)+":00";
};

function relative_dates(){
    return {
	today : _.first(Date.today().toArray(),3),
	today_h : _.first(Date.today().toArray(),4),
	tomorrow : _.first(Date.today().addDays(1).toArray(),3),
	tomorrow_h : _.first(Date.today().addDays(1).toArray(),4),
	yesterday : _.first(Date.today().addDays(-1).toArray(),3),
	yesterday_h : _.first(Date.today().addDays(-1).toArray(),4),
	startOfMonth : _.first(Date.today().moveToFirstDayOfMonth().toArray(),3),
	startOfYear : _.first(Date.today().moveToMonth(0,-1).moveToFirstDayOfMonth().toArray(),3)
    };
};

function returnQuery(callback){
    return function(query){
	callback(null, query);
    };
};

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
function typedTransactionRangeGroupedQuery(view,db,base){
    return function(startDate,endDate){
	var startKey = base.concat(startDate);
	var endKey = base.concat(endDate);
	var options = {
	    group_level:_.size(endKey),
	    startkey:startKey,
	    endkey:endKey,
	    inclusive_end: false
	};
	return queryF(view,db)(options);
    };
};
function transactionRangeQuery(start,end){
    return function(view,db,base){
	var startKey = base.concat(start);
	var endKey = base.concat(end);
	var options = {
	    reduce:false,
	    include_docs: true,
	    startkey:startKey,
	    endkey:endKey
	};
	return queryF(view,db)(options);
    };
};

function typedTransactionDateRangeGroupedQuery(startDate,endDate){
    return function(view,db){
	return function (base){
	    var startKey = base.concat(startDate);
	    var endKey = base.concat(endDate);
	    var options = {
		group_level:_.size(endKey),
		startkey:startKey,
		endkey:endKey,
		inclusive_end: false
	    };
	    return queryF(view,db)(options);
	};
    };
};

function generalTransactionsIndexRangeFetcher(view,db,id,startIndex,endIndex,continuation){
    var transactionsQuery = transactionRangeQuery(startIndex,endIndex)(view,db,[id]);
    transactionsQuery(function(response){
			  function isVoid(transaction){return transaction.type == "VOID" || transaction.type == "VOIDREFUND";}
			  function docs(resp_data){return resp_data.doc;};
			  var transactions = _(response.rows).chain().map(docs).reject(isVoid).value();
			  continuation(transactions);
		      });
}

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
		sales.avgsale = Number(sales.total) / Number(sales.transactions);
		if(_.isNaN(sales.avgsale)){sales.avgsale = 0;}
		runAfter(sales);	  
	    });
};
function originTodaysSalesFetcher(view,db,id,runAfter){
    var d = relative_dates();
    var menuSales = typedTransactionRangeQuery(view,db,[id,'SALE','MENU'])(d.today,d.tomorrow);
    var menuRefunds = typedTransactionRangeQuery(view,db,[id,'REFUND','MENU'])(d.today,d.tomorrow);
    var scanSales = typedTransactionRangeQuery(view,db,[id,'SALE','INVENTORY'])(d.today,d.tomorrow);
    var scanRefunds = typedTransactionRangeQuery(view,db,[id,'REFUND','INVENTORY'])(d.today,d.tomorrow);
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

function originTodaysHourlySalesFetcher(view,db,id,runAfter){
    var d = relative_dates();
    //fixme:use todays date not yesterdays
    var todaysQuery = typedTransactionDateRangeGroupedQuery(d.today_h,d.tomorrow_h)(view,db);
    var menuSales = todaysQuery([id,'SALE','MENU']);
    var menuRefunds = todaysQuery([id,'REFUND','MENU']);
    var scanSales = todaysQuery([id,'SALE','INVENTORY']);
    var scanRefunds = todaysQuery([id,'REFUND','INVENTORY']);
    var ecrSales = todaysQuery([id,'SALE','ECR']);
    var ecrRefunds = todaysQuery([id,'REFUND','ECR']);

    function assign(fn){
	function returnQuery(callback){
	    return function(query){
		callback(null, query);
	    };
	};
	return function(callback){
	    fn(returnQuery(callback));
	};
    }
    async
	.parallel(
	    {menuSales:assign(menuSales),
	     menuRefunds:assign(menuRefunds),
	     scanSales:assign(scanSales),
	     scanRefunds:assign(scanRefunds),
	     ecrSales:assign(ecrSales),
	     ecrRefunds:assign(ecrRefunds)
	    },
	    function(err,report){
		//need to join things together based on the same time from the key
		function time(item){
		    return item.key[6];
		}
		function salesAmount(item){
		    if(_.isNumber(item.value.sum)){return item.value.sum;}
		    return 0;
		}
		function type(item){
		    return item.key[1];
		}
		function origin(item){
		    return item.key[2].toLowerCase();
		}
		function isSale(item){
		    return item.type == 'SALE';    
		};
		function isRefund(item){
		    return item.type == 'REFUND';
		}

		function extractTotalSales(salesData,refundsData){
		    var sales = 0, refunds = 0;
		    (_.isNotEmpty(salesData))? sales = salesData.value: sales = 0;
		    (_.isNotEmpty(refundsData))? refunds = refundsData.value: refunds = 0;
		    return sales - refunds;
		}

		function template(){
		    return {menu:0,inventory:0,ecr:0};
		}

		var stuff = _([]).
		    chain().
		    concat(report.menuRefunds.rows,
			   report.menuSales.rows,
			   report.scanSales.rows,
			   report.scanRefunds.rows,
			   report.ecrSales.rows,
			   report.ecrRefunds.rows).
		    map(function(item){return {type:type(item),origin:origin(item),time:time(item),value:salesAmount(item)};}).
		    groupBy(function(item){return item.time+item.origin;}).kv().
		    map(function(pair){
			    var sale_refund = _.second(pair);
			    var sales = _(sale_refund).chain().filter(isSale).first().value();
			    var refunds = _(sale_refund).chain().filter(isRefund).first().value();
			    var totalSales = extractTotalSales(sales,refunds);
			    return _.removeKeys(_.extend({},refunds,sales,{value:totalSales}),['type']);
			}).
		    groupBy(function(item){return item.time;}).kv().
		    map(function(pair){
			    var time = _.first(pair);
			    var menu_scan_ecrs = _.second(pair);
			    var originsForKeys = _.extend({},
							  template(),
							  _.reduce(menu_scan_ecrs,function(sum,cur){
								       sum[cur.origin] = cur.value;
								       return sum;
								   },{}));
			    var timeForKey = {};
			    timeForKey[time] = originsForKeys;
			    return timeForKey;
			}).
		    reduce(function(sum,cur){
			       var pair = _.first(_.kv(cur));
			       sum[_.first(pair)] = _.second(pair);
			       return sum;
			   },{})
		    .value();
		
		var mergeTimes = _(24).chain().
		    range().
		    map(function(i){return {};}).
		    extend(stuff).
		    kv().
		    reduce(function(sum,cur){
			       var time = _.first(cur);
			       var obj = _.second(cur);
			       sum[formatTime(time)] = _.extend({},template(),obj);
			       return sum;
			   },{})
		    .value();
		runAfter(null,mergeTimes);	  
	    });
};
function todaysHourlySalesFetcher(view,db,id,runAfter){
    var d = relative_dates();
    //fixme:use todays date not yesterdays
    var todaysQuery = typedTransactionDateRangeGroupedQuery(d.today_h,d.tomorrow_h)(view,db);
    var sales = todaysQuery([id,'SALE']);
    var refunds = todaysQuery([id,'REFUND']);


    function assign(fn){
	function returnQuery(callback){
	    return function(query){
		callback(null, query);
	    };
	};
	return function(callback){
	    fn(returnQuery(callback));
	};
    }
    async
	.parallel(
	    {sales:assign(sales),
	     refunds:assign(refunds)
	    },
	    function(err,report){
		//need to join things together based on the same time from the key
		function time(item){
		    return item.key[5];
		}
		function salesAmount(item){
		    if(_.isNumber(item.value.sum)){return item.value.sum;}
		    return 0;
		}
		function numSales(item){
		    if(_.isNumber(item.value.count)){return item.value.count;}
		    return 0;
		}
		function type(item){
		    return item.key[1];
		}
		function isSale(item){
		    return item.type == 'SALE';    
		};
		function isRefund(item){
		    return item.type == 'REFUND';
		}

		function template(){
		    return {total:0,refunds:"0",transactions:"0",avgsale:0};
		}

		function transactionSummary(salesData,refundsData){
		    var sales = 0, refunds = 0, saleCount = 0, refundCount = 0, avgsale = 0;
		    if(_.isNotEmpty(salesData)){
			sales = salesData.value;
			saleCount = salesData.count;
		    }
		    if(_.isNotEmpty(refundsData)){
			refunds = refundsData.value;
			refundCount = refundsData.count;
		    };
		    if(saleCount){avgsale = sales / saleCount;}
		    return {total:sales - refunds,refunds:refundCount+"",transactions:saleCount+"",avgsale:avgsale};
		}

		var stuff = _([]).
		    chain().
		    concat(report.refunds.rows,
			   report.sales.rows).
		    map(function(item){return {type:type(item),time:time(item),value:salesAmount(item),count:numSales(item)};}).
		    groupBy(function(item){return item.time;}).kv().
		    map(function(pair){
			    var time = _.first(pair);
			    var sale_refund = _.second(pair);
			    var sales = _(sale_refund).chain().filter(isSale).first().value();
			    var refunds = _(sale_refund).chain().filter(isRefund).first().value();
			    var summary = transactionSummary(sales,refunds);
			    
			    var timeForKey = {};
			    timeForKey[time] = summary;
			    return timeForKey;
			}).
		    reduce(function(sum,cur){
			       var pair = _.first(_.kv(cur));
			       var time = _.first(pair);
			       sum[time] = _.second(pair);
			       return sum;
			   },{}).
		    value();

		var mergeTimes = _(24).chain().
		    range().
		    map(function(i){return {};}).
		    extend(stuff).
		    kv().
		    reduce(function(sum,cur){
			       var time = _.first(cur);
			       var obj = _.second(cur);
			       sum[formatTime(time)] = _.extend({},template(),obj);
			       return sum;
			   },{})
		    .value();

		runAfter(null,mergeTimes);	  
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
			.extend(_.selectKeys(data, ['noofpayment','noofrefund','firstindex','lastindex']))
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
function generalCashoutListFetcher_Period(view,db,id,startDate,endDate,runAfter){
    var baseKey = [id];
    var dateStart = _.first(startDate.toArray(),3);
    var dateEnd = _.first(endDate.toArray(),3);

    var cashoutQuery = transactionRangeQuery(dateStart,dateEnd)(view,db,baseKey)
    (function(response){
	 runAfter(_.pluck(response.rows,'doc'));	 
     });
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

function generalCashoutListArrayFetcher_Period(view,db,ids,startDate,endDate,runAfter) {
    async.map(ids, 
	      function(id,callback){generalCashoutListFetcher_Period(view,db,id,startDate,endDate,returnQuery(callback));},
	      runAfter);
};

function generalArrayFetcher(array,fn,runAfter) {
    /*
     * fn() must return a function of the form fn(err,response)
     */
    async.map(array, 
	      function(array_item,callback){fn(array_item)(callback);},
	      runAfter);
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
		      voids:function(callback){todaysVoidsFetcher(transactionsTotalView,transaction_db, parentID,function(data){callback(null,data);});}
		  },
		  function(err,report){
		      var templateObj = _.merge([report.hwdt,{cancelledtransactions:report.voids}]);
		      runAfter(templateObj);
		  });
};

function hourlyReportFetcher(id,runAfter){
    var transactionsView = cdb.view('reporting','id_type_origin_date');
    var transactionsTotalView = cdb.view('reporting','id_type_date');
    var transaction_db = cdb.db('transactions');
    async
	.parallel(
	    {originSales:function(callback){originTodaysHourlySalesFetcher(transactionsView,transaction_db,id,function(err,data){callback(null, data);});},
	     totalSales:function(callback){todaysHourlySalesFetcher(transactionsTotalView,transaction_db,id,function(err,data){callback(null, data);});}
	    },
	    function(err,report){
		
		var templateData = _([]).chain().
		    concat(_.kv(report.originSales),_.kv(report.totalSales)).
		    groupBy(function(pair){return _.first(pair);}). //group by time
		    toArray().
		    map(function(pair){
			    var time = _.first(_.first(pair));
			    var merged = _(pair).chain().map(_.second).merge().applyToValues(toFixed(2)).value();
			    return _.extend({},{timerange:time},merged);
			}).
		    value();

		runAfter(templateData);	  
	    });
};

function taxReportFetcher(terminals,startDate,endDate,callback){
    var transactionsView = cdb.view('reporting','cashouts_id_date');
    var transaction_db = cdb.db('cashouts');

    function resultFetcher(terminals,callback){
    	return function(err,cashoutData){
	    function extractTemplateData(extendedCashoutData){
		function extractTaxTotals(cashout){
		    var tax1 = (Number(cashout.netsaletax1) -  Number(cashout.netrefundtax1)).toFixed(2);
		    var tax3 = (Number(cashout.netsaletax3) -  Number(cashout.netrefundtax3)).toFixed(2);
		    return {sales : cashout.netsales, totalsales : cashout.netsalestotal, tax1 :tax1, tax3:tax3, firstindex:cashout.firstindex, lastindex:cashout.lastindex};
		}
		return _.extend({},
				extractTaxTotals(extendedCashoutData.period),
				_.selectKeys(extendedCashoutData,['id','name'])
			       );
	    }
	    var forTMP = _(terminals)
		.chain()
		.zip(cashoutData)
		.map(function(pair){
			 return _.extend(_.first(pair),_.second(pair));
		     })
		.map(extractTemplateData)
		.value();
	    callback(forTMP);
	};
    }

    if(_.isArray(terminals)){
	var ids = _.pluck(terminals,'id');
	return generalCashoutArrayFetcher_Period(transactionsView,transaction_db,ids,startDate,endDate,resultFetcher(terminals,callback));
    }
    else{
	var ids = _.pluck([terminals],'id');
	return generalCashoutArrayFetcher_Period(transactionsView,transaction_db,ids,startDate,endDate,resultFetcher([terminals],callback));
    }
};

function taxReportTransactionsFetcher(terminal,startIndex,endIndex,callback){
    var view = cdb.view('reporting','terminalID_index');
    var db = cdb.db('transactions');

    function resultFetcher(terminal,callback){
    	return function(transactions){
	    function extractTemplateData(transaction){
		function isRefund(transaction){return transaction.type == "REFUND";}
		function switchSign(number){return 0 - number;};

		function extractTaxTotals(transaction){
		    var tax1 = transaction.tax1and2;
		    var tax3 = transaction.tax3;
		    return {sales : transaction.subTotal, totalsales : transaction.total, tax1 :tax1, tax3:tax3};
		};

		var moneyFields = extractTaxTotals(transaction);
		if(isRefund(transaction)){
		    moneyFields = _.applyToValues(moneyFields,switchSign);
		}
		return _.extend({},
				moneyFields,
				{date: (new Date(transaction.time.end)).toString("yyyy/MM/dd-HH:mm:ss")},
				{transaction:transaction.transactionNumber.toString()},
				{type:transaction.type}
			       );
	    }
	    var transactionsTaxData = _(transactions).map(extractTemplateData);
	    
	    var defaultTotalsData = {sales : 0, totalsales : 0, tax1 :0, tax3:0};
	    var totalsTaxData = 
		_(transactionsTaxData)
		.chain()
		.reduce(addPropertiesTogether,{})
		.value();
	    var safeTotalsTaxData = _(defaultTotalsData).chain().extend(totalsTaxData).applyToValues(toFixed(2)).value();

	    callback({items:_.map(transactionsTaxData,function(t){return _.applyToValues(t,toFixed(2));}),
		      totals:safeTotalsTaxData});
	};
    }

    return generalTransactionsIndexRangeFetcher(view,db,terminal,Number(startIndex),Number(endIndex),resultFetcher(terminal,callback));
};



