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
    __session.user_name = $scope.username;
    __session.initialize();
  }

};
