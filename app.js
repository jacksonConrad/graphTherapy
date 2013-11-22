// Uses functions in articleprovider-memory.js
var express = require('express');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

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

/*  SEPERATE CONFIGS FOR DEV & PROD ENVIRONMENTS */

// Dev Env - for debugging
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Prod Env
app.configure('production', function(){
  app.use(express.errorHandler());
});

// Instantiate instance of ArticleProvider
var articleProvider = new ArticleProvider();

// Routes
app.get('/', function(req, res){
  //When we recieve GET request for URI: '/', find all documents and send them as the response
  articleProvider.findAll(function(error, docs){
      // res.render() is the callback for findAll
      res.render('index.jade', {  
        title: 'Blog',
        articles: docs
        
      });
  })
});

// Listen on port 3000!!!
app.listen(3000);