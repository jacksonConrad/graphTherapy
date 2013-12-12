
$(document).ready(function() {
    var colors =  ["#637b85","#2c9c69","#dbba34","#c62f29","#c62f78"];
    getData(colors);
});


            

// makes http GET request to server for the data needed to populate the chart
var getData = function(colors) {
    $.get(
        '/api/getTopFive', function(data) {
            getPieChart(data, colors);
        }
    );
}

// constructs data array for the chart
var getPieChart = function(data, colors) {
    pieChart = [{},{},{},{},{}];
    for (var i = data.length - 1; i >= 0; i--) {
        pieChart[i].value = data[i].totalPlays;
        pieChart[i].color = colors[i];
    }
    console.log(pieChart);
    var canvas = document.getElementById("myChart");
    var ctx = canvas.getContext("2d");
    new Chart(ctx).Doughnut(pieChart);

}