var Hogan = require('hogan.js')
	, fs = require('fs')
	, Tools = require('./tools').Tools
	, DataProvider = require('./data_provider')
	, util = require('util')
	, views_path = __dirname + '/../views/';

exports.getPage = function(page_link){
	var pageLayoutData = new Object();
	var siteSettings = DataProvider.getSiteSettings();

	// Read menu template
	var menuViewPath = views_path + siteSettings.menu_view;
	pageLayoutData.menu = Hogan.compile(
			fs.readFileSync(menuViewPath, siteSettings.encoding));

	// Read page template
	var pageData = DataProvider.getFullPageInfoByLink(page_link);
	var pageViewPath = views_path + pageData.presentation_data.page_view; 
	pageLayoutData.pageContent = Hogan.compile(
			fs.readFileSync(pageViewPath, siteSettings.encoding));
	
	// Get data for menu rendering
	var menuData = new Object();
	menuData.menu_items = DataProvider.getMenuItemsData();

	for(n in menuData.menu_items) {
		if(menuData.menu_items[n] != null) {
			menuData.menu_items[n].selected = menuData.menu_items[n].link == page_link;
		}
	}

	// Get data for page content
	var pageContentData = 
		Tools.mergeObjects(
			menuData, 
			pageData.common_data);

	Tools.mergeObjects(
		pageContentData, 
		pageData.user_data);

	// Merge everyhting together and render page
	return Hogan.compile(
		fs.readFileSync(
				views_path + siteSettings.index_view, 
				siteSettings.encoding)).render(pageContentData, pageLayoutData);
};

exports.getIndexPage = function() {
	return this.getPage('/');
}
