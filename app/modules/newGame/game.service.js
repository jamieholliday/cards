;(function() {
	'use strict';
	angular.module('cards')
	.factory('gameService', registerGame);

	function registerGame($firebase, FIREBASE_URL, localStorageService, guidService) {

			var createNewGame,
				createNewPlayer,
				getGame,
				getUser,
				getLocalPlayer,
				setLocalPlayer,
				_createGame,
				_createPlayer,
				_assignPlayerToGame,
				ref = new Firebase(FIREBASE_URL);

		/**
		 * Sets up a new game. 		Sets objects in Firebase and configs player in LocalStorage. Called when a new game is created
		 * @param  {String} name 	Name of the player from form
		 * @return {Promise}      	The result of setting up the game
		 */
		createNewGame = function createNewGame(name) {
			var gameGuid = guidService.create();
			var playerGuid = guidService.create();

			return _createGame(gameGuid)
			.then(function() {
				return _createPlayer(name, playerGuid, gameGuid, true);
			})
			.then(function() {
				return _assignPlayerToGame(gameGuid, playerGuid);
			})
			.then(function() {
				localStorageService.set('playerId', playerGuid);
				return gameGuid;
			});
		};

		/**
		 * Creates anew player in Firebase and config in LocalStore. Called when a player is added to an existing game
		 * @param  {String} name     	Name of player from form
		 * @param  {Number} gameGuid 	Unique identifier of game
		 * @return {Promise}          Result of setting user in system
		 */
		createNewPlayer = function createNewPlayer(name, gameGuid) {
			var playerGuid = guidService.create();
			return _createPlayer(name, playerGuid, gameGuid)
			.then(function() {
				return _assignPlayerToGame(gameGuid, playerGuid);
			})
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

			return $firebase(ref.child('/games/'))
            .$asObject()
            .$loaded()
            .then(function(games) {
                if(games[gameId]) {
                    return games[gameId];
                    vm.newUser = checkforUser(currentGame);
                } else {
                   return false;
                }
            });
		};

		/**
		 * Returns user object based on game id and current user in id in LocalStorage
		 * @param  {Number} game Unique game identifier
		 * @return {Boolean}      If this player is in game
		 */
		getUser = function getUser (game) {
			var playerId = localStorageService.get('playerId');
            if(game && playerId && game.players[playerId]) {
                return false;
            } 
            return true;	
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
			var sync = $firebase(ref.child('/players/' + playerGuid)),
				isCurrent;

			isLeader = isLeader || false;
			isCurrent = isLeader;

		    return sync.$set(
		        {
		            gameId: gameGuid,
		            name: name,
		            score: 0,
		            isCurrent: false,
		            isLeader: isLeader
		        }
		    );
		} ;
		
		/**
		 * Assigns player to a game
		 * @param  {Number} gameGuid   Unique game identifier
		 * @param  {Number} playerGuid Unique player identifier
		 * @return {Promise}            Result of adding plyer to game
		 */	
		_assignPlayerToGame = function assignPlayerToGame(gameGuid, playerGuid) {   
			var sync = $firebase(ref.child('/games/' + gameGuid).child('/players/' + playerGuid)); 
		    return sync.$set({
		        createdAt: new Date().toString()
		    });
		};

		return {
			createNewGame: createNewGame,
			createNewPlayer: createNewPlayer,
			getGame: getGame,
			getUser: getUser
		};
	}

})();
