var fs = require('fs');

module.exports = {
  episodeParse: function (path, callback) {
    // whatever
    fs.open(path, 'r', function(err, f){
    	//console.log(f.toString());
	    var lines = f.toString();
	    console.log(f);
	    console.log(f.toString());
	        // use the array


	    for(var i = 0; i< lines.length; i++) {
	    	console.log(lines[i]);
	    	console.log(lines.length);
	    }
	});

  },

  bar: function () {
    // whatever
  }
};

var zemba = function () {
}
	
        