var menuReportsHourlyActivityRouter = 
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportHourlyActivity":"menuReportsCompanyHourly",
		  "menuReports/groupReportHourlyActivity":"menuReportsGroupHourly",
		  "menuReports/storeReportHourlyActivity":"menuReportsStoreHourly"
	      },
	      menuReportsCompanyHourly:function() {
		  console.log("menuReportsCompanyHourly  ");
	      },
	      menuReportsGroupHourly:function() {
		  console.log("menuReportsGroupHourly  ");
	      },
	      menuReportsStoreHourly:function() {
		  console.log("menuReportsStoreHourly  ");
	      }
	     }));


var menuReportsHourlyActivityView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("main");
	     
	     _.bindAll(view, 
		       'renderMenuReportsCompanyHourly',
		       'renderMenuReportsGroupHourly',
		       'renderMenuReportsStoreHourly');
	     menuReportsHourlyActivityRouter
		 .bind('route:menuReportsCompanyHourly', 
		       function(){
			   console.log("menuReportsHourlyActivityView, route:menuReportsCompanyHourly");
			   view.renderMenuReportsCompanyHourly();
		       });
	     menuReportsHourlyActivityRouter
		 .bind('route:menuReportsGroupHourly', 
		       function(){
			   console.log("menuReportsHourlyActivityView, route:menuReportsGroupHourly");
			   view.renderMenuReportsGroupHourly();
		       });
	     menuReportsHourlyActivityRouter
		 .bind('route:menuReportsStoreHourly', 
		       function(){
			   console.log("menuReportsHourlyActivityView, route:menuReportsStoreHourly");
			   view.renderMenuReportsStoreHourly();
		       });
	 },
	 renderMenuReportsCompanyHourly: function() {
	     
	     var html = ich.hourlyActivityReports_TMP({startPage:"companyReport", 
	     					       breadCrumb:breadCrumb(ReportData.company.operationalname)});
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
						       return store.terminals; 
						   }).flatten().value();
	     _.each(terminals, function(terminal) {
	 		dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
	 	    });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsGroupHourly: function() {
	     
	     var html = ich.hourlyActivityReports_TMP({startPage:"groupReport", 
	 					       breadCrumb:breadCrumb(ReportData.companyName,ReportData.group.groupName)});
	     $(this.el).html(html);
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     dropdownGroup.append('<option value ='+ReportData.group.group_id+'>'+ReportData.group.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     
	     _.each(ReportData.group.stores, function(store) {
 			dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName + '</option>');
	 	    });
	     
	     var terminals = _(ReportData.group.stores).chain().map(function(store) {
									return store.terminals; 
								    }).flatten().value();
	     _.each(terminals, function(terminal) {
	 		dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
	 	    });
	     
	     console.log("rendered general report");
	 },
	 renderMenuReportsStoreHourly: function() {
	     
	     var html = ich.hourlyActivityReports_TMP({startPage:"storeReport", 
	 					       breadCrumb:breadCrumb(ReportData.companyName,
	 					     			     ReportData.groupName,
	 					     			     ReportData.store.storeName)});
	     $(this.el).html(html);
	     
	     var dropdownGroup = $("#groupsdown");
	     var dropdownStore = $("#storesdown");
	     var dropdownTerminal = $("#terminalsdown");
	     
	     $('option', dropdownGroup).remove();
	     $('option', dropdownStore).remove();
	     
	     dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
	     dropdownGroup.attr('disabled','disabled');
	     dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName+ '</option>');
	     dropdownStore.attr('disabled','disabled');
	     
	     _.each(ReportData.store.terminals, function(terminal) {
	 		dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
	 	    });
	     
	     console.log("rendered general report");
	 }
	});


/************************************ helper functions **********************************************/
function renderHourlyActivityTable() {
    var dropdownGroup = $("#groupsdown");
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");
    
    if(dropdownTerminal.val()!="ALL") {
	alert("terminal id : "+dropdownTerminal.val());
    } else if(dropdownStore.val()!="ALL") {
	alert("store id : "+dropdownStore.val());
    } else if(dropdownGroup.val()!="ALL" && dropdownGroup.val()!="") {
	alert("group id : "+dropdownGroup.val());
    } else {
	if(dropdownGroup.val()=="ALL") {
	    alert("company id : "+ReportData.company._id);
	} else if(dropdownGroup.val()=="") {
	    alert("store id : "+ ReportData.store.store_id);
	}
    }
    
    //TODO : hourly activity talble data 
    var data_param={};
    
    var html = ich.hourlyActivityTabel_TMP(data_param);
    $("hourlytable").html(html);
};

function updateTerminalDropdown() {
    var dropdownStore = $("#storesdown");
    var dropdownTerminal = $("#terminalsdown");
    
    var terminals, allStores;
    var ids;
    
    $('option', dropdownTerminal).remove();
    dropdownTerminal.append('<option value="ALL">ALL</option>');
    
    if(dropdownStore.val()=="ALL") {
	ids = _($('option', dropdownStore)).chain()
	    .map(function(option){return option.value})
	    .reject(function(item){return item=="ALL"})
	    .value();
    } else {
	ids = [dropdownStore.val()];
    }
    
    if(!_.isEmpty(ReportData.company)) {
	var groups = ReportData.company.hierarchy.groups;
	allStores = _(groups).chain().map(function(group) {
					      return group.stores; 
					  }).flatten().value();
    } else if(!_.isEmpty(ReportData.group)) {
	allStores = ReportData.group.stores;			
    } else if(!_.isEmpty(ReportData.store)) {
	allStores = [ReportData.store];
    }
    
    var stores = _(ids).chain()
	.map(function(id){
		 return _.filter(allStores, function(store){ return store.store_id==id}) 
	     }).flatten().value();
    terminals = _(stores).chain().map(function(store) {
					  return store.terminals; 
				      }).flatten().value();
    
    _.each(terminals, function(terminal) {
 	       dropdownTerminal.append('<option value=' + terminal.terminal_id + '>' + terminal.terminal_label + '</option>');
 	   });	
};