var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
var db_menus = "menus";
var Menu = couchDoc.extend(
    {
	urlRoot:urlBase + db_menus,
	menu_screen:function(screen){
	    if(!this.menuButtons || _.isEmpty(this.menuButtons)){
		this.set_empty_menu();
	    }
	    var buttonRows = _(this.toJSON().menuButtons).chain()
		.groupBy(function(button){return button.display.screen;})
		.peek(screen)
		.partition(4)
		.map(function(row){return {row:row};})
		.value();
	    return {menu_screen : buttonRows};
	},
	set_empty_menu :function(){
	    var default_menu_item =        
		{
		    "display": {
			"is_enabled": false,
			"image": "",
			"color": "255,255,255",
			"screen": 1,
			"position": 0,
			"description": [" ", " ", " "]
		    },
		    "foodItem": {
			"price": 0,
			"apply_taxes": {
			    "exemption": false,
			    "tax1": true,
			    "tax2": true,
			    "tax3": false
			},
			"use_scale": false,
			"print_to_kitchen": false,
			"duplicate": false,
			"has_modifier": false
		    }
		};
	    var menuButtonHeaders = [
		{
		    "description1": "",
		    "description2": "",
		    "description3": "",
		    "defaultImage": "/assets/menu-1.png",
		    "menu_id": 1,
		    "image": "",
		    "color": ""
		},
		{
		    "description1": "",
		    "description2": "",
		    "description3": "",
		    "defaultImage": "/assets/menu-2.png",
		    "menu_id": 2,
		    "image": "",
		    "color": ""
		},
		{
		    "description1": "",
		    "description2": "",
		    "description3": "",
		    "defaultImage": "/assets/menu-3.png",
		    "menu_id": 3,
		    "image": "",
		    "color": ""
		},
		{
		    "description1": "",
		    "description2": "",
		    "description3": "",
		    "defaultImage": "/assets/menu-4.png",
		    "menu_id": 4,
		    "image": "",
		    "color": ""
		}
	    ];
	    var num_of_menu_screens = 5;
	    var num_of_menu_buttons = 180;
	    var num_of_menu_buttons_per_screen = 36;
	    var menu = {};
	    menu.menuButtons = _(num_of_menu_screens).chain().range().zip(_.range(1,num_of_menu_screens+1))
		.map(function(menu_screen){
			 return _(num_of_menu_buttons_per_screen).chain().range()
			     .map(function(menu_item){
				      var display = {display:_.extend(_.clone(default_menu_item.display),
								      {screen: _.first(menu_screen), position: menu_item})};
				      return _.extend(_.clone(default_menu_item),display);
				  }).value();
		     })
		.flatten()
		.value();
	    menu.menuButtonHeaders = menuButtonHeaders;
	    return this.set(menu);
	}
    });