var fs = require('fs')
	, path = require('path')
	, util = require('util')
	, pages_dir = __dirname + '/../pages'
	, pages_cache = __dirname + '/../data/pages.json'
	, DataProvider = require('./data_provider');

//
// This method generates home page element
//
exports.getHomePage = function(){
	var page = new Object();

	page.common_data = new Object();
	page.common_data.title = DataProvider.getSiteSettings().title;
	page.common_data.id = '/';
	
	page.presentation_data = new Object();
	page.presentation_data.link = '/';
	page.presentation_data.glyphicon = DataProvider.getSiteSettings().home_glyphicon;
	page.presentation_data.page_view = DataProvider.getSiteSettings().home_view;
	page.presentation_data.disabled = false;
	
	return page;
};

exports.collectPageDataSync = function() {
	var files = fs.readdirSync(pages_dir);
	var collected_pages = new Array();

	// Collect informaion about pages from the appropriate folder
	for(var idx in files){
		var page_id = files[idx];
		// Read page settings
		var data = fs.readFileSync(pages_dir + '/' + page_id + '/page_data.json');
		if(data){
			var page_data;
			try {
				page_data = JSON.parse(data);
			} catch (err) {
				util.log("ERROR; Data for page '" + page_id + "' cannot be parsed!");
				return false;
			}
			if(page_data){
				collected_pages[idx] = page_data;
			}

			// Point 'link' field to page_id in case setting has no cutom page link
			// 'link' value should start with '/' for better matching with routes
			if(!collected_pages[idx].presentation_data.link){
				collected_pages[idx].presentation_data.link = '/' + page_id;
			}

			// Fill 'id' field
			collected_pages[idx].common_data.id = page_id;
		} else {
			util.log("ERROR: Data for page '" + page_id + "' cannot be loaded!");
			return false;
		}
	}

	// Add home page to the begginig of the page array before writing
	collected_pages.unshift(this.getHomePage());

	// Write collected pages cache
	fs.writeFileSync(pages_cache, JSON.stringify(collected_pages));
	return true;
}

