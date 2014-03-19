var Hogan = require('hogan.js')
	, fs = require('fs')
	, Tools = require('./tools')
	, cacheManager = require('./cache_manager')
	, util = require('util')
	, marked = require('marked').setOptions({highlight: function (code) {return require('highlight.js').highlightAuto(code).value;}})
	, views_path = __dirname + '/../views/';

exports.renderPage = function(pages_path, page_link){

	var pageLayoutData = new Object();
	var siteSettings = cacheManager.getSiteSettings();

	// Read menu template
	var menuViewPath = views_path + siteSettings.menu_view;
	pageLayoutData.menu = Hogan.compile(
			fs.readFileSync(menuViewPath, siteSettings.encoding));

	// Read page template
	var pageData = cacheManager.getFullPageInfoByLink(page_link);

	var pageViewPath;
	if(pageData.presentation_data.page_view){
		pageViewPath = pages_path + pageData.common_data.id + '/' + pageData.presentation_data.page_view;
		if(!fs.existsSync(pageViewPath)){
			pageViewPath = views_path + pageData.presentation_data.page_view;
			if(!fs.existsSync(pageViewPath)){
				pageViewPath = views_path + siteSettings.page_view;		
			}
		}
	} else {
		pageViewPath = views_path + siteSettings.page_view;
	}
	pageLayoutData.pageContent = Hogan.compile(
			fs.readFileSync(pageViewPath, siteSettings.encoding));
	
	// Get data for menu rendering
	var menuData = new Object();
	menuData.menu_items = cacheManager.getMenuItemsData();

	for(n in menuData.menu_items) {
		if(menuData.menu_items[n] != null) {
			menuData.menu_items[n].selected = menuData.menu_items[n].link == page_link;
		}
	}

	// Get data for page content
	// Collect data for the menu
	var pageContentData = 
		Tools.mergeObjects(
			menuData, 
			pageData.common_data);

	// Collect user data if such presented in case of cutom used in Mustache view 
	Tools.mergeObjects(
		pageContentData, 
		pageData.user_data);

	// Read the Markdown page content and conver it to html
	var contentMDFilePath = pages_path + '/' + pageData.common_data.id + '/' + siteSettings.page_content_md;
	if(fs.existsSync(contentMDFilePath)){
		pageContentData.page_body = marked(
			fs.readFileSync(
				contentMDFilePath, siteSettings.encoding));
	}

	// Merge everyhting together and render page
	return Hogan.compile(
		fs.readFileSync(
				views_path + siteSettings.index_view, 
				siteSettings.encoding)).render(pageContentData, pageLayoutData);
};

exports.getIndexPage = function() {
	return 
}
