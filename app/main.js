'use strict';

angular.module('cards', ['ui.router', 'firebase'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide) {

	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/home.html',
			controller: 'homeCtrl as home'
		})
});
