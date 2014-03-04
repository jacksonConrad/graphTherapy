// statAPI.js
var Tweet = require('./models/TweetModel');
var Moment = require('moment');
var _ = require('underscore');
var async = require('async');
var cronJob = require('cron').CronJob;


var birthTime = Moment().toJSON();

minutesBin = [];
hoursBin   = [];
daysBin    = [];

// Initialize minutesBin with 0's
min = 60;
while (min--) {
    minutesBin[min] = {
    	date: null,
    	time: min,
    	value: 0
    }
}
// Initialize hoursBin with 0's
hour = 24;
while (hour--) {
    hoursBin[hour] = {
    	date: null,
    	time: hour,
    	value: 0
    }
}
// Initialize daysBin with 0's
day = 28;
while (day--) {
    daysBin[day] = {
    	date: null,
    	time: day,
    	value: 0
    }
}


module.exports = function(app, io) {

	// Returns the last :number tweets to keep in the table
	app.get('/api/getlast/:number', function(req, res) {
		Tweet.find({}, 'created_at text id user.screen_name user.profile_image_url user.followers_count')		
		.sort({'created_at':-1})
		.limit(req.params.number)

		.exec(function(err, results) {
			res.json(results);
		});
	});

	// When the app starts, fill the bins.  
	// This only happens once.
	// Bins will be updated dynamically from here on out.
	
	/////////////////////////////////////////////////////
	// Initialize data to be maintained on the server //
	/////////////////////////////////////////////////////

	async.parallel([
		function (callback) {
			// fill minutes array
			minuteDataQuery();
			callback(null, minutesBin);
		},
		function (callback) {
			// fill hours array
			hourDataQuery();
			callback(null, hoursBin);
		},		
		function (callback) {
			// fill days array
			dayDataQuery();
			callback(null, daysBin);

		}], // final callback
		function (err, results) {
			// results[0], results[1], etc.
			
		});
	
	// Initialize event timers //
	startCronJobs();

	// Serve clients data over a socket when they connect
	io.sockets.on('connection', function (socket) {
		socket.emit('minutesBin', minutesBin);
		socket.emit('hoursBin', hoursBin);
		socket.emit('daysBin', daysBin);
	});
};

/////////////////////////////////
// Data Aggregation functions  //
/////////////////////////////////

function emitMinute(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('minute', 1).toJSON()}}, 
		'user.followers_count')
	.exec(function(err, results) {
		
		minutesBin.push({
			time: (minutesBin[59].time + 1) % 60,
			value:results.length,
			date: Moment().subtract('minute', 1).startOf('minute').toJSON()
		});
		minutesBin.shift();
		callback(minutesBin);
	});
}

function emitHour(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('hour', 1).toJSON()}}, 
		'user.followers_count')
	.exec(function(err, results) {
		
		hoursBin.push({
			time: (hoursBin[23].time + 1) % 24,
			value:results.length,
			date: Moment().subtract('hour', 1).startOf('hour').toJSON()
		});
		hoursBin.shift();
		
		callback(hoursBin);
	});
}

function emitDay(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('day', 1).toJSON()}}, 
		'user.followers_count')
	.exec(function(err, results) {
		
		daysBin.push({
			time: (daysBin[59].time + 1) % 28,
			value:results.length,
			date: Moment().subtract('day', 1).startOf('day').toJSON()
		});
		daysBin.shift();
		
		callback(daysBin);
	});
}

// Initialize event timers
function startCronJobs() {

	// Triggers every day at midnight
	new cronJob('00 00 00 * * *', function(){
    	console.log('You will see this message every day');
    	emitDay(function (data)  {
    		io.sockets.emit("daysBin",data);
    	});
	}, null, true, "America/New_York");

	// Triggers every hour on the hour
	new cronJob('00 00 * * * *', function(){
    	console.log('You will see this message every hour');
    	emitHour(function (data)  {
    		io.sockets.emit("hoursBin", data);
    	});
	}, null, true, "America/New_York");

	// Triggers every minute on the minute
	new cronJob('00 * * * * *', function(){
    	console.log('You will see this message every minute');
    	emitMinute(function (data)  {
    		io.sockets.emit("minutesBin", data);
    	});
	}, null, true, "America/New_York");

	/*setInterval(
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

	// emit data every hour
	setInterval(
		// emit new data
		emitHour
		// every hour
		, 1000*60*60
		, function (hoursBin) {
			io.sockets.emit('hours', hoursBin);
			//console.log('minutesBin emitted');
			//console.log(minutesBin);
		}
	);	
    // emit data every day
	setInterval(
		// emit new data
		emitDay
		// every day
		, 1000*60*60*24
		, function (daysBin) {
			io.sockets.emit('daysBin', daysBin);
			//console.log('minutesBin emitted');
			//console.log(minutesBin);
		}
	);	
*/
}	
////////////////
// DB Queries //
////////////////

