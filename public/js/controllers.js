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
			// render the graph when the data loads
			$scope.render($scope.data);	
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