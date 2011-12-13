_.mixin({
	    /* Retrieve the keys and values of an object's properties.
	     {a:'a',b:'b'} -> [[a,'a'],[b,'b']]
	    */
	    kv:function (obj) {
		return _.zip(_.keys(obj),_.values(obj));}});

_.mixin({
	    /*converts an array of pairs into an objcet
	     * [[a,'a'],[b,'b']] ->  {a:'a',b:'b'}
	     */
	    toObject:function(pairs){
		return pairs.reduce(function(total,cur){
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
		return  _(obj).chain()
		    .kv()
		    .filter(function(kv){return _.contains(keys,_.first(kv));})
		    .toObject()
		    .value();
	    }});

_.mixin({
	    /*create an object without the keys in the selected keys array arg
	     * ({a:'a',b:'b'},['a']) -> {b:'b'}
	     */
	    removeKeys:function (obj,keys){
		return _(obj).chain()
		    .kv()
		    .reject(function(kv){return _.contains(keys,_.first(kv));})
		    .toObject()
		    .value();
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

_.mixin({merge:function (objArray){
	     //merges all of the objects in an array into one object
	     //probably can be done via apply.extend([...])
	     return _.reduce(objArray,function(sum,cur){return _.extend(sum,cur);},{});
	 }});

_.mixin({zipMerge:function (){
	     console.log('zipmerge')   ;
	     return _.map(_.zip.apply(null,arguments),
                          function(zipped){return _.merge(zipped);});
	 }});


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
		    return walk.pre_walk(obj,fn);
		}
		else{
		    return _(obj).chain()
			.kv()
			.map(function(pair){pair[1] = fn(pair[1]);return pair;})
			.toObject()
			.value();
		}
	    }});