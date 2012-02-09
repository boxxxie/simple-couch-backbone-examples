var RetailerUserDoc = couchDoc.extend({db:"layered_login_users"});

var RetailerUserCollection = couchCollection(
            {db:'layered_login_users'},
            {model:RetailerUserDoc,
             findUser : function(userName) {
                 var list = this.toJSON();
                 return this.find(function(model){return (model.get("user")).toLowerCase() == userName.toLowerCase();});
             }
    });

function fetchRetailerUserCollection(id) {
    return function(callback){
            queryF(cdb.view("app","lowestlevel_id_doc"), cdb.db("layered_login_users"))
            ({key:id})
            (function(response){
                 var user_collection = new RetailerUserCollection();
                 _.reduce(response.rows, function(collection,item){
                     return collection.add(item.value, {silent:true});
                 },user_collection);
                 callback(null,user_collection);
             });
    };
};

function fetchRetailerUserCollection_All(id) {
    return function(callback){
            queryF(cdb.view("app","id_doc"), cdb.db("layered_login_users"))
            ({key:id})
            (function(response){
                 var user_collection = new RetailerUserCollection();
                 _.reduce(response.rows, function(collection,item){
                     return collection.add(item.value, {silent:true});
                 },user_collection);
                 callback(null,user_collection);
             });
    };
};
