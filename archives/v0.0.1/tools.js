var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Passes a newly created article to the callback
exports.scrape = function (episodeNumber, callback) {

	var number = episodeNumber.toString();
	console.log('length: ' + number.length);
	console.log('episodeNumber: ' + number);
	var article = {title: null, songs:[]};
  	article.title = 'Episode ' + episodeNumber;

	//return;

	if(number.length == 1)
		number ='00' + number;
	else if(number.length == 2)
		number = '0' + number;
	else if(number.length == 3)
		number = number;
	else {
		console.log("ERROR: Invalid length of 'episodeNumber'.  Should be 1-3 digits");
		return;
	}

	var url = 'http://www.aboveandbeyond.nu/radio/abgt' + number;
	var fd = '';
	var date = '';


	request(url, function(err, resp, body) {
	    if (err)
	        throw err;
	    
	    $ = cheerio.load(body);


	    // Get all the text inside divs who have class 'field-items'
	    $('.field-items').each( function(date, i) {
	        var buffer = $(this).text().toString();

	        // Write text to file line-by-line, parsing along the way.
	        if(buffer.length < 100) {
	            fd = buffer;
	        }
	        else {
	            var lines = buffer.split('\n');
	            //var words = [];

	            // Parse each line into artist, song, and label
	            for(var i = 0; i<lines.length; i++) {
	            	//console.log(lines[i]);

                    // Insert a space after each ']', ')', and '"'
        /*
                    for(var j = lines[i].length -1 ; j>0 ; j--) {
                        if(lines[i].charAt(j).match('[\]]|[)]|["]'))
                            lines[i].splice
                    }
        */

	                parseLine(lines[i], function(words) {
	                    //console.log(words);
	                    if(words == null)
	                    	//do nothing
	                    	;
	                    else {
	                        parseWords(words, function(Song) {
	                        	// push song to article
	                        		article.songs.push(Song);

	                        });
	                    } 
	                });
	            }
	        }          
	    });
	    callback(article);
	});
}


/****** Private functions ******/

//Given a line, create an array of words
var parseLine = function (line, callback) {
//console.log(line);
var words = line.split(' ');    
if(words[0].charAt(0).match('[0-9]')) {
	callback(words);
}
else
	callback(null);


// return words;
}

// Given an array of words, create a Song object to be added to an article (episode)
var parseWords = function (words, callback) {


    // If first character  of the line isn't a number, trash it

    // Loop through words in the line to store them in database;

    var song = '';
    var artist = '';
    var label = '';
    var Song = new Object();

    for(var j = 0; j<words.length; j++) {
        //console.log('outside j: ' + j);
        //console.log('On word: ' + words[j]);;

        // Get the first and last character of each word
        var start = words[j].charAt(0);
        var end =  words[j].charAt(words[j].length - 1);
        var gotArtist = false;
        // Logging
        //console.log('start: ' + start);
        //console.log('end: ' + end);



        // If its the first word, its the index.  Trash it.
        if ( j == 0 ) {
            // Do nothing
            //console.log('j = 0');
        }
        else {
            //console.log('about to hit if statements');
            // Check what type you are storing
            // Cases: Artist, Song, Label
            while( 1 ) {
                //console.log("On word: " + words[j]);
                if(words[j].charAt(0).match('[a-z]|[A-Z]') ) {
                    //console.log("artist loop!");
                    //console.log(words[j]);
                    try{
                        while(words[j].charAt(0) != '"') {
                            //console.log(words[j].charAt(0));
                            //console.log(words[j]);
                            artist += words[j] + ' ';
                            j++;
                        }
                    }
                    catch(e) {
                        console.log('ERROR: formatting');
                        console.log(e);
                        return;
                    }

                    j--;

                    Song.artist = artist.trim();
                    //console.log('artist: ' + Song.artist.trim());
                    //console.log('j: ' + j);
                }
                else if(start == '"') {


                    try{
                        while(words[j].substring(words[j].length - 1) != '\"') {
                            //do things
                            song += words[j] + ' ';
                            j++;
                        }
                    }
                    catch(e) {
                        console.log('ERROR: formatting');
                        console.log(e);
                        return;
                    }   
                    song += words[j];
                    Song.song = song;

                    //console.log("Song: " + Song.song);
                }
                else if(start == '[') {
                    //console.log('remix loop');
                    song += ' ';

                    try {
                        while(words[j].substring(words[j].length - 1) != ']') {
                            //do things
                            song += words[j] + ' ';
                            j++;
                        }
                    } catch(e) {
                        console.log('ERROR: formatting');
                        console.log(e);
                        return;
                    }

                    song += words[j];

                    Song.song = song;
                    //console.log('song: ' + Song.song);

                }
                else if( start == '(' ) {
                    try{
                    while( (words[j].substring(words[j].length - 1) != ')') && 
                        (words[j].substring(words[j].length - 1) != ']') ) {
                        //do things
                        //console.log('DEBUG: ' + words[j]);
                        //console.log('DEBUG: last character: ' +words[j].substring(words[j].length - 1));
                        label += words[j] + ' ';

                        j++;
                    }
                    } catch(e) {
                        console.log('ERROR: formatting');
                        console.log(e);
                        return;
                    }
                    //if(end == ')')
                    
                    label += words[j];
                    Song.label = label;
                    console.log("label: " + Song.label);

                } 
                else {
                    console.log("ERROR: default case executed");
                    console.log(words[j]);
                    return;
                }
                //console.log('break');

                break;
            }
        }
    }
    //console.log(Song);
    callback(Song);
}

    