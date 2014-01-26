// statAPI.js
var Tweet = require('./models/TweetModel');
var Moment = require('moment');
var _ = require('underscore');
var async = require('async');


var birthTime = Moment().toJSON();

//console.log(birthTime.format('MMMM Do YYYY, h:mm:ss a'));
//One hour ago.
//console.log(Moment().hour( Moment().hour() - 1).toJSON() );
//console.log(Moment().format('MMMM Do YYYY, h:mm:ss a'));

minutesBin = [];
hoursBin   = [];
daysBin    = [];

// Initialize minutesBin with 0's
min = 60;
while (min--) {
    minutesBin[min] = {
    	time: min,
    	value: 0
    }
}
// Initialize hoursBin with 0's
hour = 24;
while (hour--) {
    hoursBin[hour] = {
    	time: hour,
    	value: 0
    }
}
// Initialize daysBin with 0's
day = 28;
while (day--) {
    daysBin[day] = {
    	time: day,
    	value: 0
    }
}







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
	Tweet.find({'created_at': {$gte: Moment().hour( (Moment().hour() - 1) % 24 ).toJSON()}}, 
		'created_at user.followers_count')
	.exec(function (err, results) {
		// Use async module to execute operations in series
		// and pass results to a final callback
		var now = Moment().minutes();
		console.log('we are in minute: ' + now);
		console.log('There have been ' + results.length + ' tweets in the past hour');
		// console.log(minutesBin);

		async.series([
			function (callback) {

				// First, fill bins with the proper value where index corresponds to minutes
				_.each(results, function (tweet) {
					var bin = Moment( tweet.created_at ).minutes();
					//console.log()
					if(bin != 0) {

						//console.log(minutesBin[bin]);
						minutesBin[bin].value++;
						//console.log(bin);
					}
				});
				callback();
				//console.log(minutesBin);
			},
			// Second, rotate indexes
			function (callback) {				
				for (var i = 0; i<(59 - now); i++) {
					// Rotate indexes until they are in the correct spot with respect to now
					// i.e. if i started the app at 2:38, the array is rotated until the object
					// with time: 38 is in the 0th index
					minutesBin.unshift(minutesBin.pop());			
				}
				callback(null, minutesBin);
			}
			],
			// Final callback
			function (err, results) {
				console.log('minutesBin initialized!');
				//console.log(results[1]);

			}
		);
	});

	setInterval(
		// emit new data
		emitMinute
		// every minute
		, 1000*60
		// callback fn for 'emitMinute'
		// This is how you pass args to initial function
		// when using setInterval
		, function (minutesBin) {
			io.sockets.emit('minutesBin', minutesBin);
			//console.log('minutesBin emitted');
			//console.log(minutesBin);
		}
	);		
		
		
	// When the user connects, give him the data
	io.sockets.on('connection', function (socket) {
		socket.emit('minutesBin', minutesBin);
	});
};


//////////////////
// Private Fn's //
//////////////////

function emitMinute(callback) {
	Tweet.find({'created_at': {$gte: Moment().minute( Moment().minute() - 1).toJSON()}}, 
		'user.followers_count')
	.exec(function(err, results) {
		
		minutesBin.push({
			time: (minutesBin[59].time + 1) % 60,
			value:results.length
		});
		minutesBin.shift();
		
		//console.log('IN EMIT MINUTE FUNCTION');
		callback(minutesBin);
	});
}




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