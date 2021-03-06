// twitterAPI.js
var _ = require('underscore'),
mongoose = require('mongoose'),
Tweet = require('./models/TweetModel');

//Instantiate the twitter component

module.exports = function(twitter, io) {

  // SET UP TWITTER STREAM ======================================================

  var t = new twitter({
      consumer_key       : 'zmk7DUdtp7iNV1deBkavWg', // <--- FILL ME IN
      consumer_secret    : 'Dhn6cgU1iJNmX5Cwn8hznjcL6SZu4vwoIzD73V4HA', // <--- FILL ME IN
      access_token_key   : '29588297-jlwvwiC4SoZkEeD5BP0sgLKA4PfTQVQsuyNrtM9Jv', // <--- FILL ME IN
      access_token_secret: 'wDjzPEsSVht79fuGVK7vO8wIfuzR2Q7qza9jVTjcJ4r8a' // <--- FILL ME IN
  });

  // Twitter symbols array
  var watchSymbols = ['abgt', 'grouptherapy', 'aboveandbeyond', 'abgrouptherapy'];

  //Set the watch symbols to zero.
  console.log('WATCHING:');
  _.each(watchSymbols, function(v) { 
    console.log('- ' + v);
  });

  //Tell the twitter API to filter on the watchSymbols 
  t.stream('statuses/filter', { track: watchSymbols }, function(stream) {
   
    //We have a connection. Now watch the 'data' event for incomming tweets.
    stream.on('data', function(tweet) {
   
      //This variable is used to indicate whether a symbol was actually mentioned.
      //Since twitter doesnt indicate why the tweet was forwarded we have to search through the text
      //and determine which symbol it was ment for. Sometimes we can't tell, in which case we don't
      //want to increment the total counter...
      var claimed = false;
   
      //Make sure it was a valid tweet
      if (tweet.text !== undefined) {
   
        console.log('\n');
        console.log(tweet.user.screen_name + ' Says: ');
        console.log(tweet.text);
        console.log('\n');

        // Store tweet in the database
        Tweet.create(
        {
          created_at             : tweet.created_at,
          id                     : tweet.id,
          text                   : tweet.text,
          in_reply_to_status_id  : tweet.in_reply_to_status_id,
          in_reply_to_user_id    : tweet.in_reply_to_user_id,
          in_reply_to_screen_name: tweet.in_reply_to_screen_name,
          user                   : 
          {
            id                          : tweet.user.id,
            name                        : tweet.user.name,
            screen_name                 : tweet.user.screen_name,
            location                    : tweet.user.location,
            description                 : tweet.user.description,
            followers_count             : tweet.user.followers_count,
            friends_count               : tweet.user.friends_count,
            timezone                    : tweet.user.timezone,
            profile_background_image_url: tweet.user.profile_background_image_url,
            profile_image_url           : tweet.user.profile_image_url,
            profile_banner_url          : tweet.user.profile_banner_url
          }
        }, 
        function(err, result) {
          if(err)
            console.log("ERROR: unable to add tweet to the database");
          else {
            //Send tweet to all the clients
            io.sockets.emit('tweet', result);
          }
        });
      }
    });

    // Handle a disconnect
    stream.on('end', function(response) {
      console.log('ERR: stream ended');
      console.log(response);
    });

    // Handle a silent disconnect from twitter
    stream.on('destroy', function(response) {
      console.log('ERR: stream destroyed');
      console.log(response);
    });

    stream.on('limit', function(response) {
      console.log('ERR: Limit reached');
      console.log(response);
    });

    stream.on('error', function(response) {
      console.log('ERROR');
      console.log(resopnse);
    });
  });
};