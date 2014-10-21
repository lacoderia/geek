'use strict';

Geek.factory('CountyService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var all = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.COUNTY_SERVICE_URL).
        success(function(data){
            deferred.resolve(data);
        }).

        error(function(response){
            deferred.reject(response);
        });

        return promise
    };

    return{
        all: all
    }

}]);
