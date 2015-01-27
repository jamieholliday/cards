angular.module('cards')
.controller('newGameCtrl', function($firebase, FIREBASE_URL, $stateParams, $state, localStorageService, guidService) {
    'use strict';
    var newGame = this,
        ref = new Firebase(FIREBASE_URL);
    
    var createGame = function(guid) {
        ref.child('/games/' + guid).set({
            createdAt: new Date().toString()
        });
    }
    
    var createPlayer = function(name, playerGuid, gameGuid) {       
        ref.child('/players/' + playerGuid).set(
            {
                gameId: gameGuid,
                name: name,
                score: 0,
                isCurrent: false
            }
        );
    } 
    
    var assignPlayerToGame = function(gameGuid, playerGuid) {
        ref.child('/games/' + gameGuid + '/players').set({playerId: playerGuid});
    }
    
    //events
    newGame.createNewGame = function(vaild) {
        //creates a new game and adds the player to it
        if(vaild) {
            var gameGuid = guidService.create();
            var playerGuid = guidService.create();
            createGame(gameGuid);
            createPlayer(newGame.player.name, playerGuid, gameGuid);
            assignPlayerToGame(gameGuid, playerGuid);
            
            localStorageService.set('playerId', playerGuid);
            
            $state.go('currentGame', {gameId: gameGuid});
        }
    }
    
    
});