var menuSetMenusRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	"menuSetMenus/companyReport":"menuSetMenusCompany",
	     	"menuSetMenus/groupReport":"menuSetMenusGroup",
		  "menuSetMenus/storeReport":"menuSetMenusStore",
	      },
	      menuSetMenusCompany:function() {
		  console.log("menuSetMenusCompany  ");
	      },
	      menuSetMenusGroup:function() {
		  console.log("menuSetMenusGroup  ");
	      },
	      menuSetMenusStore:function() {
		  console.log("menuSetMenusStore  ");
	      }
	     }));

var menuSetMenusView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuSetMenusCompany',
		       'renderMenuSetMenusGroup',
		       'renderMenuSetMenusStore');
	     menuSetMenusRouter
		 .bind('route:menuSetMenusCompany', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusCompany");
			   view.renderMenuSetMenusCompany();
		       });
		menuSetMenusRouter
		 .bind('route:menuSetMenusGroup', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusGroup");
			   view.renderMenuSetMenusGroup();
		       });
		menuSetMenusRouter
		 .bind('route:menuSetMenusStore', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusStore");
			   view.renderMenuSetMenusStore();
		       });
	 },
	 renderMenuSetMenusCompany: function() {
	     
	     var html = ich.menuSetMenus_TMP({startPage:"companyReport", 
	     						    breadCrumb:breadCrumb(ReportData.company.companyName)});
	     $(this.el).html(html);
	     
	     		
		var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     var dropdownTerminal = $("#terminalsdown");
	     
	     _.each(ReportData.company.hierarchy.groups, function(group) {
			dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
		    });
	     
	     var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
										 return group.stores; 
									     }).flatten().value();
	     
	     _.each(stores, function(store) {
	 		dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var terminals = _(stores).chain().map(function(store) {
						       return store.terminals?store.terminals:[]; 
						   }).flatten().value();
	     if(terminals.length>0) {
		    _.each(terminals, function(terminal) {
		 			dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
		 	   });	
	 	} else {
	 		$('option', dropdownTerminal).remove();
	    	dropdownTerminal.append('<option value="NOTHING">NO TERMINALS</option>');
	 	}
		
	     console.log("rendered set menus");
	 },
	 renderMenuSetMenusGroup: function() {
	     
	     var html = ich.menuSetMenus_TMP({startPage:"groupReport", 
	     						    breadCrumb:breadCrumb(ReportData.companyName, ReportData.group.groupName)});
	     $(this.el).html(html);
	     
	    
		
	     console.log("rendered set menus");
	 },
	 renderMenuSetMenusStore: function() {
	     
	     var html = ich.menuSetMenus_TMP({startPage:"storeReport", 
	     						    breadCrumb:breadCrumb(ReportData.companyName, ReportData.groupName, ReportData.store.storeName)});
	     $(this.el).html(html);
	          
	 	
	     console.log("rendered set menus");
	 }
	});

/******************************************** helper functions ************************************/
function rendermenuReportsCashOutsTable() {
    console.log("renderCashOutsTable");
    
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");

    if(!_.isEmpty($("#dateFrom").val()) && !_.isEmpty($("#dateTo").val())) {
	var startDate = new Date($("#dateFrom").val());
	var endDate = new Date($("#dateTo").val());
	var endDateForQuery = new Date($("#dateTo").val());
	var today = (new Date()).toString("MM/dd/yyyy");
	
    endDateForQuery.addDays(1);
	
	//TODO
	var ids;
    
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
	
	console.log(ids);
	
	cashoutReportFetcher(ids,startDate,endDateForQuery)
	(function(data_TMP){
	     data_TMP = _.map(data_TMP, function(item){
				var dialogtitle=getDialogTitle(ReportData,item.name);
				return _.extend(item, {dialogtitle:dialogtitle});
			    });

	     var html = ich.menuReportsCashOutsTabel_TMP({items:data_TMP});
	     $("cashoutstable").html(html);
	     
	     _.each(data_TMP, function(item){	
			var btn = $('#'+item.id)
			    .button()
			    .click(function(){
				       var data = item.cashout;
				       var html = ich.menuReportsCashoutQuickViewDialog_TMP(data);
				       quickmenuReportsCashoutViewDialog(html, {title:item.dialogtitle});
				   });
		    });		
	 });
	
    } else {
   	alert("Input Date");
    }
};
