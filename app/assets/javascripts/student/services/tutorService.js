'use strict';

Geek.factory('TutorService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getTutorByCategoryAndCountyIds = function(categoryId, countyId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        var params = {};

        if(categoryId != null) {
            params.category_id = categoryId;
        }

        if(countyId != null) {
            params.county_id = countyId;
        }

        $http.get(DEFAULT_VALUES.URL_SERVICES.TUTOR_SERVICE_URL,{
            params : params
        }).
         success(function(data){
         deferred.resolve(data);
         }).

         error(function(response){
         deferred.reject(response);
         });

        return promise
    };

    var getTutorByQueryParamsForGoogle = function(queryParams){
        var deferred = $q.defer();
        var promise = deferred.promise;

        console.log(queryParams)

        $http.post(DEFAULT_VALUES.URL_SERVICES.TUTOR_BY_GOOGLE_SERVICE_URL,{
            category_str: null,
            category_id: null,
            zone_obj: queryParams,
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
        getTutorByCategoryAndCountyIds: getTutorByCategoryAndCountyIds,
        getTutorByQueryParamsForGoogle: getTutorByQueryParamsForGoogle
    }

}]);
