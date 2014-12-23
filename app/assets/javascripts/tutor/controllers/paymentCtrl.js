'use strict';

Geek.controller('PaymentController',['$scope','$rootScope', 'DEFAULT_VALUES' ,function($scope, $rootScope, DEFAULT_VALUES){

    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.CARD_METHOD = 0;
    $scope.BANK_ACCOUNT_METHOD = 1;
    $scope.LIST_OF_BANKS = DEFAULT_VALUES.LIST_OF_BANKS;

    $scope.paymentMethodOption = $scope.CARD_METHOD;
    $scope.debitCardHolder = '';
    $scope.debitCardNumber = '';
    $scope.expirationMonth = undefined;
    $scope.expirationYear = undefined;
    $scope.debitCardValidationNumber = undefined;
    $scope.availableYears = [];
    $scope.clabe = '';
    $scope.bankAccountOwner = '';
    $scope.bankName = undefined;

    var currentYear = new Date().getYear() + DEFAULT_VALUES.START_YEAR;
    for(var yearIndex=0; yearIndex<=16; yearIndex++){
        $scope.availableYears.push(currentYear);
        currentYear++;
    }

    $scope.saveCard = function(){

        if($scope.paymentMethodOption == $scope.CARD_METHOD){

            var card = {
                "card_number": $scope.debitCardNumber,
                "holder_name": $scope.debitCardHolder,
                "expiration_year": $scope.expirationYear,
                "expiration_month": $scope.expirationMonth,
                "cvv2": $scope.debitCardValidationNumber,
                "address": {
                    "city":"Querétaro",
                    "line3":"Queretaro",
                    "postal_code":"76900",
                    "line1":"Av 5 de Febrero",
                    "line2":"Roble 207",
                    "state":"Queretaro",
                    "country_code":"MX"
                }
            };
            console.log(card)

            /*OpenPay.token.create(,
                function(data){
                    console.log(data);
                },
                function(response){
                    console.log(response);
                }
            );*/
        }else{

        }

    };

    $scope.setExpirationMonth = function(indexMonth){
        if(indexMonth > 0){
            $scope.expirationMonth = indexMonth;
        }else{
            $scope.expirationMonth = undefined;
        }
    };

    $scope.setExpirationYear = function(year){
        if(year > 0){
            $scope.expirationYear = year - 2000;
        }else{
            $scope.expirationYear = undefined;
        }
    };

    $scope.setBank = function(bank){
        if(bank){
            $scope.bankName = bank;
        }else{
            $scope.bankName = undefined;
        }
    };

    angular.element(document).ready(function(){
        OpenPay.setId(DEFAULT_VALUES.MERCHANT_ID);
        OpenPay.setApiKey(DEFAULT_VALUES.PUBLIC_KEY);
        OpenPay.setSandboxMode(true);
    });

}]);
