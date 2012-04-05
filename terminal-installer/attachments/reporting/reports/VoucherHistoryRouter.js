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
                            
                            var opts =[];
                            if(voucherdown.val()=="ALL") {
                                opts = opts.concat("ZEROBALANCE").concat("NOTZEROBALANCE");
                            } else {
                                opts = opts.concat(voucherdown.val());
                            }
                            
                            console.log(ids);
                            console.log(opts);
                            
                            //TODO : fetch transactions
                            
                        } else {
                            alert("Input Date");
                        }
                        
                        //TODO : just reference
                        /*var originids = [companyInfo,groupInfo,storeInfo];
                        
                        stockInventoryFetcher_F(store.val(),originids)
                        (function(err,resp){
                             //console.log(resp);
                             $("#inventorystockmain").html(ich.inventoryStockMain_TMP({}));
                             
                             var invCollection = new (couchCollection(
                                          {db:'inventory'},
                                          {model:InventoryStockDoc,
                                           getJSONbyUPC:function(upccode){
                                               return (this).chain()
                                               .filter(function(model){return (model.get('inventory')).upccode==upccode;})
                                               .map(function(model){ return model.toJSON();})
                                               .value();
                                           },
                                           getModelbyUPC:function(upccode){
                                               return (this).chain()
                                               .filter(function(model){return (model.get('inventory')).upccode==upccode;})
                                               .value();
                                           }}));
                             
                             _.each(resp.docList, function(doc){
                                invCollection.add(new InventoryStockDoc(doc));
                                });
                             
                             view.collection = invCollection;
                             view.soldList = resp.soldList;
                             view._initUPCbox();
                             view._renderTable(invCollection.toJSON());
                         });*/
                        });
                 
                 },
                 _initUPCbox:function() {
                 var view = this;
                 $("#upc").keypress(
                     function(e){
                     var code = (e.keyCode ? e.keyCode : e.which), enterCode = 13;
                     if (code == enterCode){
                         view._searchInv($(this).val());}
                     });
                 
                 $("#submitAddStock").button().click(
                     function(){
                     var invCollection = view.collection;
                     var newInvModelList = 
                         _.chain(varFormGrabber($("#inventorystocktable")))
                         .removeEmptyKeys()   
                         .map(function(stockCnt,strUPC){
                              var upc = strUPC.replace("upc-","");//need to do this due to a limitation in forms.js
                              var invModel = _.first(invCollection.getModelbyUPC(upc)); 
                              var newCount = _.isNaN(Number(stockCnt))?Number(invModel.get('count')):(Number(invModel.get('count'))+Number(stockCnt));
                              //var invItemReturn = _.combine(invItem,{count:newCount.toString()});
                              //return invItemReturn;
                              if(_.isEmpty(invModel.get('_id'))) {
                                  var invJSON = invModel.toJSON();
                                  invModel.set({_id:invJSON.inventory.locid+"-"+invJSON.inventory.upccode+"-stock"},{silent:true});   
                              }
                              invModel.set({count:newCount.toString()},{silent:true});
                              return invModel;
                          })
                         .value();
                     
                     async.forEach(
                         newInvModelList,
                         function(model, callback) {
                         model.save({},{
                                success:callback,
                                error:callback
                                });
                         
                         },
                         function(err) {
                         //callback
                         view._searchInv($("#upc").val());
                         }
                     );
                     });
                 
                 },
                 _searchInv:function(searchString){
                 var view = this;
                 var invCollection = view.collection;
                 
                 if(_.isEmpty(searchString)){
                     var searchQuery = undefined;
                 }
                 else{
                     var searchQuery = searchString;
                 }
                 
                 if(!searchQuery) {
                     view._renderTable(invCollection.toJSON());
                 } else {
                     var listJSON = invCollection.getJSONbyUPC(_.str.trim(searchQuery));
                     if(_.size(listJSON)>0) {
                     view._renderTable(listJSON);
                     } else {
                     view._renderTable({});
                     }
                 } 
                 },
                 _renderTable:function(list) {
                 var view = this;
                 var soldlist = view.soldList;
                 
                 var for_TMP = 
                     _.chain(_.combine({},list))
                     .map(function(item_constant){
                              var item = _.combine({},item_constant);
                              item.inventory.price.selling_price = currency_format(Number(item.inventory.price.selling_price));
                              var found = _.find(soldlist,function(itm){ return itm.upc==item.inventory.upccode;});
                          if(_.isEmpty(found)) {
                          return _.combine({qty:item.count},item);
                          } else {
                          var qty = Number(item.count) - Number(found.info.qty);
                          return _.combine({qty:qty},item);
                          }
                      })
                     .sortBy(function(item){ return item.inventory.upccode;})
                     .value();
                 
                 var html = ich.inventoryStockstable_TMP({items:for_TMP});
                 $("#inventorystocktable").html(html);
                 }
             });
