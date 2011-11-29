var ReportData;

var globalReportTestData = {
	  				   yesterday: {NetSales:{netSales:"100.00", totalTax1:"1.00", totalTax3:"1.00", totalSales:"100.00"},
	  				   			   NetRefunds:{netRefunds:"100.00", totalTax1:"1.00", totalTax3:"1.00", totalRefunds:"100.00"},
	  				   			   NetSaleActivity : "200.00",
	  				   			   PaymentDetails : {cash:"100.00", creditcard:"100.00", debitcard:"100.00", mobile:"100.00", noOfTrans:"7", avgTrans:"77.77"},
	  				   			   RefundDetails : {cash:"100.00", creditcard:"100.00", debitcard:"100.00", mobile:"100.00", noOfTrans:"7", avgTrans:"77.77"},
	  				   			   TotalDiscount : "123.45",
	  				   			   SalesByCategory : {menuSalesAmt:"100.00", menuSalesPct:"100.00", scanSalesAmt:"100.00", scanSalesPct:"100.00", ecrSalesAmt:"100.00", ecrSalesPct:"100.00"}
	  				   			   },
	  				   			   
	  				   mtd: {NetSales:{netSales:"100.00", totalTax1:"1.00", totalTax3:"1.00", totalSales:"100.00"},
			  				   		 NetRefunds:{netRefunds:"100.00", totalTax1:"1.00", totalTax3:"1.00", totalRefunds:"100.00"},
			  				   		 NetSaleActivity : "200.00",
	  				   			   PaymentDetails : {cash:"100.00", creditcard:"100.00", debitcard:"100.00", mobile:"100.00", noOfTrans:"7", avgTrans:"77.77"},
	  				   			   RefundDetails : {cash:"100.00", creditcard:"100.00", debitcard:"100.00", mobile:"100.00", noOfTrans:"7", avgTrans:"77.77"},
	  				   			   TotalDiscount : "123.45",
	  				   			   SalesByCategory : {menuSalesAmt:"100.00", menuSalesPct:"100.00", scanSalesAmt:"100.00", scanSalesPct:"100.00", ecrSalesAmt:"100.00", ecrSalesPct:"100.00"}
	  				   		 		},
	  				   		 
	  				   ytd: {NetSales:{netSales:"100.00", totalTax1:"1.00", totalTax3:"1.00", totalSales:"100.00"},
			  				   		 NetRefunds:{netRefunds:"100.00", totalTax1:"1.00", totalTax3:"1.00", totalRefunds:"100.00"},
			  				   		 NetSaleActivity : "200.00",
	  				   			   PaymentDetails : {cash:"100.00", creditcard:"100.00", debitcard:"100.00", mobile:"100.00", noOfTrans:"7", avgTrans:"77.77"},
	  				   			   RefundDetails : {cash:"100.00", creditcard:"100.00", debitcard:"100.00", mobile:"100.00", noOfTrans:"7", avgTrans:"77.77"},
	  				   			   TotalDiscount : "123.45",
	  				   			   SalesByCategory : {menuSalesAmt:"100.00", menuSalesPct:"100.00", scanSalesAmt:"100.00", scanSalesPct:"100.00", ecrSalesAmt:"100.00", ecrSalesPct:"100.00"}
		  				   		 }
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


