var COLORS = ["#637b85", "#2c9c69", "#dbba34", "#c62f29", "#c62f78"];

/*

exports.updateTopFive = function(articleProvider, callback) {
    articleProvider.getTopNArtists(5, function( error, results) {
        data = results;
        console.log('top 5 updated');
    });
}
*/
exports.getTopFive = function(callback) {
    var data =  [
            {
                value: 20,
                color: COLORS[0]
            },
            {
                value : 30,
                color : COLORS[1]
            },
            {
                value : 40,
                color : COLORS[2]
            },
            {
                value : 10,
                color : COLORS[3]
            },
            {
                value : 3,
                color : COLORS[4]
            }
            ];
    callback(data);
}
