var lineReader = require('line-reader');

// read all lines:
lineReader.eachLine('./public/episodes/test1.txt', function(line) {
  console.log(line);
  


}).then(function () {
  console.log("I'm done!!");
});