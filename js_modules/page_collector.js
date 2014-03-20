var path = require('path')
	, util = require('util')
	, pages = null
	, fsTools = require('./fs_tools')
	, cacheManager = require('./cache_manager')
	, errorHandler = require('./error_handler');

//
// This method generates home page element
//
exports.getHomePage = function(){
	var page = new Object();

	page.common_data = new Object();
	page.common_data.title = 'Home';
	page.common_data.id = '/';
	
	page.presentation_data = new Object();
	page.presentation_data.link = '/';
	page.presentation_data.glyphicon = cacheManager.getSiteSettings().home_glyphicon;
	page.presentation_data.page_view = cacheManager.getSiteSettings().home_view;
	page.presentation_data.disabled = false;
	
	return page;
};

exports.collectEntriesDataSync = function(entries_path){
	var files = fsTools.readdirSync(entries_path);
	var collected_entries = new Array();

	// Collect informaion about pages from the appropriate folder
	for(var idx in files){
		var entry_id = files[idx];
		// Read page settings
		var data = fsTools.readFileSync(entries_path + '/' + entry_id + '/' + cacheManager.getSiteSettings().entry_data);
		if(data){
			var entry_data;
			try {
				entry_data = JSON.parse(data);
			} catch (err) {
				errorHandler.error("Data for page '" + entry_id + "' cannot be parsed!");
				return null;
			}
			if(entry_data){
				collected_entries[idx] = entry_data;
			}

			// Point 'link' field to entry_id in case setting has no cutom page link
			// 'link' value should start with '/' for better matching with routes
			if(!collected_entries[idx].presentation_data.link){
				collected_entries[idx].presentation_data.link = '/' + entry_id;
			}

			// Fill 'id' field
			collected_entries[idx].common_data.id = entry_id;
		} else {
			errorHandler.error("Data for page '" + entry_id + "' cannot be loaded!");
			return null;
		}
	}

	return collected_entries;

};

exports.collectPages = function(pages_dir){
	pages = this.collectEntriesDataSync(pages_dir);

	// Add home page to the begginig of the page array before writing
	pages.unshift(this.getHomePage());

	return pages;
};