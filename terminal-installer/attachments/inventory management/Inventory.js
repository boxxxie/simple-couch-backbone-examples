


var Inventory = couchDoc.extend(	
    {defaults: function() {
	 return {
	     upccode:"unknown",
	     apply_taxes:{/*tax1:false, tax2:false, tax3:false, exemption:false*/},
	     category:"unknown",
	     description:"unknown",
	     location:{},
	     price:{}
	 }
     }
  });