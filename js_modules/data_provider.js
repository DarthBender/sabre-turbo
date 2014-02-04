var fs = require('fs'),
	util = require('util'),
	siteData = require('../data/site.json');

exports.getCommonPageData = function () {
	var pageData = new Object();
	pageData.title = siteData.title;
	pageData.encoding  = siteData.encoding;
	pageData.menu_view = siteData.menu_view;
	pageData.index_view = siteData.index_view;
	return pageData;
};

exports.getPages = function() {
	return siteData.pages;
}

exports.getExternalLinks = function() {
	return siteData.external_links;
}

exports.getPageByLink = function(pageID){
	for(n in siteData.pages){
		if(siteData.pages[n].link == pageID){
			return siteData.pages[n];
		}
	}
	return null;
};
