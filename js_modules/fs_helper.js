var fs = require('fs')
    , ncp = require('ncp').ncp
    , siteSeedDir = __dirname + '/../initial_seed';

var fsHelper = new Object(); 

fsHelper.deleteFolderRecursive = function(path) {
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

fsHelper.rmdirSync = function(path){
    fsHelper.deleteFolderRecursive(path);
}

fsHelper.rmkdirSync = function(path){
    fsHelper.deleteFolderRecursive(path);
    return fs.mkdirSync(path);
}

fsHelper.copyInitialSeedSiteData = function(path){

    ncp(siteSeedDir, path, function (err) {
        if (err) {
            return console.error(err);
        }
    });
}

module.exports = fsHelper;
