'use strict';

function GameLobby($scope) {
  $scope.rooms = [
    {
      players: ['vs', 'dy']
    }
  , {
      players: ['vs', 'sr']
    }
  , {
      players: ['dh', 'sr']
    }
  ];

  $scope.showLobby = function() {
    return (typeof window.username != "undefined");
  }
};