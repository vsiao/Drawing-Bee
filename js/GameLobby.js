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

  $scope.showUsernameForm = false;

  $scope.setUsername = function() {
    __session.setUserName($scope.username);
    __session.initialize();
  }

};
