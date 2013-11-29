var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var lineReader = require('line-reader');

ArticleProvider = function(host, port) {
  this.db= new Db('graphTherapy', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


ArticleProvider.prototype.getCollection= function(callback) {
  this.db.collection('articles', function(error, article_collection) {
    if( error ) callback(error);
    else callback(null, article_collection);
  });
};

ArticleProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


ArticleProvider.prototype.save = function(articleNumber, callback) {
      // Create new Article and save it to the DB
  var article = null;
  var songs = [];

  // Insert empty article into the DB
  this.getCollection(function(error, article_collection) {
    if( error ) callback(error)
    else {
      article_collection.insert(article, function() {
        callback(null, article);
      });
    }
  });

  // Read file line-by-line and push songs onto the article
  lineReader.eachLine('./public/episodes/test' + articleNumber + '.txt', function(line) {
    console.log(line);
    var i = 0;
    if(line == null) {
      this.addSongToArticle(article._id, artist, song_title, 
        function(error, article) {
          if( error ) callback(error)
          else callback(article)
        });
      i=0;
    }

    /* TRACK NUMBER OF SONGS THAT HAVE BEEN ADDED FOR SONGS[] ARRAY */

    else {
      if(i == 0)
        song.artist = line;
      else if(i == 1)
        song.song = line;
      else
        console.log('Textfile formatted improperly');

      i++;
    }
  }).then(function () {
    console.log("I'm done!!");
  });


  
};

ArticleProvider.prototype.addSongToArticle = function(articleId, artist, song_title, callback) {
  this.getCollection(function(error, article_collection) {
    if( error ) callback( error );
    else {
      article_collection.update(
        {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
        {"$push": {songs: song}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article)
        });
    }
  });
};

ArticleProvider.prototype.populateDB = function(articleNumber) {
  // Create new Article and save it to the DB
  var article = null;



// Read file line-by-line
  lineReader.eachLine('./public/episodes/test' + articleNumber + '.txt', function(line) {
    console.log(line);
  


    }).then(function () {
      console.log("I'm done!!");
    });

  
}

exports.ArticleProvider = ArticleProvider;