(function(){
	'use strict';

	angular.module('cards')
	.factory('playService', playService);

	function playService() {

		var askQuestion;

		askQuestion = function askQuestion (game) {
			
		};
		
		return {
			askQuestion: askQuestion
		};
	}

})();