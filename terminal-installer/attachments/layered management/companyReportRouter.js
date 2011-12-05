function log(text){return function(){console.log(text);};};
function generalReportRenderer(view,param,template,idField){ 
    function generateFormattedSales(sales){
	function toFixed(mag){
	    return function(num){
		return num.toFixed(mag);
	    };
	};
	function safeSum(total,cur){
	    return total + Number(cur);
	};
	function sumSalesType(sales,type){
	    return _(sales)
		.chain()
		.pluck(type)
		.reduce(safeSum,0)
		.value();
	};
	return _.applyToValues({yesterdaysales:sumSalesType(sales,'yesterdaysales'),
				mtdsales:sumSalesType(sales,'mtdsales'),
				ytdsales:sumSalesType(sales,'ytdsales')},
			       toFixed(2));
    };

    return function(callback){
	extractSalesDataFromIds(param.list,idField,function(listForTable){
				    param.list =  listForTable;
				    var formattedSales = generateFormattedSales(_.pluck(param.list,'sales'));
				    _.extend(param, {breadCrumb:"Company : " + 
						     ReportData.company.operationalname},{sales:formattedSales});
				    var html = ich[template](param);
				    $(view.el).html(html);
				    if(_.isFunction(callback)){callback(param);}
				});
    };
};

var companyReportRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "companyReport/":"companyReport",
		  "companyReport/groups" :"companyReport_groupsTable",
		  "companyReport/group/:group_id/stores" :"companyReport_storesTable",
		  "companyReport/store/:store_id/terminals" :"companyReport_terminalsTable",
		  "companyReport/stores" :"companyReport_storesTable",
		  "companyReport/terminals" :"companyReport_terminalsTable"
	      },
	      companyReport:function(){
		  console.log("companyReport  ");
	      },

	      companyReport_groupsTable:function() {
	     	  console.log("companyReport : groupsTable  ");
	      },
	      companyReport_storesTable:function(group_id) {
	     	  console.log("companyReport : storesTable ");
	      },
	      companyReport_terminalsTable:function(store_id) {
	     	  console.log("companyReport : terminalsTable ");
	      }}));

var companyReportView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderCompanyReport' , 
		       'renderGroupsTable', 
		       'renderStoresTable', 
		       'renderTerminalsTable');

	     companyReportRouter
		 .bind('route:companyReport', 
		       function(){
			   console.log("companyReportView, route:companyReport");
			   view.model = ReportData.company;
			   view.renderCompanyReport();
		       });

	     companyReportRouter
		 .bind('route:companyReport_groupsTable', 
		       function(){
			   console.log("companyReportView, route:companyReport_groupsTable");
			   view.renderGroupsTable();						
		       });

	     companyReportRouter
		 .bind('route:companyReport_storesTable', 
		       function(group_id){
			   console.log("companyReportView, route:companyReport_storesTable");
			   view.renderStoresTable(group_id);						
		       });

	     companyReportRouter
		 .bind('route:companyReport_terminalsTable', 
		       function(store_id){
			   console.log("companyReportView, route:companyReport_terminalsTable");
			   view.renderTerminalsTable(store_id);						
		       });
	 },
	 renderCompanyReport: function() {
	     generalReportRenderer(this,getReportParam(),'companyManagementPage_TMP','company_id')
	     (function(){
		  $("dialog-quickView").html();
		  console.log("companyReportView renderGroupsTable");});
	 },
	 renderGroupsTable: function() {
	     generalReportRenderer(this,getGroupsTableParam(),'groupsTabel_TMP','group_id')(log("companyReportView renderGroupsTable"));
	 },
	 renderStoresTable: function(id) {
	     generalReportRenderer(this,getStoresTableParam(id),'storesTabel_TMP','store_id')(log("companyReportView renderStoresTable"));
	 },
	 renderTerminalsTable : function(id) {
	     generalReportRenderer(this,getTerminalsTableParam(id),'terminalsTabel_TMP','terminal_id')(log("companyReportView renderTerminalsTable"));
	 }
	});