function minuteDataQuery(callback) {
	Tweet.find({'created_at': {$gte: Moment().startOf('minute').subtract('hour', 1).toJSON(), $lt: Moment().startOf('minute').toJSON()}}, 
		'created_at user.followers_count')
	.exec(function (err, results) {
		// Use async module to execute operations in series
		// and pass results to a final callback
		var now = Moment().minutes();
		console.log('we are in minute: ' + now);
		console.log('There have been ' + results.length + ' tweets in the past hour');

		async.series([
			function (callback) {

				// First, fill bins with the proper value where index corresponds to minutes
				_.each(results, function (tweet) {
					var bin = Moment( tweet.created_at ).minutes();
					//console.log()
					if(minutesBin[bin].date == null)
						minutesBin[bin].date = Moment( tweet.created_at ).startOf('minute').toJSON();

					minutesBin[bin].value++;
				});
				callback();
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
}

function hourDataQuery(callback) {
	Tweet.find({'created_at': {$gte: Moment().startOf('hour').subtract('hour', 24).toJSON(), $lt: Moment().startOf('hour').toJSON()}}, 
		'created_at user.followers_count')
	.sort({'created_at': -1})
	.exec(function (err, results) {
		// Use async module to execute operations in series
		// and pass results to a final callback
		var now = Moment().hours();
		//console.log('we are in minute: ' + now);
		console.log('There have been ' + results.length + ' tweets in the past day');
		// console.log(minutesBin);

		async.series([
			function (callback) {

				// First, fill bins with the proper value where index corresponds to minutes
				_.each(results, function (tweet) {
					var bin = Moment( tweet.created_at ).hours();
					//console.log(bin);
					if(hoursBin[bin].date == null) {
						hoursBin[bin].date = Moment( tweet.created_at ).startOf('hour').toJSON();
					}
					hoursBin[bin].value++;
				});
				callback();
			},
			// Second, rotate indexes
			function (callback) {		
				for (var i = 0; i<(24 - now); i++) {
					// Rotate indexes until they are in the correct spot with respect to now
					hoursBin.unshift(hoursBin.pop());			
				}
				callback(null, hoursBin);
			}
			],
			// Final callback
			function (err, results) {
				console.log('hoursBin initialized!');
				console.log(results[1]);
			}
		);
	});
}

function dayDataQuery(callback) {
	Tweet.find({'created_at': {$gte: Moment().startOf('day').subtract('day', 28).toJSON(), $lt: Moment().startOf('day').toJSON()}}, 
		'created_at user.followers_count')
	.sort({'created_at': -1})
	.exec(function (err, results) {
		// Use async module to execute operations in series
		// and pass results to a final callback
		var now = Moment().startOf('day');
		console.log('we are in day: ' + now.dates());
		//console.log('There have been ' + results.length + ' tweets in the past 4 weeks');
		if (!results) {
			console.log("ALERT:  Query for day data has failed!");
		}
		else {
			console.log("There have been " + results.length + " tweets in the past 4 weeks");
		}

		async.series([
			function (callback) {
				// First, fill bins with the proper value where index corresponds to minutes
				_.each(results, function (tweet) {
					var bin = Moment( tweet.created_at ).startOf('day');
					// console.log(bin);
						//console.log(now.diff(bin, 'days'));

						if(daysBin[now.diff(bin, 'days') - 1].date == null) {
							console.log(now.diff(bin, 'days'));
							daysBin[now.diff(bin, 'days') - 1].date = Moment( tweet.created_at).startOf('day').toJSON();
						}

						daysBin[now.diff(bin, 'days') - 1].value++;
				});
				callback(null, daysBin);
			}
			],
			// Final callback
			function (err, results) {
				console.log('daysBin initialized!');
				console.log(results[0]);

			}
		);
	});
}