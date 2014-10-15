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

    $scope.submitTutorForm = function(){
        $("#tutor-form").submit();
    }
    $scope.registerGooglePlus = function(){
        window.location = "users/auth/google_oauth2";
    }

    $(document).ready(function() {    

        $scope.userData = false;
        if ($("#user-data").data()){
            $scope.userData = true;
            $('#sign-in-modal').modal('show');
			$scope.signUpName = $('#user-data').data('first-name');
			$scope.signUpMail = $('#user-data').data('email'); 
			$scope.signUpUID = $('#user-data').data('uid'); 
			$scope.signUpLastName = $('#user-data').data('last-name'); 
			$scope.signUpToken = $('#user-data').data('token'); 
			$scope.signUpRefreshToken = $('#user-data').data('email'); 
			$scope.roleIds = 2; 
		}
    });

});

