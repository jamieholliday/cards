'use strict';

angular.module('cards', ['ui.router', 'firebase'])
.constant('FIREBASE_URL', 'https://popping-inferno-5313.firebaseio.com')
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $provide) {

//	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/new');

	$stateProvider
		.state('newGame', {
			url: '/new',
			templateUrl: 'views/newGame.html',
			controller: 'newGameCtrl as newGame'
		})
        .state('joinGame', {
            url: '/join/:gameId',
            templateUrl: 'views/joinGame.html',
            controller: 'joinGameCtrl as joinGame'
        })
        .state('currentGame', {
            url: '/game/:gameId',
            templateUrl: 'views/currentGame.html',
            controller: 'currentGameCtrl as currentGame'
        })
        
});
