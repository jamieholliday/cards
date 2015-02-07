//Note this service is for internal game logic only
;(function(){
	'use strict';

	angular.module('cards')
	.factory('playService', playService);

	function playService(_, utilsService) {

		var askQuestion,
			selectAnswer,
			selectWinningAnswer,
			_getNextPlayer;

		askQuestion = function askQuestion (game) {
			var questions = game.questions,
				keys = _.keys(questions),
				random = utilsService.getRandomNumberBetween(0, keys.length),
				randomKey = keys[random];

			//assign current 
			_getNextPlayer
			.then(function(){
				game.answersLocked = false;
				game.currentQuestion = game.questions[randomKey];
				//setting to null removes the key:val from the object in Firebase
				game.questions[randomKey] = null;
			});
		};

		_getNextPlayer = function getNextPlayer(game) {
			var currentPlayer = _.chain(game.players)
			.map(function(player) {
				return player.isCurrent;
			})
			.value();

			console.log(currentPlayer);

			return game.$save()
			// var current = _.pick(game.players, function(value, key, object) {
			// 	return 
			// })
		};

		selectAnswer = function selectAnswer(game, player, key) {
			player.selectedAnswer = {
				answerKey: key,
				answerText: game.players[player.id].answers[key]
			};
			return game.$save();
		};

		selectWinningAnswer = function selectWinningAnswer (game, player) {
			game.players[player.id].score += 10;
			game.$save()
			.then(function() {
				askQuestion(game);
			});
		};
		
		return {
			askQuestion: askQuestion,
			selectAnswer: selectAnswer,
			selectWinningAnswer: selectWinningAnswer
		};
	}

})();