var ReportData;

Date.prototype.toArray = function(){
    return [this.getFullYear(),
	    (this.getMonth()+1),
	    this.getDate(),
	    this.getHours(),
	    this.getMinutes(),
	    this.getSeconds()];
};

function doc_setup() {

    var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
    var db_install = 'install';
    var Company = couchDoc.extend({urlRoot:urlBase+db_install});
    
    var LoginDisplay = new reportLoginView();
    var CompanyReportDisplay = new companyReportView();
    var GroupReportDisplay = new groupReportView();
    var StoreReportDisplay = new storeReportView();
    var MenuReportsDisplay = new menuReportsView();
    var CompanyHowAreWeDisplay = new companyReportHowAreWeTodayView();
    var GroupHowAreWeDisplay = new groupReportHowAreWeTodayView();
    var StroeHowAreWeDisplay = new storeReportHowAreWeTodayView();
    var MenuReportsSalesSummaryDisplay = new menuReportsSalesSummaryView();
    var MenuReportsSalesDetailDisplay = new menuReportsSalesDetailView();
    var MenuReportsHourlyActivityDisplay = new menuReportsHourlyActivityView();
    var MenuReportsTaxCollcetedDisplay = new menuReportsTaxCollectedView();
    var MenuReportsElectronicPaymentsDisplay = new menuReportsElectronicPaymentsView();
    var MenuReportsCashOutsDisplay = new menuReportsCashOutsView();
    var MenuReportsCancelledDisplay = new menuReportsCancelledTransactionsView();
    var MenuReportsRefundsDisplay = new menuReportsRefundsView();
    var MenuReportsDiscountsDisplay = new menuReportsDiscountsView();
    var MenuReportsInventoryDisplay = new menuReportsInventoryView();
    var MenuSetMenusDisplay = new menuSetMenusView();
    var MenuInventoryDisplay = new menuInventoryView();
    var MenuInventoryScanPriceChangeDisplay = new menuInventoryscanPriceChangeView();
    var MenuInventoryScanTaxChangeDisplay = new menuInventoryscanTaxChangeView();
    var MenuInventoryAddScanItemDisplay = new menuInventoryaddScanItemView();
    var MenuInventoryPriceChangeLogDisplay = new menuInventorypriceChangeLogView();
    var MenuInventoryTaxChangeLogDisplay = new menuInventorytaxChangeLogView();
    var MenuAdministrationDisplay = new menuAdministrationView();
    
    Backbone.history.start();

	$("#layeredloginpassword").keyup(function(event){
  		if(event.keyCode == 13){
	    login();
	  }
	});

};


