'use strict';

Geek.controller('NavigationController', ["$filter", "$scope", "$rootScope", "$timeout", "ForgotService", "DEFAULT_VALUES", "usSpinnerService", function($filter, $scope, $rootScope, $timeout, ForgotService, DEFAULT_VALUES, usSpinnerService){

    $scope.selectedTab = 'signUp';

    $scope.$on('showSignInModal', function(){
       $scope.showSignInModal('signUp');
    });

    //Function that opens the landing modal with the sign in tab selected
    $scope.showSignInModal = function(selectedTab) {
        $scope.selectTab(selectedTab);
        $('#sign-in-modal').modal('show');
    };

    //Function that selects the sign in modal tab
    $scope.selectTab = function(selectedTab) {
        $scope.selectedTab = selectedTab;
    };

    // Función que envía la forma de registro del estudiante después de validarla
    $scope.submitStudentForm = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.signUpForm);

        if ($scope.signUpForm.$valid) {
            $("#student-form").submit();
        }
    };

    // Función que envía la forma de registro del estudiante después de validarla
    $scope.loginStudent = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.studentLoginForm);

        if ($scope.studentLoginForm.$valid) {
            $("#student-login-form").submit();
        }
    };

    $scope.registerFacebook = function(){
        window.location = "users/auth/facebook";
    };

    $scope.showForgotPassword = function(){
        $scope.forgotPasswordMessage = '';
        $scope.forgotPasswordError = '';
        $scope.selectTab('forgotPassword');
    };

    $scope.sendForgotPasswordEmail = function(){
        $scope.forgotPasswordMessage = '';
        $scope.forgotPasswordError = '';

        $timeout(function(){
            usSpinnerService.spin('forgot-password-spinner');
        }, 0);

        if($scope.forgotPasswordEmail){
            ForgotService.sendForgotPassword($scope.forgotPasswordEmail).then(
                function(data){
                    if (data.success){
                        $scope.forgotPasswordMessage = $filter('translate')('FORGOT_PASSWORD_SENT');
                    } else {
                        $scope.forgotPasswordError = $filter('translate')('ERROR_FORGOT_PASSWORD');
                    }
                },
                function (response){
                    $scope.forgotPasswordError = $filter('translate')('ERROR_FORGOT_PASSWORD');
                    console.log('Error sending email: ' + response);
                }
            ).finally(function(){
                    $timeout(function(){
                        usSpinnerService.stop('forgot-password-spinner');
                    }, 0);
                });
        }

    };

    $scope.showResetPassword = function(){
        $scope.resetPasswordMessage = '';
        $scope.resetPasswordError = '';
        $scope.selectTab('resetPassword');
    };

    $scope.sendResetPassword = function(){
        $scope.resetPasswordMessage = '';
        $scope.resetPasswordError = '';

        $timeout(function(){
            usSpinnerService.spin('reset-password-spinner');
        }, 0);

        var user = {
            "reset_password_token": $rootScope.resetToken,
            "password": $scope.resetPasswordPassword,
            "password_confirmation": $scope.resetPasswordConfirmation
        }

        $scope.$broadcast('show-errors-check-validity', $scope.resetPasswordForm);

        if ($scope.resetPasswordForm.$valid) {
            ForgotService.sendResetPassword(user).then(
                function(data){
                    if (data.success){
                        $scope.resetPasswordMessage = $filter('translate')('RESET_PASSWORD_SENT');
                    } else {
                        $scope.resetPasswordError = $filter('translate')('ERROR_RESET_PASSWORD');
                    }
                    usSpinnerService.stop('reset-password-spinner');
                },
                function (response){
                    $scope.resetPasswordError = $filter('translate')('ERROR_RESET_PASSWORD');
                    console.log('Error resetting password: ' + response);
                }
            ).finally(function(){
                    usSpinnerService.stop('reset-password-spinner');
                });
        }

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

        if($rootScope.resetToken){
            $scope.selectTab('resetPassword');
            $('#sign-in-modal').modal('show');
        }
    });
}]);
