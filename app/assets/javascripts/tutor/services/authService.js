'use strict';

Geek.factory('AuthService', ['$http', '$q', '$rootScope', '$timeout', 'SessionService', 'DEFAULT_VALUES', function($http, $q, $rootScope, $timeout, SessionService, DEFAULT_VALUES){

    var getSessionStatus = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.PROFILE_GET_STATUS_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var getSession = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.PROFILE_GET_PROFILE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
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

    return{
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        getSession: getSession,
        getSessionStatus: getSessionStatus
    }

}]);