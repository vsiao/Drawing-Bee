'use strict';

function UsernameForm($scope) {
  $scope.setUsername = function() {
    __session.userName = $scope.username;
    __session.initialize();
  }

  $scope.showUsernameForm = function() {
    return __session.userName == null;
  }
};
