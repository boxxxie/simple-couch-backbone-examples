function transactionsReportFetcher(start,end){
    return function(id){
	var view = cdb.view('reporting','id_date');
	var db = cdb.db('cashedout_transactions',{},true);
	var query = _async.transactionRangeQuery(start,end)(view,db,id);
	return function(callback){
	    query(function(err,response){
		      //todo, needs to be grouped by day
		      var transactions = _.chain(response.rows)
			  .groupBy(function(resp_item){
				       return _.chain(resp_item.key)
					   .slice(1,4)
					   .join("-")
					   .value();
				   }).map(function(items,date){
					      function startTime(transaction){
						  return (new Date(transaction.time.start)).getTime();
					      }
					      var transactionsForDate = 
						  _.chain(items).pluck('doc').sortBy(startTime).reverse().value();
					      return {date:date,transactions:transactionsForDate};
					  })
			  .value();
		      callback(err,transactions);
		  });
	};
    };
}