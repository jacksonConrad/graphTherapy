'use strict';

/* Controllers */

angular.module('graphTherapyApp.controllers', []).
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location) {

		$http.get('/api/getlast/20').success(function(data) {
			$scope.tweets = data;
		});
	}).
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});

/* Filters */

//This sexy beast lets me use the momentjs library as a filter
angular.module('graphTherapyApp').
  filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });