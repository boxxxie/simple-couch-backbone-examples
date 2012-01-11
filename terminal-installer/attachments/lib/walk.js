function identity(o){
    return o;
};

function demo(node){
    console.log(node);
    return node;
}

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

var pre_walk_f = function(trans){
    return function(o){
	return walk(o,trans,identity);
    };
};

function pre_walk_demo(node){
    pre_walk(node,demo);
}

var post_walk = function(o,trans){
    return walk(o,identity,trans);
};

var post_walk_f = function(trans){
    return function (o){
	return walk(o,identity,trans);
    };
};
function post_walk_demo(node){
    post_walk(node,demo);
}
