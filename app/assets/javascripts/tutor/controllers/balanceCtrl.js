'use strict';

Geek.controller('BalanceController',['$scope','$rootScope', '$timeout', '$filter', '$location', '$anchorScroll', 'AuthService', 'SessionService', 'BalanceService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, $filter, $location, $anchorScroll, AuthService, SessionService, BalanceService, usSpinnerService, DEFAULT_VALUES){

    $scope.tutorBalanceAlertParams = undefined;
    $scope.confirmTransferView = false;
    $scope.balance = undefined;

    $scope.getBalance = function(){

        $timeout(function(){
            usSpinnerService.spin('transfer-spinner');
        }, 0);

        BalanceService.getBalance().then(
            function(data){
                SessionService.setBalanceInfo(data);
                $scope.balanceInfo = SessionService.getBalanceInfo();
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

                $scope.tutorBalanceAlertParams = {
                    type: 'danger',
                    message: (DEFAULT_VALUES.OPENPAY_ERROR_STATUS[response.error_code])? $filter('translate')(DEFAULT_VALUES.OPENPAY_ERROR_STATUS[response.error_code]): $filter('translate')(DEFAULT_VALUES.OPENPAY_ERROR_STATUS['default']),
                    icon: true
                };

                $location.hash('balance-request');
                $anchorScroll();

                usSpinnerService.stop('transfer-spinner');
            }
        );

    };

    //Inicializamos el controlador
    $rootScope.$broadcast('initRoot');
    $scope.getBalance();

}]);
