var mongoose = require('mongoose'),
Schema = mongoose.Schema;


var tweetSchema = new Schema({
    created_at: Date,
    id: Number,
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




