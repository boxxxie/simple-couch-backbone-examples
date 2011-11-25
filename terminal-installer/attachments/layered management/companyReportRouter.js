var CompanyReportRouter = 
    Backbone.Router.extend(
	{
	    routes: {
		
		"companyReport/":"companyReport",
		"companyReport/groups" :"companyReport_groupsTable",
		"companyReport/group/:group_id/stores" :"companyReport_storesTable",
		"companyReport/store/:store_id/terminals" :"companyReport_terminalsTable",
		"companyReport/stores" :"companyReport_storesTable",
		"companyReport/terminals" :"companyReport_terminalsTable"
	    }
});