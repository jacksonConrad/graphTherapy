// Set up the server
var express = require('express'),
app         = express(),
port        = process.env.PORT || 3000,
// Create the HTTP server with the express app as an argument
// to pass to io object
server      = require('http').createServer(app);

// Require dependencies
var mongoose= require('mongoose'),
request     = require('request'),
cronJob     = require('cron').CronJob,
twitter     = require('ntwitter');

var configDB = require('./config/database.js');

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

// LAUNCH *********************************************/
io = require("socket.io").listen(server, {log: false});

/* 
  ROUTES 
*/

// load the socket API and pass in our server & io object
require('./api/twitterAPI.js')(twitter, io);

// load the stat API
require('./api/statAPI.js')(app, io);

// redirect all others to the index (HTML5 history)
// essentially links up all the angularjs partials with their respective paths
app.all("/*", function(req, res, next) {
  //console.log('loading page');
  res.sendfile("index.html", { root: __dirname + "/public" });
});


// Cronjob hack to keep heroku from shutting down our app
  var job = new cronJob({
    // Runs every hour 
    cronTime: '00 */59 * * * *',
    onTick: function() {
    var date = new Date();
    // Make a request to our heroku app page
    request('http://graph-therapy.herokuapp.com', function(err, response, body) {
      if (!err && response.statusCode == 200) {
        console.log('reset herokuapp: ' + date.getHours() + ' ' + date.getMinutes() + ' ' + date.getSeconds() ); // log on success
        console.log(response.statusCode);
      }
      else {
        console.log('CRON ERROR!');
        console.log(err);
        console.log(response.statusCode);
      }
    });
    },
    start: false
  });
  job.start();





// LAUNCH *********************************************/


//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') );
});