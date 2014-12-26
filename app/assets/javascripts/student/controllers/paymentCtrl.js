'use strict';

Geek.controller('PaymentController',['$filter', '$scope','$rootScope', '$timeout', '$location', '$anchorScroll', 'PaymentService', 'SessionService', 'DEFAULT_VALUES' ,function($filter, $scope, $rootScope, $timeout, $location, $anchorScroll, PaymentService, SessionService, DEFAULT_VALUES){

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

    // TEST

    $scope.debitCardHolder = 'Ricardo Rosas Schultz';
    $scope.debitCardNumber = '4242424242424242';
    $scope.expirationMonth = '10';
    $scope.expirationYear = '15';
    $scope.debitCardValidationNumber = '432';
    $scope.city = 'Veracruz';
    $scope.postalCode = '91940';
    $scope.addressLine1 = 'Mango 26';
    $scope.addressLine2 = 'Fraccionamiento Floresta';
    $scope.state = 'Veracruz';


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
            return false;
        } else {
            $scope.expirationErrorClass = '';
            return true;
        }
    }

    $scope.validateState = function() {
        if(!$scope.state) {
            $scope.stateErrorClass = 'has-error';
            return false;
        } else {
            $scope.stateErrorClass = '';
            return true;
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
        }


        OpenPay.token.create(card,
            function(data){

                var cardData = {
                    'student_id': SessionService.getId(),
                    'token': data.data.id
                }

                PaymentService.saveCard(cardData).then(
                    function(data){
                        if(data && data.id) {
                            $scope.studentPaymentAlertParams = {
                                type: 'success',
                                message: $filter('translate')('SUCCESS_STUDENT_PAYMENT_METHOD_SAVE'),
                                icon: true
                            };

                            $timeout(function(){
                                $location.hash('student-payment-form');
                                $anchorScroll();
                            }, 0);
                        }
                    },
                    function(response){

                        $scope.studentPaymentAlertParams = {
                            type: 'danger',
                            message: $filter('translate')('ERROR_STUDENT_PAYMENT_METHOD_SAVE'),
                            icon: true
                        };

                        $timeout(function(){
                            $location.hash('student-payment-form');
                            $anchorScroll();
                        }, 0);

                        console.log('Error saving students payment method: ' + response);
                    }
                );

            },
            function(response){
                $scope.studentPaymentAlertParams = {
                    type: 'danger',
                    message: response.data.description,
                    icon: true
                };

                $timeout(function(){
                    $location.hash('student-payment-form');
                    $anchorScroll();
                }, 0);

                console.log(response);
            }
        );

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
