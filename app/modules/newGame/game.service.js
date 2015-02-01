;(function() {
	'use strict';
	angular.module('cards')
	.factory('gameService', registerGame);

	function registerGame($firebase, FIREBASE_URL, localStorageService, guidService, $q) {

			var createNewGame,
				createNewPlayer,
				getGame,
				getUser,
				getGameRef,
				startGame,
				_createGame,
				_createPlayer,
				_assignPlayerToGame,
				_assignQuestionsAndAnswers,
				_assignQuestionsToGame,
				_assignAnsersToPlayers,
				ref = new Firebase(FIREBASE_URL);

		/**
		 * Sets up a new game. 		Sets objects in Firebase and configs player in LocalStorage. Called when a new game is created
		 * @param  {String} name 	Name of the player from form
		 * @return {Promise}      	The result of setting up the game
		 */
		createNewGame = function createNewGame(name) {
			var gameGuid = guidService.create();
			var playerGuid = guidService.create();

			//TODO add a check in here to clear out old games from Firebase

			return _createGame(gameGuid)
			.then(function() {
				return _createPlayer(name, playerGuid, gameGuid, true);
			})
			.then(function(player) {
				localStorageService.set('playerId', playerGuid);
				return gameGuid;
			});
		};

		/**
		 * Creates a new player in Firebase and config in LocalStore. Called when a player is added to an existing game
		 * @param  {String} name     	Name of player from form
		 * @param  {Number} gameGuid 	Unique identifier of game
		 * @return {Promise}          Result of setting user in system
		 */
		createNewPlayer = function createNewPlayer(name, gameGuid) {
			var playerGuid = guidService.create();
			return _createPlayer(name, playerGuid, gameGuid)
			.then(function() {
				localStorageService.set('playerId', playerGuid);
				return true;
			});
		};

		/**
		 * Returns game object based on guid
		 * @param  {Number} gameId Unique identifier of game
		 * @return {Promise} Game object
		 */
		getGame = function getGame (gameId) {
			return $firebase(ref.child('/games/' + gameId))
            .$asObject();
		};

		/**
		 * Returns user object based on game id and current user in id in LocalStorage
		 * @param  {Firebase Obj} Firefbase game object
		 * @return {Boolean}      If this player is in game
		 */
		getUser = function getUser (game) {
			var playerId = localStorageService.get('playerId');
            if(game && playerId && game.players[playerId]) {
                return game.players[playerId];
            } 
            return {};	
		};

		/**
		 * Gets the game started. Should only get called once on start button click from leader scree
		 * @param  {Firebase Object} game The firebase game object for this game
		 */
		startGame = function startGame (game) {
			game.started = true;
			game.$save().then(function() {
				return _assignQuestionsAndAnswers(game);
			});
		};

		/**
		 * Returns a reference to the Firebase game
		 * @param  {Number} gameId Unique identifier of a game
		 */
		getGameRef = function getGameRef(gameId) {
			return ref.child('/games/' + gameId);
		};

		_assignQuestionsAndAnswers = function assignQuestionsAndAnswers (game) {
			return _assignQuestionsToGame(game)
			.then(function() {
				return _assignAnsersToPlayers(game);
			});

		};

		_assignQuestionsToGame = function assignQuestionsToGame(game) {
			var deffered = $q.defer();
			ref.child('questions').once('value', function(snap) {
				game.questions = snap.val();
				game.$save()
				.then(function() {
					deffered.resolve();
				});
			});
			return deffered.promise;
		};


		_assignAnsersToPlayers = function assignAnsersToUsers (game) {
			ref.child('answers').once('value', function(snap) {
				var answers = Object.keys(snap.val());
				game.players.forEach(function() {
					//loop through all the players and randomly assign them an equal number of answers
				});
				return game.$save();
			});
		};

		/**
		 * Creates a new game object in Firebase
		 * @param  {Number} guid Unique game identifier
		 * @return {Promise}      Result of creating the game
		 */
		_createGame = function createGame(guid) {
			var sync = $firebase(ref.child('/games/' + guid));
		    return sync.$set({
		        createdAt: new Date().toString()
		    });
		};
		
		/**
		 * Creates a new player object in Firebase
		 * @param  {String}  name       Name of player from form
		 * @param  {Number}  playerGuid Unique identifier of player
		 * @param  {Number}  gameGuid   Unique identifier of game
		 * @param  {Boolean} isLeader   Set to true is this player is first in th egame
		 * @return {Promise}            Result of setting player in Firebase
		 */
		_createPlayer = function createPlayer(name, playerGuid, gameGuid, isLeader) {   
		 	var sync = $firebase(ref.child('/games/' + gameGuid).child('/players/' + playerGuid)),
		 		isCurrent;

			isLeader = isLeader || false;
			isCurrent = isLeader;

			return sync.$set({
		        name: name,
		        score: 0,
		        isCurrent: isCurrent,
		        isLeader: isLeader
			});

		};

		return {
			createNewGame: createNewGame,
			createNewPlayer: createNewPlayer,
			getGame: getGame,
			getUser: getUser,
			startGame: startGame,
			getGameRef: getGameRef
		};
	}

})();
