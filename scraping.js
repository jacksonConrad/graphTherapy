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
            //console.log(buffer);
           // console.log('entry ' + i + ' : ' + buffer);

            // Write text to file line-by-line, parsing along the way.

            if(buffer.length < 100) {
                fd = buffer;
            }
            else {
                var lines = buffer.split('\n');

                for(var i = 0; i<lines.length; i++)
                    //console.log(lines[i]);

                    // Split lines into array of words

                    // If first character isn't a number, trash it

                    // Read words into 'artist' variable until you see a quotation mark

                    // Read words into 'song' variable until you see another quotation mark

                    // If string starts with [, include it in song name

                    // Label is everything inside of ()


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
            }
        });
        




    });