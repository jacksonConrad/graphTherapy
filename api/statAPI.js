// statAPI.js
var Tweet = require('./models/TweetModel');

module.exports = function(app) {

	app.get('/api/getlast/:number', function(req, res) {
		Tweet.find({})
		.sort({'created_at':-1})
		.limit(req.params.number)
		.exec(function(err, results) {
			res.json(results);
		});
	});

};