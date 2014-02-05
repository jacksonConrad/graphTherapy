var mongoose = require('mongoose');
// provides 'long' number support to mongoose
// necessary because twitter user ID's are longs
require('mongoose-long')(mongoose);
SchemaTypes = mongoose.Schema.Types;

Schema = mongoose.Schema;

// Taken from the twitter API.  We are only storing elements of the tweet that we find potentially useful
var tweetSchema = new Schema({
    created_at: Date,
    id: {type: SchemaTypes.Long, min: 0, default: 0},
    id_str: String,
    text: String,
    in_reply_to_status_id: String,
    in_reply_to_user_id: String,
    in_reply_to_screen_name: String,
    user: 
    {
      id: Number,
      name: String,
      screen_name: String,
      location: String,
      description: String,
      followers_count: Number,
      friends_count: Number,
      timezone: String,
      profile_background_image_url: String,
      profile_image_url: String,
      profile_banner_url: String
    }
});

// Create a Tweet model.
// Notice 'Tweet' is capitalized. This is because when a model is compiled,
// the result is a constructor function that is used to create instances of the model.

module.exports = mongoose.model('Tweet', tweetSchema);




