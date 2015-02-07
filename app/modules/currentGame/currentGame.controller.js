;(function() {
    'use strict';

    angular.module('cards')
    .controller('currentGameCtrl', currentGame);

    function currentGame($stateParams, $state, gameService, playService, _) {
        var vm = this,
            gameId = $stateParams.gameId,
            gotoNewGame,
            checkForGames,
            checkforUser,
            setupGameChangeListener,
            handlerGameChangeEvent,
            selectAnswer,
            checkAnswers;

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
                $state.go('currentGame.play');
                playService.askQuestion(vm.game, gameId);
            });
        };

        vm.selectAnswer = function(key) {
            if(!vm.game.answersLocked) {
                playService.selectAnswer(vm.game, vm.player, key)
                .then(function() {
                    checkAnswers();
                });
            }
        };

        vm.selectWinningAnswer = function(player) {
            playService.selectWinningAnswer(vm.game, player);
        };

        checkAnswers = function checkAnswers () {
            var allAnswerd = true;
            _.each(vm.game.players, function(player) {
                if(!player.isCurrent && typeof(player.selectedAnswer) === undefined) {
                    console.log('false');
                    allAnswerd = false;
                }
            });
            if(allAnswerd) {
                //game is locked when everyone has answered a question
                vm.game.answersLocked = true;
                vm.game.$save();
            }
        };

        gotoNewGame = function gotoNewGame() {
            $state.go('newGame');
        };
        
        checkForGames = function checkForGames(gameId) {
            vm.game
            .$loaded()
            .then(function(currentGame) {
                if(currentGame.createdAt) {
                    vm.playerId = gameService.getPlayerId(currentGame);
                    vm.player = vm.game.players[vm.playerId];
                    if(vm.player && vm.player.name) {
                        if(currentGame.started) {
                            $state.go('currentGame.play');
                        } else {
                            if(!vm.player.isLeader) {
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
            if(snap.val().started === true) {
                gameService.getGameRef(gameId).off('value', handlerGameChangeEvent);
                $state.go('currentGame.play');
            }
        };
        
        //perform some checks
        checkForGames(gameId); 
    }
    
})();
