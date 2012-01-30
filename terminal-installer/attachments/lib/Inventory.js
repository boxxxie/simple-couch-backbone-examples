var urlBase = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port + "/";
var InventoryDoc = couchDoc.extend({urlRoot:urlBase + "inventory"});
var InventoryRT7Doc = couchDoc.extend({urlRoot:urlBase + "inventory_rt7"});
var InventoryChangesDoc = couchDoc.extend({urlRoot:urlBase + "inventory_changes"});