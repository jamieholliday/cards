;(function() {
    'use strict';

    angular.module('cards')
    .controller('currentGameCtrl', currentGame);

    function currentGame($stateParams, $state, gameService, playService) {
        var vm = this,
            gameId = $stateParams.gameId,
            gotoNewGame,
            checkForGames,
            checkforUser,
            setupGameChangeListener,
            handlerGameChangeEvent;

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

        vm.joinGame = function joinGame(valid) {
            if(valid) {
                gameService.createNewPlayer(vm.player.name, gameId)
                .then(function() {
                    checkForGames();
                }); 
            }
        };

        vm.startGame = function() {
            gameService.startGame(vm.game)
            .then(function() {
            //$state.go('currentGame.play');
            playService.askQuestion();
            });
        };



        gotoNewGame = function gotoNewGame() {
            $state.go('newGame');
        };
        
        checkForGames = function checkForGames(gameId) {
            vm.game
            .$loaded()
            .then(function(currentGame) {
                if(currentGame.createdAt) {
                    var user = gameService.getUser(currentGame);
                    if(user && user.name) {
                        vm.isLeader = user.isLeader;
                        vm.isCurrent = user.isCurrent;
                        if(currentGame.started) {
                            $state.go('currentGame.play');
                        } else {
                            if(!vm.isLeader) {
                                setupGameChangeListener($stateParams.gameId);
                            }
                            $state.go('currentGame.start');
                        }
                    } else {
                        $state.go('currentGame.join');
                    }
                } else {
                    gotoNewGame();
                }
            });    
        };

        setupGameChangeListener = function setupGameChangeListener (gameId) {
            //not 100% sure if there is a better method for achieving this
            gameService.getGameRef(gameId).on('value', handlerGameChangeEvent);
        };

        handlerGameChangeEvent = function handlerGameChangeEvent (snap) {  
            console.log(snap.val()); 
            if(snap.val().started === true) {
                gameService.getGameRef(gameId).off('value', handlerGameChangeEvent);
                $state.go('currentGame.play');
            }
        };
        
        //perform some checks
        checkForGames(gameId); 
    }
    
})();
