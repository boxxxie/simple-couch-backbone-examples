function topLevelEntity(reportData){
    if(ReportData.company && ReportData.company._id){return {id:ReportData.company._id,type:"company"};}
    else if(ReportData.group && ReportData.group.group_id){return {id:ReportData.group.group_id,type:"group"};}
    else if(ReportData.store && ReportData.store.store_id){return {id:ReportData.store.store_id,type:"store"};}
    else {return {id:undefined,type:undefined};}
};
function getParentsInfo(reportData){
    //makes an object that looks like {company:,group:}
    var company = {
	id:_.either(reportData.company._id,reportData.company_id), 
	label:_.either(reportData.company.companyName,reportData.companyName), 
	type:"company"
    };
    
    if(reportData.group || reportData.group_id){
	var group = {
	    id:_.either(reportData.group_id, reportData.group.group_id), 
	    label:_.either(reportData.group.groupName, reportData.groupName),
	    type:"group"
	};
    }

    if(reportData.store){
	var store = {
	    id:reportData.store.store_id, 
	    label:reportData.store.number+":"+reportData.store.storeName,
	    number:reportData.store.storeName,
	    type:"store"
	};
    }

    return _.filter$({company:company,group:group,store:store},_.isNotEmpty);
};