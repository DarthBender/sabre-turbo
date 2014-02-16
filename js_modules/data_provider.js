var   fs = require('fs')
	, util = require('util')
	, pages = new Array()
	, menu_items = new Array()
	, pages_data_file = __dirname + '/../data/pages.json'
	, siteSettings = require('../settings.json');

exports.getSiteSettings = function(){
	return siteSettings;
}

exports.getPagesWithReload = function(reload) {
	if(reload == true || !pages){
		var data = fs.readFileSync(pages_data_file);
		if(data){
			try{
				pages = JSON.parse(data);
			} catch (err) {
				util.log("ERROR: Pages data cache parse fail!");
			}
		}
	}
	return pages;
};

exports.getPages = function() {
	return this.getPagesWithReload(false);
};

exports.getMenuItemsData = function(){
	if(menu_items.length == 0){
		var full_page_data = this.getPages();
		
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

// TODO: Do we need such links at all?
//
//exports.getExternalLinks = function() {
//	return siteData.external_links;
//}

exports.getFullPageInfoByLink = function(pageLink){
	for(n in pages){
		if(pages[n].presentation_data.link == pageLink){
			return pages[n];
		}
	}
	return null;
};