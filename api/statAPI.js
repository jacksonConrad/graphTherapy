// statAPI.js
var Tweet = require('./models/TweetModel');
var Moment = require('moment');
var _ = require('underscore');


var birthTime = Moment().toJSON();

//console.log(birthTime.format('MMMM Do YYYY, h:mm:ss a'));
//One hour ago.
//console.log(Moment().hour( Moment().hour() - 1).toJSON() );
//console.log(Moment().format('MMMM Do YYYY, h:mm:ss a'));

// 60 bins total
minutesBin = [];
// Fill array with 0's
min = 60;
while (min--) {
    minutesBin[min] = 0;
}

hoursBin = [];
daysBin = [];






module.exports = function(app, io) {

	app.get('/api/getlast/:number', function(req, res) {
		Tweet.find({}, 'created_at text id user.screen_name user.profile_image_url user.followers_count')		
		.sort({'created_at':-1})
		.limit(req.params.number)

		.exec(function(err, results) {
			res.json(results);
			//console.log(results[0].created_at.getYear());

		});
	});

	// When the app starts, fill the bins.  
	// This only happens once.
	// Bins will be updated dynamically from here on out.
	/*
	app.get('/api/minutes', function(req, res) {
		Tweet.find({'created_at': {$gte: Moment().hour( Moment().hour() - 1).toJSON()}}, 
			'created_at user.followers_count')
		.sort({'created_at':-1})
		.exec(function(err, results) {
			//for(var i = 0; i<results.length; i++) {
			_.each(results, function(tweet) {
				var bin = Moment( tweet.created_at ).minutes() ;
				//console.log('cuttoff time ' + Moment().hour( Moment().hour() - 1).format('MMMM Do YYYY, h:mm:ss a'));
				//console.log('tweet time: ' + Moment( results[i].created_at ).format('MMMM Do YYYY, h:mm:ss a') );
				//console.log('has minute: ' + bin);
				minutesBin[bin]++;
			});
			//}
			
			res.json(minutesBin);
		});
	});
	*/

// When the app starts, fill the bins.  
// This only happens once.
// Bins will be updated dynamically from here on out.
	Tweet.find({'created_at': {$gte: Moment().hour( Moment().hour() - 1).toJSON()}}, 
		'created_at user.followers_count')
	.exec(function(err, results) {
		//console.log(results);
		_.each(results, function(tweet) {
			var bin = Moment( tweet.created_at ).minutes() ;
			//console.log('cuttoff time ' + Moment().hour( Moment().hour() - 1).format('MMMM Do YYYY, h:mm:ss a'));
			//console.log('tweet time: ' + Moment( results[i].created_at ).format('MMMM Do YYYY, h:mm:ss a') );
			//console.log('has minute: ' + bin);
			minutesBin[bin]++;
			
		});
		io.sockets.emit('minutesBin', minutesBin);
	});


	setInterval(
		// emit new data
		emitMinute
		// every minute
		, 1000*60
		, function (minutesBin) {
			io.sockets.emit('minutesBin', minutesBin);
			//console.log('minutesBin emitted');
			//console.log(minutesBin);
		  }
	);
};




function emitMinute(callback) {
		Tweet.find({'created_at': {$gte: Moment().minute( Moment().minute() - 1).toJSON()}}, 
			'user.followers_count')
		.exec(function(err, results) {
			minutesBin.push(results.length);
			minutesBin.shift();
			//console.log('IN EMIT MINUTE FUNCTION');
			callback(minutesBin);
		});
	}