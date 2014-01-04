// Uses functions in articleprovider-mongodb.js
var express  = require('express'),
port         = process.env.PORT || 3000,
io           = require('socket.io'),
mongoose     = require('mongoose'),
http         = require('http'),
twitter      = require('ntwitter');

var configDB = require('./config/database.js');

var app      = express();

// Create the HTTP server with the express app as an argument
// to pass to io object
var server   = http.createServer(app);

// Configuration

mongoose.connect(configDB.url); // connect to our database

// set up our express application
app.use(express.logger('dev')); // log every request to the console
app.use(express.bodyParser()); // get information from html forms

// Serve static files
 
app.set('port', port);
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/partials", express.static(__dirname + "/public/partials"));
app.use("/lib", express.static(__dirname + "/public/lib"));
app.use("/images", express.static(__dirname + "/public/images"));

/* 
  ROUTES 
*/

// load the socket API and pass in our server & io object
require('./api/twitterAPI.js')(twitter, io, server);

// load the stat API
require('./api/statAPI.js')(app);

// redirect all others to the index (HTML5 history)
// essentially links up all the angularjs partials with their respective paths
app.all("/*", function(req, res, next) {
  //console.log('loading page');
  res.sendfile("index.html", { root: __dirname + "/public" });
});

// LAUNCH *********************************************/


//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') );
});