'use strict';

Geek.factory('PaymentService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getPaymentMethodsList = function(){

        /*var deferred = $q.defer();
         var promise = deferred.promise;

         $http.get('https://sandbox-api.openpay.mx/v1/mvqfexabrjznvdfpdter/cards/kkb4llxaxdmkayti7a8w',{
         }).
         success(function(data){
         deferred.resolve(data);
         }).

         error(function(response){
         deferred.reject(response);
         });

         return promise;*/

        return [{
            'id': 1,
            'type': 'CARD_METHOD',
            'is_main_account': true,
            'number': 'XXXX-XXXX-XXXX-1234',
            'method_info': {
                "id":"kxq1rpdymlcpxekvjsxm",
                "card_number":"1118",
                "holder_name":"Pedro Paramo",
                "expiration_year":"15",
                "expiration_month":"12",
                "allows_charges":true,
                "allows_payouts":true,
                "creation_date":"2013-11-20T09:22:25-06:00",
                "bank_name":"BBVA BANCOMER",
                "bank_code":"012",
                "type":"debit",
                "brand":"mastercard"
            }
        },
            {
                'id': 2,
                'type': 'CARD_METHOD',
                'is_main_account': false,
                'number': 'XXXX-XXXX-XXXX-4567',
                'method_info': {
                    "id":"kxq1rpdymlcpxekvjsxm",
                    "card_number":"1118",
                    "holder_name":"Pedro Paramo",
                    "expiration_year":"15",
                    "expiration_month":"12",
                    "allows_charges":true,
                    "allows_payouts":true,
                    "creation_date":"2013-11-20T09:22:25-06:00",
                    "bank_name":"BBVA BANCOMER",
                    "bank_code":"012",
                    "type":"debit",
                    "brand":"visa"
                }
            }]

    };

    var saveCard = function(payment){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.PAYMENT_SAVE_SERVICE_URL, payment).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;
    };

    return{
        getPaymentMethodsList: getPaymentMethodsList,
        saveCard: saveCard
    }

}]);

