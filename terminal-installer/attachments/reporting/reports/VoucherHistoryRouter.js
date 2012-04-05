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
                    resetDropdownBox(ReportData, false, true);
                    
                    // TODO : view
                    _.once(function(){
                           //var view = this.view;
                           //view = new inventoryStockMngView();
                           })();
                    }
                }));