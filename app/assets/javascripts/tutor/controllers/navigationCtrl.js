'use strict';

Geek.controller('NavigationController', function($scope, $rootScope, DEFAULT_VALUES){

    //Function that opens the landing modal with the sign in tab selected
    $scope.showSignInModal = function() {
        $('#myModal').modal();
    }

    //Function that opens the landing modal with the sign up tab selected
    $scope.showSignUpModal = function() {
        $('#myModal').modal('show');
    }
});

