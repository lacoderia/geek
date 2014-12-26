'use strict';

Geek.factory('PaymentService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

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
        saveCard: saveCard
    }

}]);

