


var Inventory = couchDoc.extend(	
    {defaults: function() {
	 return {
	     upccode:"unknown",
	     apply_taxes:{/*tax1:false, tax2:false, tax3:false, exemption:false*/},
	     category:"unknown",
	     description:"unknown",
	     location:{/*company:company_id, group:group_id, store:store_id*/},
	     price:{/*selling_price:0.00, standard_price:0.00*/}
	 };
     }
  });
