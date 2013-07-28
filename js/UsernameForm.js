'use strict';

function UsernameForm($scope) {
  $scope.setUsername = function() {
    window.username = $scope.username;
  }

  $scope.showUsernameForm = function() {
    return (typeof window.username == "undefined");
  }
};
