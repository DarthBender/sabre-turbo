
/*
 * GET home page.
 */
var PageRenderer = require('../js_modules/page_render');

exports.index = function(req, res){
	res.send(PageRenderer.getPage(req.route.path));
};