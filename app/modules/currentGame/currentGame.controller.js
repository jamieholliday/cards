angular.module('cards')
.controller('currentGameCtrl', function($firebase, FIREBASE_URL, $stateParams, $state, localStorageService) {
    'use strict'
    var ref = new Firebase(FIREBASE_URL);
    
    var gameId = $stateParams.gameId;
    
    var gotoNewGame = function() {
        $state.go('newGame');
    };
    
    var checkForGames = function() {
        //if there is no game id in url then goto create new game page
        if(!gameId) {
            gotoNewGame();
            return false;
        }
        
        var games = $firebase(ref.child('/games/')).$asObject();
        games.$loaded()
        .then(function(games) {
            if(games[gameId]) {
                return games[gameId];
            } else {
                return new Error('no game') //this is not working!!!!
            }
        })
        .then(function(gameId) {
            console.log(gameId)
        })
        .catch(function(err) {
            gotoNewGame();
        })
        
        
//        angularFire(ref.child('/games/' + gameId)).then(function(game) {
//            console.log(game);
//        },
//        function() {
//           console.log('error') 
//        });

//        if(gameId) {
//            ref.child('/games/' + gameId).once('value', function(snapshot) {
//               if(snapshot.val() !== null) {
//                   return snapshot;
//               } else {
//                   //if game doesn't exist
//                   gotoNewGame();
//                   return false;
//               }
//            });
//
//        }
    }
    
    
    //perform some checks
    checkForGames();
    

    
});