'use strict';

Geek.factory('ForgotService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var sendForgotPassword = function(email){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.FORGOT_PASSWORD, {"utf8":"V", "user":{"email":email}}).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var sendResetPassword = function(user){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.put(DEFAULT_VALUES.URL_SERVICES.RESET_PASSWORD, {"utf8":"V", "user": user}).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    return{
        sendForgotPassword: sendForgotPassword,
        sendResetPassword: sendResetPassword
    }

}]);
