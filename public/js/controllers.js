/* Controllers ------------------------------------------------------------------------------------------------------------------------------------------------*/

angular.module('graphTherapyApp.controllers', []).
	controller('tweetsCtrl', function ($scope, $http, $rootScope, $location, tweetService, socketService) {
		$scope.tweets = tweetService.query();
		/*
		$scope.mData  = new Array(60);
		$scope.hData  = new Array(24);
		$scope.dData  = new Array(28);*/
		$scope.options = 
			[
				{label: 'minutes', max: '59', data: new Array(60)},
				{label: 'hours', max: '23',  data: new Array(24)},
				{label: 'days', max: '24',   data: new Array(28)}
			];
		$scope.selection = $scope.options[0];

		//$scope.options = ['minutes', 'hours', 'days'];
		//$scope.selection = $scope.options[0];
		
		// When someone tweets, update table	
		socketService.on('tweet', function(latestTweet) {
			console.dir(latestTweet);
			$scope.tweets.pop();
			$scope.tweets.unshift(latestTweet);
			//console.dir('TWEETS ARRAY IS THIS LONG:\n' + $scope.tweets.length + '\n');
		});

		// Every minute, update the data
		socketService.on('minutesBin', function (minutesBin) {
			$scope.options[0].data = minutesBin.reverse();
			console.dir('Got minutesBin!');
			console.dir($scope.options[0].data);
			// render the graph when the data loads
			//$scope.render($scope.data);	
		});

		// Every hour, update the data
		socketService.on('hoursBin', function (hoursBin) {
			$scope.options[1].data = hoursBin.reverse();
			console.dir('Got hoursBin!');
			console.dir($scope.options[1].data);
			// render the graph when the data loads
			//$scope.render($scope.data);	
		});

		// Every day, update the data
		socketService.on('daysBin', function (daysBin) {
			$scope.options[2].data = daysBin;
			console.dir('Got daysBin!');
			console.dir($scope.options[2].data);
			// render the graph when the data loads
			//$scope.render($scope.data);	
		});

	}).
	controller('graph_A_Ctrl', function ($scope, $http) {
	// write Ctrl here


	});

