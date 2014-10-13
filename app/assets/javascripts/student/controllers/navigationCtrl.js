'use strict';

Geek.controller('NavigationController', function($scope, $rootScope, DEFAULT_VALUES){

    $scope.selectedTab = 'signUp';

    //Function that opens the landing modal with the sign in tab selected
    $scope.showSignInModal = function(selectedTab) {
        $scope.selectTab(selectedTab);
        $('#sign-in-modal').modal('show');
    }

    //Function that selects the sign in modal tab
    $scope.selectTab = function(selectedTab) {
        $scope.selectedTab = selectedTab;
    }
});

