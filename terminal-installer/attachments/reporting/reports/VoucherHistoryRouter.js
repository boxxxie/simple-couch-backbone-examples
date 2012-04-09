var voucherHistoryRouter = 
    new (Backbone.Router.extend({
				    routes: {
					"menuReports/companyReportVouchersHistory":"voucherReport",
					"menuReports/groupReportVouchersHistory":"InvalidPage",
					"menuReports/storeReportVouchersHistory":"InvalidPage",
				    },
				    voucherReport:function() {
					this._setup();
				    },
				    InvalidPage:function() {
					alert("Sorry, you can't use this feature!");
					window.history.go(-1);    
				    },
				    _setup:function() {
					var html = ich.voucherHistoryReports_TMP(_.extend({startPage:ReportData.startPage},autoBreadCrumb()));
					$("#main").html(html);
					
					resetDatePicker();
					resetDropdownBox(ReportData, true, true);
					$("#ulhierarchy").hide();
					
					// TODO : view
					_.once(function(){
						   var view = this.view;
						   view = new voucherHistoryView();
					       })();
				    }
				}));



var voucherHistoryView =
    Backbone.View.extend({
			     initialize:function() {
				 var view = this;
				 var btn = $("#generalgobtn");
				 btn.button()
				     .click(function() {
						var dropdownGroup = $("#groupsdown");
						var dropdownStore = $("#storesdown");
						var dropdownTerminal = $("#terminalsdown");
						var voucherdown =$("#vouchersdown :selected");
						
						if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
						    var startDate = new Date($("#dateFrom").val());
						    var endDate = new Date($("#dateTo").val());
						    var endDateForQuery = new Date($("#dateTo").val());
						    endDateForQuery.addDays(1);
						    
						    if(dropdownTerminal.val()=="ALL") {
							ids = _($('option', dropdownTerminal)).chain()
							    .filter(function(item){ return item.value!=="ALL";})
							    .map(function(item){
								     return {id:item.value, name:item.text};
								 })
							    .value();
						    } else {
							var sd = $("#terminalsdown option:selected");
							ids =[{id:sd.val(), name:sd.text()}];
						    }
						    
						    //var opts =[];
						    //if(voucherdown.val()=="ALL") {
						    //    opts = opts.concat("ZEROBALANCE").concat("NOTZEROBALANCE");
						    //} else {
						    //    opts = opts.concat(voucherdown.val());
						    //}
						    
						    //console.log(ids);
						    //TODO : fetch transactions
						    otherTransactionsFromCashoutsFetcher(ids,startDate,endDateForQuery,voucherdown.val())
						    (function(err,resp){
							 //var data_TMP = appendGroupStoreInfoFromStoreID(resp);
							 
							 var totalrow = {};
							 totalrow.redeemed = currency_format(_.reduce(resp, function(init, item){
													  return init + Number(item.voucherRedeemed);
												      }, 0));
							 
							 var data_TMP = processTransactionsTMP(resp);
							 
							 data_TMP = _.sortBy(data_TMP,function(item){return item.time.start;});
							 var html = ich.menuReportsVouchertable_TMP({items:data_TMP, totalrow:totalrow});

							 $("#voucherstable").html(html);
							 
							 _.each(data_TMP, function(item){
								    var item = _.clone(item);
								    
								    var dialogtitle=getDialogTitle(ReportData,item);
								    
								    $("[id]")
									.filter(function(){return $(this).attr('id') == item._id;})
									.each(function(){$(this).button()
											 .click(function(){
												    var trHtml = $(this).parent().parent().parent().html();
												    if(trHtml.indexOf(item.voucherID)>=0) {
													var btnData = item;
													btnData.discount=null;
													//TODO:
													//btnData.storename = ReportData.store.storeName;
													//FIXME: use walk,
													_.applyToValues(ReportData,
															function(o){
															    if(o.store_id==btnData.store_id){
																btnData.storename = o.storeName;
															    }
															    return o;
															}
															,true);
													
													_.applyToValues(btnData,currency_format,true);
													
													var html = ich.generalTransactionQuickViewDialog_TMP(btnData);
													quickmenuReportsTransactionViewDialog(html, {title:dialogtitle});
												    }
												});
											}); 
								});
						     });
						} else {
						    alert("Input Date");
						}
					    });
				 
			     }
			 });
