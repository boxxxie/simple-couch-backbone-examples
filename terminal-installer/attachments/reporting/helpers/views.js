var company_tree_navigation_view =
    Backbone.View.extend(
	{
	    events:{
		"click li":"view_entity"
	    },
	    view_entity:function(event){
		var entity = $(event.currentTarget)
		var entity_id = entity.attr('id')
		var entity_name = entity.html()
		this.trigger('view-entity',entity_id,entity_name)
	    },
	    render:function(tree){
		this.$el.html(ich[this.options.template](tree))
	    }
	})

var date_picker_view =
    Backbone.View.extend(
	{
	    events:{
		'change':'date_change'
	    },
	    date_change:function(e){
		var date = new Date($(e.currentTarget).val())
		this.trigger('date-change',date)
	    },
	    setup:function(){
		this.$el.datepicker()
		var default_date =this.options.date
		if(default_date){
		    this.$el.datepicker("setDate",default_date)
		}
	    }
	})