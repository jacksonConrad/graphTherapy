/* Directives -----------------------------------------------------------------------------------------------------------------------------------------------*/
// Angular Directives
angular.module('graphTherapyApp.directives', [])
    .directive('d3Bars', function () {

	    // Constants
		var w = 15,
		h = 200;
		console.log('OUTSIDE RETURN');

		// Other helper functions

	    return {
	    	restrict: 'E',
	    	//terminal: true,
	    	replace: false,
	    	scope: {
	    		// Bi-directional databinding
	    		chartData: '=chartData'
	    	},

	    	// Controller shared with all instantiated directives
	    	controller: ['$scope', function ($scope, chartData) {

	    		//var updateChart = 1;
	    		var updateChart = function (svg, toolTip, data) {
						console.log('$scope.chartData: ');
						console.dir($scope.chartData);
						var chartData = $scope.chartData;
						console.log('data');
						console.dir(data);
						// Format data
						
						




						// Render graph
						 
						
						// Scale the x axis
						var x = d3.scale.linear()
							.domain([0,1])
							.range([0,(900/chartData.length)]);


						console.log('array length: ' + chartData.length);
					

						var y = d3.scale.linear()
						// Scale the data to fit into the div
							.domain([0,d3.max(chartData, function (d) { return d.value })])
							.rangeRound([0,h]);

						//console.log('MAX: ');	
						//console.dir(d3.max(d3.values(chartData)));
						


						// remove all previous items before render
	    				svg.selectAll('*').remove();

	    				// If we don't pass any data, return out of the element
	    				if (!chartData) return;

						svg.selectAll("rect")
						    .data(chartData)
						    .enter()
						    .append("rect")
						    	.attr("x", function (d, i) { return x(i) - .5; })
						    	.attr("y", function (d) { return h - y(d.value) - .5; })
						    	.attr("width", 900/chartData.length)
						    	.attr("height", function (d) { return y(d.value); })
						    	.on("mouseover", mouseover)
							    .on("mousemove", mousemove)
							    .on("mouseout", mouseout);

						svg.selectAll("text")
						    .data(chartData)
						    .enter()
							.append("text")
								.text(function (d) { return d.value})
						    	.attr("x", function (d, i) { return x(i) + 3; })
						    	.attr("y", function (d) { return h - y(d.value) + 12; })
						    	.attr("font-family", "Century Gothic")
						    	.attr("font-size", "10")
						    	.attr("fill","#000");

						svg.append("line")
						    .attr("x1", 0)
						    .attr("x2", 900)
						    .attr("y1", h - .5)
						    .attr("y2", h - .5)
						    .style("stroke", "#FFF");


						var rect = svg.selectAll("rect")
							.data(chartData, function (d) { return d.time; });

						rect.enter().insert("rect", "line")
							.attr("x", function (d, i) { return x(i + 1) - .5; })
							.attr("y", function (d) { return h - y(d.value) - .5; })
							.attr("width", w)
							.attr("height", function (d) { return y(d.value); })
							.transition()
							.duration(1000);
							//.attr("x", function (d, i) { return x(i) - .5; });

						function mouseover() {
						  	toolTip.transition()
								.duration(500)
								.style("opacity", 1);
						}

						function mousemove(d) {
							switch (chartData.length) {
								case 60:
								toolTip
								    .text(moment(d.date).format('h:mm:ss a'))
								    .style("left", (d3.event.pageX - 75) + "px")
								    .style("top", (d3.event.pageY - 12) + "px");
								    break;
								case 24:
								toolTip
								    .text(moment(d.date).format('h:mm a'))
								    .style("left", (d3.event.pageX - 75) + "px")
								    .style("top", (d3.event.pageY - 12) + "px");
								    break;
								case 28:
								toolTip
								    .text(moment(d.date).format('MMMM Do'))
								    .style("left", (d3.event.pageX - 80) + "px")
								    .style("top", (d3.event.pageY - 12) + "px");
								    break;
								default:
								toolTip
								    .text(moment(d.date).format('MMMM Do YYYY, h:mm:ss a'))
								    .style("left", (d3.event.pageX - 150) + "px")
								    .style("top", (d3.event.pageY - 12) + "px");
							}
						  
						}

						function mouseout() {
						  toolTip.transition()
						      .duration(500)
						      .style("opacity", 1e-6);
						}
													

						/*rect.transition()
							.duration(1000)
							.attr("x", function (d, i) { return x(i) - .5; })

						rect.exit().transition()
							.duration(1000)
							.attr("x", function (d, i) { return x(i - 1) - .5; })
							.remove()
							*/
					}
	    		
	    		return {
	    			updateChart: updateChart
	    		};
	    	}],
	    	link: function (scope, element, attrs, controller) {
	    		
	    		// Setup initial svg object
				var svg = d3.select("#bodyWrapper").append("svg")
					.attr("class", "chart")
					.attr("width", (w * 60) + 10)
					.attr("height", h );

				var toolTip = d3.select("#bodyWrapper").append("div")
					.attr("class", "tooltip")
	    			.style("opacity", 1e-6);

				scope.$watch('chartData', function (newData) {
					console.log('INSIDE WATCH');
					controller.updateChart(svg, toolTip, newData);
				});



				//controller.updateChart(svg);
	  		}
	  	}
  	}
);