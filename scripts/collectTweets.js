var app = angular.module('graphTherapyApp', []);

function tweetsCtrl($scope, $http) {

    $scope.tweets = [];

    $scope.loadTweets = function() {
        var httpRequest = $http({
            method: 'GET',
            url: '/imafuckingurlbro'

        }).success(function(data, status) {
            $scope.tweets = data;
        });

    };

}