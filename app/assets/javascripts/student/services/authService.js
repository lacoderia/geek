'use strict';

Geek.factory('AuthService', ["$rootScope", "SessionService", "$http", "$q", "$timeout", "DEFAULT_VALUES", function($rootScope, SessionService, $http, $q, $timeout, DEFAULT_VALUES){

    var getSessionAttempt = 0;

    var getSession = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        getSessionAttempt++;

         $http.get(DEFAULT_VALUES.URL_SERVICES.PROFILE_GET_SESSION_URL).
         success(function(data){
            deferred.resolve(data);
         }).

         error(function(response){
            deferred.reject(response);
         });


        return promise;

    };

    var isAuthenticated = function(){
        if(SessionService.getId()){
            return true;
        } else {
            return false;
        }
    };

    var isAuthorized = function(){
        if(SessionService.getId()){
            return true;
        } else {
            return false;
        }
    }

    var getSessionAttempts = function(){
        return getSessionAttempt;
    }

    return{
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        getSession: getSession,
        getSessionAttempts: getSessionAttempts
    }

}]);
