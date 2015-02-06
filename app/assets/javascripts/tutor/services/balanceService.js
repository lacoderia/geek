'use strict';

Geek.factory('BalanceService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getBalance = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.OPENPAY_GET_BALANCE,{}).
            success(function(data){
                if(data.balance == null) {
                    data.balance = 0;
                }
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;

    };

    var transferMoney = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.OPENPAY_CASH_OUT,{}).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;

    };

    return{
        getBalance: getBalance,
        transferMoney: transferMoney
    }

}]);

