;(function(){
    'use strict';
    angular.module('cards')
    .controller('newGameCtrl', newGame);

    function newGame($stateParams, $state, gameService) {

        var vm = this;

        vm.createNewGame = function(vaild) {
            if(vaild) {
                gameService.createNewGame(vm.player.name)
                .then(function(gameGuid) {
                    $state.go('currentGame.start', {gameId: gameGuid});
                });  
            }
        };   
        
    }
})();