angular.module('cards')
.controller('newGameCtrl', function($firebase, FIREBASE_URL, $stateParams, $state) {
    'use strict';
    var newGame = this,
        ref = new Firebase(FIREBASE_URL),
        sync;
    
    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    
    var guid = function() {
        return s4() + s4() + s4();
    }
    
    var createGame = function(guid) {
        var game = ref.child('/games').push({
            createdAt: new Date().toString(),
            guid: guid
        });
        return game;
    }
    
    var createPlayer = function(name, gameId) {
        var player = ref.child('/players').push(
            {
                gameId: gameId,
                name: name,
                score: 0,
                isCurrent: false
            }
        );
        return player;
    } 
    
    var assignPlayerToGame = function(game, playerId) {
        game.child('/players').set({playerId: playerId});
    }
    
    
    //create AngularFire reference to the data
    sync = $firebase(ref);
    
    //events
    newGame.createNewGame = function(vaild) {
        //creates a new game and adds the player to it
        if(vaild) {
            var gameGuid = guid();
            var game = createGame(gameGuid);
            var player = createPlayer(newGame.player.name, game.toString());
            assignPlayerToGame(game, player.toString());  
        }
    }
    
    
});