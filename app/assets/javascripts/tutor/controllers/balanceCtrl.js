'use strict';

Geek.controller('BalanceController',['$scope','$rootScope', '$timeout', '$filter', '$location', '$anchorScroll', 'AuthService', 'SessionService', 'BalanceService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, $filter, $location, $anchorScroll, AuthService, SessionService, BalanceService, usSpinnerService, DEFAULT_VALUES){

    $scope.tutorBalanceAlertParams = undefined;
    $scope.confirmTransferView = false;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('sessionLoaded', function(){
        if(AuthService.isAuthenticated() && $rootScope.sessionLoaded){
            $scope.getBalance();
        }
    });

    $scope.getBalance = function(){

        $timeout(function(){
            usSpinnerService.spin('transfer-spinner');
        }, 0);

        BalanceService.getBalance().then(
            function(data){
                SessionService.setBalanceInfo(data);
                $scope.tutorBalanceAlertParams = undefined;
                usSpinnerService.stop('transfer-spinner');
                $scope.confirmTransferView = false;
            },
            function(response){
                console.log('Error retrieving the user\'s balance' + response);

                $scope.tutorBalanceAlertParams = {
                    type: 'danger',
                    message: $filter('translate')('ERROR_TUTOR_BALANCE'),
                    icon: true
                };
                $scope.confirmTransferView = false;

                $location.hash('balance-request');
                $anchorScroll();
                usSpinnerService.stop('transfer-spinner');
            }
        );
    };

    $scope.confirmTransfer = function(){
        $scope.confirmTransferView = true;
    };

    $scope.cancelTransfer = function(){
        $scope.confirmTransferView = false;
    };

    $scope.transferMoney = function(){

        $timeout(function(){
            usSpinnerService.spin('transfer-spinner');
        }, 0);


        BalanceService.transferMoney().then(
            function(data){
                $scope.tutorBalanceAlertParams = undefined;
                $scope.getBalance();
                usSpinnerService.stop('transfer-spinner');
            },
            function(response){

                console.log('Error trasnfering the money' + response.description);

                var errorMessage = "";
                $scope.confirmTransferView = false;

                switch (response.error_code){
                    case 4001:
                        errorMessage = $filter('translate')('ERROR_TUTOR_TRANSFER_NO_BALANCE');
                        break;
                    default :
                        errorMessage = $filter('translate')('ERROR_TUTOR_TRANSFER_GENERAL');
                        break;
                }

                $scope.tutorBalanceAlertParams = {
                    type: 'danger',
                    message: errorMessage,
                    icon: true
                };

                $location.hash('balance-request');
                $anchorScroll();

                usSpinnerService.stop('transfer-spinner');
            }
        );

    };

}]);
