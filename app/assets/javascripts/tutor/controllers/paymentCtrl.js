'use strict';

Geek.controller('PaymentController',['$scope','$rootScope', '$timeout', '$location', '$anchorScroll', '$filter', 'PaymentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, $location, $anchorScroll, $filter, PaymentService, DEFAULT_VALUES){

    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.PAYMENT_METHODS = DEFAULT_VALUES.PAYMENT_METHODS;
    $scope.PAYMENT_METHODS_BUTTONS = DEFAULT_VALUES.PAYMENT_METHODS_BUTTONS;
    $scope.LIST_OF_BANKS = DEFAULT_VALUES.LIST_OF_BANKS;
    $scope.LIST_OF_STATES = DEFAULT_VALUES.LIST_OF_STATES;
    $scope.COUNTRY_CODE = 'MX';

    $scope.paymentMethodsList = [];
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
    $scope.availableYears = [];

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

    $scope.showNewBankAccount = false;
    $scope.showNewCard = false;

    $scope.clabe = '';
    $scope.bankAccountOwner = '';

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getPaymentMethodsList();
        }
    });

    $scope.getPaymentMethodsList = function(){

        PaymentService.getPaymentMethodsList($rootScope.tutor.id).then(
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
            },
            function(response){
                console.log(response)
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
                $scope.showNewBankAccount = false;
                $scope.createCard();
                break;
            case $scope.PAYMENT_METHODS.BANK_ACCOUNT_METHOD.code:
                $scope.showNewCard = false;
                $scope.showNewBankAccount = true;
                break;
        }
    }


    $scope.createCard = function(){
        var currentYear = new Date().getYear() + DEFAULT_VALUES.START_YEAR;
        for(var yearIndex=0; yearIndex<=16; yearIndex++){
            $scope.availableYears.push(currentYear);
            currentYear++;
        }
    };

    $scope.cancelPaymentMethodCreation = function(){
        $scope.showNewCard = false;
        $scope.showNewBankAccount = false;

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

        $scope.clabe = '';
        $scope.bankAccountOwner = '';
        $scope.bankName = undefined;

        $rootScope.$broadcast('closeAllAlerts');
    };

    $scope.saveCard = function(){

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

        OpenPay.token.create(card,
            function(data){

                var cardData = {
                    'tutor_id': $rootScope.tutor.id,
                    'token': data.data.id
                }

                console.log(cardData)

                PaymentService.saveCard(cardData).then(
                    function(data){
                        if(data && data.id) {

                            $timeout(function(){

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

            }
        );
    };

    $scope.saveBankAccount = function(){
        var bankAccount = {
            "holder_name": $scope.holder_name,
            "clabe": $scope.clabe
        };

        console.log(bankAccount)

    };

    $scope.callButtonAction = function($event, action, paymentMethod){
        switch (action){
            case 'change-main-account':
                console.log('ACA')
                break;
            case  'delete-account':
                console.log('AQUI')
                break;
        }
    };

    $scope.showActionButtons = function(isMainAccount, action){
        var buttonVisibility = true;
        switch (action){
            case 'change-main-account':
                if(isMainAccount){
                    buttonVisibility = false;
                }
                break;
            case  'delete-account':
                buttonVisibility =  true;
                break;
        }

        return buttonVisibility;
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

    $scope.setState = function(state){
        if(state){
            $scope.state = state;
        }else{
            $scope.state = undefined;
        }
    };

    angular.element(document).ready(function(){
        OpenPay.setId(DEFAULT_VALUES.MERCHANT_ID);
        OpenPay.setApiKey(DEFAULT_VALUES.PUBLIC_KEY);
        OpenPay.setSandboxMode(true);

        /*PaymentService.getCardById('kkb4llxaxdmkayti7a8w').then(
         function(data){
         console.log(data)
         },
         function(response){
         console.log(response)
         }
         );*/

    });

}]);
