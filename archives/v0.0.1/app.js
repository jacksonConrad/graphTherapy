// Uses functions in articleprovider-mongodb.js
var express = require('express');
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;
var tools = require('./tools');
var cronJob = require('cron').CronJob;
//var data = require('./public/javascript/data.js');

//var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

// module.exports is the object that's returned as the result of the 'require' call
var app = module.exports = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/*  

SEPERATE CONFIGS FOR DEV & PROD ENVIRONMENTS

*/

// Dev Env - for debugging
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Prod Env
app.configure('production', function(){
  app.use(express.errorHandler());
});

// Create instance of ArticleProvider, passing it a host and port #
// ArticleProvider lets us easily interact with the DB
var articleProvider = new ArticleProvider('localhost', 27017);


/* 


ROUTES 


*/

// Home
app.get('/', function(req, res){
  //When we recieve GET request for URI: '/', find all documents and send them as the response
  articleProvider.findAll(function(error, docs){
      // res.render() is the callback for findAll
      //res.writeHead(200, {'Content-Type': 'text/html'});

      res.render('index.jade', {  
        title: 'Group Therapy Episodes',
        articles: docs
        
      });
      res.end();
/*
      articleProvider.save(1,
        function(error, article) {
       //console.log('inside save callback')
        } 
      );
  */
      //console.log(req.body.newEpisode);

  })
});

// Update database
app.post('/', function(req, res) {
  /*

  TEMPORARY method of adding new episodes to the database.
  Enventually, this will be done in the background on an interval

  */

  // Construct URL based on input
  var episodeNumber = req.body.newEpisode;
  console.log("newEpisode= "+episodeNumber);

  // Call scraping function
  tools.scrape(episodeNumber, function(article) {
      console.log("Scraped!");
      console.log(article);
      articleProvider.save(article, function() {
        console.log('Article Saved!!!!!');
        console.log('Redirecting...');
        res.redirect('/');
      });
  });
});


// Show single episode
app.get('/episode/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('episode_show.jade',
        {
          title: article.title,
          article:article
        }
        );
    });
});



app.get('/test', function(req, res) {

  artists = [];
  articleProvider.getTopNArtists(5, function(error, results) {
    for (var i = results.length - 1; i >= 0; i--) {
      artists[i] = results[i]._id; 
    };

    // render 
    res.render('abgtproject2.jade', {

      title: 'abgtProject',
      artists: artists
    });

    res.end();
  });


  
});

app.get('/api/getTopFive', function(req, res) {
  //console.log('api');
  articleProvider.getTopNArtists(5, function(error, results) {
    console.log('GOT!');
    res.json(results);
    
  });
  
});


/* Submit comment and redirect to 

app.post('/blog/addComment', function(req, res) {
    articleProvider.addSongToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});
*/

/* 

CRON JOB 

*/

var counter = (function() {
   var id = 1; // This is the private persistent value
   // The outer function returns a nested function that has access
   // to the persistent value.  It is this nested function we're storing
   // in the variable uniqueID above.
   return function() { return id++; };  // Return and increment
})(); // Invoke the outer function after defining it.

try {
      var job = new cronJob({
        // Runs every Friday at 5:30PM EST
        cronTime: '*/5 * * * * *',
        onTick: function() {
          //console.log('howdy');
          //console.log( counter() );



          //Scrape new episode
          /*
          var count = counter();
          tools.scrape( count, function(article) {
            console.log("Scraped!");
            console.log(article);
            articleProvider.save(article, function() {
              console.log('Article Saved!!!!!');
            });
          });
          */

          
          


        },
        start: false
      });
      job.start();
    } catch(ex) {
        console.log("cron pattern not valid");
    }







/*********************************************/

// Listen on port 3000!!!
app.listen(3000);
console.log("Express server listening on port %d in %s mode", 3000, app.get('env') );