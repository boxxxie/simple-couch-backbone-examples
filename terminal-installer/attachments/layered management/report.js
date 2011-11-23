function getUrlVars() {
    var vars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    hash = hashes[0].split('=');
    if(hash[0]=="company") {
    	_.extend(vars, {company:hash[1]});
    }
    if(!_.isEmpty(hashes[1])) {
    	hash = hashes[1].split('=');
    	_.extend(vars, {group:hash[1]});
    }
    if(!_.isEmpty(hashes[2])) {
    	hash = hashes[2].split('=');
    	_.extend(vars, {store:hash[1]});
    }
    console.log(vars);
    return vars;
}