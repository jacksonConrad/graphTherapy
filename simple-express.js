// Barebones express application

//Module dependencies
var express = require('express');

var app = express.createServer();

// Configuration
app.configure( function() {
	
});

// Routes
// When we recieve a get request for the URI '/', do something
app.get('/', function(req, res) {
	// Send 'hello world' as the response when the user hits the home page
	res.send('Hello World');
});

// Listen on port 3000
app.listen(3000);