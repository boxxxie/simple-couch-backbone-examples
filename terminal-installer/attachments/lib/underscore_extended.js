_.mixin({
	    //depricated! can use .map(function(value,key){return [key,value];});
	    /* Retrieve the keys and values of an object's properties.
	     {a:'a',b:'b'} -> [[a,'a'],[b,'b']]
	    */
	    pairs:function (obj) {
		return _.map(obj,function(val,key){
				 return [key,val];
			     });}});

_.mixin({
	    /*converts an array of pairs into an objcet
	     * [[a,'a'],[b,'b']] ->  {a:'a',b:'b'}
	     */
	    toObject:function(pairs){
		return _(pairs).reduce(function(total,cur){
					var key = _.first(cur),
					val = _.last(cur);
					total[key] = val;
					return total;
				    },{});}});

_.mixin({
	    /*create an object with only the keys in the selected keys array arg
	     * ({a:'a',b:'b'},['a']) -> {a:'a'}
	     */
	    selectKeys:function (obj,keys){
		return  _(obj).filter$(function(val,key){return _.contains(keys,key);});
	    },
	    selectKeys_F:function (keys){
		return function(obj){
		    return  _.selectKeys(obj,keys);
		};
	    },
	    selectKeysIf:function (obj,keys,filterFn){
		return  _(obj).filter$(
		    function(val,key){
			return _.contains(keys,key) && filterFn(val);
		    });
	    }
	});

	
_.mixin({
	    /*create an object without the keys in the selected keys array arg
	     * ({a:'a',b:'b'},['a']) -> {b:'b'}
	     */
	    removeKeys:function (obj,keys){
		return _.filter$(obj,function(val,key){return !_.contains(keys,key);});
	    }});

