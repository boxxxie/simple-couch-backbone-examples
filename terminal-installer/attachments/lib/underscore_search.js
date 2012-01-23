if(!_ && require != 'undefined'){var _ = require("./underscore");}

_.mixin({
	    /* 
	     * like _.any, but will recursively search the array/object 
	     * _.search(1)([[{a:{b:1}}]]) -> true
	     */
	    search:function(compareFn){
		return function(searchFor,searchIn){
			if(compareFn(searchFor,searchIn)){
			    return true;
			}else{
			    return _.any(searchIn,
					 function(val){
					     if(compareFn(searchFor,val)){
						 return true;
					     }
					     else if (_.isObject(val) || _.isArray(val)){
						 return _.search(compareFn)(searchFor,val);
					     }
					     else{
						 return false;   
					     }
					 });
			}
		    };
	    }});
_.mixin({
	    search_Eq:_.search(_.isEqual),
	    search_Str:_.search(function(str,o){
				    if(_.isString(o)){
					return str.toLowerCase() == o.toLowerCase();
				    }
				    return false;}),
	    search_SubStr:_.search(function(str,o){
				       if(_.isString(o)){
					   return (o.toLowerCase().indexOf(str.toLowerCase()) != -1);
				       }
				       return false;}),
	    /*
	     * _.filterSearch([{a:{b:1}},{a:{b:2}}],1) -> [{a:{b:1}}]
	     */
	    filterSearch_Eq:function(list,searchObj){
		return _.filter(list,function(item){return _.search_Eq(searchObj,item);});
	    },
	    filterSearch_Str:function(list,searchStr){
		//_.filterSearchStr([{a:{b:'i'}},{a:{b:'r'}}],'I') -> [{a:{b:'i'}}]
		//todo, string stuff before running filter to make it run faster
		return _.filter(list,function(item){return _.search_Str(searchStr,item);});
	    },
	    filterSearch_SubStr:function(list,searchStr){
		//_.filterSearchStr([{a:{b:'ik'}},{a:{b:'r'}}],'I') -> [{a:{b:'ik'}}]
		//todo, string stuff before running filter to make it run faster
		return _.filter(list,function(item){return _.search_SubStr(searchStr,item);});
	    }
	});