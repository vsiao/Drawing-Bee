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
  $scope.showRoomNameForm = false;

  $scope.setUsername = function() {
    $scope.showUsernameForm = false;
    __session.setUsername($scope.username);
  }

  $scope.setRoom = function() {
    $scope.showRoomNameForm = false;
    __session.setRoomName($scope.roomName);
  }
};
