'use strict';


/* Controllers */

angular.module('graphTherapyApp.controllers', []);
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location) {

	    /*$scope.tweets = [];

			$scope.loadTweets = function() {
			//var httpRequest   = 
			$http({
	            method: 'GET',
	            url: '/api/getlast/10'

	        }).success(function (data, status, headers, config) {
	            $scope.tweets = data;
	            console.log(data);
	        }).error(function (data, status, headers, config) {
				console.log('error');
			});;
	    };*/

	    //new method of grabbing - the get looks different but it's just a shorthand of the same thing
	    graphTherapyApp.loadTweets('tweetsGet', function($http) {

	    	var tweets  = {content:null};

	    	$http.get('content.json').success(function(data) {

	    		tweets.content = data;
	    	});

	    	return tweets;
	    });
	});
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});