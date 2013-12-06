var request = require('request');
var cheerio = require('cheerio');
var lineReader = require('line-reader');
var fs = require('fs');
var tools = require('./tools')

var url = 'http://www.aboveandbeyond.nu/radio/abgt002';
var fd = './episodeTEST.txt';
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

            for(var i = 0; i<lines.length; i++)
                // Split lines into array of words 
                
                
                // Parse a line into an array of words
                parseLine(lines[i], function(words) {
                    //console.log(words);
                    if(words[0].charAt(0).match('[1-9]'))
                        parseWords(words, function() {
                        });
                });
        }          
    });
    /*
    fs.writeFile(fd, buffer, function(err) {
        if (err) return console.log(err);
        console.log(fd);
        tools.episodeParse(fd, function() {
            console.log('episode parsed');
        });

        //console.log('text written to > ' + fd);
    });
    */
    




});


function parseLine (line, callback) {
    //console.log(line);
    var words = line.split(' ');
    callback(words);;
   // return words;
};

function parseWords (words, callback) {


    // If first character  of the line isn't a number, trash it

        // Loop through words in the line to store them in database;

        var song = '';
        var artist = '';
        var label = '';

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

                        while(words[j].charAt(0) != '"') {
                            //console.log(words[j].charAt(0));
                            //console.log(words[j]);
                            artist += words[j] + ' ';
                            j++;
                        }
                        j--;

                        artist.trim();
                        console.log('artist: ' + artist);
                        //console.log('j: ' + j);
                    }
                    else if(start == '"') {
                        while(words[j].substring(words[j].length - 1) != '\"') {
                            //do things
                            song += words[j] + ' ';
                            j++;
                        }
                        song += words[j];

                        console.log("Song: " + song);
                    }
                    else if(start == '[') {
                        console.log('remix loop');
                        while(words[j].substring(words[j].length - 1) != ']') {
                            //do things
                            song += words[j] + ' ';
                            j++;
                        }
                        song += words[j];
                        console.log('song: ' + song);

                    }
                    else if( start == '(' ) {
                        while(words[j].substring(words[j].length - 1) != ')') {
                            //do things
                            label += words[j] + ' ';

                            j++;
                        }
                        //if(end == ')')
                        
                        label += words[j];
                        console.log("label: " + label);

                    } 
                    else {
                        console.log("ERROR: default case executed");
                        return;
                    }
                    //console.log('break');

                    break;
                }
            }





            /*
            else if(gotArtist == false) {
                if(start == '\"') {

                    // Start storing the artists name
                    artist += words[j].substring(1);
                }
                else {
                    if(end == '\"') {
                        gotArtist = true;
                        artist += ' ' + words[j].substring(0, words[j].length - 2);
                        console.log("Artist: " + artist);
                        // Write Artist to file

                    }
                    else
                        artist += ' ' + words[j];

                }
            }
            else if() {
                ;
            }
            */
              

            // Read words into 'artist' variable until you see a quotation mark

            // Read words into 'song' variable until you see another quotation mark

            // If string starts with [, include it in song name

            // Label is everything inside of ()
        }
          
          callback();
}
