var inventory_table_view =
    Backbone.View.extend(
	{
	    render:function(data){
		var view = this,
		template = view.options.template,
		el = view.$el,
		html = ich[template](data);
		el.html(html)
	    }
	})
var menuReportsInventoryView =
    Backbone.View.extend(
	{
	    initialize:function(){
		var view = this
		view.menu_table = new inventory_table_view({template:'menuReportsInventoryMenutable_TMP'})
		view.scan_table = new inventory_table_view({template:'menuReportsInventoryScantable_TMP'})
		view.ecr_table = new inventory_table_view({template:'menuReportsInventoryEcrtable_TMP'})
	    },
	    events:{
		'click .generate_report':'generate_report',
		'change #inventorydown':'select_table_category',
		'click #btnExport':'export_report',
	    },
	    setup:function(){
		var view = this;
		view.$el.find('button').button()
		view.menu_table.setElement('#inventorymenutable')
		view.scan_table.setElement('#inventoryscantable')
		view.ecr_table.setElement('#inventoryecrtable')
	    },
	    render:function(data){
		var view = this
		view.menu_table.render(data)
		view.scan_table.render(data)
		view.ecr_table.render(data)
	    },
	    generate_report:function(){
		this.trigger('generate_report')
	    },
	    _show_hide_tables:multimethod()
		.dispatch(function(event){
			      var child_index = event.currentTarget.selectedIndex
			      var category_selected = $(event.currentTarget.children[child_index]).val()
			      return category_selected
			  })
		.when("ALL", function(){
			  this.menu_table.$el.show()
			  this.scan_table.$el.show()
			  this.ecr_table.$el.show()
		      })
		.when("Menu",function(){
			  this.menu_table.$el.show()
			  this.scan_table.$el.hide()
			  this.ecr_table.$el.hide()
		      })
		.when("Scan",function(){
			  this.menu_table.$el.hide()
			  this.scan_table.$el.show()
			  this.ecr_table.$el.hide()
		      })
		.when("ECR",function(){
			  this.menu_table.$el.hide()
			  this.scan_table.$el.hide()
			  this.ecr_table.$el.show()
		      }),
	    select_table_category:function(event){
		this._show_hide_tables(event)
	    },
	    export_report:function(){
		this.trigger('export')
	    },
	    _selection_obj:function(event){
		var child_index = event.currentTarget.selectedIndex
		var el = $(event.currentTarget.children[child_index]);
		var selection = {
		    id : el.val(),
		    name : el.text()
		}
		return selection;
	    }
	});

var menuReportsInventoryRouter =
    new (Backbone.Router.extend(
	     {routes: {
		  "menuReports/companyReportInventory":"setup",
		  "menuReports/groupReportInventory":"setup",
		  "menuReports/storeReportInventory":"setup"
	      },
	      initialize:function(){
		  var router = this
		  router.startDate = (new Date())
		  router.endDate = (new Date()).addDays(1)
		  router.views = {
		      report : new menuReportsInventoryView(),
		      start_date_picker : new date_picker_view({date:router.startDate}),
		      end_date_picker : new date_picker_view({date:router.endDate}),
		      navigation : new company_tree_navigation_view({template:"hierarchy_list_TMP"})
		  }
		  router.views.navigation.on('view-entity',function(id){this.selected_entity = id},router)
		  router.views.report.on('generate_report',router.fetch_inventory_report,router)
		  router.on('report_fetched',router.views.report.render,router.views.report)
		  router.views.report.on('export',router.export_csv,router)
		  router.views.start_date_picker.on('date-change',router.update_start_date,router)
		  router.views.end_date_picker.on('date-change',router.update_end_date,router)
	      },
	      setup:function(){
		  var router = this
		  router.selected_entity = topLevelEntity(ReportData).id
		  var html = ich.inventoryReports_TMP(_.extend({startPage:ReportData.startPage},autoBreadCrumb()))
		  $('#main').html(html)
		  router.views.report.setElement("#main").setup()
		  router.views.start_date_picker.setElement("#dateFrom").setup()
		  router.views.end_date_picker.setElement("#dateTo").setup()
		  router.views.navigation.setElement("#company-navigation").render(ReportData);
	      },
	      update_start_date:function(date){
		  this.startDate = date
	      },
	      update_end_date:function(date){
		  this.endDate = date
	      },
	      export_csv:function(){
		  var router = this
		  var handler = {
		      success:function(){
			  //go to new page with show fn
		      },
		      error:function(){
			  alert('there was an error exporting your data')
		      }
		  }
		  var doc = {
		      _id:$.couch.newUUID(),
		      content:router.current_view_data
		  }
		  $.couch.db('api').saveDoc(doc,handler)
	      },
	      fetch_inventory_report:function() {
		  var router = this
		  inventoryTotalsRangeFetcher_F(router.selected_entity)
		  (router.startDate.toArray().slice(0,3), router.endDate.toArray().slice(0,3))
		  (function(err,response) {
		       router.current_view_data = response;
		       router.trigger('report_fetched',response)
		   });
	      }
	     }));