/* hold our database connection settings */ 
module.exports = {
	// url looks like: 'mongodb://<host>/<db-name>'
    'url' : process.env.MONGOLAB_URI || 'mongodb://localhost/graphTherapy' // temporary local config
};
