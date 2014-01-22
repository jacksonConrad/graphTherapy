// directives.js
//'use strict';

// Angular Directives
angular.module('graphTherapyApp.directives', [])
    .directive('d3Bars', function (d3Service) {
    
    return {
		restrict: 'EA',
		scope: {},
		link: function (scope, element, attrs) {
			d3Service.d3().then(function (d3) {

			////////////////////
			// Static Code //
			////////////////////

				var t = 1297110663; // start time (seconds since epoch)
			    v = 70; // start value (subscribers)
			    scope.data = d3.range(60).map(next); // starting dataset

				function next() {
				    return {
				     	time: ++t,
				     	value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
					};
				}
				
				setInterval (function() {
					scope.data.shift();
					scope.data.push(next());
					scope.render(scope.data);
				},  1500);
				

				var w = 15,
					h = 266;

				var x = d3.scale.linear()
					.domain([0,1])
					.range([0,w]);

				var y = d3.scale.linear()
					.domain([0,100])
					.rangeRound([0,h]);

				var svg = d3.select("#bodyWrapper").append("svg")
					.attr("class", "chart")
					.attr("width", w * scope.data.length)
					.attr("height", h);



				/*
				var svg = d3.select(element[0])
				.append('svg')
				.attr("class", "chart")
				//.attr("width", w * data.length)
				//.attr("height", h);
				.style('width', '100%');
				*/

				// Browser onresize event
				window.onresize = function() {
					scope.$apply();
				};


				// Watch for resize event
				/*
				scope.$watch(function() {
					return angular.element($window)[0].innerWidth;
				}, function() {
					scope.render(scope.data);
				});
				*/

				scope.render = function(data) {
					// our custom d3 code
					
					///////////////////////
					// Dynamic Code //
					///////////////////////
					
					// remove all previous items before render
    				svg.selectAll('*').remove();

    				// If we don't pass any data, return out of the element
    				if (!data) return;

    				svg.selectAll("rect")
					    .data(data)
					    .enter().append("rect")
					    .attr("x", function(d, i) { return x(i) - .5; })
					    .attr("y", function(d) { return h - y(d.value) - .5; })
					    .attr("width", w)
					    .attr("height", function(d) { return y(d.value); });

					svg.append("line")
					    .attr("x1", 0)
					    .attr("x2", w * data.length)
					    .attr("y1", h - .5)
					    .attr("y2", h - .5)
					    .style("stroke", "#000");


					var rect = svg.selectAll("rect")
						.data(data, function(d) { return d.time; });

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
				}
			// render the graph when the page loads
			scope.render(scope.data);	
	        });

  		}
  	};
});