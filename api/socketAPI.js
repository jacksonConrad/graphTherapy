// socketAPI.js

module.exports = function(io, server) {

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
	});
	

};