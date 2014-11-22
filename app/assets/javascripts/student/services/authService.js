'use strict';

Geek.factory('AuthService', ["$rootScope", "SessionService", "$http", "$q", "DEFAULT_VALUES", function($rootScope, SessionService, $http, $q, DEFAULT_VALUES){

    var getSession = function(){

        var deferred = $q.defer();
        var promise = deferred.promise;

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
        var isAuthenticated = false;

        if(SessionService.getId()){
            isAuthenticated = true;
        }
        return isAuthenticated;
    };

    var isAuthorized = function(){
        var isAuthorized = false;
        if(SessionService.getId()){
            isAuthorized = true;
        }
        return isAuthorized;
    }

    return{
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        getSession: getSession
    }

}]);
