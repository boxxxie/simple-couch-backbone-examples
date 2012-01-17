function negate(num){
    if(_.isNumber(num)){
	return -num;
    }
    return num;
}

function inventoryTotalsRangeFetcher_F(id){
    var view = cdb.view('reporting','inventory_report');
    var db = cdb.db('cashedout_transactions',{},true);
    return function(startDate,endDate){
	var rangeQuery = _async.typedTransactionQuery(startDate,endDate);
	var rangeGroupedQuery = _async.transactionRangeGroupedQuery(startDate,endDate);

	return function(callback){
	    async.parallel(
		{
		    total_menu_sale : rangeQuery(view,db,[id,"SALE","MENU"]),
		    total_menu_refund : rangeQuery(view,db,[id,"REFUND","MENU"]),
		    all_menu_sales : rangeGroupedQuery(view,db,[id,"SALE","MENU"]),
		    all_menu_refunds : rangeGroupedQuery(view,db,[id,"REFUND","MENU"]),

		    total_scan_sale : rangeQuery(view,db,[id,"SALE","INVENTORY"]),
		    total_scan_refund : rangeQuery(view,db,[id,"REFUND","INVENTORY"]),
		    all_scan_sales : rangeGroupedQuery(view,db,[id,"SALE","INVENTORY"]),
		    all_scan_refunds : rangeGroupedQuery(view,db,[id,"REFUND","INVENTORY"]),

		    total_department_sale : rangeQuery(view,db,[id,"SALE","DEPARTMENT"]),
		    total_department_refund : rangeQuery(view,db,[id,"REFUND","DEPARTMENT"]),
		    all_department_sales : rangeGroupedQuery(view,db,[id,"SALE","DEPARTMENT"]),
		    all_department_refunds : rangeGroupedQuery(view,db,[id,"REFUND","DEPARTMENT"]),

		    total_scale_sale : rangeQuery(view,db,[id,"SALE","SCALE"]),
		    total_scale_refund : rangeQuery(view,db,[id,"REFUND","SCALE"]),
		    all_scale_sales : rangeGroupedQuery(view,db,[id,"SALE","SCALE"]),
		    all_scale_refunds : rangeGroupedQuery(view,db,[id,"REFUND","SCALE"]),


		    total_ecr_sale : rangeQuery(view,db,[id,"SALE","ECR"]),
		    total_ecr_refund : rangeQuery(view,db,[id,"REFUND","ECR"]),
		    all_ecr_sales : rangeGroupedQuery(view,db,[id,"SALE","ECR"]),
		    all_ecr_refunds : rangeGroupedQuery(view,db,[id,"REFUND","ECR"])

		},
		function(err,raw_resp){
		    function inventory_transform(items){
			function reduceValue(val,key){
			    var reducedVal = _(val).
				chain().
				map(_.selectKeys_F(['price','quantity'])).
				reduce(_.addPropertiesTogether,{}).
				value();
			    return _.extend({label:key},reducedVal);
			}
			
			var out = _(items).chain()
			    .map(function(item){
				     return _.extend({label : _(item.key).last()},item.value);
				 })
			    .groupBy(function(item){
					 return item.label;
				     })
			    .map(reduceValue)
			    .value();
			return out;
		    }
		    function totals_list(sales,refunds,typedSales,totalSales){
			function applyPercentages(typedSales,totalSales){
			    return function(item){
				if(typedSales == 0){
				    var typedPercentage = 0;
				}
				else{
				    var typedPercentage = item.totals.price/typedSales * 100;
				    var typedPercentage_rounded = Number(toFixed(2)(typedPercentage));
				}
				if(totalSales == 0){
				    var totalSalesPercentage = 0;
				}
				else{
				    var totalSalesPercentage = item.totals.price/totalSales * 100;
				    var totalSalesPercentage_rounded =  Number(toFixed(2)(totalSalesPercentage));
				}
				return _.extend({},item,{typedSalesPercentage: typedPercentage, totalSalesPercentage: totalSalesPercentage});
			    };
			}
			sales = sales.rows;
			refunds = _.applyToValues(refunds.rows,negate,true);
			var totals_labeled = _.mapNest(inventory_transform(sales.concat(refunds)),['price','quantity'],'totals');
			var sales_labeled = _.mapNest(inventory_transform(sales),['price','quantity'],'sales');
			var refunds_labeled = _.mapNest(inventory_transform(refunds),['price','quantity'],'refunds');
			return _([])
			    .chain()
			    .concat(totals_labeled, sales_labeled, refunds_labeled)
			    .groupBy('label')
			    .mapMerge()
			    .map(applyPercentages(typedSales,totalSales))
			    .value();
		    }
		    function totals(sales,refunds){
			function defaultValue(o){
			    if(_.isEmpty(o.rows)){
				return {price:0,quantity:0};
			    }
			    else{
				return o.rows[0].value;
			    }
			}
			var salesVal = defaultValue(sales);
			var refundsVal =_.applyToValues(defaultValue(refunds),negate);
			return _([salesVal,refundsVal]).reduce(_.addPropertiesTogether,{});
		    }

		    var resp = raw_resp;
		    
		    var ecr_sales = _.reduce([totals(resp.total_department_sale,resp.total_department_refund),
					      totals(resp.total_scale_sale,resp.total_scale_refund),
					      totals(resp.total_ecr_sale,resp.total_ecr_refund)],
					     _.addPropertiesTogether,
					     {});

		    var menu_sales=totals(resp.total_menu_sale,resp.total_menu_refund);
		    var scan_sales=totals(resp.total_scan_sale,resp.total_scan_refund);

		    var totalSales = _.reduce([menu_sales,scan_sales,ecr_sales],_.addPropertiesTogether,{}).price;

		    var menu_sales_list = totals_list(resp.all_menu_sales,resp.all_menu_refunds,menu_sales.price,totalSales);
		    var menu_sales_totals = _.reduce(menu_sales_list,_.addPropertiesTogether,{});
		    

		    var scan_sales_list =_(totals_list(resp.all_scan_sales,resp.all_scan_refunds,scan_sales.price,totalSales))
			.map(function(scan){
				 var labels = scan.label.split('-');
				 var upc = _.str.trim(_.first(labels));
				 var description =  _.str.trim(_.second(labels));

				 var data = _.extend({},scan);
				 //return _.extend({upc: upc, label:description},scan);
				 return _.extend(data,{upc: upc, label:description});
			     });

		    var scan_sales_totals = _.reduce(scan_sales_list,_.addPropertiesTogether,{});
		    
		    var ecr_sales_list =totals_list(resp.all_ecr_sales,
						    resp.all_ecr_refunds,
						    ecr_sales.price,totalSales);
		    var department_sales_list=totals_list(resp.all_department_sales,
							  resp.all_department_refunds,
							  ecr_sales.price,totalSales);
		    var scale_sales_list=totals_list(resp.all_scale_sales,
						     resp.all_scale_refunds,
						     ecr_sales.price,totalSales);

		    var ecr_sales_totals = _.reduce(ecr_sales_list.concat(department_sales_list).concat(scale_sales_list),
						    _.addPropertiesTogether,{});
		    
		    var scale_sales_list_formatted = pre_walk(scale_sales_list,
							      function(obj){
								  if(obj.quantity){
								      return _.extend(obj,{quantity:obj.quantity.toFixed(3)});
								  }	 
								  return obj;
							      });
		    function applyDefaultSalesFields(list){
			function applyDefault_sales_refunds(item){
			    return _.defaults(item,{sales:{price:0,quantity:0},refunds:{price:0,quantity:0}});
			}
			return _.map(list,applyDefault_sales_refunds);
		    }
		    
		    var forTMP = { 
			menu_sales_list: applyDefaultSalesFields(menu_sales_list),
			menu_list_totals:menu_sales_totals,
			menu_sales:menu_sales,

			scan_sales_list:applyDefaultSalesFields(scan_sales_list),
			scan_list_totals:scan_sales_totals,
			scan_sales:scan_sales,
			
			department_sales_list:applyDefaultSalesFields(department_sales_list),
			
			scale_sales_list:applyDefaultSalesFields(scale_sales_list_formatted),

			ecr_sales_list:applyDefaultSalesFields(ecr_sales_list),
			ecr_list_totals:ecr_sales_totals,

			ecr_sales:ecr_sales
		    };

		    var priceFormatedTMP = _(forTMP).chain()
			.applyToValues(function(item){
					   if(item.price){
					       return _.extend({},item,{price:currency_format(item.price)});
					   }
					   return item;
				       },true)
			.applyToValues(function(item){
					   if(_.isNumber(item.quantity)){
					       return _.extend({},item,{quantity:item.quantity+""});
					   }
					   return item;
				       },true)
			.applyToValues(toFixed(2),true)
			.value();
		    
		    callback(err,priceFormatedTMP);	  
		});
	};
    };
}
