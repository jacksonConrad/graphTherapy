/* Directives -----------------------------------------------------------------------------------------------------------------------------------------------*/
// Angular Directives
angular.module('graphTherapyApp.directives', [])
    .directive('d3Bars', function () {

	    // Constants (dimensions of the chart)
		var w = 15,
		h = 220;

	    return {
	    	// restrict this directive to be an element only,
	    	// i.e. it has this form in the html:  <my-directive .... ></my-directive>
	    	restrict: 'E',
	    	replace: false,
	    	scope: {
	    		// Bi-directional databinding
	    		chartData: '=chartData'
	    	},

	    	// Controller shared with all instantiated directives
	    	controller: ['$scope', function ($scope, chartData) {

	    		/**
	    		 * Function  is called each time the client recieves new data.
	    		 * It simply rerenders the chart with the new data.
	    		 * @param  {D3 svg object} svg     svg
	    		 * @param  {D3 object} toolTip - small window that appears when you mouse over a data bar
	    		 * @param  {Array} data    : Array of objects with 'value' and 'date' parameters
	    		 * @return {void}
	    		 */
	    		var updateChart = function (svg, toolTip, data) {
						var chartData = $scope.chartData;
						console.log('new Data: ');
						console.log(chartData);

						// Scale the x axis with respect to the number of data points
						var x = d3.scale.linear()
							.domain([0,1])
							.range([0,(900/chartData.length)]);
					
						// Scale the y axis with respect to the largest value in the data set
						var y = d3.scale.linear()
							.domain([0,d3.max(chartData, function (d) { return d.value })])
							.rangeRound([0,h]);

						// remove all previous svg items before render
	    				svg.selectAll('*').remove();

	    				// If we don't pass any data, return out of the element
	    				if (!chartData) return;

	    				// append a data bar to the chart for each element in the data array
						svg.selectAll("rect")
						    .data(chartData)
						    .enter()
						    .append("rect")
						    	.attr("x", function (d, i) { return x(i) - .5; })
						    	.attr("y", function (d) { return h - y(d.value) - .5; })
						    	// width of bar is dependent on which data set we are using
						    	// since they are different sizes
						    	.attr("width", 900/chartData.length)
						    	.attr("height", function (d) { return y(d.value); })
						    	// set listeners for the tooltip
						    	.on("mouseover", mouseover)
							    .on("mousemove", mousemove)
							    .on("mouseout", mouseout);

						// display the text value on each bar
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

						// add the x-axis
						svg.append("line")
						    .attr("x1", 0)
						    .attr("x2", 900)
						    .attr("y1", h - .5)
						    .attr("y2", h - .5)
						    .style("stroke", "#FFF");


						var rect = svg.selectAll("rect")
							.data(chartData, function (d) { return d.time; });

						rect.enter().insert("rect", "line")
							.attr("x", function (d, i) { return x(i - 1) - .5; })
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
	    			// expose this function to our application
	    			// ***** does this only expose it to link?
	    			updateChart: updateChart
	    		};
	    	}],
	    	// the link function essentially initializes our directive
	    	link: function (scope, element, attrs, controller) {
	    		
	    		// Setup initial svg object
				var svg = d3.select("#bodyWrapper").append("svg")
					.attr("class", "chart")
					.attr("width", (w * 60) + 10)
					.attr("height", h );

				// Setup the tooltip object, which appears when you hover
				// over a data bar
				var toolTip = d3.select("#bodyWrapper").append("div")
					.attr("class", "tooltip")
	    			.style("opacity", 1e-6);

	    		// Re-render the chart when the data changes.
	    		// Data will change on an interval, or when the user
	    		// selects a different time interval option
				scope.$watch('chartData', function (newData) {
					console.log('INSIDE WATCH');
					controller.updateChart(svg, toolTip, newData);
				});
	  		}
	  	}
  	}
);