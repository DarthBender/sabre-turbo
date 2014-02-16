var   fs = require('fs')
	, util = require('util')
	, pages = new Array()
	, menu_items = new Array()
	, pages_data_file = __dirname + '/../data/pages.json'
	, siteSettings = require('../settings.json');

exports.getSiteSettings = function(){
	return siteSettings;
}

exports.getPagesWithReload = function(reread) {
	if(reread == true || !pages){
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
	if(!menu_items){
		var full_page_data = getPages();
		for(idx in full_page_data){
			menu_items[idx].title = full_page_data[idx].title;
			menu_items[idx].glyphicon = full_page_data[idx].glyphicon;
			menu_items[idx].disabled = full_page_data[idx].disabled;
			menu_items[idx].link = full_page_data[idx].link;
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
		if(pages[n].link == pageLink){
			return pages[n];
		}
	}
	return null;
};