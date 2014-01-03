'use strict';


/* Controllers */

angular.module('graphTherapyApp.controllers', []).
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location) {

	    $scope.tweets = [];

	    $scope.loadTweets = function() {
	        var httpRequest = $http({
	            method: 'GET',
	            url: '/api/getTweets'

	        }).success(function(data, status) {
	            $scope.tweets = data;
	        });
	    };
	}).
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});