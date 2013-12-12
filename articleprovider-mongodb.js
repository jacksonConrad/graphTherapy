var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var lineReader = require('line-reader');

ArticleProvider = function(host, port) {
  this.db= new Db('graphTherapy', new Server(host, port, {auto_reconnect: true}, {}), {safe: false});
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

ArticleProvider.prototype.getTopNArtists = function(N, callback) {
  
  // Create a collection
  this.getCollection(function(err, collection) {

      // Execute aggregate, notice the pipeline is expressed as an Array
      collection.aggregate([
          { $project: {
            //  For each document in the collection, throw-out the episode number, keep the array of songs
            songs: 1
             }
          },
          {
            //Peels off the elements of the array individually, and returns a stream of documents. 
            //$unwind returns one document for every member of the unwound array within every 
            //source document.
            $unwind: "$songs"
          },
          {
            //Groups documents based on artist name. Tally the play count for each duplicate artist
            $group: {
              _id: "$songs.artist",
              totalPlays: {$sum: 1}
            }
          },
            //Sort the documents based on total plays in descending order
          { $sort: { totalPlays: -1}
          },
            //Limit the documents to the first N
          { $limit: N }
        ], function(err, result) {
          console.dir(result);
          callback(null, result);
      });
  });
};




// Adds an article to the database.
ArticleProvider.prototype.save = function(article, callback) {

  // Check if this article has already been created before you go making a new one.

  /*
  this.findById(articleNumber, function(error, result) {
    if(result != null) {
      console.log('ERROR: Article ' + articleNumber + ' has already been created.');
      callback(result);
    }
  });
  */

  // Instantiate empty objects to fill later
  this.getCollection(function(error, article_collection) {

    console.log('collection got');
    article_collection.insert(article, function( error ) {
      console.log("article inserted");
      if( error ) callback( error );
      else {
        console.log('callback for newArticle function');
        callback();
      }
    });
  });
};


ArticleProvider.prototype.addSongToArticle = function(articleId, Song, callback) {
  this.getCollection(function(error, article_collection) {
    if( error ) callback( error );
    else {
      article_collection.update(
        {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
        {"$push": {songs: Song}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article);
        });
    }
  });
};

exports.ArticleProvider = ArticleProvider;
/*
ArticleProvider.prototype.save = function(articleNumber, callback) {
 // Create new Article and save it to the DB
 // var article = {title: '1', songs:[{artist:'Mat Zo', song:'Bipolar'}, 
 //                                 {artist:'Artificial', song:'Prototype'}]};
 var collection = null;

 this.getCollection(function(error, article_collection) {
    collection = article_collection;
    console.log('collection got');
  });


  // Instantiate empty objects to fill later
  var article = {title: null, songs:[]};
  article.title = 'Episode ' + articleNumber;
  var songs = [];
  var song = {artist: null, song: null};


  // Variables to keep track of parameter, and array index
  var i = 0;
  var j = 0;


  // Read file line-by-line and push songs onto the article
  lineReader.eachLine('./public/episodes/test' + articleNumber + '.txt', function(line) {
    // console.log(line);
    

    
    if(line.length == 0) {

      //Push the song onto the songs array
      console.log(song.artist + ' ' + song.song);
      article.songs[j] = song;
      song = {artist: null, song: null};
      
      // Increment line number
      i++;
      // Increment song number
      j++;

    }
    */

    // This logic assumes that the textfile has been formatted as such:
    /*
      * artist name
      * song name 
      * [blank line]
      * artistname
      * song name
      * [blank line]
      * .
      * .
      * .
      * artist name
      * song name
      * [blank line]    <--blank line at the end is important
    */
/*
    else {
      if( i % 3 == 0)
        song.artist = line;
      else if( i % 3 == 1)
        song.song = line;
      else
        console.log('********\n\n\n\n\nTextfile formatted improperly!!!!\n\n\n\n\n**********');

    // increment line number
    i++;      
    }
  }).then( function () {
    // Insert article into the DB
    
    // console.log(article.songs);

    collection.insert(article, function( error ) {
      console.log("article inserted");
      if( error ) callback( error );
      else {
        console.log('callback for save function');
        callback(null);
      }
    });
  });  
};
*/





