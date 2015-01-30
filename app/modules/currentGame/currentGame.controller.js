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

        vm.joinGame = function joinGame(valid) {
            console.log('join');
            if(valid) {
                gameService.createNewPlayer(vm.player.name, gameId)
                .then(function() {
                    vm.newUser = false;
                }); 
            }
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

            gameService.getGame(gameId)
            .then(function(currentGame) {
                if(currentGame) {
                    vm.newUser = gameService.getUser(currentGame);
                } else {
                    gotoNewGame();
                    return false;
                }
            });
            
        };

        
        //perform some checks
        checkForGames(gameId); 
    }
    
})();
