var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Connection = Mongoose.createConnection('localhost', 'graphTherapy');
var Tweet = require('./models/TweetModel.js')

TweetProvider = function(host, port) {
  console.log('TweetProvider created');
};


TweetProvider.prototype.getCollection= function(callback) {


};

TweetProvider.prototype.save = function(tweet, callback) {
  // tweet should be a JSON object

Tweet.create(tweet);
  // save the tweet
  /*
  t.save(function (err, result, numberAffected) {
    console.log('result: ' + result);
    console.log('number affected: ' + numberAffected);
    callback();
  });
  */
callback();
};

module.exports= TweetProvider;






