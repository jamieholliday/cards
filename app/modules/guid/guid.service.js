angular.module('cards')
.factory('guidService', function() {
    'use strict';
    
    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    
    var create = function() {
        return s4() + s4() + s4();
    }
    
    return {
        create: create
    }
})