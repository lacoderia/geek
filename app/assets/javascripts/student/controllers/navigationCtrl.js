'use strict';

Geek.controller('NavigationController', ["$scope", "$rootScope", "DEFAULT_VALUES", function($scope, $rootScope, DEFAULT_VALUES){

    $scope.selectedTab = 'signUp';

    $scope.$on('showSigInModal', function(){
       $scope.showSignInModal('signUp');
    });

    //Function that opens the landing modal with the sign in tab selected
    $scope.showSignInModal = function(selectedTab) {
        $scope.selectTab(selectedTab);
        $('#sign-in-modal').modal('show');
    }

    //Function that selects the sign in modal tab
    $scope.selectTab = function(selectedTab) {
        $scope.selectedTab = selectedTab;
    }

    // Función que envía la forma de registro del estudiante después de validarla
    $scope.submitStudentForm = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.signUpForm);

        if ($scope.signUpForm.$valid) {
            $("#student-form").submit();
        }
    }

    // Función que envía la forma de registro del estudiante después de validarla
    $scope.loginStudent = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.studentLoginForm);

        if ($scope.studentLoginForm.$valid) {
            $("#student-login-form").submit();
        }
    }

    $scope.registerFacebook = function(){
        window.location = "users/auth/facebook";
    };

    $scope.$on("rootControllerReady", function() {
        $scope.userData = false;
	    $scope.roleIds = 3;

        if ($("#user-data").data()){
            $scope.userData = true;
            $scope.showSignInModal('signUp'); 
	        $scope.signUpName = $('#user-data').data('first-name');
	        $scope.signUpMail = $('#user-data').data('email');
	        $scope.signUpUID = $('#user-data').data('uid');
	        $scope.signUpLastName = $('#user-data').data('last-name');
	        $scope.signUpToken = $('#user-data').data('token');
	        $scope.signUpRefreshToken = $('#user-data').data('refresh-token');
	    }

        if ($("#login-data").data()) {
            $scope.showSignInModal('signIn'); 
            $scope.loginError = $("#login-data").data('error');
        }
    });
}]);
