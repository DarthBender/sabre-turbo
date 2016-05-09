
/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , PageCollector = require('./js_modules/page_collector')
  , DataProvider = require('./js_modules/data_provider')
  , PageRenderer = require('./js_modules/page_render');

var app = express();

// all environments
app.enable('trust proxy');
app.set('port', process.env.PORT || 8275);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('env', 'development');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.send(PageRenderer.getIndexPage())
});

try {
  PageCollector.collectPages();
} catch (err) {
  console.log("ERROR: Problem loading pages. " + err);
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var pages = DataProvider.getPagesWithReload(true);

for(n in pages){
  if(!pages[n].presentation_data.link){
    pages[n].presentation_data.link = '/';
  }

  var entryPath = __dirname + '/pages';
	app.get(pages[n].presentation_data.link, function(req, res){
    res.send(PageRenderer.getPage(__dirname + '/pages', req.route.path));
  });
}

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
