//'use strict';

// Declare app level module which depends on filters, and services

var graphTherapyApp = angular.module('graphTherapyApp', [
	'ngRoute',
	'graphTherapyApp.controllers',
//	'graphTherapyApp.filters'
	'graphTherapyApp.services',
	'graphTherapyApp.directives',
	'ngAnimate'
]).
/**
 * Hooks up the partials to their controllers in controllers.js
 * also directs to correct partial based on url
 */
config(function ($routeProvider, $locationProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'partials/graph1.html',
			controller: 'tweetsCtrl'
		}).
			otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});

/* Controllers ------------------------------------------------------------------------------------------------------------------------------------------------*/

angular.module('graphTherapyApp.controllers', []).
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location, tweetService, socketService, d3Service) {
		$scope.tweets = tweetService.query();
		/*
		$http.get('/api/getlast/500').success(function(data) {
			$scope.tweets = data;
		});
		*/
	
		socketService.on('tweet', function(latestTweet) {
			console.dir(latestTweet);
			$scope.tweets.pop();
			$scope.tweets.unshift(latestTweet);
			console.dir('TWEETS ARRAY IS THIS LONG:\n' + $scope.tweets.length + '\n');
		});

		socketService.on('minutesBin', function (minutesBin) {
			$scope.data = minutesBin;
			console.dir('Got minutesBin!');
			console.dir(minutesBin);
		});



	}).
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});

/* Filters ---------------------------------------------------------------------------------------------------------------------------------------------------*/

//This sexy beast lets me use the momentjs library as a filter
angular.module('graphTherapyApp').
  filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });

/* Services --------------------------------------------------------------------------------------------------------------------------------------------------*/
 // Angular service module for connecting to JSON APIs
angular.module('graphTherapyApp.services', ['ngResource']).
	factory('tweetService', function($resource) {
		return $resource('/api/getlast/:number', {}, {
			// Use this method for getting a list of tweets
			
			query: { method: 'GET', params: { number: '20' }, isArray: true }
		})
	}).
	factory('socketService', function($rootScope) {
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
	      socket.on(eventName, function () {  
	        var args = arguments;
	        $rootScope.$apply(function () {
	          callback.apply(socket, args);
	        });
	      });
	    },
	    emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
		};
	// Service to load the d3 library onto the page without having it in index.html directly
	}).factory('d3Service', ['$document', '$q', '$rootScope',
	    function($document, $q, $rootScope) {
			var d = $q.defer();
			function onScriptLoad() {
			// Load client in the browser
			$rootScope.$apply(function() { d.resolve(window.d3); });
			}
			// Create a script tag with d3 as the source
			// and call our onScriptLoad callback when it
			// has been loaded
			var scriptTag = $document[0].createElement('script');
			scriptTag.type = 'text/javascript'; 
			scriptTag.async = true;
			scriptTag.src = 'http://d3js.org/d3.v3.min.js';
			scriptTag.onreadystatechange = function () {
			if (this.readyState == 'complete') onScriptLoad();
			}
			scriptTag.onload = onScriptLoad;

			var s = $document[0].getElementsByTagName('body')[0];
			s.appendChild(scriptTag);
			
			console.log('D3 LOADED!');

			return {
			d3: function() { return d.promise; }
			};
		}
	]);

/* Directives -----------------------------------------------------------------------------------------------------------------------------------------------*/
// Angular Directives
angular.module('graphTherapyApp.directives', [])
    .directive('d3Bars', function (d3Service, socketService) {
    
    return function (scope, element, attrs) {
			d3Service.d3()
			.then(function (d3) {

			/*socketService.on('minutesBin', function (minutesBin) {
				$scope.data = minutesBin;
				console.dir('Got minutesBin!');
				console.dir(minutesBin);
			});*/

			////////////////////
			// Static Code //
			////////////////////
				

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

				console.log("From Dir");
				console.dir(scope.data);

				// Browser onresize event
				window.onresize = function() {
					scope.$apply();
				};
			
				// watch for data changes and re-render
				scope.$watch('data', function(newVals, oldVals) {
				  return scope.render(newVals);
				}, true);
			

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
  	}
);