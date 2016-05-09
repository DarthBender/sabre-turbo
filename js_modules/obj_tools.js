var objectTools = new Object();

objectTools.mergeObjects = function(obj1, obj2){
	var res = obj1;

	for(var field in obj2){
		res[field] = obj2[field];
	}
	return res;
};

objectTools.cloneObject = function(obj1){
	var res = new Object();

	for(var field in obj1){
		res[field] = obj1[field];
	}
	return res;
};

module.exports = objectTools;