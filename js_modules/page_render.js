var Hogan = require('hogan.js')
	, fs = require('fs')
	, Tools = require('./tools').Tools
	, DataProvider = require('./data_provider')
	, util = require('util')
	, viewPath = __dirname + '/../views/';

exports.getPage = function(pageLink){
	// Read common page data
	var pageLayoutData = DataProvider.getCommonPageData();
	
	// Read menu template
	var menu_view_path = viewPath + pageLayoutData.menu_view;
	pageLayoutData.menu = Hogan.compile(
			fs.readFileSync(menu_view_path, pageLayoutData.encoding));	

	// Get page description
	var page = DataProvider.getPageByLink(pageLink);

	// Read page template
	var page_view_path = viewPath + page.page_view;
	pageLayoutData.pageContent = Hogan.compile(
			fs.readFileSync(page_view_path, pageLayoutData.encoding));
	
	// Get data for menu rendering
	var menuData = new Object();
	menuData.pages = DataProvider.getPages();
	for(n in menuData.pages) {
		if(menuData.pages[n] != null) {
			menuData.pages[n].selected = menuData.pages[n].link == pageLink;
		}
	}
	menuData.externalLinks = DataProvider.getExternalLinks();
	
	// Get data for page content rendering
	var pageContentData = Tools.mergeObjects(menuData);
	
	// Merge everyhting together and render page
	return Hogan.compile(
		fs.readFileSync(
				viewPath + pageLayoutData.index_view, 
				pageLayoutData.encoding)).render(pageContentData, pageLayoutData);
};

exports.getPageContent = function(pageLink){
	return Hogan.compile(fs.readFileSync(DataProvider.getPageViewByID(pageLink), Resources.encoding));
};
