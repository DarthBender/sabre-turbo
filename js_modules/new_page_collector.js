var path = require('path')
    , util = require('util')
    , page_folders = new Array()
    , fs = require('fs')
    , path = require('path')
    , res = require('./resources')
    , cacheManager = require('./cache_manager')
    , errorHandler = require('./error_handler');

var pageCollector = new Object();

pageCollector.readState = {
    "content":"content",
    "template":"template"
};

//
// This method generates home page element
//
pageCollector.getHomePage = function(){
    var page = new Object();

    page.common_data = new Object();
    page.common_data.title = 'Home';
    page.common_data.id = '/';

    page.presentation_data = new Object();
    page.presentation_data.link = '/';
    page.presentation_data.glyphicon =
                        cacheManager.getSiteSettings().home_glyphicon;
    page.presentation_data.page_view =
                        cacheManager.getSiteSettings().home_view;
    page.presentation_data.disabled = false;

    return page;
};

pageCollector.generateEmptyPageFolderById = function(page_id){
    var page = new Object();

    page.common_data = new Object();
    page.common_data.title = cacheManager.getSiteSettings().site_title;
    page.common_data.id = page_id;

    page.presentation_data = new Object();
    page.presentation_data.link = '/' + page_id;
    page.presentation_data.glyphicon =
                        cacheManager.getSiteSettings().home_glyphicon;
    page.presentation_data.page_view =
                        cacheManager.getSiteSettings().page_view;
    page.presentation_data.disabled = false;

    return page;
}

pageCollector.collectEntriesDataSync = function(entries_path){

    // The main plan
    // 1. Read all items from the directory
    // 2. Filter non relevant
    // 3. Go through relevan folders
    //     3.0 Create PageFolder with id similar to folder name
    //         3.1. Go thought all the items of the folder
    //             3.1.0. If current item is md file -> update existing or create new subsection
    //             3.1.1. If current item is hjs filr -> update existing or create new subsection
    //             3.1.2. If index.md is found rise a flag inside PageFolder
    //             3.1.3. If page_data.json found - read it inside PageFolder
    // 4.
    // 5. Create all PageFolders and fill subsections
    // 6.

    var files = fs.readdirSync(entries_path);
    var collected_pagefolders = new Array();

    try {
        // Collect informaion about page_folders from the appropriate folder
        for(var idx in files){

            var entry = files[idx];
            var entry_path = entries_path + entry;
            var stat = fs.statSync(entry_path);
            if(!stat.isDirectory()){
                continue;
            }

            if(entry.indexOf('.') == 0){
                continue;
            }

            collected_pagefolders[entry]
                    = pageCollector.collectPageDataAndSubsectionsSync(entry_path);
        }
    } catch (err) {
        errorHandler.exception("Problem while initial page colletion", err);
    }
};

pageCollector.collectPageDataAndSubsectionsSync = function(entry_path){

    var files = fs.readdirSync(entry_path);
    for(var idx in files){
        var currentPageFolder = new Object();
        var file = files[idx];
        var filePath  = entry_path + '/' + file;
        var stat = fs.statSync(filePath);

        if(!stat.isFile()){
            continue;
        }

        if(file == res.page_data){
            var fileData = fs.readFileSync(file_path);
            errorHandler.debug_item(res.page_data, fileData);
            currentPageFolder.meta = JSON.parse(fileData);
        } else {
            var fileData = fs.readFileSync(filePath);
            errorHandler.debug(fileData);
            var fileExt = path.extname(file);
            if(fileExt == res.content_ext){
                var section = path.basename(file, res.content_ext);
                if(currentPageFolder[section] == 'undefined'){
                    currentPageFolder[section] = new Object();
                }
                currentPageFolder[section].content = fileData;
            } else if (fileExt == res.template_ext){
                var section = path.basename(file, res.template_ext);
                if(currentPageFolder[section] == 'undefined'){
                    currentPageFolder[section] = new Object();
                }
                currentPageFolder[section].view_template = fileData;
            }
        }

        errorHandler.debug_item('current page_folder', currentPageFolder);
    }

    return currentPageFolder;
};

pageCollector.collectPages = function(pages_dir){
    pageCollector.page_folders = this.collectEntriesDataSync(pages_dir);

    // Add home page to the begginig of the page array before writing
    pageCollector.page_folders.unshift(this.getHomePage());

    return page_folders;
};

module.exports = pageCollector;