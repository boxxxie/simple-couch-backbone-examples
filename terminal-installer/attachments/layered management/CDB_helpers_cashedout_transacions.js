function transactionFormattingWalk(obj){
    if(obj.quantity){
	if(obj.origin == "SCALE"){
	    return _.extend(obj,{quantity:toFixed(3)(obj.quantity)});
	}
	else{
	    return _.extend(obj,{quantity:obj.quantity+""});
	}
    }
    return currency_format(obj);
}
function transactionsReportFetcher(start,end){
    return function(id){
	var view = cdb.view('reporting','id_date');
	var db = cdb.db('cashedout_transactions',{},true);
	var query = _async.transactionRangeQuery(start,end)(view,db,id);
	return function(callback){
	    query(function(err,response){
		      function calculateTotalsOverTransactions(transactions){
			  return _.chain(transactions)
			      .map(_.selectKeys_F(['type','tax1and2','subTotal','tax3','total']))
			      .groupBy('type')
			      .filter$(function(transactions,type){return (type == "SALE" || type == "REFUND");})
			      .map(function(transactions,type){
				       if(type == "REFUND"){return pre_walk(transactions, negate);}
				       return transactions;
				   })
			      .flatten()
			      .reduce(_.addPropertiesTogether,{})
			      .defaults({tax1and2:0,subTotal:0,tax3:0,total:0})
			      .value();
		      }
		      //todo, needs to be grouped by day
		      var transactions = _.chain(response.rows)
			  .groupBy(function(resp_item){
				       return _.chain(resp_item.key)
					   .slice(1,4)
					   .join("-")
					   .value();
				   })
			  .map(function(items,date){
				   function startTime(transaction){
				       return (new Date(transaction.time.start)).getTime();
				   }
				   var transactionsForDate = 
				       _.chain(items).pluck('doc').sortBy(startTime).reverse().value();
				   
				   var totals = calculateTotalsOverTransactions(transactionsForDate);
				   return {date:date,transactions:transactionsForDate,totalsForDate:totals};
			       })
			  .value();
		      var totalOverAllDates = calculateTotalsOverTransactions(_.chain(transactions)
									      .pluck('transactions')
									      .flatten()
									      .value());
		      var result = {transactionsForDates:transactions,total:totalOverAllDates};
		      var formattedResult = pre_walk(result,transactionFormattingWalk);
		      callback(err,formattedResult);
		  });
	};
    };
}