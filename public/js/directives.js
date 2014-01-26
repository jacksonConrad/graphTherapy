/* Directives -----------------------------------------------------------------------------------------------------------------------------------------------*/
// Angular Directives
angular.module('graphTherapyApp.directives', [])
    .directive('d3Bars', function (d3Service, socketService) {

	    // Constants
		var w = 15,
		h = 266;
		console.log('OUTSIDE RETURN');

	    
	    return {
	    	restrict: 'EA',
	    	terminal: true,
	    	scope: {
	    		// Bi-directional databinding
	    		chartData: '='
	    	},
	    	link: function (scope, element, attrs) {
				d3Service.d3()
				.then(function (d3) {
					console.log('INSIDE LINK FUNCTION');
					//console.dir(scope.chartData);



					var x = d3.scale.linear()
						.domain([0,1])
						.range([0,w]);

					var y = d3.scale.linear()
						.domain([0,100])
						.rangeRound([0,h]);

					// Setup initial svg object
					var svg = d3.select("#bodyWrapper").append("svg")
						.attr("class", "chart")
						// Because 60 bars`1
						.attr("width", w * 60)
						.attr("height", h);


				
					// watch for data changes and re-render	
					scope.$watch('chartData', function (newVals, oldVals) {
						// remove all previous items before render
	    				svg.selectAll('*').remove();
	    				console.log('INSIDE WATCH!!!');
	    				console.dir(newVals);
	    				console.dir(oldVals);

	    				// If we don't pass any data, return out of the element
	    				if (!newVals) return;

	    				

	    				svg.selectAll("rect")
						    .data(newVals)
						    .enter().append("rect")
						    .attr("x", function(d, i) { return x(i) - .5; })
						    .attr("y", function(d) { return h - y(d.value) - .5; })
						    .attr("width", w)
						    .attr("height", function(d) { return y(d.value); });

						svg.append("line")
						    .attr("x1", 0)
						    .attr("x2", w * newVals.length)
						    .attr("y1", h - .5)
						    .attr("y2", h - .5)
						    .style("stroke", "#000");


						var rect = svg.selectAll("rect")
							.data(newVals, function(d) { return d.time; });

						rect.enter().insert("rect", "line")
							.attr("x", function(d, i) { return x(i + 1) - .5; })
							.attr("y", function(d) { return h - y(d.value) - .5; })
							.attr("width", w)
							.attr("height", function(d) { return y(d.value); })
							.transition()
							.duration(1000)
							.attr("x", function(d, i) { return x(i) - .5; });

						rect.transition()
							.duration(1000)
							.attr("x", function(d, i) { return x(i) - .5; });

						rect.exit().transition()
							.duration(1000)
							.attr("x", function(d, i) { return x(i - 1) - .5; })
							.remove();
					});

		        });
	  		}
	  	}
  	}
);