'use strict';

Geek.controller('BalanceController',['$scope','$rootScope', '$timeout', '$filter', 'BalanceService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, $filter, BalanceService, usSpinnerService, DEFAULT_VALUES){

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getBalance();
        }
    });

    $scope.getBalance = function(){

        BalanceService.getBalance().then(
            function(data){
                $rootScope.tutor.balanceInfo = data;
            },
            function(response){
                console.log('Error retrieving the user\'s balance' + response);
            }
        );
    };

    $scope.transferMoney = function(){

        BalanceService.transferMoney().then(
            function(data){
                $rootScope.tutor.balanceInfo = data;
                $scope.getBalance();
            },
            function(response){
                console.log('Error trasnfering the money' + response.description);
            }
        );

    };

}]);
