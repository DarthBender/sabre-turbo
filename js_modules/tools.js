Tools = function(){	
};

Tools.mergeObjects = function(obj1, obj2){
	var res = obj1;
	
	for(var field in obj2){
		res[field] = obj2[field];
	}
	return res;
};

Tools.mergeObjectsExcludePresentationFields = function(target, source){
	var res = target;
	
	for(var field in source){
		if(field != 'glyphicon' 
				&& field != 'disabled'
				&& field != 'link'
				&& field != 'page_view'){
			res[field] = source[field];
		}
	}
	return res;
};

Tools.cloneObject = function(obj1){
	var res = new Object();

	for(var field in obj1){
		res[field] = obj1[field];
	}
	return res;	
}

exports.Tools = Tools;