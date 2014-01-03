// twitterAPI.js
var _ = require('underscore');

//Instantiate the twitter component

module.exports = function(twitter, io, server) {

  // SET UP SOCKET =============================================================
  
  //Start a Socket.IO listen
  var sockets = io.listen(server);
 
  //Set the sockets.io configuration.

  /*
  //THIS IS NECESSARY ONLY FOR HEROKU!
  sockets.configure(function() {
    sockets.set('transports', ['xhr-polling']);
    sockets.set('polling duration', 10);
  });
  */
   
  //If the client just connected, give them fresh data!
  sockets.sockets.on('connection', function(socket) { 
      // socket.emit('data', watchList);
      console.log('\nclient connected!!!!!!!!!!\n');
  });

  // SET UP TWITTER STREAM ======================================================

  var t = new twitter({
      consumer_key       : 'zmk7DUdtp7iNV1deBkavWg', // <--- FILL ME IN
      consumer_secret    : 'Dhn6cgU1iJNmX5Cwn8hznjcL6SZu4vwoIzD73V4HA', // <--- FILL ME IN
      access_token_key   : '29588297-jlwvwiC4SoZkEeD5BP0sgLKA4PfTQVQsuyNrtM9Jv', // <--- FILL ME IN
      access_token_secret: 'wDjzPEsSVht79fuGVK7vO8wIfuzR2Q7qza9jVTjcJ4r8a' // <--- FILL ME IN
  });

  // Twitter symbols array
  var watchSymbols = ['abgt', 'grouptherapy', 'aboveandbeyond', 'abgrouptherapy'];

  // This structure will keep the total number of tweets received and a map of all the symbols 
  // and how many tweets received of that symbol
  var watchList = {
      total: 0,
      symbols: {}
  };

  //Set the watch symbols to zero.
  console.log('WATCHING:');
  _.each(watchSymbols, function(v) { 
    console.log('- ' + v);
    watchList.symbols[v] = 0; 
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
   
        //We're gunna do some indexOf comparisons and we want it to be case agnostic.
        console.log(tweet.user.screen_name + ' Says: ');
        console.log(tweet.text);
        var text = tweet.text.toLowerCase();
   
        //Go through every symbol and see if it was mentioned. If so, increment its counter and
        //set the 'claimed' variable to true to indicate something was mentioned so we can increment
        //the 'total' counter!
        _.each(watchSymbols, function(v) {
            if (text.indexOf(v.toLowerCase()) !== -1) {
                watchList.symbols[v]++;
                claimed = true;
            }
        });
   
        //If something was mentioned, increment the total counter and send the update to all the clients
        if (claimed) {
            //Increment total
            watchList.total++;
   
            //Send to all the clients
            sockets.sockets.emit('data', watchList);
        }
      }
    });
  });

};