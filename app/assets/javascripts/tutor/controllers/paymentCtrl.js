'use strict';

Geek.controller('PaymentController',['$scope','$rootScope', 'PaymentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, PaymentService, DEFAULT_VALUES){

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

    $scope.clabe = '';
    $scope.bankAccountOwner = '';
    $scope.bankName = undefined;

    $scope.getPaymentMethodsList = function(){
        $scope.paymentMethodsList = PaymentService.getPaymentMethodsList();
        angular.forEach($scope.paymentMethodsList, function(payment){
            payment.showInfo = false;
            switch (payment.method_info.brand){
                case 'visa':
                    payment.brandClass = 'icon-cc-visa';
                    break;
                case 'mastercard':
                    payment.brandClass = 'icon-cc-mastercard';
                    break;
            }
        });
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
                console.log('ENTRE AQUI')
                break;
            case $scope.PAYMENT_METHODS.BANK_ACCOUNT_METHOD.code:
                console.log('ENTRE ACA')
                break;
        }
    }


    $scope.createCard = function(){
        var currentYear = new Date().getYear() + DEFAULT_VALUES.START_YEAR;
        for(var yearIndex=0; yearIndex<=16; yearIndex++){
            $scope.availableYears.push(currentYear);
            currentYear++;
        }

        $scope.card = {
            card_info : undefined,
            isNew: true
        }
    };

    $scope.cancelCardCreation = function(){
        $scope.card = undefined;
    };

    $scope.saveCard = function(){

        if($scope.paymentMethodOption == $scope.CARD_METHOD){

            var cardInfo = {
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
            $scope.card.card_info = cardInfo;
            $scope.card.isNew = false;
            console.log($scope.card)
            /*OpenPay.token.create(card,
             function(data){
             $scope.card.isNew = false;
             console.log(data);
             },
             function(response){
             console.log(response);
             }
             );*/

        }else{

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

        /*PaymentService.getCardById('kkb4llxaxdmkayti7a8w').then(
         function(data){
         console.log(data)
         },
         function(response){
         console.log(response)
         }
         );*/

    });

    $scope.getPaymentMethodsList();

}]);
