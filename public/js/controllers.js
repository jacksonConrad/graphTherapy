'use strict';


/* Controllers */

angular.module('graphTherapyApp.controllers', []).
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location) {

	    $scope.tweets = [];

			$scope.loadTweets = function() {
			//var httpRequest   = 
			$http({
	            method: 'GET',
	            url: '/api/getlast/10'

	        }).success(function (data, status) {
	            $scope.tweets = data;
	            console.log(data);
	        }).error(function (data, status, headers, config) {
				console.log('error');
			});;
	    };
	}).
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});