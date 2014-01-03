//Temporary, schema-less Tweet
var mongoose = require('mongoose'),
Schema = mongoose.Schema;


var tweetSchema = new Schema({
    any: {} 
});

// Create a Tweet model.
// Notice 'Tweet' is capitalized. This is because when a model is compiled,
// the result is a constructor function that is used to create instances of the model.

module.exports = mongoose.model('Tweet', tweetSchema);




