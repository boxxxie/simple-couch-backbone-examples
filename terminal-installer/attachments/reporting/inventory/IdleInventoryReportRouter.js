var idleInventoryRouter = 
    new (Backbone.Router.extend(
         {routes: {
          "menuInventory/IdleInventory":"idleInventory"
          },
          idleInventory:function() {
              this._setup();
          },
          _setup:function() {
              var html = ich.idleInventoryReports_TMP(_.extend({startPage:ReportData.startPage},autoBreadCrumb()));
              $("#main").html(html);
              
              var dropdownGroup = $("#groupsdown");
              var dropdownStore = $("#storesdown");
              
              switch(_.indexOf(["companyReport","groupReport","storeReport"],ReportData.startPage)) {
                  case 0: //: company
                  $('option', dropdownGroup).remove();
                 _.each(ReportData.company.hierarchy.groups, function(group) {
                    dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
                    });
                 
                 var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
                                                 return group.stores; 
                                                 }).flatten().value();
                 
                 $('option', dropdownStore).remove();
                 _.each(stores, function(store) {
                    dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
                                 + "(" + store.number + ")" + '</option>');
                    });
                  break;
                  case 1: //: group
                  $('option', dropdownGroup).remove();
                 dropdownGroup.append('<option value ='+ReportData.group.group_id+'>'+ReportData.group.groupName+ '</option>');
                 dropdownGroup.attr('disabled','disabled');
                 
                 $('option', dropdownStore).remove();
                 _.each(ReportData.group.stores, function(store) {
                    dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName 
                                 + "(" + store.number + ")" + '</option>');
                    });
                  break;
                  case 2: //: store
                  $('option', dropdownGroup).remove();
                 $('option', dropdownStore).remove();
                 
                 dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
                 dropdownGroup.attr('disabled','disabled');
                 dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName
                              + "(" + ReportData.store.number + ")" + '</option>');
                 dropdownStore.attr('disabled','disabled');
                  break;
              }
              
              // TODO : view
                
          }
         }));



/*
var idleInventoryView = 
    Backbone.View.extend(
    {initialize:function(){
         var view = this;
         view.el = $("#main");
         
         _.bindAll(view, 
               'renderIdleInventoryCompany',
               'renderIdleInventoryGroup',
               'renderIdleInventoryStore');
         idleInventoryRouter
         .bind('route:idleInventoryCompany', 
               function(){
               view.renderIdleInventoryCompany();
               });
         idleInventoryRouter
         .bind('route:idleInventoryGroup', 
               function(){
               view.renderIdleInventoryGroup();
               });
         idleInventoryRouter
         .bind('route:idleInventoryStore',
               function(){
               view.renderIdleInventoryStore();
               });
     },
     renderIdleInventoryCompany: function() {
         
         var html = ich.salesSummaryReports_TMP({startPage:"companyReport", 
                                 breadCrumb:breadCrumb(ReportData.company.companyName)});
         $(this.el).html(html);
         
         var dropdownGroup = $("#groupsdown");
         var dropdownStore = $("#storesdown");
         
         $('option', dropdownGroup).remove();
         _.each(ReportData.company.hierarchy.groups, function(group) {
            dropdownGroup.append('<option value=' + group.group_id + '>' + group.groupName + '</option>');
            });
         
         var stores = _(ReportData.company.hierarchy.groups).chain().map(function(group) {
                                         return group.stores; 
                                         }).flatten().value();
         
         $('option', dropdownStore).remove();
         _.each(stores, function(store) {
            dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName
                         + "(" + store.number + ")" + '</option>');
            });
         
         var btn = $('#generalgobtn')
         .button()
         .click(function(){
                renderSalesSummaryReportTable();
            });
         
         console.log("rendered general report");
     },
     renderIdleInventoryGroup: function() {
         
         var html = ich.salesSummaryReports_TMP({startPage:"groupReport", 
                             breadCrumb:breadCrumb(ReportData.companyName,
                                           ReportData.group.groupName)});
         $(this.el).html(html);
         
         var dropdownGroup = $("#groupsdown");
         var dropdownStore = $("#storesdown");
         
         $('option', dropdownGroup).remove();
         dropdownGroup.append('<option value ='+ReportData.group.group_id+'>'+ReportData.group.groupName+ '</option>');
         dropdownGroup.attr('disabled','disabled');
         
         $('option', dropdownStore).remove();
         _.each(ReportData.group.stores, function(store) {
            dropdownStore.append('<option value=' + store.store_id + '>' + store.storeName 
                         + "(" + store.number + ")" + '</option>');
            });
         
         var btn = $('#generalgobtn')
         .button()
         .click(function(){
                renderSalesSummaryReportTable();
            });
         
         console.log("rendered general report");
     },
     renderIdleInventoryStore: function() {
         
         var html = ich.salesSummaryReports_TMP({startPage:"storeReport", 
                             breadCrumb:breadCrumb(ReportData.companyName,
                                           ReportData.groupName,
                                           ReportData.store.storeName,
                                           ReportData.store.number)});
         $(this.el).html(html);
         
         var dropdownGroup = $("#groupsdown");
         var dropdownStore = $("#storesdown");
         
         $('option', dropdownGroup).remove();
         $('option', dropdownStore).remove();
         
         dropdownGroup.append('<option value=="">'+ReportData.groupName+ '</option>');
         dropdownGroup.attr('disabled','disabled');
         dropdownStore.append('<option value='+ReportData.store.store_id+'>'+ReportData.store.storeName
                      + "(" + ReportData.store.number + ")" + '</option>');
         dropdownStore.attr('disabled','disabled');
         
         var btn = $('#generalgobtn')
         .button()
         .click(function(){
                renderSalesSummaryReportTable();
            });
         
         console.log("rendered general report");
     }
    });
*/