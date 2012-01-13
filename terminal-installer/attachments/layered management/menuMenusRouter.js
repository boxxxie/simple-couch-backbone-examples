var menuModel;

var menuSetMenusRouter = 
    new (Backbone.Router.extend(
	     {routes: {
	     	  "menuSetMenus/companyReport":"menuSetMenusCompany",
	     	  "menuSetMenus/groupReport":"menuSetMenusGroup",
	     	  "menuSetMenus/storeReport":"menuSetMenusStore"
	      },
	      menuSetMenusCompany:function() {
		  console.log("menuSetMenusCompany  ");
	      },
	      menuSetMenusGroup:function() {
		  console.log("menuSetMenusGroup  ");
		  alert("Company can access this menu.");
		  window.history.go(-1);
	      },
	      menuSetMenusStore:function() {
		  console.log("menuSetMenusStore  ");
		  alert("Company can access this menu.");
		  window.history.go(-1);
	      }
	     }));

var menuSetMenusView = 
    Backbone.View.extend(
	{initialize:function(){
	     var view = this;
	     view.el = $("#main");
	     
	     _.bindAll(view, 
		       'renderMenuSetMenusCompany',
		       //'renderMenuSetMenusGroup',
		       //'renderMenuSetMenusStore',
		       'renderMenuHeaderPartial',
		       'renderMenuScreenPartial');
	     menuSetMenusRouter
		 .bind('route:menuSetMenusCompany', 
		       function(){
			   console.log("menuReportsView, route:menuSetMenusCompany");
			   view.renderMenuSetMenusCompany();
		       });
		//menuSetMenusRouter
		 //.bind('route:menuSetMenusGroup', 
		  //     function(){
		//	   console.log("menuReportsView, route:menuSetMenusGroup");
		//	   //view.renderMenuSetMenusCompany();
		//	   alert("Company can access this menu.");
		//	   window.history.go(-1);
		 //      });
		//menuSetMenusRouter
		 //.bind('route:menuSetMenusStore', 
		  //     function(){
		//	   console.log("menuReportsView, route:menuSetMenusStore");
		//	   //view.renderMenuSetMenusCompany();
		//	   alert("Company can access this menu.");
		//	   window.history.go(-1);
		 //      });
	 },
	 renderMenuSetMenusCompany: function() {
	     var view = this;
	     fetch_company_menu(ReportData.company._id)
	     (function(err,menu){
	    	  console.log(menu);
	    	  menuModel = menu;
	    	  
	    	  var html = ich.menuSetMenus_TMP({startPage:"companyReport", 
	     					   breadCrumb:breadCrumb(ReportData.company.companyName)});
		  $(view.el).html(html);
		  
		  
		  var htmlleft = ich.menuSetMenus_Left_TMP({});
		  $("#menusetmenusleft").html(htmlleft);
		  
		  $("#menumodifiersbutton").button()
		      .click(function(){
				 view.renderMenuScreenPartial(0);
				 $("#menusetmenusright").html({});
			     });
		  $("#menueditheader1").button()
		      .click(function(){
				 renderEditHeader(1);
			     });
		  $("#menueditheader2").button()
		      .click(function(){
				 renderEditHeader(2);
			     });
		  $("#menueditheader3").button()
		      .click(function(){
				 renderEditHeader(3);
			     });
		  $("#menueditheader4").button()
		      .click(function(){
				 renderEditHeader(4);
			     });						   						   
		  
		  
		  view.renderMenuScreenPartial(1);
		  view.renderMenuHeaderPartial();
		  
		  menuModel.bind("change:menuButtonHeaders",view.renderMenuHeaderPartial);
		  menuModel.bind("change:menuButtons", view.renderMenuScreenPartial);
		  
		  console.log("rendered set menus");	
	      }); 
	     
	 },
	 renderMenuHeaderPartial: function() {
	     var view = this;
	     var menuModelHeaders = menuModel.get('menuButtonHeaders');
	     
	     menuModelHeaders = _.map(menuModelHeaders, function(item) {
					  if(_.isEmpty(item.description1) 
			  		     && _.isEmpty(item.description2)
			  		     && _.isEmpty(item.description3)) {
				  	      item.description1="MENU" + item.menu_id;
					  }
					  return item;
				      });
	     
	     
	     var htmlbottom = ich.menuSetMenus_Bottom_TMP({menuButtonHeaders:menuModelHeaders});
	     $("#menusetmenusbottom").html(htmlbottom);
	     
	     _.each(menuModelHeaders, function(item){
		  	$("#menubuttonheader"+item.menu_id).button()
		  	//.css({background:"rgb("+item.color+")"})
			    .click(function(){
				       view.renderMenuScreenPartial(item.menu_id);
				       $("#menusetmenusright").html({});
				   });
		    });
	     
	     /*
	      _.each(menuModelHeaders, function(item){
	      $("#menubuttonheader"+item.menu_id)
	      .click(function(){
	      view.renderMenuScreenPartial(item.menu_id);
	      $("#menusetmenusright").html({});
	      });;
	      });
	      */
	     
	 },
	 renderMenuScreenPartial: function(model,menus,item) {
	     if(_.isNumber(model)){
	 	 console.log("screen num : " + model);
	 	 var menuscreentitle;
	 	 
	 	 if(model==0) {
	 	     menuscreentitle = "MODIFIERS";
	 	 } else {
	 	     var header = menuModel.get_header(model);
	 	     menuscreentitle = "".concat(header.description1)
	 	    	 .concat(header.description2)
	 	    	 .concat(header.description3);
	 	 }
	 	 
	 	 var menuScreen = menuModel.menu_screen(model);
		 var htmlcenter = ich.menuSetMenus_Center_TMP(_.extend({menuscreentitle:menuscreentitle},menuScreen));
		 $("#menusetmenuscenter").html(htmlcenter);
		 
		 _.each(menuScreen.menu_screen, function(item){
		 	_.each(item.row, function(rowitem) {
		 		var btn = $('#'+rowitem.display.screen+"\\:"+rowitem.display.position)
		 					.click(function(){
			    				//onsole.log("click event! : "+ this.id);
			    				renderEditMenuItem(rowitem.display.screen, rowitem.display.position);
				   			});	
		 	});	
		  });
		 
		 console.log("menuscreen rendered");
	     } else if(!_.isEmpty(item)) {
		 console.log("screen num : " + item.display.screen);
		 
		 var menuscreentitle;
		 if(item.display.screen==0) {
	 	     menuscreentitle = "MODIFIERS";
	 	 } else {
	 	     var header = menuModel.get_header(item.display.screen);
	 	     menuscreentitle = "".concat(header.description1)
	 	    	 .concat(header.description2)
	 	    	 .concat(header.description3);
	 	 }
	 	 
	 	 var menuScreen = menuModel.menu_screen(item.display.screen);
		 var htmlcenter = ich.menuSetMenus_Center_TMP(_.extend({menuscreentitle:menuscreentitle},menuScreen));
		 $("#menusetmenuscenter").html(htmlcenter);
		 
		 _.each(menuScreen.menu_screen, function(item){
		 	_.each(item.row, function(rowitem) {
		 		var btn = $('#'+rowitem.display.screen+"\\:"+rowitem.display.position)
		 					.click(function(){
			    				//console.log("click event! : "+ this.id);
			    				renderEditMenuItem(rowitem.display.screen, rowitem.display.position);
				   			});	
		 	});	
		  });	
		 
		 console.log("menuscreen rendered");
	     }
	 }
	});

