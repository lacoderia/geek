'use strict';

Geek.factory('ProfileService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getProfile = function(){
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

    return {
        getProfile: getProfile
    }

}]);
