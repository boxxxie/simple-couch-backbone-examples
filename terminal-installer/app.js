 var couchapp = require('couchapp'), 
path = require('path');

/*
 *
 * <PPaul> http://localhost:5984/campaigns/_all_docs?include_docs=true
<PPaul> the docs are below that node, though
<_sorensen_> can you make _all_docs a param?
<PPaul> http://localhost:5984/campaigns?_all_docs&include_docs=true
<_sorensen_> why dont you just rewrite localhost/campaigns/ to give you all models by default?
 * */

ddoc = { _id:'_design/app', 
	 rewrites :[ 
	     {from:"/api", to:'../../'},
	     {from:"/api/*", to:'../../*'},
	     {from:"/db", to:'../../_all_docs',query:{include_docs:"true"}},
	     {from:"/db/*", to:'../../*'},
	     {from:"/*", to:'*'}]};


//ddoc.views.lib = couchapp.loadFiles('./common');
couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;