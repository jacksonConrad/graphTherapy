tools = require('./tools');

tools.scrape(21, function(article) {
	console.log("Scraped!");
	console.log(article);
});