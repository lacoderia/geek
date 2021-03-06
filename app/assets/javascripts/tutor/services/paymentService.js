'use strict';

Geek.factory('PaymentService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getPaymentMethodsList = function(tutorId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.OPENPAY_GET_CARDS_SERVICE_URL,{
            params: {
                tutor_id: tutorId
            }
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;

    };

    var saveCard = function(payment){

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.OPENPAY_PAYMENT_SAVE_SERVICE_URL, payment).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;
    };

    var saveBankAccount = function(payment){

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.OPENPAY_SAVE_BANK_ACCOUNT_SERVICE_URL, payment).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;
    };

    var activateAccount = function(cardId){

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post('cards/' + cardId + '/activate.json', {}).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;
    };

    var deleteAccount = function(payment){

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.OPENPAY_DELETE_PAYMENT_SERVICE_URL, payment).
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
        saveBankAccount: saveBankAccount,
        saveCard: saveCard,
        activateAccount: activateAccount,
        deleteAccount: deleteAccount
    }

}]);
