var fs = require('fs')
    , ncp = require('ncp').ncp;

exports.rmdirSync = function(path) {
    return fs.rmdirSync(path);
}

exports.mkdirSync = function(path) {
    return fs.mkdirSync(path);
}

exports.existsSync = function(path) {
    return fs.existsSync(path);
}

exports.unlinkSync = function(path) {
    return fs.unlinkSync(curPath);
}

exports.readdirSync = function(path) {
    return fs.readdirSync(path);
}

exports.lstatSync = function(path) {
    return fs.lstatSync(path);
}

exports.writeFile = function(path, data, callback) {
    return fs.writeFile(path, data, callback);
}

deleteFolderRecursive = function(path) {
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

exports.rmdir_rSync = function(path){
    deleteFolderRecursive(path);
}

exports.rmkdirSync = function(path){
    if(fs.existsSync(path)){
        this.rmdir_rSync(path);
    }

    return fs.mkdirSync(path);
}

exports.copyInitSiteData = function(path){

    ncp(__dirname + '/../public', path, function (err) {
        if (err) {
            return console.error(err);
        }
    });
}