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
});

