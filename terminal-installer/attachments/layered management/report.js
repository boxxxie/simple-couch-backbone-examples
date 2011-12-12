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
    var MenuReportsHourlyActivityDisplay = new menuReportsHourlyActivityView();
    var MenuReportsTaxCollcetedDisplay = new menuReportsTaxCollectedView();
    var MenuReportsCashOutsDisplay = new menuReportsCashOutsView();
    var MenuReportsCancelledDisplay = new menuReportsCancelledTransactionsView();
    var MenuReportsRefundsDisplay = new menuReportsRefundsView();
    Backbone.history.start();

};


