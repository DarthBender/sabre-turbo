
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , DataProvider = require('./js_modules/data_provider');
   
var app = express();

// all environments
app.enable('trust proxy');
app.set('port', process.env.PORT || 8275);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}
var pages = DataProvider.getPages();
for(n in pages){
	if(!pages[n].external){
		app.get(pages[n].link, routes.index);
	}	
}

app.get('/655387a91dca.html', user.getCode);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
