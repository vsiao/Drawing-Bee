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
    return __session.userName != null;
  }

  $scope.showUsernameForm = false;

  $scope.setUsername = function() {
    __session.userName = $scope.username;
    __session.initialize();
  }

};
