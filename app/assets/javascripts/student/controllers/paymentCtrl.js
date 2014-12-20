'use strict';

Geek.controller('PaymentController',['$scope','$rootScope', 'DEFAULT_VALUES' ,function($scope, $rootScope, DEFAULT_VALUES){

    $scope.debitCardNumber = '';
    $scope.debitCardHolder = '';
    $scope.paymentMethodOption = 0;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.availableYears = [];

    var currentYear = new Date().getYear() + DEFAULT_VALUES.START_YEAR;

    for(var yearIndex=0; yearIndex<=16; yearIndex++){
        $scope.availableYears.push(currentYear);
        currentYear++;
    }

    $scope.changePaymentMethod = function(){
        console.log($scope.paymentMethodOption)
    };


}]);
