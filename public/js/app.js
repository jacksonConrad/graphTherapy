'use strict';

// Declare app level module which depends on filters, and services

var graphTherapyApp = angular.module('graphTherapyApp', [
	'ngRoute',
	'graphTherapyApp.controllers',
//	'graphTherapyApp.filters'
//	'graphTherapyApp.services',
//	'graphTherapyApp.directives'
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