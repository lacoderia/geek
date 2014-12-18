'use strict';

Geek.controller('NavigationController', ["$scope", "$rootScope", "DEFAULT_VALUES", function($scope, $rootScope, DEFAULT_VALUES){

    $scope.selectedTab = 'signUp';
 
    // Inicializamos los broadcasts y listeners del controlador
    $scope.$on("rootControllerReady", function() {
        $scope.userData = false;

         //TODO: no dejar pasar al usuario
        if ($("#error-data").data()){
          alert("Usuario bloqueado");
        }


        if ($("#user-data").data()){
            $scope.userData = true;
            $scope.showSignInModal('signUp');
            $scope.signUpName = $('#user-data').data('first-name');
            $scope.signUpMail = $('#user-data').data('email');
            $scope.signUpUID = $('#user-data').data('uid');
            $scope.signUpLastName = $('#user-data').data('last-name');
            $scope.signUpToken = $('#user-data').data('token');
            $scope.signUpRefreshToken = $('#user-data').data('refresh-token');
            $scope.roleIds = 2;
        }
        if ($("#login-data").data()) {
            $scope.showSignInModal('signIn');
            $scope.loginError = $("#login-data").data('error');
        }
    });

    // Function that opens the landing modal with the sign in tab selected
    $scope.showSignInModal = function(selectedTab) {
        $scope.selectTab(selectedTab);
        $('#sign-in-modal').modal('show');
    }

    // Function that selects the sign in modal tab
    $scope.selectTab = function(selectedTab) {
        $scope.selectedTab = selectedTab;
    }

    // Función que envía la forma de registro del tutor después de validarla
    $scope.submitTutorForm = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.signUpForm);

        if ($scope.signUpForm.$valid) {
            $("#tutor-form").submit();
        }
    }

    // Función que envía la forma de registro del tutor después de validarla
    $scope.loginTutor = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.tutorLoginForm);

        if ($scope.tutorLoginForm.$valid) {
            $("#tutor-login-form").submit();
        }
    }

    $scope.registerGooglePlus = function(){
        window.location = "users/auth/google_oauth2";
    };

}]);
