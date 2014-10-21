'use strict';

Geek.factory('TutorService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getTutorByCountyId = function(countyId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.TUTOR_SERVICE_URL,{
            params: {
                'county_id': countyId
            }
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var getTutorByCategoryId = function(categoryId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.TUTOR_SERVICE_URL,{
            params: {
                'category_id': categoryId
            }
        }).
         success(function(data){
         deferred.resolve(data);
         }).

         error(function(response){
         deferred.reject(response);
         });

        return promise
    };

    var getTutorByCategoryAndCountyIds = function(categoryId, countyId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.CATEGORY_SERVICE_URL, {
            params: {
                'county_id': countyId,
                'category_id': categoryId
            }
        }).
         success(function(data){
         deferred.resolve(data);
         }).

         error(function(response){
         deferred.reject(response);
         });

        return promise
    }

    return{
        getTutorByCountyId: getTutorByCountyId,
        getTutorByCategoryId: getTutorByCategoryId,
        getTutorByCategoryAndCountyIds: getTutorByCategoryAndCountyIds
    }

}]);
