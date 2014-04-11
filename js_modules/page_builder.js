var	pageCollector = require('./page_collector')
	, pageRenderer = require('./page_render')
	, cacheManager = require('./cache_manager')
	, errorHandler = require('./error_handler')
	, fsTools = require('./fs_tools');

saintyCheck = function(clear) {
	var siteDir = process.cwd() + '/site';
	var pagesDir = process.cwd() + '/pages';
	var cacheDir = process.cwd() + '/cache';

	if(!fsTools.existsSync(siteDir)) {
		return false;
	}

	if(!fsTools.existsSync(pagesDir)) {
		return false;
	}

	if(clear) {
		fsTools.rmkdirSync(cacheDir);
	} else {
		if(!fsTools.existsSync(cacheDir)) {
			return false;
		}
	}

	return true;
};

exports.buildSite = function() {
	var root = process.cwd()
		, siteDir = root + '/site/'
		, pagesDir = root + '/pages/'
		, cacheDir = root + '/cache/'
		, viewsDir = root + '/views/';

	if(!saintyCheck(true)) {
		printUsage();
		process.exit(0);
	}

	var pages = null;
	try {
		// Collect all pages
		pages = pageCollector.collectPages(pagesDir, cacheDir + 'pages.json');
		// And cache them
		cacheManager.cachePages(pages);
	} catch (err) {
		errorHandler.error("Problem loading pages. " + err);
		process.exit(1);
	}

	// Now go through all the pages
	// and generate static output
	for(n in pages){

		var curPageDir = '';
		if(pages[n].presentation_data.external && pages[n].presentation_data.external) {
			curPageDir = siteDir + pages[n].common_data.id + '/';
			fsTools.rmkdirSync(curPageDir);
		} else if (pages[n].common_data.id == '/') {
			curPageDir = siteDir;
		} else {
			curPageDir = siteDir + pages[n].presentation_data.link + '/';
			fsTools.rmkdirSync(curPageDir);
		}

		var fileName =
		fsTools.writeFile(
			curPageDir + 'index.html',
			pageRenderer.renderPage(pagesDir, viewsDir, pages[n].common_data.id),
			function(err) {
				if(err){
					errorHandler.error(err);
				}
			});
	}
}