// unEscape a string for HTML interpolation.
_.mixin({
	    //this function is in underscore.string
	    unEscape : function(string) {
		return (''+string)
		    .replace(/&lt;/g,    '<')
		    .replace(/&gt;/g,    '>')
		    .replace(/&quot;/g,  '"')
		    .replace(/&#x27;/g,  "'")
		    .replace(/&#x2F;/g,  '\/')
		    .replace(/&amp;/g,   '&');
	    }});

_.mixin({isNotEmpty:function (obj){
	     return !_.isEmpty(obj);
	 }});

_.mixin({isLastEmpty:function (array){
	     return _.isEmpty(_.last(array));
	 }});

_.mixin({isFirstEmpty:function (array){
	     return _.isEmpty(_.first(array));
	 }});

_.mixin({isFirstNotEmpty:function (array){
	     return !_.isEmpty(_.first(array));
	 }});

_.mixin({isLastNotEmpty:function (array){
	     return !_.isEmpty(_.last(array));
	 }});

_.mixin({second:function (array){
	     return _.first(_.rest(array));
	 }});

_.mixin({renameKeys:function (toEdit,fieldMap){
	     //usage _.renameKeys({a:'b',c:'d'},{a:'ba'})  -> {ba:'b',c:'d'}
	     function applyToValue(fn){return function(pair){return fn(_.second(pair));};};
	     function reMapValue(ojbToRemap){
		 return function(remapPair){
		     var valueToRemap = ojbToRemap[_.first(remapPair)];
		     if(_.isUndefined(valueToRemap)){return {};}
		     var reMapKey = _.second(remapPair);
		     var remapped = {}; 
		     remapped[reMapKey] = valueToRemap;
		     return remapped;
		 };
	     };
	     var remap = _(fieldMap).
		 chain().
		 kv().
		 filter(applyToValue(_.isString)).
		 reject(applyToValue(_.isEmpty)).
		 map(reMapValue(toEdit)).
		 reduce(function(sum,cur){sum = _.extend(sum,cur);return sum;},{}).
		 value();
	     return  _(toEdit)
		 .chain()
		 .removeKeys(_.keys(fieldMap))
		 .extend(remap)
		 .value();
	 }});

_.mixin({renameKeys_F:function (fieldMap){
	     return function(toEdit){
		 return _.renameKeys(toEdit,fieldMap);
	     };}});

_.mixin({mapRenameKeys:function (list,fieldMap){
	     return _.map(list,_.renameKeys_F(fieldMap));    
	 }});

_.mixin({merge:function (objArray){
	     //merges all of the objects in an array into one object
	     //probably can be done via apply.extend([...])
	     return _.reduce(objArray,function(sum,cur){return _.extend({},sum,cur);},{});
	 },
	 mapMerge:function(lists){
	     return _.map(lists,_.merge);
	 },
	 zipMerge:function (){
	     return _.map(_.zip.apply(null,arguments),
                          function(zipped){return _.merge(zipped);});
	 }});

_.mixin({extend_r:function (obj1,obj2){
	     //recursive extend
	     function mergeRecursive(obj1, obj2) {
		 for (var p in obj2) {
		     if (_.isObject(obj2[p])) {
			 obj1[p] = mergeRecursive(obj1[p], obj2[p]);
		     } else {
			 obj1[p] = obj2[p];
		     }
		 }
		 return obj1;
	     }
	     return mergeRecursive(obj1, obj2);
	 }
	});



//TODO: add walk to lib, or make an underscore_walk lib
_.mixin({
	    /*applies a function over the values of an object*/
	    applyToValues:function(obj,fn,recursive){
		function identity(o){
		    return o;
		};

		//the transformer needs to take in 1 args
		//it needs to return the transformed obj. noop = return first arg;
		//refer to tests
		function walk(o,pretran,posttran){
		    //transforms data in a js object via a walk function
		    o = pretran(o);
		    var ret = o;
		    if(typeof o == 'object'){
			for(var prop in o){
			    if(o.hasOwnProperty(prop)){
				var val = o[prop];
				var transformedVal = posttran(walk(val,pretran,posttran));
				var walked = {};
				walked[prop] = transformedVal;
				_.extend(ret,walked);
			    }
			} 
		    }  
		    return ret;
		};

		var pre_walk = function(o,trans){
		    return walk(o,trans,identity);
		};

		if(recursive){
		    return pre_walk(obj,fn);
		}
		else{
		    return _.map$(obj,function(val,key){return [key,fn(val)];});
		}
	    }});

_.mixin({
	    partition:function(arr,size){
		function partition_helper(arr,size){
		    if(_.size(arr) <= size){return [arr];}
		    return [_.first(arr,size)].concat(partition_helper(_.rest(arr,size),size));
		}
		return partition_helper(arr,size);
	    }});

_.mixin({
	    peek:function(arr,index){
		return arr[index];
	    }});

_.mixin({
	    groupBy_F:function(iterator){
		return function(list){
		    return _.groupBy(list,iterator);
		};
	    }});
_.mixin({
	    //fn({a:1,b:2,c:3},['a','b'],'field') -> {field:{a:1,b:2},c:3}
	    nest:function(obj,selectedKeysList,newFieldName){
		var o = {};
		o[newFieldName] = _.selectKeys(obj,selectedKeysList);
		return _.extend(_.removeKeys(obj,selectedKeysList),o);
	    },
	    nest_F:function(selectedKeysList,newFieldName){
		return function(obj){
		    return _.nest(obj,selectedKeysList,newFieldName);
		};
	    },
	    mapNest:function (list,selectedKeysList,newFieldName){
		return _.map(list,_.nest_F(selectedKeysList,newFieldName));    
	    }
	});

_.mixin({
	    //fn({a:1},{a:1}) -> {a:2}
	    //make recursive
	    //fn({a:{b:1},c:1},{a:{b:1},c:1}) -> {a:{b:2},c:2}
	    addPropertiesTogether:function(addTo,addFrom){
		function addPropertiesTogether_helper(addTo,addFrom){
		    var addToClone = _.clone(addTo);
		    for (var prop in addFrom) {
			if(!_.isUndefined(addToClone[prop])){
			    if(_.isNumber(addFrom[prop])){
				addToClone[prop] += addFrom[prop];
				continue;
			    }
			    else if(_.isObject(addFrom[prop])){
				addToClone[prop] = addPropertiesTogether_helper(addToClone[prop],addFrom[prop]);
				continue;
			    }
			}
			addToClone[prop] = addFrom[prop];
		    }
		    return addToClone;
		}
		return addPropertiesTogether_helper(addTo,addFrom);
	    }});

_.mixin({
	    isObject:function(obj){
		return typeof(obj) === 'object' && !_.isArray(obj);
	    }});

_.mixin({
	    log:function(logText){
		return function(obj){
		    console.log(logText);
		    console.log(obj);
		    return obj;
		};
	    }
	});

_.mixin({
	    //_.filter$({a:1,b:2},function(val,key){return key == 'a'}) -> {a: 1}
	    //_.filter$([1,2],function(val){return val == 1}) -> [1]
	    filter$:function(obj,iterator){
		if(_.isObject(obj)){
		    function iteratorWrapper(value, index, list){
			//in this case the value would look like ['a',1]
			//index would look like 0
			//we want the value to look like '1' and index to look like 'a'
			return iterator(_.second(value), _.first(value), list);
		    }
		    return _(obj)
			.chain()
			.pairs()
			.filter(iteratorWrapper)
			.toObject()
			.value();
		}
		else if(_.isArray(obj)){
		    return _.filter(obj,iterator);
		}
		else{
		    return obj;
		}
	    }
	});

_.mixin({
	    //_.map$({a:1,b:2},function(val,key){return [key,val] }) -> {a:1,b:2}
	    // _.map$([{a:1},{b:2}],function(val,key){return val }) -> [{a:1},{b:2}]
	    map$:function(obj,iterator){
		if(_.isObject(obj)){
		    return _(_.map(obj,iterator)).toObject();
		}
		else if(_.isArray(obj)){
		    return _.map(obj,iterator);
		}
		else{
		    return obj;
		}
	    }
	});


_.mixin({
	    /* 
	     * like _.any, but will recursively search the array/object 
	     * _.search(1)([[{a:{b:1}}]]) -> true
	     */
	    search:function(searchObj){
		return function(objToBeSearched){
		    if(_.isEqual(searchObj,objToBeSearched)){
			return true;
		    }else{
			return _.any(objToBeSearched,
				     function(val){
					 if(_.isEqual(searchObj,val)){
					     return true;
					 }
					 else if (_.isObject(val)||_.isArray(val)){
					     return _.search(searchObj)(val);
					 }
					 else{
					     return false;   
					 }
				     });
		    }
		};
	    },
	    /*
	     * _.filterSearch([{a:{b:1}},{a:{b:2}}],1) -> [{a:{b:1}}]
	     */
	    filterSearch:function(list,searchObj){
		return _.filter(list,_.search(searchObj));
	    }
});
