'use strict';

function UsernameForm($scope) {
  $scope.setUsername = function() {
    __session.username = $scope.username;
  }

  $scope.showUsernameForm = function() {
    return (typeof __session.username == "undefined");
  }
};
