;(function() {
    'use strict';

    angular.module('cards')
    .controller('currentGameCtrl', currentGame);

    function currentGame($stateParams, $state, gameService) {
        var vm = this,
            gameId = $stateParams.gameId,
            gotoNewGame,
            checkForGames,
            checkforUser;

        vm.newUser = true;
        vm.game = gameService.getGame(gameId);

        vm.getNumPlayers = function getNumPlayers() {
            if(vm.game.players) {
                return Object.keys(vm.game.players).length;
            }
        };

        vm.showStartButton = function showStartButton() {
            
            if(vm.getNumPlayers() > 1) {
                return true;
            } 
            return false;
        };

        vm.isLeader = function isLeader() {
            var user = gameService.getUser(vm.game);
            return user && user.isLeader;
        };

        vm.joinGame = function joinGame(valid) {
            if(valid) {
                gameService.createNewPlayer(vm.player.name, gameId)
                .then(function() {
                    vm.newUser = false;
                }); 
            }
        };

        vm.startGame = function() {
            gameService.startGame(vm.game);
        };

        gotoNewGame = function gotoNewGame() {
            $state.go('newGame');
        };
        
        checkForGames = function checkForGames(gameId) {

            //if there is no game id in url then goto create new game page
            if(!gameId) {
                gotoNewGame();
                return false;
            }

            vm.game
            .$loaded()
            .then(function(currentGame) {
                //if the game does not have a createdAt the it must not exist
                if(currentGame.createdAt) {
                    var user = gameService.getUser(currentGame);
                    if(user && user.name) {
                        vm.newUser = false;
                    } else {
                        vm.newUser = true;
                    }
                } else {
                    console.log('goto new game');
                    gotoNewGame();
                }
            });    
        };
        
        //perform some checks
        checkForGames(gameId); 
    }
    
})();