/******************************************** helper functions ************************************/

function renderEditPage(num,position) {
    if(_.isNumber(position)) {
	//renderEditMenuItem
	var button = menuModel.get_button(num,position);
	
	var htmlright = ich.menuSetMenus_Right_TMP(button);
	$("#menusetmenusright").html(htmlright);
	var btn = $("#btnMenuSave")
				.click(function(){
					console.log("menuSavebtn event");
					saveEditMenu();
				});

	// if modifier menu, disable modifier/read scale button
	// otherwise(menu), disable duplicate button	
	if(num==0) {
	    var btnHasModifier = $("#has_modifier");
	    var btnUseScale = $("#use_scale");
	    btnHasModifier.attr('disabled',true);
	    btnUseScale.attr('disabled',true);
	} else {
	    var btnDuplicate = $("#duplicate");
	    btnDuplicate.attr('disabled',true);
	}
	$("#displayColor").ColorPicker({
					   onSubmit: function(hsb, hex, rgb, el) {
					       $(el).val(rgb.r + "," + rgb.g + "," + rgb.b);
					       $(el).ColorPickerHide();
					   },
					   onBeforeShow: function () {
					       $(this).ColorPickerSetColor(this.value);
					   }
				       })
	    .bind('keyup', function(){
		      $(this).ColorPickerSetColor(this.value);
		  });
	
    } else {
	//renderEditHeader
	var menu_id=num;
	var header  = menuModel.get_header(menu_id);
	
	var htmlright = ich.menuSetMenuHeader_TMP(header);
	$("#menusetmenusright").html(htmlright);
	
	$("#displayColor").ColorPicker({
					   onSubmit: function(hsb, hex, rgb, el) {
					       $(el).val(rgb.r + "," + rgb.g + "," + rgb.b);
					       $(el).ColorPickerHide();
					   },
					   onBeforeShow: function () {
					       $(this).ColorPickerSetColor(this.value);
					   }
				       })
	    .bind('keyup', function(){
		      $(this).ColorPickerSetColor(this.value);
		  });
	
    }
};

function renderEditHeader(numHeader) {
    renderEditPage(numHeader);
};

function renderEditMenuItem(numScreen,position) {
    renderEditPage(numScreen,position);
};

function clearEditMenu() {
    
};

function closeEditMenu() {
    $("#menusetmenusright").html({});
};

function saveEditMenu() {
    var editDialog = $("#editMenuButton");

    var newButtonItemData = varFormGrabber(editDialog);

    
    menuModel.set_button(newButtonItemData);    
    menuModel.save();
    
    console.log("menuModel, saved");
    closeEditMenu();
};

function clearEditHeader() {
    
}

function closeEditHeader() {
    $("#menusetmenusright").html({});
}

function saveEditHeader() {
    var editDialog = $("#editMenuHeaderButton");

    var newHeaderItemData = varFormGrabber(editDialog);

    console.log("newHeaderItemData");
    console.log(newHeaderItemData);
    
    menuModel.set_header(newHeaderItemData);    
    menuModel.save();
    closeEditMenu();
}
