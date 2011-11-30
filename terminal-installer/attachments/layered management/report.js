var ReportData;

var CashoutFormatData = {
    allDiscount:0.00,
    avgpayment:0.00,
    avgrefund:0.00,
    cashpayment:0.00,
    cashrefund:0.00,
    creditpayment:0.00,
    creditrefund:0.00,
    debitpayment:0.00,
    debitrefund:0.00,
    ecrsalesamount:0.00,
    ecrsalesno:0,
    ecrsalespercent:0.00,
    menusalesamount:0.00,
    menusalesno:0,
    menusalespercent:0.00,
    mobilepayment:0.00,
    mobilerefund:0.00,
    netrefund:0.00,
    netrefundtax1:0.00,
    netrefundtax3:0.00,
    netrefundtotal:0.00,
    netsaleactivity:0.00,
    netsales:0.00,
    netsalestotal:0.00,
    netsaletax1:0.00,
    netsaletax3:0.00,
    noofpayment:0,
    noofrefund:0,
    otherpayment:0.00,
    otherrefund:0.00,
    scansalesamount:0.00,
    scansalesno:0,
    scansalespercent:0.00
};


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
    Backbone.history.start();

};


