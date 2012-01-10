//concat all of the .rows together from couchdb views over that return buttons
function constructMenu_keyValue(couchDB_responses){
    /*returns (can extend with transformed empty menu 
     Object:
     0:0: Object
     1:0: Object
     */
    return _(couchDB_responses).chain()
	.map(function(response){
	    return {date: response.value.date, menuButton: response.value.menuButton};
	})
	.groupBy(function(item){
	    return item.menuButton.display.screen +":"+
		item.menuButton.display.position;
	})
	.map(function(buttonChangeLog,location){
	    var mostRecentMenuButton = 
		_(buttonChangeLog).chain()
		.sortBy(function(item){return item.date;})
		.last()
		.value();
	    return [location,mostRecentMenuButton.menuButton];
	})
	.toObject()
	.value();
}

var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
var MenuButton = couchDoc.extend(
    {
	urlRoot:urlBase + "menu_buttons",
	emptyMenuButton:function(){
	    return {
		"display": {
		    "is_enabled": false,
		    "image": "",
		    "color": "255,255,255",
		    "description": [" ", " ", " "]
		},
		"foodItem": {
		    "price": "",
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
	}
    });