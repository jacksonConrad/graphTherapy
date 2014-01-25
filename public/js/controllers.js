/* Controllers ------------------------------------------------------------------------------------------------------------------------------------------------*/

angular.module('graphTherapyApp.controllers', []).
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location, tweetService, socketService, d3Service) {
		$scope.tweets = tweetService.query();
		$scope.mData  = new Array(60);
		console.dir('$scope.mData: ' + $scope.mData);

		setTimeout(function () {
			console.log('TIMEOUT');
			console.dir($scope.mData);
		}, 10000)
		
		// When someone tweets, update table	
		socketService.on('tweet', function(latestTweet) {
			console.dir(latestTweet);
			$scope.tweets.pop();
			$scope.tweets.unshift(latestTweet);
			//console.dir('TWEETS ARRAY IS THIS LONG:\n' + $scope.tweets.length + '\n');
		});

		// Every minute, update the data
		socketService.on('minutesBin', function (minutesBin) {
			$scope.mData = minutesBin;
			console.dir('Got minutesBin!');
			console.dir($scope.mData);
			// render the graph when the data loads
			//$scope.render($scope.data);	
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