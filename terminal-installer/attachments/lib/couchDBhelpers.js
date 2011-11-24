function db(name){return $.couch.db(name);};

function view(designDoc,name){return designDoc + "/" + name;};
function appView(name){return view('app',name);};
function appShow(name){return view('app',name);};

function query(options, view, database){
    return function(callback){
	var mergedOptions = _.extend({success: callback},options);
	database.view(view, mergedOptions);
    };
};

function basicQuery(view,database){
    return query({},view,database);
};

function keyQuery(key, view, database) {
	return query({key:key}, view, database);
};

function groupQuery(view,database,group_level){
    return query({group_level:group_level},view,database);
};

function peekingQuery(view,database,startKey){
    //peeks at the values of a view when grouped in an array
    //startkey should be an array
    //endkey will be like ['something',{}];
    var endkey = startKey.concat({});
    return query({group_level:endkey.length,
		 startkey:startKey,
		 endkey:endkey},view,database);
};

function extractKeys(data){
    return _(data.rows)
	.chain()
	.pluck('key')
	.value();
};

function extractKeysArr(data){
    return _(data.rows).chain()
	.pluck('key')
	.flatten()
	.value();
};
