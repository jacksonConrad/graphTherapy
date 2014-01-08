'use strict';


/* Controllers */

angular.module('graphTherapyApp.controllers', []).
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
	    
	    	//var tweets  = {content:null};

	    	$http.get('/api/getlast/:number').success(function(data) {
	    		$scope.tweets = data;
	    	});
	}).
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});