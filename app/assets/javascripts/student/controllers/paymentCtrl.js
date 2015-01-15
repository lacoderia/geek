'use strict';

Geek.controller('PaymentController',['$filter', '$scope','$rootScope', '$timeout', '$location', '$anchorScroll', 'PaymentService', 'AuthService', 'SessionService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($filter, $scope, $rootScope, $timeout, $location, $anchorScroll, PaymentService, AuthService, SessionService, usSpinnerService, DEFAULT_VALUES){

    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.PAYMENT_METHODS = DEFAULT_VALUES.PAYMENT_METHODS;
    $scope.PAYMENT_METHODS_BUTTONS = DEFAULT_VALUES.PAYMENT_METHODS_BUTTONS;
    $scope.LIST_OF_STATES = DEFAULT_VALUES.LIST_OF_STATES;
    $scope.COUNTRY_CODE = 'MX';

    $scope.paymentMethodsList = undefined;
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

    $scope.showNewCard = false;

    $scope.expirationErrorClass = '';
    $scope.stateErrorClass = '';


    $scope.getPaymentMethodsList = function(){

        $timeout(function(){
            usSpinnerService.spin('payments-spinner');
        }, 0);

        PaymentService.getPaymentMethodsList(SessionService.getId()).then(
            function(data){
                $scope.paymentMethodsList = data;
                angular.forEach($scope.paymentMethodsList, function(payment){
                    payment.showInfo = false;

                    switch (payment.brand){
                        case 'visa':
                            payment.brandClass = 'icon-cc-visa';
                            break;
                        case 'mastercard':
                            payment.brandClass = 'icon-cc-mastercard';
                            break;
                    }

                    (payment.is_bank_account) ? payment.type = $scope.PAYMENT_METHODS.BANK_ACCOUNT_METHOD : payment.type = $scope.PAYMENT_METHODS.CARD_METHOD ;

                });

                usSpinnerService.stop('payments-spinner');
            },
            function(response){
                console.log("Error retrieving the payment lists" + response);
            }
        );
    };

    $scope.togglePaymentMethodInfo = function(paymentItem){
        angular.forEach($scope.paymentMethodsList, function(payment){
            if(paymentItem.id != payment.id){
                payment.showInfo = false;
            }else{
                if(payment.showInfo){
                    payment.showInfo = false;
                }else{
                    payment.showInfo = true;
                }
            }
        });

    };

    $scope.createPaymentMethod = function(paymentMethodType){
        switch (paymentMethodType){
            case $scope.PAYMENT_METHODS.CARD_METHOD.code:
                $scope.showNewCard = true;
                $scope.createCard();
                break;
            default:
                break;
        }
    }

    $scope.createCard = function(){
        $scope.availableYears = [];
        var currentYear = new Date().getYear() + DEFAULT_VALUES.START_YEAR;
        for(var yearIndex=0; yearIndex<=16; yearIndex++){
            $scope.availableYears.push(currentYear);
            currentYear++;
        }
    };

    $scope.cancelPaymentMethodCreation = function(){
        $scope.showNewCard = false;

        $scope.paymentMethodOption = undefined;
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

        $scope.expirationErrorClass = '';
        $scope.stateErrorClass = '';

        $rootScope.$broadcast('closeAllAlerts');
        $rootScope.$broadcast('show-errors-reset-by-form', $scope.studentPaymentOptionsForm);

    };

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

            usSpinnerService.spin('payments-spinner');

            OpenPay.token.create(card,
                function(data){

                    var cardData = {
                        'student_id': SessionService.getId(),
                        'token': data.data.id
                    }

                    PaymentService.saveCard(cardData).then(
                        function(data){
                            if(data && data.id) {

                                $timeout(function() {

                                    SessionService.setHasCard(true);
                                    $scope.cancelPaymentMethodCreation();

                                    $scope.studentPaymentAlertParams = {
                                        type: 'success',
                                        message: $filter('translate')('SUCCESS_STUDENT_PAYMENT_METHOD_SAVE'),
                                        icon: true
                                    };

                                    $location.hash('student-payment-form');
                                    $anchorScroll();

                                    $scope.getPaymentMethodsList();

                                }, 0);
                            }
                        },
                        function(response){

                            console.log('Error saving students payment method: ' + response);

                            $scope.studentPaymentAlertParams = {
                                type: 'danger',
                                message: (DEFAULT_VALUES.OPENPAY_ERROR_STATUS[response.error_code])? $filter('translate')(DEFAULT_VALUES.OPENPAY_ERROR_STATUS[response.error_code]): $filter('translate')(DEFAULT_VALUES.OPENPAY_ERROR_STATUS['default']),
                                icon: true
                            };

                            $timeout(function(){
                                $location.hash('student-payment-form');
                                $anchorScroll();
                            }, 0);
                        }
                    ).finally(function(){
                        usSpinnerService.stop('payments-spinner');
                    });

                },
                function(response){
                    console.log('Error saving students payment method: ' + response);
                    usSpinnerService.stop('payments-spinner');

                    $scope.studentPaymentAlertParams = {
                        type: 'danger',
                        message: (DEFAULT_VALUES.OPENPAY_ERROR_STATUS[response.data.error_code])? $filter('translate')(DEFAULT_VALUES.OPENPAY_ERROR_STATUS[response.data.error_code]): $filter('translate')(DEFAULT_VALUES.OPENPAY_ERROR_STATUS['default']),
                        icon: true
                    };


                    $timeout(function(){
                        $location.hash('student-payment-form');
                        $anchorScroll();
                    }, 0);

                }
            );
        }

    };

    $scope.callButtonAction = function($event, action, paymentMethod){
        switch (action){
            case 'change-main-account':
                PaymentService.activateAccount(paymentMethod.id).then(
                    function(data){
                        $scope.getPaymentMethodsList();
                    },
                    function(response){
                        console.log('Error activating account ' + response);
                    }
                );
                break;
            case  'delete-account':
                break;
        }
    };

    $scope.showActionButtons = function(active, action){
        var buttonVisibility = true;
        switch (action){
            case 'change-main-account':
                if(active){
                    buttonVisibility = false;
                }
                break;
            case  'delete-account':
                buttonVisibility =  false;
                break;
        }

        return buttonVisibility;
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

    //Inicializamos el controlador
    $scope.getPaymentMethodsList();

}]);
