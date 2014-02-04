Tools = function(){	
};

Tools.mergeObjects = function(obj1, obj2){
	var res = obj1;
	
	for(var field in obj2){
		res[field] = obj2[field];
	}
	return res;
};

exports.Tools = Tools;