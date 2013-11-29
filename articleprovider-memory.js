var articleCounter = 1;       

ArticleProvider = function(){};
ArticleProvider.prototype.dummyData = [];

ArticleProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

ArticleProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

ArticleProvider.prototype.save = function(articles, callback) {
  var article = null;

  if( typeof(articles.length)=="undefined")
    articles = [articles];

  for( var i =0;i< articles.length;i++ ) {
    article = articles[i];
    article._id = articleCounter++;
    //article.created_at = new Date();

    //If the episode has no songs (stupid condition)
    if( article.songs === undefined ) {
      console.log("WARNING: artical was submitted with no songs");
      article.songs = [];
    }

    /*
    for(var j =0;j< article.songs.length; j++) {
      article.songs[j].created_at = new Date();
    }
    */

    this.dummyData[this.dummyData.length]= article;
  }
  callback(null, articles);
};

/* Lets bootstrap with dummy data */
new ArticleProvider().save([
  {title: '1', songs:[{artist:'Mat Zo', song:'Bipolar'}, {artist:'Artificial', song:'Prototype'}]},
], function(error, articles){});

exports.ArticleProvider = ArticleProvider; //