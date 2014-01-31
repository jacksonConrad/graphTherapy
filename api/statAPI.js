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
	
	//////////////////////////////
	// Initialize event timers //
	//////////////////////////////

	startCronJobs();

	// Serve clients data over a socket when they connect
	io.sockets.on('connection', function (socket) {
		socket.emit('minutesBin', minutesBin);
		socket.emit('hoursBin', hoursBin);
		socket.emit('daysBin', daysBin);
	});
};


//////////////////
// Private Fn's //
//////////////////


////////////////////////////////////////
// Functions executing on an interval //
////////////////////////////////////////

function emitMinute(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('minute', 1).toJSON()}}, 
		'user.followers_count')
	.exec(function(err, results) {
		
		minutesBin.push({
			time: (minutesBin[59].time + 1) % 60,
			value:results.length,
			date: Moment( minutesBin[59].date ).add('minute', 1).toJSON()
		});
		minutesBin.shift();
		
		//console.log('IN EMIT MINUTE FUNCTION');
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
			date: Moment( minutesBin[59].date ).add('hour', 1).toJSON()
		});
		hoursBin.shift();
		
		//console.log('IN EMIT MINUTE FUNCTION');
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
			date: Moment( minutesBin[59].date ).add('day', 1).toJSON()
		});
		daysBin.shift();
		
		//console.log('IN EMIT MINUTE FUNCTION');
		callback(daysBin);
	});
}

// Initialize event timers
function startCronJobs(callback) {
	// emit new data every minute
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
}	


////////////////
// DB Queries //
////////////////

function minuteDataQuery(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('hour', 1).toJSON()}}, 
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
					if(minutesBin[bin].date == null)
						minutesBin[bin].date = Moment( tweet.created_at ).startOf('minute').toJSON();

						//console.log(minutesBin[bin]);
					minutesBin[bin].value++;
						//console.log(bin);
					
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
}

function hourDataQuery(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('hour', 24).toJSON()}}, 
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
						//console.log('herooooo');
						//console.log(Moment( tweet.created_at ).startOf('hour').format('MMMM Do YYYY, h:mm:ss a'));
					}
						//console.log(minutesBin[bin]);
					hoursBin[bin].value++;
						//console.log(bin);
					//console.log( Moment( tweet.created_at ).format('MMMM Do YYYY, h:mm:ss a') );

					
				});
				callback();
				//console.log(minutesBin);
			},
			// Second, rotate indexes
			function (callback) {		
				//console.log(hoursBin);		
				for (var i = 0; i<(23 - now); i++) {
					// Rotate indexes until they are in the correct spot with respect to now
					hoursBin.unshift(hoursBin.pop());			
				}
				callback(null, hoursBin);
			}
			],
			// Final callback
			function (err, results) {
				console.log('hoursBin initialized!');
				//console.log(results[1]);
				for(var i = 0; i<24; i++) {
					//console.log( Moment( results[1][i].date ).format('MMMM Do YYYY, h:mm:ss a') );
					//console.log(results[1][i].time);
				}
				//console.log(results[1]);
				
			}
		);
	});
}

function dayDataQuery(callback) {
	Tweet.find({'created_at': {$gte: Moment().subtract('day', 28).toJSON()}}, 
		'created_at user.followers_count')
	.sort({'created_at': -1})
	.exec(function (err, results) {
		// Use async module to execute operations in series
		// and pass results to a final callback
		var now = Moment().dates();
		//console.log('we are in minute: ' + now);
		console.log('There have been ' + results.length + ' tweets in the past 4 weeks');
		// console.log(minutesBin);

		async.series([
			function (callback) {

				// First, fill bins with the proper value where index corresponds to minutes
				_.each(results, function (tweet) {
					var bin = Moment( tweet.created_at ).dates();
					// console.log(bin);

						if(daysBin[bin % 28].date == null)
							daysBin[bin % 28].date = Moment( tweet.created_at).startOf('day').toJSON();

						daysBin[bin % 28].value++;
				});

				//console.log('hello');

				callback();
				//console.log(minutesBin);
			},
			// Second, rotate indexes
			function (callback) {
			/*				
				for (var i = 0; i<(27 - (now % 28)); i++) {
					// Rotate indexes until they are in the correct spot with respect to now
					daysBin.unshift(daysBin.pop());			
				}
			*/	//console.log('hello
				callback(null, daysBin);
			}
			],
			// Final callback
			function (err, results) {
				console.log('daysBin initialized!');
				//console.log(results[1]);

			}
		);
	});
}