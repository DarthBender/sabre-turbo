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
	var menu_view_path = views_path + siteSettings.menu_view;
	pageLayoutData.menu = Hogan.compile(
			fs.readFileSync(menu_view_path, siteSettings.encoding));

	// Read page template
	var page_data = DataProvider.getFullPageInfoByLink(page_link);
	var page_view_path = views_path + page_data.page_view; 
	pageLayoutData.pageContent = Hogan.compile(
			fs.readFileSync(page_view_path, siteSettings.encoding));
	
	// Get data for menu rendering
	var menu_data = new Object();
	menu_data.pages = DataProvider.getMenuData();

	for(n in menu_data.pages) {
		if(menu_data.pages[n] != null) {
			menu_data.pages[n].selected = menu_data.pages[n].link == page_link;
		}
	}

	// Get data for page content
	var pageContentData = 
		Tools.mergeObjectsExcludePresentationFields(
			menu_data, 
			page_data);

	// Merge everyhting together and render page
	return Hogan.compile(
		fs.readFileSync(
				views_path + siteSettings.index_view, 
				siteSettings.encoding)).render(pageContentData, pageLayoutData);
};

exports.getIndexPage = function() {
	return this.getPage('/');
}
