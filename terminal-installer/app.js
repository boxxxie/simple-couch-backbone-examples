 var couchapp = require('couchapp'), 
path = require('path');

ddoc = { _id:'_design/app', 
	 rewrites :[ 
	     {from:"/api", to:'../../'},
	     {from:"/api/*", to:'../../*'},
	     {from:"/db", to:'../../_all_docs',query:{include_docs:"true"}},
	     {from:"/db/*", to:'../../*'},
	     {from:"/*", to:'*'}]};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;