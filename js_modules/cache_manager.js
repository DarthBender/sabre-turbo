var util = require('util')
	, pagesCache = null
	, menu_items = null
	, siteSettings = null
	, pagesCacheSuffix = '/cache/pages.json'
	, settingsSuffix = '/settings.json'
	, fsTools = require('./fs_tools')
	, errorHandler = require('./error_handler');

exports.getSiteSettings = function(){
	if(!siteSettings){
		siteSettings = JSON.parse(
			fsTools.readFileSync(process.cwd() + settingsSuffix));
	}

	return siteSettings;
}

exports.getPages = function(){
	if(!pagesCache){
		pagesCache = JSON.parse(
			fsTools.readFileSync(process.cwd() + pagesCacheSuffix));
	}


	return pagesCache;
}

exports.getMenuItemsData = function(){
	if(!menu_items){
		var full_page_data = this.getPages();

		if(!full_page_data){
			return null;
		}

		menu_items = new Array();

		for(idx in full_page_data){
			menu_items[idx] = new Object();
			menu_items[idx].title = full_page_data[idx].common_data.title;
			menu_items[idx].glyphicon = full_page_data[idx].presentation_data.glyphicon;
			menu_items[idx].disabled = full_page_data[idx].presentation_data.disabled;
			menu_items[idx].link = full_page_data[idx].presentation_data.link;
		}
	}
	return menu_items;
};

exports.getFullPageInfoByLink = function(pageLink){
	if(!pagesCache){
		this.getPages();
	}

	for(n in pagesCache){
		if(pagesCache[n].presentation_data.link == pageLink){
			return pagesCache[n];
		}
	}
	return null;
};

exports.cachePages = function(pages){
	pagesCache = pages;
	// Write collected pages cache
	fsTools.writeFileSync(process.cwd() + pagesCacheSuffix, JSON.stringify(pages));
}