'use strict';

Geek.controller('PaymentController',['$filter', '$scope','$rootScope', 'DEFAULT_VALUES' ,function($filter, $scope, $rootScope, DEFAULT_VALUES){

    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.LIST_OF_STATES = DEFAULT_VALUES.LIST_OF_STATES;
    $scope.COUNTRY_CODE = 'MX';

    $scope.debitCardHolder = '';
    $scope.debitCardNumber = '';
    $scope.expirationMonth = undefined;
    $scope.expirationYear = undefined;
    $scope.debitCardValidationNumber = undefined;
    $scope.city = '';
    $scope.postalCode = '';
    $scope.addressLine1 = '';
    $scope.addressLine2 = '';
    $scope.state = undefined;
    $scope.availableYears = [];

    $scope.expirationErrorClass = '';
    $scope.stateErrorClass = '';


    var currentYear = new Date().getYear() + DEFAULT_VALUES.START_YEAR;
    for(var yearIndex=0; yearIndex<=16; yearIndex++){
        $scope.availableYears.push(currentYear);
        currentYear++;
    }

    $scope.validatePaymentForm = function() {
        var validPaymentForm = true;

        if(!$scope.validateExpirationDate()){
            validPaymentForm = false;
        }

        if(!$scope.validateState()){
            validPaymentForm = false;
        }

        return validPaymentForm;

    }

    $scope.validateExpirationDate = function() {
        if(!$scope.expirationMonth || !$scope.expirationYear) {
            $scope.expirationErrorClass = 'has-error';
        } else {
            $scope.expirationErrorClass = '';
        }
    }

    $scope.validateState = function() {
        if(!$scope.state) {
            $scope.stateErrorClass = 'has-error';
        } else {
            $scope.stateErrorClass = '';
        }
    }

    $scope.saveCard = function(){
        $scope.$broadcast('show-errors-check-validity', $scope.studentPaymentOptionsForm);

        if ($scope.studentPaymentOptionsForm.$valid & $scope.validatePaymentForm()) {
            var card = {
                "card_number": $scope.debitCardNumber,
                "holder_name": $scope.debitCardHolder,
                "expiration_year": $scope.expirationYear,
                "expiration_month": $scope.expirationMonth,
                "cvv2": $scope.debitCardValidationNumber,
                "address": {
                    "city": $scope.city,
                    "line3":"",
                    "postal_code": $scope.postalCode,
                    "line1": $scope.addressLine1,
                    "line2": $scope.addressLine2,
                    "state": $scope.state,
                    "country_code": $scope.COUNTRY_CODE
                }
            };

            console.log(card);
        }


        /*OpenPay.token.create(card,
            function(data){
                console.log(data);
            },
            function(response){
                console.log(response);
            }
        );*/

    };

    $scope.setExpirationMonth = function(indexMonth){
        $scope.expirationMonth = indexMonth;
        $scope.validateExpirationDate();
    };

    $scope.setExpirationYear = function(year){
        $scope.expirationYear = year - 2000;
        $scope.validateExpirationDate();
    };

    $scope.setState = function(state) {
        $scope.state = state;
        $scope.validateState();
    }

    angular.element(document).ready(function(){
        OpenPay.setId(DEFAULT_VALUES.MERCHANT_ID);
        OpenPay.setApiKey(DEFAULT_VALUES.PUBLIC_KEY);
        OpenPay.setSandboxMode(true);
    });

}]);
