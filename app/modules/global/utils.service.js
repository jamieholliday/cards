(function(){
	'use strict';
	angular.module('cards')
	.factory('utilsService', function() {

		var getRandomNumberBetween;

		getRandomNumberBetween = function getRandomNumberBetween(start, end) {
			return Math.floor(Math.random() * end) + start;
		};

		return {
			getRandomNumberBetween: getRandomNumberBetween
		};
	});
})();