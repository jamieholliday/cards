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

		createNewGame = function createNewGame(name) {
			var gameGuid = guidService.create();
			var playerGuid = guidService.create();

			return _createGame(gameGuid)
			.then(function() {
				return _createPlayer(name, playerGuid, gameGuid);
			})
			.then(function() {
				return _assignPlayerToGame(gameGuid, playerGuid);
			})
			.then(function() {
				localStorageService.set('playerId', playerGuid);
				return gameGuid;
			});
		};

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

		getUser = function getUser (game) {
			var playerId = localStorageService.get('playerId');
            if(game && playerId && game.players[playerId]) {
                return false;
            } 
            return true;	
		};

		_createGame = function createGame(guid) {
			//var ref = new Firebase(FIREBASE_URL + '/games/' + guid);
			var sync = $firebase(ref.child('/games/' + guid));
		    return sync.$set({
		        createdAt: new Date().toString()
		    });
		};
		
		_createPlayer = function createPlayer(name, playerGuid, gameGuid) {
			var ref = new Firebase(FIREBASE_URL + '/players/' + playerGuid);    
		    return $firebase(ref).$set(
		        {
		            gameId: gameGuid,
		            name: name,
		            score: 0,
		            isCurrent: false
		        }
		    );
		} ;
		
		_assignPlayerToGame = function assignPlayerToGame(gameGuid, playerGuid) {
			var ref = new Firebase(FIREBASE_URL + '/games/' + gameGuid).child('/players/' + playerGuid);    
		    return $firebase(ref).$set({
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
