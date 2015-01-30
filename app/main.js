'use strict';

angular.module('cards', ['ui.router', 'firebase', 'LocalStorageModule'])
.constant('FIREBASE_URL', 'https://popping-inferno-5313.firebaseio.com')
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide, localStorageServiceProvider) {

//	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/new');
    
    //where to store player ids
    localStorageServiceProvider.setStorageType('sessionStorage');

	$stateProvider
		.state('newGame', {
			url: '/new',
			templateUrl: 'views/newGame.html',
			controller: 'newGameCtrl as newGame'
		})
        .state('currentGame', {
            url: '/game/:gameId',
            templateUrl: 'views/currentGame.html',
            controller: 'currentGameCtrl as currentGame'
        });
        
});
