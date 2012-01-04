function negate(num){
    if(_.isNumber(num)){
	return -num;
    }
    return num;
}

function addPropertiesTogetherRounded(roundMag){
    return function(addTo,addFrom){
	for (var prop in addFrom) {
	    var addFromVal = Number(toFixed(roundMag)(addFrom[prop]));
	    (addTo[prop] !== undefined && _.isNumber(addFromVal)) ? addTo[prop] += addFromVal: addTo[prop] = addFromVal;
	}
	return addTo;
    };
};

function inventoryTotalsRangeFetcher_F(id){
    var view = cdb.view('reporting','inventory_report');
   // var db = cdb.db('cashedout_transactions',{},true); //fixme change the db to cashouts_transactions
    var db = cdb.db('transactions',{},true); //fixme change the db to cashouts_transactions
    return function(startDate,endDate){
	var rangeQuery = _async.typedTransactionQuery(startDate,endDate);
	var rangeGroupedQuery = _async.transactionRangeGroupedQuery(startDate,endDate);

	return function(callback){
	    async.parallel({
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
			   function(err,resp){
			       function inventory_transform(items){
				   function reduceValue(pair){
				       var key = _.first(pair);
				       var val = _.second(pair);
				       var reducedVal = _(val).
					   chain().
					   map(function(o){return _.selectKeys(o,['price','quantity']);}).
					   reduce(addPropertiesTogetherRounded(2),{}).
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
				       .kv()
				       .map(reduceValue)
				       .value();
				   return out;
			       }
			       function totals_list(sales,refunds,typedSales,totalSales){
				   function applyPercentages(typedSales,totalSales){
				       return function(item){
					   if(typedSales == 0){
					       var typedPercentage = "0.00";
					   }
					   else{
					       var typedPercentage = item.price/typedSales * 100;
					   }
					   if(totalSales == 0){
					       var totalSalesPercentage = "0.00";
					   }
					   else{
					       var totalSalesPercentage = item.price/totalSales * 100;
					   }
					   return _.extend({},item,{typedSalesPercentage : typedPercentage, totalSalesPercentage: totalSalesPercentage});
				       };
				   }
				   sales = sales.rows;
				   refunds = _.applyToValues(refunds.rows,negate,true);
				   return _(inventory_transform(sales.concat(refunds)))
				       .map(applyPercentages(typedSales,totalSales));
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
				   return addPropertiesTogetherRounded(2)(salesVal,refundsVal);
			       }

			       function totals_calc(sales_list){
				   return _(sales_list).chain()
				       .map(_.selectKeys_F(['price','quantity','totalSalesPercentage','typedSalesPercentage']))
				       .reduce(addPropertiesTogetherRounded(2),{})
				       .value();
			       }
			       
			       var ecr_sales = _.reduce([totals(resp.total_department_sale,resp.total_department_refund),
							 totals(resp.total_scale_sale,resp.total_scale_refund),
							 totals(resp.total_ecr_sale,resp.total_ecr_refund)],
							addPropertiesTogetherRounded(2),
							{});

			       var menu_sales=totals(resp.total_menu_sale,resp.total_menu_refund);
			       var scan_sales=totals(resp.total_scan_sale,resp.total_scan_refund);


			       var totalSales = _.reduce([menu_sales,scan_sales,ecr_sales],addPropertiesTogetherRounded(2),{}).price;
			       


			       var menu_sales_list = totals_list(resp.all_menu_sales,resp.all_menu_refunds,menu_sales.price,totalSales);
			       var menu_sales_totals = totals_calc(menu_sales_list);
 

			       var scan_sales_list =_(totals_list(resp.all_scan_sales,resp.all_scan_refunds,scan_sales.price,totalSales))
				   .map(function(scan){
					    var labels = scan.label.split('-');
					    var upc = _.str.trim(_.first(labels));
					    var description =  _.str.trim(_.second(labels));
					    return _.extend({upc: upc, description:description},scan);
					});
			       var scan_sales_totals = totals_calc(scan_sales_list);
			       
			       var ecr_sales_list =totals_list(resp.all_ecr_sales,resp.all_ecr_refunds,ecr_sales.price,totalSales);
			       var department_sales_list=totals_list(resp.all_department_sales,resp.all_department_refunds,ecr_sales.price,totalSales);
			       var scale_sales_list=totals_list(resp.all_scale_sales,resp.all_scale_refunds,ecr_sales.price,totalSales);

			       var ecr_sales_totals = totals_calc(ecr_sales_list.concat(department_sales_list).concat(scale_sales_list));
			       
			       var scale_sales_list_formatted = _(scale_sales_list)
				   .map(function(scale){
					    scale.quantity = scale.quantity.toFixed(3);
					    return scale;
					});
			       
			       var forTMP = { 
				   menu_sales_list: menu_sales_list,
				   menu_list_totals:menu_sales_totals,
				   menu_sales:menu_sales,

				   scan_sales_list:scan_sales_list,
				   scan_list_totals:scan_sales_totals,
				   scan_sales:scan_sales,
				   
				   department_sales_list:department_sales_list,
				   
				   scale_sales_list:scale_sales_list_formatted,

				   ecr_sales_list:ecr_sales_list,
				   ecr_list_totals:ecr_sales_totals,

				   ecr_sales:ecr_sales
			       };

			       var priceFormatedTMP = _(forTMP).chain()
				   .applyToValues(function(item){
						      if(item.price){
							  return _.extend(item,{price:currency_format(item.price)});
						      }
						      return item;
						  },true)
				   .applyToValues(function(item){
						      if(item.quantity){
							  return _.extend(item,{quantity:item.quantity+""});
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
