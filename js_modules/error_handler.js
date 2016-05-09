var util = require('util');
var errorHandler = new Object();

errorHandler.exception = function(message, error) {
	console.log('ERROR: ' + message);
	console.log('ERROR exception data: ' + util.inspect(error));
};

errorHandler.error = function(message) {
	console.log('ERROR: ' + message);
};

errorHandler.info = function(message) {
	console.log('INFO: ' + message);
}

errorHandler.debug = function(message) {
	console.log('---!!!DEBUG!!!---\n\n' + message + '\n\n---!!!END_DEBUG!!!---\n\n');
}

errorHandler.debug_item = function(message, item) {
	console.log('---!!!DEBUG!!!---\n\n');
	console.log(message);
	console.log('Value: ' + util.inspect(item));
	console.log('\n\n---!!!END_DEBUG!!!---\n\n');

}

module.exports = errorHandler;